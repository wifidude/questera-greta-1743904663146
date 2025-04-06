import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-[#1A191C] shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <img 
              src="/pillar-logo.svg" 
              alt="Pillar"
              className="h-8 w-auto"
            />
            <div className="h-6 w-px bg-[#C1E0D7] opacity-30" />
            <h1 className="text-xl font-medium text-white">
              Kanban Card Generator
            </h1>
          </div>
          <Link
            to="/"
            className="flex items-center space-x-2 text-[#C1E0D7] hover:text-[#EF8741] transition-colors"
          >
            <FaHome className="text-lg" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;