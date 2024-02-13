
from utils.db.models import ReceiveMessage, SendMessage, EventStore
from utils.db.setting import session
from utils.chatbot.streaming_interface import StreamMessage
from sequence_handler import SequenceHandler
from sqlalchemy import desc
import random
import os

def insert_event_store(user_id: int, chat_id: int, sequence_id: int) -> int:
    with session() as local_session:
        event_store = EventStore(
            user_id = user_id,
            chat_id = chat_id,
            sequence_id = sequence_id
        )
        local_session.add(event_store)
        local_session.commit()
        event_id = event_store.id
    return int(event_id)

def insert_recieve_message(event_id: int, message: str) -> None:
    with session() as local_session:
        recieve_message = ReceiveMessage(
            event_id = event_id,
            value=message)
        session.add(recieve_message)
        session.commit()

def insert_send_message(event_id: int, message: str) -> None:
    with session() as local_session:
        send_message = SendMessage(
            event_id = event_id,
            value=message)
        session.add(send_message)
        session.commit()

def count_event_freq(id: int, user_id:int, chat_id: int) -> int:
    with session() as local_session:
        sequence_ids_query = local_session.query(EventStore.sequence_id).filter_by(user_id=user_id, chat_id=chat_id, sequence_id=id).all()
    sequence_ids = [sequence_id[0] for sequence_id in sequence_ids_query]
    return len(sequence_ids)

def get_latest_sequence_id(user_id:int, chat_id: int) -> int:
    with session() as local_session:
        latest_sequence = local_session.query(EventStore.sequence_id).\
            filter_by(user_id=user_id, chat_id=chat_id).\
            order_by(desc(EventStore.event_timestamp)).\
            first()
    latest_sequence_id = latest_sequence[0] if latest_sequence else 0
    return latest_sequence_id

def get_event_id_from_sequence(sequence_id:int ,user_id:int, chat_id: int) -> int:
    with session() as local_session:
        event_num_query = local_session.query(EventStore.id).\
            filter_by(user_id=user_id,chat_id=chat_id,sequence_id=sequence_id)
    event_num = [num[0] for num in event_num_query]
    return event_num

def get_is_exist_id(user_id:int, chat_id: int) -> int:
    with session() as local_session:
        is_exist_id = local_session.query(EventStore.id).\
            filter_by(user_id=user_id, chat_id=chat_id).\
            order_by(desc(EventStore.event_timestamp)).\
            all()
    return bool(is_exist_id)

buttons=[
    {"label":"◯◯◯◯とはどのような人物ですか？","value":"◯◯◯◯とはどのような人物ですか？","key":"0"},
    {"label":"◯◯◯◯の趣味を教えてください","value":"◯◯◯◯の趣味を教えてください","key":"1"},
    {"label":"◯◯◯◯にはどのような経験がありますか？","value":"◯◯◯◯にはどのような経験がありますか？","key":"2"},
    {"label":"◯◯◯◯のキャリアプランはなんですか？","value":"◯◯◯◯のキャリアプランはなんですか？","key":"3"},
    {"label":"◯◯◯◯の長所と短所を教えてください","value":"◯◯◯◯の長所と短所を教えてください","key":"4"},
    {"label":"◯◯◯◯の得意なことはなんですか？","value":"◯◯◯◯の得意なことはなんですか？","key":"5"},
    {"label":"◯◯◯◯どのような仕事をしたいと考えていますか？","value":"◯◯◯◯どのような仕事をしたいと考えていますか？","key":"5"},
]

sequence_handler = SequenceHandler()

@sequence_handler.event(id=0)
async def qa_next_id(id, websocket, receive_json):
    user_id = int(receive_json['userId'])
    chat_id = int(receive_json['chatId'])
    print("user_id: ", user_id, type(user_id))
    print("chat_id: ", chat_id, type(chat_id))
    if get_is_exist_id(user_id, chat_id):
        if receive_json["content"] == "":
            send_message = 'メッセージが空欄です。テキストを入力してください。'
            await StreamMessage.simple_text(websocket, send_message)
            return {'next_id': 0, 'continue': False}
        else:
            event_id = insert_event_store(user_id , chat_id , id)
            if receive_json["type"] == 'button':
                recieve_message = receive_json["content"]["label"]
                insert_recieve_message(event_id,recieve_message)
            elif receive_json["type"] == 'text':
                recieve_message=receive_json["content"]
                insert_recieve_message(event_id,recieve_message)

            with session() as local_session:
                event_ids_query = local_session.query(EventStore.id).filter_by(user_id=user_id, chat_id=chat_id).all()
                event_ids = [id[0] for id in event_ids_query]
                user_messages_query = local_session.query(ReceiveMessage.received_at, ReceiveMessage.value).filter(ReceiveMessage.event_id.in_(event_ids)).all()
                bot_messages_query = local_session.query(SendMessage.send_at, SendMessage.value).filter(SendMessage.event_id.in_(event_ids)).all()
            user_messages_history = [{"send_by": "user_message","datetime": message[0], "message":message[1]} for message in user_messages_query if not message[1] == ""]
            bot_messages_history = [{"send_by": "bot_message","datetime": message[0], "message":message[1]} for message in bot_messages_query]
            messages_history = user_messages_history + bot_messages_history
            print(messages_history)
            sorted_message_history = sorted(messages_history, key=lambda x: x['datetime'])

            send_message = await StreamMessage.qa_with_docs(websocket,recieve_message, sorted_message_history)
            insert_send_message(event_id,send_message)

            sequence_id_num = count_event_freq(id, user_id, chat_id)
            print("sequence_id_num: ",sequence_id_num)
            if (sequence_id_num) % 4 != 0:
                return {'next_id': 0, 'continue': False}
            else:
                return {'next_id': 2, 'continue': True}
    else:
        event_id = insert_event_store(user_id , chat_id , id)
        recieve_message=receive_json["content"]
        insert_recieve_message(event_id,recieve_message)
        send_message = 'こんにちわ!\n私は◯◯◯◯についての質問を受け付けるチャットボットです！\n何か質問はございますか？\n例)'
        await StreamMessage.simple_text(websocket, send_message)

        select_buttons = random.sample(buttons, 2)


        await StreamMessage.select_button(websocket, select_buttons)
        insert_send_message(event_id,send_message)
        return {'next_id': 0, 'continue': False}

@sequence_handler.event(id=2)
async def send_text(id, websocket, receive_json):
    print("id:", id)
    user_id = receive_json['userId']
    chat_id = receive_json['chatId']

    latest_sequence_id = get_latest_sequence_id(user_id, chat_id)
    event_id = insert_event_store(user_id , chat_id , id)
    if latest_sequence_id!=id:
        send_message = '\n\nご質問は解消いたしましたか？'
        await StreamMessage.simple_text(websocket, send_message)
        buttons=[
            {"label":"はい","value":"はい","key":"0"},
            {"label":"いいえ","value":"いいえ","key":"1"},
        ]
        await StreamMessage.select_button(websocket, buttons)
        return {'next_id': 0, 'continue': False}
    else:
        return {'next_id': 3, 'continue': True}

@sequence_handler.event(id=3)
async def send_text(id, websocket, receive_json):
    user_id = receive_json['userId']
    chat_id = receive_json['chatId']
    recieve_message=receive_json["content"]
    latest_sequence_id = get_latest_sequence_id(user_id, chat_id)

    if receive_json["type"] == 'button' and latest_sequence_id != id:
        message_label = recieve_message["label"]
        message_key = recieve_message["key"]
        message_value = recieve_message["value"]
        event_id = insert_event_store(user_id , chat_id , id)
        if message_label == "はい":
            send_message = '引き続きご利用ください!\n'
            await StreamMessage.simple_text(websocket, send_message)
            insert_recieve_message(event_id,message_label)
            insert_send_message(event_id,send_message)
            return {'next_id': 0, 'continue': False}
        elif message_label == "いいえ":
            send_message = '質問をまとめ、担当者に報告しました！\n引き続きご利用ください！'
            await StreamMessage.simple_text(websocket, send_message)
            insert_recieve_message(event_id,message_label)
            insert_send_message(event_id,send_message)
            return {'next_id': 0, 'continue': False}
    elif receive_json["type"] == 'text' and latest_sequence_id==3:
        return {'next_id': 0, 'continue': True}
    else:
        send_message = 'ボタンをクリックして再度回答してください。'
        event_id = insert_event_store(user_id , chat_id , id)
        insert_recieve_message(event_id,recieve_message)
        await StreamMessage.simple_text(websocket, send_message)
        insert_send_message(event_id,send_message)
        return {'next_id': 2, 'continue': True}

async def chatbot_router(websocket, receive_json):
    user_id = receive_json['userId']
    chat_id = receive_json['chatId']
    latest_sequence_id = get_latest_sequence_id(user_id, chat_id)
    print("receive_json")
    print(receive_json)
    # {
    #     'userId': 1156986,
    #     'chatId': 1769902,
    #     'type': 'button',
    #     'content': {
    #         'label': '◯◯◯◯のキャリアプランはなんですか？',
    #         'key': '3',
    #         'value': '◯◯◯◯のキャリアプランはなんですか？'
    #     }
    # }
    # {'userId': 1688493, 'chatId': 1581866, 'type': 'text', 'content': 'こんにちわ'}

    # if receive_json["type"] == "button":


    await sequence_handler.handle_sequence(latest_sequence_id, websocket, receive_json)


