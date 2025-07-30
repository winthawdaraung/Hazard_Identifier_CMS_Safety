import React from 'react';
import { FileText, Shield } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-cern-blue text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8" />
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">CERN CMS Safety Report</h1>
            <p className="text-cern-lightblue">Hazard Identification Process Generator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;