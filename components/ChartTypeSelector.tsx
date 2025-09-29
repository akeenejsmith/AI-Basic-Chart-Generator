
import React from 'react';
import { ChartType } from '../types';

interface ChartTypeSelectorProps {
  chartTypes: ChartType[];
  selectedType: ChartType;
  onSelectType: (type: ChartType) => void;
}

const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({
  chartTypes,
  selectedType,
  onSelectType,
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-2">
      Chart Type
    </label>
    <div className="flex bg-slate-700/50 border border-slate-600 rounded-md p-1">
      {chartTypes.map((type) => (
        <button
          key={type}
          onClick={() => onSelectType(type)}
          className={`w-full text-center py-2 px-4 rounded-md text-sm font-semibold transition-colors duration-300
            ${selectedType === type
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-300 hover:bg-slate-700'
            }`}
        >
          {type}
        </button>
      ))}
    </div>
  </div>
);

export default ChartTypeSelector;
