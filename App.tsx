
import React, { useState, useCallback } from 'react';
import { streamChatResponse, generateWorkflow } from './services/geminiService';
import type { ChatMessage as ChatMessageType } from './types';
import Header from './components/Header';
import ChatLog from './components/ChatLog';
import PromptInput from './components/PromptInput';

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveHistory = () => {
    if (chatHistory.length === 0) return;

    const formattedHistory = chatHistory
      .map(msg => `${msg.role.toUpperCase()}:\n${msg.text}\n`)
      .join('\n---\n\n');

    const blob = new Blob([formattedHistory], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gemini-chat-history-${new Date().toISOString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSendPrompt = useCallback(async (prompt: string) => {
    if (isLoading || !prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    const newUserMessage: ChatMessageType = { role: 'user', text: prompt };
    const newHistoryWithPrompt = [...chatHistory, newUserMessage];
    setChatHistory(newHistoryWithPrompt);

    // Add a placeholder for the model's response
    setChatHistory(prev => [...prev, { role: 'model', text: '' }]);

    try {
      await streamChatResponse(
        prompt,
        newHistoryWithPrompt, // Pass history including the new prompt
        (chunk) => {
          setChatHistory(prev => {
            const latestHistory = [...prev];
            const lastMessage = latestHistory[latestHistory.length - 1];
            if (lastMessage.role === 'model') {
              lastMessage.text += chunk;
            }
            return latestHistory;
          });
        }
      );
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Error: ${errorMessage}`);
      setChatHistory(prev => prev.slice(0, -1)); // Remove placeholder on error
    } finally {
      setIsLoading(false);
    }
  }, [chatHistory, isLoading]);

  const handleCreateWorkflow = useCallback(async () => {
    const lastUserMessage = [...chatHistory].reverse().find(m => m.role === 'user');
    if (!lastUserMessage || isLoading) return;

    setIsLoading(true);
    setError(null);

    const modelPlaceholder: ChatMessageType = { role: 'model', text: '', isWorkflow: true };
    setChatHistory(prev => [...prev, modelPlaceholder]);

    try {
        const workflowText = await generateWorkflow(lastUserMessage.text);
        setChatHistory(prev => {
            const latestHistory = [...prev];
            const lastMessage = latestHistory[latestHistory.length - 1];
            lastMessage.text = workflowText;
            return latestHistory;
        });
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(`Error generating workflow: ${errorMessage}`);
        setChatHistory(prev => prev.slice(0, -1));
    } finally {
        setIsLoading(false);
    }
  }, [chatHistory, isLoading]);

  const isWorkflowCreationPossible = chatHistory.some(m => m.role === 'user');

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans">
      <Header 
        onSave={handleSaveHistory}
        onCreateWorkflow={handleCreateWorkflow}
        isWorkflowCreationPossible={isWorkflowCreationPossible && !isLoading}
      />
      <main className="flex-1 overflow-y-auto">
        <ChatLog history={chatHistory} isLoading={isLoading} />
        {error && (
            <div className="flex justify-center p-4">
                <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg max-w-2xl w-full">
                    <p className="font-bold">An Error Occurred</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        )}
      </main>
      <div className="p-4 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700">
        <PromptInput onSend={handleSendPrompt} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;
