
import React from 'react';

interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TopicInput: React.FC<TopicInputProps> = ({ value, onChange }) => (
  <div>
    <label htmlFor="topic" className="block text-sm font-medium text-slate-300 mb-2">
      Chart Topic
    </label>
    <input
      id="topic"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="e.g., Monthly coffee sales"
      className="w-full bg-slate-700/50 border border-slate-600 text-slate-200 rounded-md py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
    />
  </div>
);

export default TopicInput;
