import React, { ReactNode, createContext, useState } from "react";

interface InputTextContextType {
    inputText: string;
    setInputText: (newValue: string) => void;
};

export const InputTextContext = createContext<InputTextContextType>({
    inputText: "",
    setInputText: () => {},
});

interface InputTextProviderProps {
    children: ReactNode;
};

export const InputTextProvider = ({children}: InputTextProviderProps) => {
    const [TextValue, setInputText] = useState<string>('');

    return (
        <InputTextContext.Provider value={{inputText: TextValue, setInputText}}>
            {children}
        </InputTextContext.Provider>
    )
};
