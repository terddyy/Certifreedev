import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bug } from 'lucide-react';
import { DebugPanel } from './DebugPanel';

export const DebugToggle: React.FC = () => {
  const [isDebugPanelOpen, setIsDebugPanelOpen] = useState(false);

  // Only show in development
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-40 shadow-lg"
        onClick={() => setIsDebugPanelOpen(true)}
        title="Open Debug Panel"
      >
        <Bug className="h-4 w-4" />
      </Button>

      <DebugPanel 
        isOpen={isDebugPanelOpen} 
        onClose={() => setIsDebugPanelOpen(false)} 
      />
    </>
  );
}; 