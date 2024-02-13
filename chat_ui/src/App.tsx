import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import styled from 'styled-components';
import './App.css';
import { ChatWindow } from './components/pages/ChatWindow';
import { SendButtonActionsProvider } from './providers/SendButtonActionsProvider';
import { InputTextProvider } from './providers/InputTextProvider';
import { WebSocketProvider } from './providers/WebSocketContext';
import { ChatAreaObjectsProvider } from './providers/ChatAreaObjectsProvider';


const MainContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  user-select: text;
`;

function App() {
  // userId,chatIdはまだ実装で規定なため、ランダムで対応
  function generateRandomSevenDigitNumber() {
    return Math.floor(Math.random() * 1000000) + 1000000;
  }
  globalThis.userId = generateRandomSevenDigitNumber();
  globalThis.chatId = generateRandomSevenDigitNumber();


  return (
    <BrowserRouter>
        <MainContainer>
            <Switch>
              <InputTextProvider>
                <SendButtonActionsProvider>
                  <ChatAreaObjectsProvider>
                    <WebSocketProvider url="ws://0.0.0.0:8000/ws/streaming-response">
                      <Route path='/' exact component={ChatWindow} />
                    </WebSocketProvider>
                  </ChatAreaObjectsProvider>
                </SendButtonActionsProvider>
              </InputTextProvider>
            </Switch>
        </MainContainer>
    </BrowserRouter>
  );
}

export default App;


