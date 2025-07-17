import React from 'react';
import { Button } from '../common/Button';
import { Save, Eye, Upload } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="h-16 bg-gray-900 border-t border-gray-800 px-6 flex items-center justify-end space-x-4">
      <Button variant="secondary" size="sm" icon={Save}>
        Save Draft
      </Button>
      <Button variant="ghost" size="sm" icon={Eye}>
        Preview
      </Button>
      <Button variant="primary" size="sm" icon={Upload}>
        Publish
      </Button>
    </footer>
  );
};