import React from 'react';

interface DynamicBackgroundProps {
  children?: React.ReactNode;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ children }) => {
  return (
    <div className="fixed inset-0 overflow-hidden z-0">
      {/* Light blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[rgba(34,197,94,0.2)] rounded-full mix-blend-multiply filter blur-[180px] opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-[rgba(34,197,94,0.2)] rounded-full mix-blend-multiply filter blur-[180px] opacity-20 animate-blob animation-delay-4000 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[rgba(34,197,94,0.2)] rounded-full mix-blend-multiply filter blur-[180px] opacity-20 animate-blob pointer-events-none"></div>
      {/* Additional blobs for more depth/movement */}
      <div className="absolute top-1/3 right-1/3 w-56 h-56 bg-[rgba(34,197,94,0.2)] rounded-full mix-blend-multiply filter blur-[180px] opacity-20 animate-blob animation-delay-6000 pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/3 w-60 h-60 bg-[rgba(34,197,94,0.2)] rounded-full mix-blend-multiply filter blur-[180px] opacity-20 animate-blob animation-delay-8000 pointer-events-none"></div>
    {children}
    </div>
  );
};

export default DynamicBackground;
