/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { LightningBoltIcon } from './icons';

const SparkleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.624l-.219.874-.219-.874a1.5 1.5 0 00-1.023-1.023l-.874-.219.874-.219a1.5 1.5 0 001.023-1.023l.219-.874.219.874a1.5 1.5 0 001.023 1.023l.874.219-.874.219a1.5 1.5 0 00-1.023 1.023z" />
  </svg>
);

const CpuChipIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5m0 16.5v-1.5m3.75-12H21m-18 0h1.5m15 3.75H21m-18 0h1.5m9-1.5v-3.75c0-.621-.504-1.125-1.125-1.125h-3.75c-.621 0-1.125.504-1.125 1.125v3.75m11.25 0v-3.75c0-.621-.504-1.125-1.125-1.125h-3.75c-.621 0-1.125.504-1.125 1.125v3.75m-3.75 0h-3.75m11.25 0h3.75M9 12.75h6m-6 3.75h6m-6-3.75a.375.375 0 0 1-.375-.375v-1.5a.375.375 0 0 1 .375-.375h6a.375.375 0 0 1 .375.375v1.5a.375.375 0 0 1-.375.375M9 12.75v-1.5" />
    </svg>
);

interface HeaderProps {
    models: Record<string, { name: string, id: string }>;
    currentModelId: string;
    onModelChange: (modelId: string) => void;
    isTurboMode: boolean;
    onTurboModeChange: (enabled: boolean) => void;
}


const Header: React.FC<HeaderProps> = ({ models, currentModelId, onModelChange, isTurboMode, onTurboModeChange }) => {
  return (
    <header className="w-full py-4 px-8 border-b border-gray-700 bg-gray-800/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
              <SparkleIcon className="w-6 h-6 text-blue-400" />
              <h1 className="text-xl font-bold tracking-tight text-gray-100">
                atcrez
              </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <label htmlFor="turbo-mode-toggle" className="flex items-center cursor-pointer gap-2" title="Turbo mode disables extra AI thinking for faster, lower-quality results.">
                <LightningBoltIcon className={`w-5 h-5 transition-colors ${isTurboMode ? 'text-yellow-400' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium transition-colors ${isTurboMode ? 'text-yellow-300' : 'text-gray-300'}`}>Turbo Mode</span>
                <div className="relative">
                    <input 
                        type="checkbox" 
                        id="turbo-mode-toggle" 
                        className="sr-only" 
                        checked={isTurboMode} 
                        onChange={(e) => onTurboModeChange(e.target.checked)}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${isTurboMode ? 'bg-yellow-500/50' : 'bg-gray-600'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isTurboMode ? 'translate-x-4' : ''}`}></div>
                </div>
            </label>

            <div className="h-6 w-px bg-gray-600"></div>

            <div className="relative flex items-center gap-2 bg-white/5 rounded-md px-2 py-1">
              <CpuChipIcon className="w-5 h-5 text-gray-400"/>
              <select 
                value={currentModelId} 
                onChange={(e) => onModelChange(e.target.value)}
                className="bg-transparent text-gray-200 text-sm font-medium border-0 focus:ring-0 focus:outline-none appearance-none pr-6 cursor-pointer"
                aria-label="Select AI Model"
              >
                {Object.entries(models).map(([id, { name }]) => (
                  <option key={id} value={id} className="bg-gray-800 text-white">
                    {name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
      </div>
    </header>
  );
};

export default Header;