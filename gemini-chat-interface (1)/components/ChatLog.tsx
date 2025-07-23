
import React, { useRef, useEffect } from 'react';
import type { ChatMessage as ChatMessageType } from '../types';
import ChatMessage from './ChatMessage';

interface ChatLogProps {
  history: ChatMessageType[];
  isLoading: boolean;
}

const ChatLog: React.FC<ChatLogProps> = ({ history, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  return (
    <div className="p-4 space-y-6">
      {history.map((msg, index) => (
        <ChatMessage 
          key={index} 
          message={msg} 
          isStreaming={isLoading && index === history.length - 1} 
        />
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatLog;
