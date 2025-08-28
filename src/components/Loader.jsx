import React from 'react';

const Loader = () => (
  <div className="flex items-center justify-center py-8">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <span className="ml-3 text-blue-500 font-semibold">Loading...</span>
  </div>
);

export default Loader;