
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800/50 shadow-sm">
      <div className="container mx-auto px-4 py-5 md:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          HR Employee Photo Standardizer
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Upload an employee photo, then use a text prompt to standardize the background and attire.
        </p>
      </div>
    </header>
  );
};

export default Header;
