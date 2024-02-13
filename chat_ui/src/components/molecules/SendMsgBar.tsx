import React from 'react';
import styled from 'styled-components';

import { MsgField } from '../atoms/MsgField';
import { SendButton } from '../atoms/SendButton';

const Container = styled.div`
  display: grid;
  place-items: center;
  grid-template-columns: 1fr auto;
  padding: 0px;
  // background-color: black;
  background-color: rgba(0, 0, 0, 0);
  margin-top: 0px;
  margin-bottom: 10px;
  margin-left: 0px;
  margin-right: 0px;
`;

const BtnContainer = styled.div`

  margin-top: 0px;
  // margin-left: 15px;
  margin-left: 10px;
  place-items: center;
`;

export const SendMsgBar = () => {
  return (
    <Container>
      <MsgField />
      <BtnContainer>
        <SendButton />
      </BtnContainer>
    </Container>
  );
};

