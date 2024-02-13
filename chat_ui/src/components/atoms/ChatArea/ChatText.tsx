import React from "react";
import styled from "styled-components";

const Sp = styled.p`
  margin:0px;
  font-size: 13px;
  color: #8b9196;

  white-space: pre-line;
`;

type ChatTextProps = {
  children: string;
}

export const ChatText: React.FC<ChatTextProps> = ({children}) => {
  return (
    <Sp>{children}</Sp>
  )
}

