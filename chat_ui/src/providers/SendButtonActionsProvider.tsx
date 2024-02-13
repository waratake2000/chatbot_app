import React, { createContext, ReactNode, useState } from "react";

// コンテキストの型定義を更新
interface SendButtonActionsContextType {
    sendButtonClickHandler: () => void;
    setSendButtonClickHandler: (newHandler: () => void) => void;
}

// コンテキストの名前を変更
export const SendButtonActionsContext = createContext<SendButtonActionsContextType>({
    sendButtonClickHandler: () => {},
    setSendButtonClickHandler: () => {},
});

interface SendButtonActionsProviderProps {
    children: ReactNode;
}

// プロバイダコンポーネントの名前と内部の状態名を変更
export const SendButtonActionsProvider = ({ children }: SendButtonActionsProviderProps) => {
    // 状態変数の命名を変更
    const [sendButtonClickHandler, setSendButtonClickHandler] = useState<() => void>(() => {});

    return (
        <SendButtonActionsContext.Provider value={{ sendButtonClickHandler, setSendButtonClickHandler }}>
            {children}
        </SendButtonActionsContext.Provider>
    );
}

