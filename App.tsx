
import React from 'react';
import Header from './components/Header';
import ImageProcessor from './components/ImageProcessor';

function App() {
  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <ImageProcessor />
      </main>
       <footer className="text-center p-4 text-xs text-slate-500">
        <p>Powered by Gemini API. © 2024</p>
      </footer>
    </div>
  );
}

export default App;
