/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useCallback } from 'react';
import { UploadIcon, UsersIcon } from './icons';
import Spinner from './Spinner';

interface CombinePanelProps {
  onCombine: (personOne: File, personTwo: File, prompt: string) => Promise<void>;
  isLoading: boolean;
  loadingMessage: string;
  countdown: number;
}

const ImageUploader: React.FC<{
    onFileSelect: (file: File) => void;
    imageUrl: string | null;
    label: string;
    onClear: () => void;
}> = ({ onFileSelect, imageUrl, label, onClear }) => {
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };
    
    if (imageUrl) {
        return (
            <div className="relative group w-full h-64 bg-black/20 rounded-lg flex items-center justify-center overflow-hidden">
                <img src={imageUrl} alt={label} className="w-full h-full object-cover"/>
                <button 
                    onClick={onClear} 
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Clear ${label} image`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        );
    }

    return (
        <div 
          className={`w-full h-64 p-4 transition-all duration-300 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-3 ${isDraggingOver ? 'bg-blue-500/20 border-dashed border-blue-400' : 'bg-white/5 border-dashed border-gray-600 hover:border-gray-500'}`}
          onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleDrop}
        >
            <UploadIcon className="w-8 h-8 text-gray-400" />
            <p className="font-semibold text-gray-300">{label}</p>
            <label htmlFor={`upload-${label}`} className="text-blue-400 font-medium cursor-pointer hover:underline">
                Choose a file
                <input id={`upload-${label}`} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
            <p className="text-xs text-gray-500">or drag and drop</p>
        </div>
    );
};


const CombinePanel: React.FC<CombinePanelProps> = ({ onCombine, isLoading, loadingMessage, countdown }) => {
    const [personOneFile, setPersonOneFile] = useState<File | null>(null);
    const [personTwoFile, setPersonTwoFile] = useState<File | null>(null);
    const [personOneUrl, setPersonOneUrl] = useState<string | null>(null);
    const [personTwoUrl, setPersonTwoUrl] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');

    useEffect(() => {
        if (personOneFile) {
            const url = URL.createObjectURL(personOneFile);
            setPersonOneUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPersonOneUrl(null);
        }
    }, [personOneFile]);
    
    useEffect(() => {
        if (personTwoFile) {
            const url = URL.createObjectURL(personTwoFile);
            setPersonTwoUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPersonTwoUrl(null);
        }
    }, [personTwoFile]);

    const handleCombineClick = () => {
        if (personOneFile && personTwoFile && prompt) {
            onCombine(personOneFile, personTwoFile, prompt);
        }
    };
    
    const canGenerate = personOneFile && personTwoFile && prompt.trim().length > 0 && !isLoading;

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 animate-fade-in">
            {isLoading && (
                <div className="absolute inset-0 bg-black/70 z-30 flex flex-col items-center justify-center gap-4 animate-fade-in">
                    <Spinner />
                    <p className="text-gray-300 text-lg">{loadingMessage || 'Combining images...'}</p>
                    {countdown > 0 && (
                        <p className="text-gray-400">Estimated time remaining: {countdown}s</p>
                    )}
                    {countdown <= 0 && (
                        <p className="text-gray-400">Finishing up, just a moment...</p>
                    )}
                </div>
            )}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-100 flex items-center justify-center gap-3">
                    <UsersIcon className="w-8 h-8 text-blue-400"/>
                    Combine Images
                </h2>
                <p className="mt-2 text-lg text-gray-400">Upload two photos, and describe a new scene to place them in together.</p>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <ImageUploader 
                    label="Person 1" 
                    onFileSelect={setPersonOneFile} 
                    imageUrl={personOneUrl}
                    onClear={() => setPersonOneFile(null)}
                />
                <ImageUploader 
                    label="Person 2" 
                    onFileSelect={setPersonTwoFile} 
                    imageUrl={personTwoUrl}
                    onClear={() => setPersonTwoFile(null)}
                />
            </div>

            {personOneFile && personTwoFile && (
                 <div className="w-full flex flex-col gap-2 animate-fade-in">
                    <p className="font-semibold text-center text-gray-300">Describe the new scene:</p>
                    <div className="w-full flex items-center gap-2">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'A photo of these two people walking on a beach at sunset'"
                            className="flex-grow bg-gray-800 border border-gray-700 text-gray-200 rounded-lg p-5 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={isLoading}
                        />
                        <button 
                            onClick={handleCombineClick}
                            className="bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-5 px-8 text-lg rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner disabled:from-blue-800 disabled:to-blue-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                            disabled={!canGenerate}
                        >
                            Generate
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CombinePanel;