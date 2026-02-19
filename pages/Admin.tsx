import React from 'react';

// This file is deprecated. 
// Configuration is now handled via data/portfolioConfig.ts

const Admin: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Page Moved</h1>
        <p className="text-gray-500 mt-2">
           Please configure the portfolio in <code>src/data/portfolioConfig.ts</code>.
        </p>
      </div>
    </div>
  );
};

export default Admin;