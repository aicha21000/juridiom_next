import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const ResponsiveLayout = () => {
  return (
    <>
      {/* Header toujours visible */}
      <Header />
      
      {/* Contenu principal avec padding-top pour compenser le header fixe */}
      <main className="pt-16">
        <Outlet />
      </main>
    </>
  );
};

export default ResponsiveLayout;
