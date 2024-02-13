import React from "react";
import styled from "styled-components";
import { IconImg } from "../atoms/ChatArea/IconImg";
import { TextTitle } from "../atoms/ChatArea/TextTitle";

const TitleContainer = styled.div`
  display: flex;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  margin: 0px;
  height: 25px;
`;

type ChatAreaTitleProps = {
  iconSrc: string;
  iconAlt: string;
  titleText: string;
}

export const ChatAreaTitle: React.FC<ChatAreaTitleProps> = ({ iconSrc, iconAlt, titleText}) => {
  return (
    <TitleContainer>
      <IconImg src={iconSrc} alt={iconAlt} />
      <TextTitle>{titleText}</TextTitle>
    </TitleContainer>
  )
}



