import React, { useContext } from "react";
import styled from "styled-components";
import ArrowIcon from "./ArrowIcon.svg";
import { SendButtonActionsContext } from "../../providers/SendButtonActionsProvider";

const SButton = styled.button`
    height:39px;
    width: 39px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #e4edf4;
    display: flex;

    justify-content: center;
    place-items: center;
    user-select: none;
    &:hover {
        cursor: pointer;
    };
    &:active {
        background-color: #C4D3DF;
    };
`;

const Simg = styled.img`
    stroke-width="3"
    height:20px;
    width: 20px;
    opacity: 0.4;
`;

export const SendButton: React.FC = () => {
    const { sendButtonClickHandler }  = useContext(SendButtonActionsContext);
    return (
        // <SButton onClick={sendButtonClickHandler}>
        <SButton onClick={sendButtonClickHandler}>
            <Simg src={ArrowIcon} alt=""/>
        </SButton>
    )
}
