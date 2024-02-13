import React, { useContext, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Mb = styled(motion.button)`
  margin: 2px 5px 2px 0px;
  text-align: center;

  font-weight: bold;
  font-size: 13px;
  color: #8BBDE1;
  background-color: white;
  border: 1px solid #8BBDE1;
  border-radius: 100vh;
`;

const hoverAnimation = {
  transition: { duration: 0.2 },
  cursor: 'pointer',
  color: '#fff',
  backgroundColor: '#3eabfa',
};

const tapAnimation = {
  backgroundColor: '#3eabfa',
  scale: 0.9,
  transition: {
    duration: 0.06
  }
};

type ChatButtonProps = {
  value: string;
  children: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export const ChatButton: React.FC<ChatButtonProps> = ({ value,children,onClick }: ChatButtonProps) => {

  return (
    <Mb
      value={value}
      onClick={onClick}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      >
      {children}
    </Mb>
  )
};

