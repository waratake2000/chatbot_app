import React, { ReactNode }  from "react";
import styled from "styled-components";

const SImg = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #ccc;
`;

type IconImgProps = {
  src: string;
  alt: string;
}

export const IconImg: React.FC<IconImgProps> = ({ src, alt }) => {
  return (
    <SImg src={src} alt={alt} />
  )
}
