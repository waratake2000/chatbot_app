import React from "react";
import styled from "styled-components";
import { IconImg } from "../atoms/ChatArea/IconImg";
import { TextTitle } from "../atoms/ChatArea/TextTitle";
import { MsgContent } from "../atoms/ChatArea/MsgContent";

const Sdiv = styled.div`
  margin-top: 11px;
  margin-bottom: 20px;
`;

const TitleContainer = styled.div`
  display: flex;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  margin: 0px;
  height: 25px;
`;

type ChatAreaProps = {
  iconSrc: string;
  iconAlt: string;
  titleText: string;
  msgContent: string;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ iconSrc, iconAlt, titleText, msgContent}) => {
  return (
    <Sdiv>
      <TitleContainer>
        <IconImg src={iconSrc} alt={iconAlt} />
        <TextTitle>{titleText}</TextTitle>
      </TitleContainer>
      <MsgContent>{msgContent}</MsgContent>
    </Sdiv>
  )
}
