import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header'; // Import Header
import Footer from '../components/layout/Footer'; // Import Footer
import './MainLayout.css'; // Create CSS for layout styling

function MainLayout() {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <Outlet /> {/* Child routes will render here */}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;

