import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import ChatWithUs from '../components/chat/ChatWithUs';

export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Interactive Chat Widget */}
      <ChatWithUs />
    </div>
  );
}

export default PublicLayout;
