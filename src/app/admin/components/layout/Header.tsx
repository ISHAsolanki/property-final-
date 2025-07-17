import React from 'react';
import { Search, Bell, User, Menu, LogOut } from 'lucide-react';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useApp();

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          icon={Menu}
          onClick={onMenuToggle}
          className="lg:hidden"
        />
        
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties, users..."
            className="w-96 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" icon={Bell} />
        <Button 
          variant="ghost" 
          size="sm" 
          icon={LogOut} 
          onClick={logout}
          className="text-gray-400 hover:text-red-400"
        />
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-300" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white">{user?.email || 'Admin'}</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};