import { ReactNode, useState } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-50 bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-xl shadow-lg animate-fade-in">
          {content}
          <div className="absolute top-full right-4 -mt-1 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      )}
    </div>
  );
}