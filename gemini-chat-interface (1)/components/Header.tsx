
import React from 'react';
import { SaveIcon } from './icons/SaveIcon';
import { WorkflowIcon } from './icons/WorkflowIcon';

interface HeaderProps {
  onSave: () => void;
  onCreateWorkflow: () => void;
  isWorkflowCreationPossible: boolean;
}

const Header: React.FC<HeaderProps> = ({ onSave, onCreateWorkflow, isWorkflowCreationPossible }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700 shadow-md">
      <h1 className="text-xl font-bold text-teal-400">Gemini Chat</h1>
      <div className="flex items-center gap-3">
        <button
            onClick={onCreateWorkflow}
            disabled={!isWorkflowCreationPossible}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Create workflow from last message"
        >
            <WorkflowIcon className="w-5 h-5" />
            <span>Create Workflow</span>
        </button>
        <button
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Save chat history"
        >
            <SaveIcon className="w-5 h-5" />
            <span>Save History</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
