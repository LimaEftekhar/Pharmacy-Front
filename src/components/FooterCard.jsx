import React from "react";

const FooterCard = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-6 text-sm w-full relative">
      <div
        className="relative py-6 px-4 md:px-6 flex flex-col justify-between items-center overflow-visible"
        style={{ boxShadow: "0 -4px 6px -4px rgba(0,0,0,0.15)" }}
      >
        {/* Background blobs */}
        <div className="absolute -top-6 -left-6 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl"></div>

        {/* Center block */}
        <div className="text-gray-700 relative z-10 p-2 text-center">
          <h2 className="text-sm font-bold text-blue-500">
            Pharmacy Management System
          </h2>
          <p className="text-sm mt-1">© {currentYear} Lima Eftekhar</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterCard;
