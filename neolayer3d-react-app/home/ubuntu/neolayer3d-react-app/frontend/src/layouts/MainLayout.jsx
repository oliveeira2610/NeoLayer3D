import React from 'react';
import { Outlet } from 'react-router-dom';
// Import Header and Footer components once created
// import Header from '../components/layout/Header';
// import Footer from '../components/layout/Footer';

function MainLayout() {
  return (
    <div className="main-layout">
      {/* <Header /> */}
      <main className="main-content">
        <Outlet /> {/* Child routes will render here */}
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default MainLayout;

