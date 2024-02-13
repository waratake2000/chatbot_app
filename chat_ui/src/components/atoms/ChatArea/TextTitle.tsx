import React from "react";
import styled from "styled-components";

const Sp = styled.p`
  font-size: 13px;
  font-weight: 600;
  margin-left: 6px;
  padding: 0;
  color: #8b9196;

`;

type TextTitleProps = {
  children: string;
}

export const TextTitle: React.FC<TextTitleProps> = ({children}) => {
  return (
    <Sp>{children}</Sp>
  )
}

