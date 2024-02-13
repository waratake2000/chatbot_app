import React, { useContext } from "react";
import styled from "styled-components";
import { InputTextContext } from "../../providers/InputTextProvider";

const STextField = styled.input`
  height: 35px;
  width: 100%;
  border-radius: 9px;
  font-size:14px;
  border: 1px solid #d9dad9;
  margin:0;
  padding-left:10px;
  &:focus {
    border-color: #8BBDE1; /* フォーカス時の枠線の色 */
    outline: none; /* ブラウザのデフォルトのアウトラインを無効にする */
  }

`;

export const MsgField: React.FC = () => {
  const { inputText, setInputText } = useContext(InputTextContext);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value)
  }

  return (
    <STextField
      value={inputText}
      onChange={handleInputChange}
      // fieldState="default"
      // label=""
      name=""
      placeholder="Input your question"
    />
  )
}
