import asyncio
import json
import os

from numpy import void

from .langchain_classes import StreamingConversationChain

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
    async def simple_text(websocket, send_message: str) -> void:
        for message_text in send_message:
            responce = {
                "type": "text",
                "status": "success",
                "content": message_text
            }
            # print(responce)
            await websocket.send_text(json.dumps(responce))
            await asyncio.sleep(0.02)

    @staticmethod
    async def select_button(websocket, buttons: list) -> void:
        responce = {
            "type": "button",
            "status": "success",
            "content": buttons
        }
        await websocket.send_text(json.dumps(responce))
