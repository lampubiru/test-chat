
import React, { useState, useRef } from 'react';
import { SendIcon } from './icons/SendIcon';

interface PromptInputProps {
  onSend: (prompt: string) => void;
  isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSend, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSend(prompt);
      setPrompt('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <div className="relative flex items-center">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message to Gemini..."
          className="w-full p-4 pr-16 bg-slate-800 border border-slate-600 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-teal-600 text-white disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-teal-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500"
          aria-label="Send prompt"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <SendIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
};

export default PromptInput;
