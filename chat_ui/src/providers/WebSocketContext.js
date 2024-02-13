import React, { useState, useEffect, createContext, useContext, useRef } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children, url }) => {
    const [webSocketMessage, setwebSocketMessage] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);

    const connectWebSocket = (onOpenCallback) => {
        socketRef.current = new WebSocket(url)
        socketRef.current.onopen = () => {
            console.log("WebSocket connection established");
            setIsConnected(true);
            if (onOpenCallback) onOpenCallback();
        };
        socketRef.current.onmessage = (event) => {
            console.log("event.data")
            console.log(event.data)
            setwebSocketMessage(messages => [...messages, JSON.parse(event.data)]);
            // setwebSocketMessage(JSON.parse(event.data));
        };
        socketRef.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
        socketRef.current.onclose = () => {
            console.log("WebSocket connection closed");
        };
    };

    useEffect(() => {
        console.log("再接続")
        if (!isConnected) {
            connectWebSocket()
        }
    }, [isConnected]);

    const sendMessage = (data) => {
        console.log("sendmessage")
        if (socketRef.current.readyState === WebSocket.OPEN) {
            console.log("websocketが接続されています。");
            console.log(socketRef.current)
            socketRef.current.send(JSON.stringify(data));
        } else {
            console.error("WebSocket is not open. Attempting to reconnect...");
            connectWebSocket(() => {
                console.log("Reconnected. Sending message.");
                socketRef.current.send(JSON.stringify(data));
            });
        }
    }

    const contextValue = {
        webSocketMessage,
        setwebSocketMessage,
        sendMessage,
        isConnected
    };

    return (
        <WebSocketContext.Provider value={contextValue}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = (url) => {
    return useContext(WebSocketContext);
}
