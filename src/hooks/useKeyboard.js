import { useEffect } from 'react';

export const useKeyboard = (handlers) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key.toLowerCase();
      
      if (handlers[key]) {
        e.preventDefault();
        handlers[key]();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handlers]);
};