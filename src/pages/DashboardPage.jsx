// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [menuApps, setMenuApps] = useState([]);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const menuData = localStorage.getItem("menu");
    if (menuData) {
      try {
        setMenuApps(JSON.parse(menuData));
      } catch (err) {
        console.error("Error parsing menu:", err);
      }
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#e8f3f6] to-[#cde4ea]">
      {/* === NAVBAR === */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md px-5 md:px-10 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 font-semibold text-lg text-[#093757]">
          <div className="w-9 h-9 bg-[#093757] flex items-center justify-center rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M12 2L4 5v6c0 5.25 3.25 10.25 8 11 4.75-.75 8-5.75 8-11V5l-8-3z" />
            </svg>
          </div>
          <span>Bispro Digitaltech</span>
        </div>

        {/* Desktop menu */}
        <ul className="hidden md:flex gap-6 text-sm font-medium text-[#093757]">
          <li onClick={() => scrollToSection("top")} className="hover:text-[#25577a] cursor-pointer">Home</li>
          <li onClick={() => scrollToSection("applications")} className="hover:text-[#25577a] cursor-pointer">Applications</li>
          <li onClick={() => scrollToSection("reports")} className="hover:text-[#25577a] cursor-pointer">Reports</li>
        </ul>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-4">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-[#25577a]"
          />
          <button onClick={() => navigate("/profil-user")} className="bg-[#093757] text-white px-5 py-2 text-sm rounded-md">
            Profil
          </button>
          <button onClick={handleLogout} className="bg-[#093757] text-white px-5 py-2 text-sm rounded-md">
            Logout
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[#093757] text-2xl"
          onClick={() => setNavOpen(!navOpen)}
        >
          ☰
        </button>
      </nav>

      {/* Mobile dropdown */}
      {navOpen && (
        <div className="md:hidden bg-white shadow-md px-5 py-4 space-y-4">
          <ul className="space-y-3 text-[#093757] font-medium">
            <li onClick={() => scrollToSection("top")} className="cursor-pointer">Home</li>
            <li onClick={() => scrollToSection("applications")} className="cursor-pointer">Applications</li>
            <li onClick={() => scrollToSection("reports")} className="cursor-pointer">Reports</li>
          </ul>

          <div className="flex flex-col gap-3 mt-4">
            <input type="text" placeholder="Search..." className="border rounded-md px-3 py-2" />
            <button onClick={() => navigate("/profil-user")} className="bg-[#093757] text-white py-2 rounded-md">
              Profil
            </button>
            <button onClick={handleLogout} className="bg-[#093757] text-white py-2 rounded-md">
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div id="top" className="h-20"></div>

      {/* === HERO === */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-16 max-w-[1200px] mx-auto gap-10">
        <div className="text-[#093757] md:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Integrated IT Ecosystem in One Dashboard
          </h1>
          <p className="text-[#294659] text-base leading-relaxed">
            Access and manage assets, tickets, and configurations seamlessly with one secure login.
          </p>
        </div>

        <img
          src="src/assets/dashboard.png"
          alt="dashboard"
          className="w-full md:w-1/2 max-w-md"
        />
      </section>

      {/* === APPLICATIONS === */}
      <section id="applications" className="text-center py-16 bg-[#aee1ea] px-6">
        <h2 className="text-3xl font-bold mb-10 text-[#093757]">Our Services Apps</h2>

        {menuApps.length === 0 ? (
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
                    <img className="w-14 h-14 object-contain" src={app.logo} alt={app.name} />
                  ) : (
                    <span className="text-3xl">📱</span>
                  )}
                </div>
                <h3 className="mt-4 font-semibold text-xl">{app.name}</h3>
                <p className="text-sm text-gray-600">{app.description || "-"}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* === REPORTS === */}
      <section id="reports" className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold text-[#093757] mb-6">
          Why Organizations Trust Our Platform
        </h2>
        <p className="max-w-3xl mx-auto mb-12 text-[#4a4a4a]">
          Streamline your IT operations with centralized control and full SLA compliance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { title: "Unified Access", desc: "Manage assets and tickets with one login." },
            { title: "Smart Automation", desc: "Follow ITIL standards to improve efficiency." },
            { title: "Secure & Reliable", desc: "Enterprise-grade authentication and logs." },
          ].map((item, i) => (
            <div key={i} className="bg-[#dff0f3] p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-[#093757] text-white rounded-full flex justify-center items-center mx-auto text-lg">
                ⚙️
              </div>
              <h3 className="font-semibold mt-4">{item.title}</h3>
              <p className="text-sm text-gray-700 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === STATISTICS === */}
      <section className="bg-[#eaf5f7] py-12">
        <div className="flex flex-wrap justify-center gap-10 text-center">
          {[
            { icon: "📁", title: "10K+", subtitle: "Managed Assets" },
            { icon: "✅", title: "98%", subtitle: "SLA Compliance" },
            { icon: "👥", title: "500+", subtitle: "Active Users" },
            { icon: "⏰", title: "24/7", subtitle: "Monitoring" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl">{stat.icon}</div>
              <div className="text-xl font-bold">{stat.title}</div>
              <p className="text-sm">{stat.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === INFO CARDS === */}
      <section className="max-w-6xl mx-auto px-6 md:px-24 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Asset Management", desc: "Track, audit, and maintain assets." },
          { title: "Service Desk", desc: "Manage tickets & SLA performance." },
          { title: "Change & Configuration", desc: "Versioning, RFC logs, approval flows." },
        ].map((item, i) => (
          <div key={i} className="bg-[#dff0f3] p-8 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2 text-[#093757]">{item.title}</h3>
            <p className="text-sm text-[#294659]">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* === FOOTER === */}
      <footer className="bg-[#093757] text-[#b4cadd] py-12 px-6 md:px-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-md"></div>
              <span className="text-white font-semibold">Bispro Digitaltech</span>
            </div>
            <p className="text-sm mt-3">
              Streamlining government IT operations with secure integrated solutions.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li>Dashboard</li>
              <li>Applications</li>
              <li>Reports</li>
              <li>Documentation</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Support</h4>
            <ul className="space-y-1 text-sm">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>System Status</li>
              <li>Training</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Contact Info</h4>
            <p className="text-sm">support@gov-sso.com</p>
            <p className="text-sm">+1 (555) 123-4567</p>
          </div>
        </div>

        <div className="text-center mt-10 text-sm border-t border-[#1f5c82] pt-4">
          © 2025 Pemkot Surabaya. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
