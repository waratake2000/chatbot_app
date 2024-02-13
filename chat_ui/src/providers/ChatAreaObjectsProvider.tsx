import React, {ReactNode, createContext, useState} from "react";

interface ChatAreaObjectType {
    key: number;
    iconSrc: string;
    iconAlt: string;
    titleText: string;
    contents: any;
};

interface ChatAreaObjectContextType {
    chatAreaObjects: ChatAreaObjectType[];
    setChatAreaObjects: React.Dispatch<React.SetStateAction<ChatAreaObjectType[]>>
};

export const ChatAreaObjectsContext = createContext<ChatAreaObjectContextType | undefined>(undefined);

interface chatAreaObjectsProviderProps {
    children: ReactNode;
};

export const ChatAreaObjectsProvider: React.FC<chatAreaObjectsProviderProps> = ({children}) => {
    const [chatAreaObjects, setChatAreaObjects] = useState<ChatAreaObjectType[]>([]);

    return (
        <ChatAreaObjectsContext.Provider value={{ chatAreaObjects, setChatAreaObjects}}>
            {children}
        </ChatAreaObjectsContext.Provider>
    )
};


