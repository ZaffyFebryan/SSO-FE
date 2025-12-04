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

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 text-sm font-medium text-[#093757]">
          <li className="nav-link" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Home</li>
          <li className="nav-link" onClick={() => scrollToSection("applications")}>Applications</li>
          <li className="nav-link" onClick={() => scrollToSection("reports")}>Reports</li>
        </ul>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          <input
            type="text"
            placeholder="Search..."
            className="input-search"
          />
          <button onClick={() => navigate("/profil-diskominfo")} className="btn-primary">Profil</button>
          <button onClick={handleLogout} className="btn-primary">Logout</button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-[#093757] text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </nav>

      {/* ==== MOBILE MENU ==== */}
      {menuOpen && (
        <div className="mobile-menu">
          <input
            type="text"
            placeholder="Search..."
            className="input-search w-full"
          />

          <ul className="flex flex-col gap-4 text-[#093757] text-base">
            <li className="nav-link" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Home</li>
            <li className="nav-link" onClick={() => scrollToSection("applications")}>Applications</li>
            <li className="nav-link" onClick={() => scrollToSection("reports")}>Reports</li>
          </ul>

          <button onClick={() => navigate("/profil-diskominfo")} className="btn-primary w-full mt-2">Profil</button>
          <button onClick={handleLogout} className="btn-primary w-full">Logout</button>
        </div>
      )}

      {/* Spacer for Navbar */}
      <div className="h-20"></div>

      {/* ==== HERO SECTION ==== */}
      <section className="hero-section">
        <div className="max-w-lg text-[#093757] text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Diskominfo Dashboard</h1>
          <p className="text-[#294659] text-base">
            Monitor user activity, manage accounts, and oversee IT services from one secure dashboard.
          </p>
        </div>

        <div className="mt-10 md:mt-0 flex justify-center md:justify-end">
          <img src="/images/dashboard.png" alt="dashboard" className="w-64 md:w-96" />
        </div>
      </section>

      {/* ==== ADMIN CARDS ==== */}
      <section className="admin-section">
        <h2 className="section-title">Admin Actions</h2>

        <div className="admin-grid">
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

      {/* === APPLICATIONS === */}
      <section id="applications" className="text-center py-16 bg-[#aee1ea] px-6">
        <h2 className="text-3xl font-bold mb-10 text-[#093757]">Our Services Apps</h2>

        {loading ? (
          <p className="text-[#294659] text-lg">Loading applications...</p>
        ) : menuApps.length === 0 ? (
          <p className="text-[#294659] text-lg">Tidak ada aplikasi untuk user Anda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {menuApps.map((app, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border cursor-pointer flex flex-col items-center"
                onClick={() => app.url && window.open(app.url, "_blank")}
              >
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex justify-center items-center">
                  {app.logo ? (
                    <img 
                      className="w-14 h-14 object-contain" 
                      src={`/images/${app.logo}`} 
                      alt={app.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <span className="text-3xl" style={{ display: app.logo ? 'none' : 'block' }}>📱</span>
                </div>
                <h3 className="mt-4 font-semibold text-xl text-[#093757]">{app.name}</h3>
                <p className="text-sm text-gray-600">{app.description || "-"}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ==== REPORTS ==== */}
      <section id="reports" className="reports-section">
        <h2 className="section-title mb-6">Why Organizations Trust Our Platform</h2>

        <p className="text-[#4a4a4a] max-w-3xl mx-auto mb-14">
          Streamline your IT operations with centralized control and enhanced efficiency.
        </p>

        <div className="reports-grid">
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
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                className="w-5 h-5 text-[#093757]"
                fill="currentColor"
              >
                <path d="M12 2 4 5v6c0 5.25 3.25 10.25 8 11 4.75-.75 8-5.75 8-11V5l-8-3z"/>
              </svg>
            </div>
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

        <div className="footer-bottom">
          © 2025 Pemkot Surabaya. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default DashboardDiskominfo;
