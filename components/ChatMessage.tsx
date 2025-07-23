
import React from 'react';
import type { ChatMessage as ChatMessageType } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
}

const LoadingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1">
    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
  </div>
);

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isStreaming = false }) => {
  const isUser = message.role === 'user';

  const containerClasses = `flex items-start gap-4 max-w-3xl mx-auto ${isUser ? 'flex-row-reverse' : ''}`;
  const bubbleClasses = `px-5 py-3 rounded-2xl ${isUser ? 'bg-teal-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`;
  const textClasses = "whitespace-pre-wrap prose prose-invert prose-p:my-0";

  const Avatar = () => (
    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${isUser ? 'bg-teal-500' : 'bg-slate-600'}`}>
      {isUser ? <UserIcon className="w-5 h-5 text-white" /> : <BotIcon className="w-5 h-5 text-teal-300" />}
    </div>
  );

  const content = (
    <div className={textClasses}>
      {message.text}
      {isStreaming && <LoadingIndicator />}
    </div>
  );

  return (
    <div className={containerClasses}>
      <Avatar />
      <div className={bubbleClasses}>
        {message.isWorkflow ? (
          <div className="border border-slate-600 rounded-lg p-4 -m-2 bg-slate-800/40">
            <h3 className="text-md font-semibold text-teal-300 mb-3">Generated Workflow</h3>
            <div className={textClasses}>
              {message.text}
              {isStreaming && <LoadingIndicator />}
            </div>
          </div>
        ) : (
          <div className={textClasses}>
            {message.text}
            {isStreaming && <LoadingIndicator />}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
