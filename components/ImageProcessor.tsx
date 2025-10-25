
import React, { useState, useCallback, useMemo } from 'react';
import { editImage } from '../services/geminiService';
import Spinner from './Spinner';
import { UploadIcon, DownloadIcon, SparklesIcon } from './Icons';

const ImageProcessor: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('Set a professional, blurred office background and ensure business casual attire.');
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const originalPreviewUrl = useMemo(() => {
    if (originalFile) {
      return URL.createObjectURL(originalFile);
    }
    return null;
  }, [originalFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError('File size must be less than 4MB.');
        return;
      }
      setOriginalFile(file);
      setEditedImageUrl(null);
      setError(null);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!originalFile || !prompt) {
      setError('Please upload an image and provide an editing prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImageUrl(null);

    try {
      const resultUrl = await editImage(originalFile, prompt);
      setEditedImageUrl(resultUrl);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [originalFile, prompt]);

  const handleDownload = () => {
    if (editedImageUrl) {
      const link = document.createElement('a');
      link.href = editedImageUrl;
      link.download = 'edited-employee-photo.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
             <label htmlFor="file-upload" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Step 1: Upload Employee Photo
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
                <div className="flex text-sm text-slate-600 dark:text-slate-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={handleFileChange}/>
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-500">PNG, JPG up to 4MB</p>
              </div>
            </div>
             {originalFile && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Selected: <span className="font-medium">{originalFile.name}</span>
                </p>
            )}
          </div>
          <div className="space-y-4">
            <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Step 2: Describe Edits
            </label>
            <textarea
              id="prompt"
              rows={4}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Add a retro filter, remove the person in the background..."
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !originalFile}
              className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Spinner className="h-5 w-5"/>
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-5 w-5"/>
                  Generate Edited Image
                </>
              )}
            </button>
          </div>
        </div>
        {error && <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md text-sm">{error}</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-center">Original Image</h3>
          <div className="aspect-square w-full bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center">
            {originalPreviewUrl ? (
              <img src={originalPreviewUrl} alt="Original employee" className="max-h-full max-w-full object-contain rounded-md" />
            ) : (
              <p className="text-slate-500">Upload an image to see a preview</p>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-center">Edited Image</h3>
          <div className="aspect-square w-full bg-slate-200 dark:bg-slate-700 rounded-md flex flex-col items-center justify-center relative">
            {isLoading && <Spinner className="h-12 w-12 text-indigo-500" />}
            {!isLoading && editedImageUrl && (
              <img src={editedImageUrl} alt="Edited employee" className="max-h-full max-w-full object-contain rounded-md" />
            )}
            {!isLoading && !editedImageUrl && (
              <p className="text-slate-500">Your generated image will appear here</p>
            )}
          </div>
          {editedImageUrl && !isLoading && (
            <button
              onClick={handleDownload}
              className="mt-4 w-full flex justify-center items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 transition-colors"
            >
              <DownloadIcon className="h-5 w-5" />
              Download Image
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageProcessor;
