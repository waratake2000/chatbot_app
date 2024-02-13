import React from "react";
import styled from "styled-components";

const Sp = styled.p`
  font-size: 13px;
  color: #8b9196;

  margin: 0 0 0 26px;
  white-space: pre-line;
`;

type MsgContentProps = {
  children: string;
}

export const MsgContent: React.FC<MsgContentProps> = ({children}) => {
  return (
    <Sp>{children}</Sp>
  )
}

