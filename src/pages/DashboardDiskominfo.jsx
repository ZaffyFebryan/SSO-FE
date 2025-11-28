import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardDiskominfo = () => {
  const navigate = useNavigate();

  // Fungsi smooth scroll (sama seperti dashboard user)
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#e8f3f6] to-[#cde4ea] text-gray-800 font-sans">
      {/* ==== NAVBAR ==== */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-10 py-4 bg-white shadow-md backdrop-blur-sm">
        <div className="flex items-center gap-3 font-semibold text-lg text-[#093757]">
          <div className="w-9 h-9 bg-[#093757] flex items-center justify-center rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M12 2L4 5v6c0 5.25 3.25 10.25 8 11 4.75-.75 8-5.75 8-11V5l-8-3z" />
            </svg>
          </div>
          <span>Bispro Digitaltech</span>
        </div>

        <ul className="hidden md:flex gap-6 text-sm font-medium text-[#093757]">
          <li
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-[#25577a] cursor-pointer transition"
          >
            Home
          </li>
          <li
            onClick={() => scrollToSection("applications")}
            className="hover:text-[#25577a] cursor-pointer transition"
          >
            Applications
          </li>
          <li
            onClick={() => scrollToSection("reports")}
            className="hover:text-[#25577a] cursor-pointer transition"
          >
            Reports
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#25577a]"
          />
          <button
            className="bg-[#093757] text-white text-sm px-5 py-2 rounded-md hover:bg-[#0e4f76] transition"
            onClick={() => navigate("/profil-diskominfo")}
          >
            Profil
          </button>
          <button
            className="bg-[#093757] text-white text-sm px-5 py-2 rounded-md hover:bg-[#0e4f76] transition"
            onClick={() => navigate("/")}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="h-20"></div>

      {/* ==== HERO SECTION ==== */}
      <section className="flex flex-col md:flex-row items-center justify-between px-12 py-20 max-w-[1200px] mx-auto w-full">
        <div className="max-w-lg text-[#093757]">
          <h1 className="text-4xl font-bold mb-4 leading-tight">Diskominfo Dashboard</h1>
          <p className="text-[#294659] text-base leading-relaxed">
            Monitor user activity, manage accounts, and oversee IT services from one secure dashboard.
          </p>
        </div>
        <div className="mt-10 md:mt-0">
          <img src="src/assets/dashboard.png" alt="Dashboard preview" />
        </div>
      </section>

      {/* ==== ADMIN ACTION CARDS ==== */}
      <section className="w-full bg-[#eaf5f7] py-20">
        <h2 className="text-3xl font-bold text-[#093757] text-center mb-12">
          Admin Actions
        </h2>

        {/* Wrapper agar kartu tetap berada di tengah */}
        <div className="flex justify-center w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-3xl w-full px-6">
            
            {/* Card 1 */}
            <div
              onClick={() => navigate("/manajemen-akun")}
              className="bg-white rounded-2xl shadow-md p-8 cursor-pointer hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              <h3 className="text-2xl font-semibold text-[#093757] mb-3">
                Add User
              </h3>
              <p className="text-[#294659] text-sm">
                Add new user data via the account registration form
              </p>
            </div>

            {/* Card 2 */}
            <div
              onClick={() => navigate("/data-user")}
              className="bg-white rounded-2xl shadow-md p-8 cursor-pointer hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              <h3 className="text-2xl font-semibold text-[#093757] mb-3">
                Manage User
              </h3>
              <p className="text-[#294659] text-sm">
                View, manage, and update existing user data
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ==== OUR SERVICES ==== */}
      <section id="applications" className="text-center py-16 bg-[#aee1ea]">
        <h2 className="text-3xl font-bold mb-12 text-[#093757]">Our Services Apps</h2>
        <div className="grid md:grid-cols-3 gap-10 px-8 md:px-24 max-w-6xl mx-auto">
          {[
            { title: "SIPRIMA", logo: "src/assets/siprima.png", desc: "Aset Management System" },
            { title: "SINDRA", logo: "src/assets/sindra.png", desc: "Service Desk Management" },
            { title: "SIMANTIC", logo: "src/assets/simantic.png", desc: "Change & Configuration Management" },
          ].map((app, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-10 flex flex-col items-center gap-4 border border-gray-200"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                <img src={app.logo} alt={app.title} className="w-16 h-16 object-contain" />
              </div>
              <h3 className="font-semibold text-xl text-[#093757]">{app.title}</h3>
              <p className="text-sm text-[#294659] mt-1">{app.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==== REPORT SECTION ==== */}
      <section id="reports" className="py-20 text-center bg-white">
        <h2 className="text-3xl font-bold text-[#093757] mb-6">Why Organizations Trust Our Integrated Platform</h2>
        <p className="text-[#4a4a4a] max-w-3xl mx-auto mb-14 text-base">
          Streamline your IT operations with centralized control, enhanced efficiency, and complete SLA compliance through our comprehensive integration solution.
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { title: "Unified Access", desc: "Single login to manage assets, tickets, and configuration data across all your IT systems seamlessly." },
            { title: "Smart Automation", desc: "Workflow automation following ITIL standards to reduce manual work and improve operational efficiency." },
            { title: "Secure & Reliable", desc: "Enterprise-grade authentication and comprehensive audit logs ensure maximum security and compliance." },
          ].map((item, index) => (
            <div key={index} className="bg-[#dff0f3] p-8 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#093757] text-white rounded-full flex items-center justify-center mb-4 text-lg">⚙️</div>
              <h3 className="font-semibold text-[#093757] mb-2">{item.title}</h3>
              <p className="text-[#4a4a4a] text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==== STATISTICS ==== */}
      <section className="bg-[#eaf5f7] py-12">
        <div className="flex flex-wrap justify-center gap-16 text-center text-[#093757]">
          {[
            { icon: "📁", title: "10K+", subtitle: "Managed Assets" },
            { icon: "✅", title: "98%", subtitle: "SLA Compliance Rate" },
            { icon: "👥", title: "500+", subtitle: "Active Users" },
            { icon: "⏰", title: "24/7", subtitle: "Monitoring Enabled" },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-1 min-w-[140px]">
              <div className="text-3xl">{stat.icon}</div>
              <div className="text-xl font-bold">{stat.title}</div>
              <div className="text-sm">{stat.subtitle}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ==== INFO CARDS ==== */}
      <section className="max-w-6xl mx-auto px-8 md:px-24 py-20 grid md:grid-cols-3 gap-8 w-full">
        {[
          { title: "Asset Management", desc: "Track, audit, and maintain government inventory with comprehensive asset lifecycle management and automated reporting." },
          { title: "Service Desk", desc: "Manage tickets, assign technicians, and monitor SLA compliance with intelligent routing and automated escalations." },
          { title: "Change & Configuration", desc: "Log RFCs, control versioning, and review impact changes with comprehensive approval workflows and rollback capabilities." },
        ].map((app, i) => (
          <div key={i} className="bg-[#dff0f3] p-8 rounded-lg shadow-md hover:shadow-lg transition cursor-default">
            <h3 className="text-lg font-semibold mb-2 text-[#093757]">{app.title}</h3>
            <p className="text-sm text-[#294659] leading-relaxed">{app.desc}</p>
          </div>
        ))}
      </section>

      {/* ==== FOOTER ==== */}
      <footer className="bg-[#093757] text-[#b4cadd] py-12 px-8 md:px-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white rounded-md"></div>
              <span className="font-semibold text-white">Bispro Digitaltech</span>
            </div>
            <p className="text-sm">Streamlining government IT operations through integrated solutions and secure access management.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-white">Quick Links</h4>
            <ul className="text-sm space-y-1">
              <li className="hover:text-white cursor-pointer">Dashboard</li>
              <li className="hover:text-white cursor-pointer">Applications</li>
              <li className="hover:text-white cursor-pointer">Reports</li>
              <li className="hover:text-white cursor-pointer">Documentation</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-white">Support</h4>
            <ul className="text-sm space-y-1">
              <li className="hover:text-white cursor-pointer">Help Center</li>
              <li className="hover:text-white cursor-pointer">Contact Us</li>
              <li className="hover:text-white cursor-pointer">System Status</li>
              <li className="hover:text-white cursor-pointer">Training</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-white">Contact Info</h4>
            <ul className="text-sm space-y-1">
              <li>support@gov-sso.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-[#aacde6] text-sm mt-10 border-t border-[#225b7d] pt-4">
          © 2025 Pemkot Surabaya. All rights reserved. | Privacy Policy | Terms of Service
        </div>
      </footer>
    </div>
  );
};

export default DashboardDiskominfo;
