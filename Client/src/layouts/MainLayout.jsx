import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar/Sidebar';
import Header from '../Components/Header/Header';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
    {/* Sidebar: always fixed on the left */}
    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
  
    {/* Content area: scrollable and margin left on desktop */}
    <div className="flex-1 flex flex-col">
      <Header toggleSidebar={toggleSidebar} />
      <main className="mt-14 overflow-y-auto h-[calc(100vh-3.5rem)]"> {/* Adjust for header height */}
        {children}
      </main>
    </div>
  </div>
  );
};

export default MainLayout;
