import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import ChatWithUs from '../components/chat/ChatWithUs';
import DemoModeSwitcher from '../components/navigation/DemoModeSwitcher';

export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Interactive Chat Widget (Prototype 1:1) */}
      <ChatWithUs />

      {/* Interactive Demo Mode Switcher (Prototype 1:1) */}
      <DemoModeSwitcher />
    </div>
  );
}

export default PublicLayout;
