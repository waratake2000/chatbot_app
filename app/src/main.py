#fastapi
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
from starlette.middleware.cors import CORSMiddleware
from utils.chatbot.streaming_interface import StreamMessage
import os
import json
from chatbot_router import chatbot_router

# os.environ['DATABASE_URL'] = "mysql://root:imglab2023@mysql/mondoumuyou"

# OPENAI_API_KEY="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"
# os.environ["OPENAI_API_KEY"]=OPENAI_API_KEY

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.websocket("/ws/streaming-response")
async def websocket_endpoint(websocket: WebSocket):
    print("メッセージを受信しました")
    await websocket.accept()
    while True:
        # print("ループ突入")
        request_json = await websocket.receive_text()
        print(request_json)
        recieve_json = json.loads(request_json)
        await chatbot_router(websocket, recieve_json)

@app.get("/")
async def default_root():
    html_content = """
    <html>
        <head>
            <title>Chatbot api</title>
        </head>
        <body>
            <h1>アクセス成功</h1>
        </body>
    </html>
    """
    return HTMLResponse(html_content)
