/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ChatLayout } from "../template/ChatLayout";
import { SendButtonActionsContext } from "../../providers/SendButtonActionsProvider";
import { InputTextContext } from "../../providers/InputTextProvider";
import { ChatAreaObjectsContext } from "../../providers/ChatAreaObjectsProvider";
import { ChatArea } from "../organisms/ChatArea";
import { useWebSocket } from '../../providers/WebSocketContext';

import chatbotImage from "./chatbot.png";
import userImage from './user.png';

export const ChatWindow = () => {
    const socketRef = useRef<WebSocket>(null);
    // const [chatAreaObjects, setChatAreaObjects] = useState<any>([]);
    const { inputText, setInputText } = useContext(InputTextContext);
    const { sendButtonClickHandler, setSendButtonClickHandler } = useContext(SendButtonActionsContext);
    const {chatAreaObjects, setChatAreaObjects} = useContext(ChatAreaObjectsContext)
    const { webSocketMessage, setwebSocketMessage, sendMessage, isConnected } = useWebSocket();

    const [hasRunOnce, setHasRunOnce] = useState(false);

    useEffect(() => {
        if (isConnected && !hasRunOnce) {
            // ここに一度だけ実行したい関数や処理を書く
            const newBotArea = {
                key: 0,
                send_by: 'bot',
                iconSrc: './chatbot.png',
                iconAlt: 'bot',
                titleText: 'チャットボット',
                contents: []
            };
            console.log(sendMessage.readyState);
            setChatAreaObjects([newBotArea]);
            console.log(globalThis.userId)
            console.log(globalThis.chatId)
            sendMessage(
                {
                    "userId" : globalThis.userId,
                    "chatId" : globalThis.chatId,
                    "type": "text",
                    "content": ""
                }
            );

            setHasRunOnce(true); // 処理が実行されたことを記録
        }
    }, [isConnected]);

    const sendButtonClickEvent = useCallback(() => {
            const newUserArea = {
                key: chatAreaObjects.length,
                send_by: 'user',
                iconSrc: userImage,
                iconAlt: 'user',
                titleText: 'あなた',
                contents: [
                    { key: 0, type: 'text', content: inputText }
                ]
            };
            const newBotArea = {
                key: chatAreaObjects.length+1,
                send_by: 'bot',
                iconSrc: chatbotImage,
                iconAlt: 'bot',
                titleText: 'チャットボット',
                contents: []
            };
            sendMessage(
                {
                    "userId" : globalThis.userId,
                    "chatId" : globalThis.chatId,
                    "type": "text",
                    "content": inputText
                }
            );
            setChatAreaObjects(prevProps => [...prevProps, newUserArea,newBotArea]);
            setInputText(""); //メッセージ送信後、入力欄を空にする
        // };
    }, [inputText,chatAreaObjects.length]);

    setSendButtonClickHandler(() => sendButtonClickEvent)

    useEffect(() => {
        if (webSocketMessage.length > 0) {
            const receive_message= webSocketMessage[0]
            setwebSocketMessage(messages => messages.slice(1));
            console.log(receive_message)
            switch(receive_message.type) {
                case 'text':
                    setChatAreaObjects(prevProps => prevProps.map((areaProps, index) => {
                        if (index === prevProps.length - 1) {
                            if (areaProps.contents.length === 0) {
                                // console.log("textコンテントを追加したお");
                                return {
                                    ...areaProps,
                                    contents: [{key: 0, type: 'text', content: receive_message.content}]
                                }
                            }
                            // console.log(chatAreaObjects)
                            const lastIndex = areaProps.contents.length - 1;
                            const lastContent = areaProps.contents[lastIndex];
                            if (lastContent && lastContent.type !== 'text') {
                                return {
                                    ...areaProps,
                                    contents:[...areaProps.contents, {key: areaProps.contents.length, type: 'text', content: receive_message.content}]
                                }
                            }
                            return {
                                ...areaProps,
                                contents: areaProps.contents.map((content, idx) =>
                                    idx === lastIndex ? { ...content, content: content.content + receive_message.content } : content
                                )
                            };
                        }
                        return areaProps;
                    }));
                    break;
                case 'button':
                    console.log("button")
                    setChatAreaObjects((prevProps) => prevProps.map((areaProps, index) => {
                        if (index === prevProps.length - 1) {
                            if (areaProps.contents.length === 0) {
                                return {
                                    ...areaProps,
                                    contents: [{key: 0, type: 'button', content: receive_message.content}]
                                }
                            }
                            // console.log(chatAreaObjects)
                            const lastIndex = areaProps.contents.length - 1;
                            const lastContent = areaProps.contents[lastIndex];
                            if (lastContent && lastContent.type !== 'button') {
                                return {
                                    ...areaProps,
                                    contents:[...areaProps.contents, {key: areaProps.contents.length, type: 'button', content: receive_message.content}]
                                }
                            }
                            return {
                                ...areaProps,
                                contents: areaProps.contents.map((content, idx) =>
                                    idx === lastIndex ? { ...content, content: content.content + receive_message.content } : content
                                )
                            };
                        }
                        return areaProps;
                    }));
                    break;
                default:
                    break;
            };
        };

    },[webSocketMessage.length,chatAreaObjects]);

    return (
        <>
            <ChatLayout>
               {chatAreaObjects.map(props => (
                    <ChatArea
                        key={props.key}
                        iconSrc={props.iconSrc}
                        iconAlt={props.iconAlt}
                        titleText={props.titleText}
                        contents={props.contents}
                    />
               ))}
               <div style={{height:'20vh',position:"relative"}}></div>
            </ChatLayout>
        </>
    )
};
