import asyncio
import json
from pydantic import BaseModel, validator
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain, ConversationalRetrievalChain
from langchain.chains.question_answering import load_qa_chain
from langchain.memory import ConversationBufferMemory
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.callbacks import AsyncIteratorCallbackHandler
from langchain.callbacks.base import AsyncCallbackHandler
from langchain.callbacks.manager import AsyncCallbackManager
from langchain.prompts import (
    PromptTemplate
)

import os
import asyncio

class ChatResponse(BaseModel):
    """Chat response schema"""
    sender: str
    message: str
    type: str
    xtra: dict = None

    @validator("sender")
    def sender_must_be_or_you(cls, v):
        if v not in ["bot","you"]:
            raise ValueError("sender must be bot or you")
        return v

    @validator("type")
    def validate_message_type(cls, v):
        if v not in ['start','stream','end','error','info']:
            raise ValueError('type must be start, stream or end')
        return v

class ChatResponse(BaseModel):
    """Chat response schema"""
    sender: str
    message: str
    type: str
    xtra: dict = None

    @validator("sender")
    def sender_must_be_bot_or_you(cls, v):
        if v not in ["bot", "you"]:
            raise ValueError("sender must be bot or you")
        return v

    @validator("type")
    def validate_message_type(cls, v):
        if v not in ['start','stream','end','error','info']:
            raise ValueError('type must be start, stream or end')
        return v

class StreamingLLMCallbackHandler(AsyncIteratorCallbackHandler):
    """Callback handler for streaming LLM responses."""

    async def on_llm_start(self, serialized, prompts, **kwargs) -> None:
        self.done.clear()
        self.queue.put_nowait(ChatResponse(sender="bot", message="", type="start"))

    async def on_llm_end(self, response, **kwargs) -> None:
        # we override this method since we want the ConversationalRetrievalChain to potentially return
        # other items (e.g., source_documents) after it is completed
        pass

    async def on_llm_error(self, error: Exception | KeyboardInterrupt, **kwargs) -> None:
        self.queue.put_nowait(ChatResponse(sender="bot", message=str(error), type="error"))

    async def on_llm_new_token(self, token: str, **kwargs) -> None:
        self.queue.put_nowait(ChatResponse(sender="bot", message=token, type="stream"))

class ConvoChainCallbackHandler(AsyncCallbackHandler):
    """Use to add additional information (e.g., source_documents, etc...) once the chain finishes"""

    def __init__(self, callback_handler) -> None:
        super().__init__()
        self.callback_handler = callback_handler

    async def on_chain_end(self, outputs, *, run_id, parent_run_id, **kwargs) -> None:
        """Run after chain ends running."""

        source_docs = outputs.get("source_documents", None)
        source_docs_d = [{"source": doc.metadata["source"]} for doc in source_docs] if source_docs else None

        xtra = {"source_documents": source_docs_d}
        self.callback_handler.queue.put_nowait(ChatResponse(sender="bot", message="", xtra=xtra, type="info"))
        self.callback_handler.queue.put_nowait(ChatResponse(sender="bot", message="", type="end"))

class StreamingConversationChain:
    """Class for handling streaming conversation chains."""

    def __init__(self, openai_api_key: str, temperature: float = 0.5):
        self.memories = {}
        self.openai_api_key = openai_api_key
        self.from_template = temperature

    async def generate_response(self, message: str, chat_history):
        """
        Asynchronous function to generate a response for a conversation.
        It creates a new conversation chain for each message and uses a
        callback handler to stream responses as they're generated.
        :param message: The message from the user.
        """

        streaming_callback_handler = StreamingLLMCallbackHandler()
        convo_db_manager = AsyncCallbackManager([ConvoChainCallbackHandler(streaming_callback_handler)])

        question_gen_llm = ChatOpenAI(
            model_name="gpt-3.5-turbo",
            max_retries=15,
            temperature=0.0,
            streaming=True,
            openai_api_key=self.openai_api_key,
        )

        streaming_llm = ChatOpenAI(
            model_name='gpt-3.5-turbo',
            max_retries=15,
            temperature=0,
            callbacks=[streaming_callback_handler],
            streaming=True,
            openai_api_key=self.openai_api_key
        )

        memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True, output_key="answer")

        if chat_history:
            for history_msg in chat_history:
                # print(list(i.keys())[-1])
                if 'user_message' == history_msg['send_by']:
                    print('history_msg[message]')
                    print(history_msg["message"])
                    memory.chat_memory.add_user_message(history_msg["message"])
                elif 'bot_message' == history_msg['send_by']:
                    print('history_msg[message]')
                    print(history_msg["message"])
                    memory.chat_memory.add_ai_message(history_msg["message"])

        template_qg = """
            次の会話に対しフォローアップの質問があるので、フォローアップの質問を独立した質問に言い換えなさい。

            チャットの履歴:
            {chat_history}

            フォローアップの質問:
            {question}

            言い換えられた独立した質問:"""

        prompt_qg = PromptTemplate(
            template=template_qg,
            input_variables=["chat_history", "question"],
            output_parser=None,
            partial_variables={},
            template_format='f-string',
            validate_template=True,
        )

        question_gen_chain = LLMChain(llm=question_gen_llm, prompt=prompt_qg)  # , callback_manager=manager)

        prompt_template_qa = """You are a helpful assistant. Please answer in Japanese! If the context is not relevant, please answer the question by using your own knowledge about the topic.

            {context}

            Question: {question}
            Answer in Japanese:"""

        prompt_qa = PromptTemplate(
            template=prompt_template_qa,
            input_variables=["context", "question"]
        )

        final_qa_chain = load_qa_chain(
            llm=streaming_llm,
            chain_type="stuff",
            prompt=prompt_qa
        )

        loaded_db = Chroma(
            persist_directory='/root/EmbeddingDB',
            embedding_function=OpenAIEmbeddings()
        )

        retriever = loaded_db.as_retriever()

        convo_chain = ConversationalRetrievalChain(
            retriever=retriever,
            question_generator=question_gen_chain,
            combine_docs_chain=final_qa_chain,
            memory=memory,
            return_source_documents=True,
            callback_manager=convo_db_manager,
        )

        run = asyncio.create_task(convo_chain.acall({'question': message}))

        async for token in streaming_callback_handler.aiter():
            if token.type in ["end","error"]:
                streaming_callback_handler.done.set()

            yield json.dumps(token.dict())
        await run

class StreamMessage:
    """メッセージを生成し送信するクラス"""
    @staticmethod
    async def qa_with_docs(websocket, message: str, chat_history=None):
        streaming_conversation_chain = StreamingConversationChain(openai_api_key=os.environ.get('OPENAI_API_KEY'), temperature=0.7)
        send_message = ''
        async for openai_responce_json in streaming_conversation_chain.generate_response(message, chat_history):
            openai_responce_dir = json.loads(openai_responce_json)
            message_text = str(openai_responce_dir["message"])
            responce = {
                "type": "text",
                "status": "success",
                "content": message_text
            }
            send_message += message_text
            await websocket.send_text(json.dumps(responce))
        return send_message

    @staticmethod
    async def simple_text(websocket, send_message: str):
        for message_text in send_message:
            responce = {
                "type": "text",
                "status": "success",
                "content": message_text
            }
            await websocket.send_text(json.dumps(responce))
            await asyncio.sleep(0.02)

    @staticmethod
    async def send_button(websocket, send_message: str):
        for message_text in send_message:
            responce = {
                "type": "text",
                "status": "success",
                "content": message_text
            }
            await websocket.send_text(json.dumps(responce))
            await asyncio.sleep(0.02)


