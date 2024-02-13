import React, { ReactNode } from "react";
import styled from "styled-components";

import { SendMsgBar } from "../molecules/SendMsgBar";

const Container = styled.div`
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ScrollContainer = styled.div`
    flex-grow: 1;
    display: flex;
    width: 100%;
    margin-top: 30px;
    justify-content: center;
    overflow-y: scroll;
`;

const ChatList = styled.div`
    width: 45vw;
    @media (max-width: 850px) {
        width: 75vw;
    }
`;

const MsgBarContainer = styled.div`
    flex-grow: auto;
    width: 45vw;
    @media (max-width: 850px) {
        width: 75vw;
    }
`;

interface ChatLayoutProps {
    children: ReactNode;
}

export const ChatLayout = ({children}:ChatLayoutProps ) => {

    return (
        <Container>
            <ScrollContainer>
                <ChatList>
                    {children}
                </ChatList>
            </ScrollContainer>
            <MsgBarContainer>
                <SendMsgBar />
            </MsgBarContainer>
        </Container>
    )
}
