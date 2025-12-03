import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardDiskominfo = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#e8f3f6] to-[#cde4ea] text-gray-800 font-sans">

      {/* ==== NAVBAR ==== */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-10 py-4 bg-white shadow-md">
        
        {/* Logo */}
        <div className="flex items-center gap-3 font-semibold text-lg text-[#093757]">
          <div className="w-9 h-9 bg-[#093757] flex items-center justify-center rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M12 2L4 5v6c0 5.25 3.25 10.25 8 11 4.75-.75 8-5.75 8-11V5l-8-3z" />
            </svg>
          </div>
          <span>Bispro Digitaltech</span>
        </div>

        {/* Desktop menu */}
        <ul className="hidden md:flex gap-6 text-sm font-medium text-[#093757]">
          <li onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-[#25577a] cursor-pointer">Home</li>
          <li onClick={() => scrollToSection("applications")} className="hover:text-[#25577a] cursor-pointer">Applications</li>
          <li onClick={() => scrollToSection("reports")} className="hover:text-[#25577a] cursor-pointer">Reports</li>
        </ul>

        {/* Right section */}
        <div className="hidden md:flex items-center gap-4">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-[#25577a]"
          />
          <button onClick={() => navigate("/profil-diskominfo")} className="btn-primary">Profil</button>
          <button onClick={handleLogout} className="btn-primary">Logout</button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-[#093757] text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </nav>

      {/* ==== MOBILE MENU ==== */}
      {menuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-white shadow-lg p-6 space-y-4 z-40">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
          />

          <ul className="flex flex-col gap-4 text-[#093757] text-base">
            <li onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-[#25577a] cursor-pointer">Home</li>
            <li onClick={() => scrollToSection("applications")} className="hover:text-[#25577a] cursor-pointer">Applications</li>
            <li onClick={() => scrollToSection("reports")} className="hover:text-[#25577a] cursor-pointer">Reports</li>
          </ul>

          <button onClick={() => navigate("/profil-diskominfo")} className="w-full btn-primary mt-2">Profil</button>
          <button onClick={handleLogout} className="w-full btn-primary">Logout</button>
        </div>
      )}

      {/* Spacer */}
      <div className="h-20"></div>

      {/* ==== HERO SECTION ==== */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-20 max-w-[1200px] mx-auto">
        <div className="max-w-lg text-[#093757] text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Diskominfo Dashboard</h1>
          <p className="text-[#294659] text-base">
            Monitor user activity, manage accounts, and oversee IT services from one secure dashboard.
          </p>
        </div>

        <div className="mt-10 md:mt-0">
          <img src="src/assets/dashboard.png" className="w-64 md:w-96 mx-auto" />
        </div>
      </section>

      {/* ==== ADMIN CARDS ==== */}
      <section className="bg-[#eaf5f7] py-20">
        <h2 className="text-3xl font-bold text-[#093757] text-center mb-12">Admin Actions</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-3xl mx-auto w-full px-6">
          
          <div onClick={() => navigate("/manajemen-akun")} className="card-admin">
            <h3 className="card-title">Add User</h3>
            <p>Add new user data via the account registration form</p>
          </div>

          <div onClick={() => navigate("/data-user")} className="card-admin">
            <h3 className="card-title">Manage User</h3>
            <p>View, manage, and update existing user data</p>
          </div>
        </div>
      </section>

      {/* ==== SERVICES ==== */}
      <section id="applications" className="text-center py-16 bg-[#aee1ea] px-6">
        <h2 className="text-3xl font-bold mb-12 text-[#093757]">Our Services Apps</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { title: "SIPRIMA", logo: "src/assets/siprima.png", desc: "Aset Management System" },
            { title: "SINDRA", logo: "src/assets/sindra.png", desc: "Service Desk Management" },
            { title: "SIMANTIC", logo: "src/assets/simantic.png", desc: "Change & Configuration Management" },
          ].map((app, index) => (
            <div key={index} className="service-card">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <img src={app.logo} className="w-14 h-14 object-contain" />
              </div>
              <h3 className="font-semibold text-xl text-[#093757]">{app.title}</h3>
              <p className="text-sm text-[#294659]">{app.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==== REPORTS ==== */}
      <section id="reports" className="py-20 text-center bg-white px-6">
        <h2 className="text-3xl font-bold text-[#093757] mb-6">Why Organizations Trust Our Platform</h2>
        <p className="text-[#4a4a4a] max-w-3xl mx-auto mb-14">
          Streamline your IT operations with centralized control and enhanced efficiency.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { title: "Unified Access", desc: "Single login to manage assets, tickets, and configuration." },
            { title: "Smart Automation", desc: "Automated workflows to reduce manual work and improve efficiency." },
            { title: "Secure & Reliable", desc: "Enterprise-grade authentication and audit logs." },
          ].map((item, index) => (
            <div key={index} className="report-card">
              <div className="icon-circle">⚙️</div>
              <h3 className="font-semibold text-[#093757] mb-2">{item.title}</h3>
              <p className="text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==== FOOTER ==== */}
      <footer className="bg-[#093757] text-[#b4cadd] py-12 px-8 md:px-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white rounded-md"></div>
              <span className="font-semibold text-white">Bispro Digitaltech</span>
            </div>
            <p className="text-sm">Streamlining government IT operations through integrated solutions.</p>
          </div>

          <div>
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-list">
              <li>Dashboard</li>
              <li>Applications</li>
              <li>Reports</li>
              <li>Documentation</li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Support</h4>
            <ul className="footer-list">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>System Status</li>
              <li>Training</li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Contact Info</h4>
            <ul className="footer-list">
              <li>support@gov-sso.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>

        <div className="text-center text-[#aacde6] text-sm mt-10 border-t border-[#225b7d] pt-4">
          © 2025 Pemkot Surabaya. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default DashboardDiskominfo;
