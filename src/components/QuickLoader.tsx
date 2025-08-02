import React from 'react';
import { Wrench } from 'lucide-react';

interface QuickLoaderProps {
  message?: string;
}

export const QuickLoader: React.FC<QuickLoaderProps> = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Wrench className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-white">Salvatore</h1>
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg font-medium">{message}</p>
      </div>
    </div>
  );
};
