import React, { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { ChatAreaTitle } from "../molecules/ChatAreaTitle";
import { ChatText } from "../atoms/ChatArea/ChatText";
import { ChatButton } from "../atoms/ChatArea/ChatButton";
import { ChatTicketCard } from "../atoms/ChatArea/ChatTicketCard";
import { useWebSocket } from '../../providers/WebSocketContext'
import { ChatAreaObjectsContext } from "../../providers/ChatAreaObjectsProvider";

import chatbotImage from "./chatbot.png";
import userImage from './user.png';

const Container = styled.div`
  animation: fadein-bottom 0.1s ease-out forwards;
  @keyframes fadein-bottom {
    0% {
      opacity: 0;
      transform: translateY(30px); /* 開始時はマイナス指定 */
    }
    100% {
      opacity: 1;
      transform: translateY(0); /* 終了時の位置をデフォルトに */
    }
  }
`;

const TextContainer = styled.div`
  margin: 7px 0 10px 26px;
  padding: 0px;
`;

const ButtonContainer = styled.div`
  margin-left: 26px;
  animation: fadein-top 0.5s ease-out forwards;
  @keyframes fadein-top {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const TicketContainer = styled.div`
  margin-top: 5px;
  margin-bottom: 20px;
  margin-left: 26px;
  animation: slideinLeft 0.4s ease forwards;
  @keyframes slideinLeft {
    0% {
      opacity: 0;
      transform: translateX(-250px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

type ChatAreaProps = {
  iconSrc: string;
  iconAlt: string;
  titleText: string;
  contents: any;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ iconSrc, iconAlt, titleText, contents}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage } = useWebSocket();
  const {chatAreaObjects, setChatAreaObjects} = useContext(ChatAreaObjectsContext)

  const handleClick = async (label:String ,key:String, value:String) => {
    await sendMessage({
      "userId" : globalThis.userId,
      "chatId" : globalThis.chatId,
      "type": "button",
      "content": {"label":label, "key":key, "value":value}
    });
    const newUserArea = {
      key: chatAreaObjects.length,
      send_by: 'user',
      iconSrc: userImage,
      iconAlt: 'user',
      titleText: 'あなた',
      contents: [
          { key: 0, type: 'text', content: label }
      ]};
      const newBotArea = {
        key: chatAreaObjects.length+1,
        send_by: 'bot',
        iconSrc: chatbotImage,
        iconAlt: 'bot',
        titleText: 'チャットボット',
        contents: []
    };
    setChatAreaObjects(prevProps => [...prevProps, newUserArea,newBotArea]);
  };

  const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
      scrollToBottom();
  }, [contents]);

  const renderResponseComponent = (contents) => {
    if (!contents) return null;
    return contents.map((content,index) => {
      switch(content.type) {
        case 'text':
          return (
            <TextContainer ref={messagesEndRef}>
              <ChatText key={index}>{`${content.content}`}</ChatText>
            </TextContainer>
          )
        case 'button':
          return (
            <ButtonContainer ref={messagesEndRef}>
              {content.content.map((button, buttonIndex) => (
                <ChatButton
                  key={buttonIndex}
                  value={button.value}
                  onClick={() => handleClick(String(button.label),String(button.key),String(button.value))}
                  >
                  {`${button.label}`}
                </ChatButton>
              ))}
            </ButtonContainer>
          )
        default:
          return null;
      }
    });
  };

  return (
    <Container>
      <ChatAreaTitle iconSrc={iconSrc} iconAlt={iconAlt} titleText={titleText} />
      {renderResponseComponent(contents)}
    </Container>
  );
};
