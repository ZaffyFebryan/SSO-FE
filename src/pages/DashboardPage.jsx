// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchProfile,
  getStoredUser,
  hasToken,
  logout,
} from "../services/auth";
import { apiRequest } from "../services/api";

const APP_LOGOS = {
  asset: "src/assets/siprima.png",
  maintenance: "src/assets/sindra.png",
  change: "src/assets/simantic.png",
};

const APP_DESCRIPTIONS = {
  asset: "Aset Management System",
  maintenance: "Service Desk Management",
  change: "Change & Configuration Management",
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getStoredUser());
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [apps, setApps] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    if (!hasToken()) {
      setPageLoading(false);
      navigate("/");
      return undefined;
    }

    fetchProfile()
      .then((profile) => {
        if (!ignore) {
          setUser(profile);
        }
      })
      .catch(async (err) => {
        if (err.status === 401) {
          await logout();
          navigate("/");
          return;
        }
        if (!ignore) {
          setError(err.message || "Gagal memuat profil pengguna.");
        }
      })
      .finally(() => {
        if (!ignore) {
          setPageLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [navigate]);

  const handleLogout = async () => {
    setError("");
    try {
      await logout();
    } catch (err) {
      setError(err.message || "Gagal logout, coba ulang lagi.");
    } finally {
      navigate("/");
    }
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    let ignore = false;

    if (!hasToken()) {
      setApps([]);
      setAppsLoading(false);
      return () => {};
    }

    setAppsLoading(true);
    apiRequest("/v1/apps")
      .then((response) => {
        if (!ignore) {
          setApps(response?.apps ?? []);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setApps([]);
          setError(
            (prev) =>
              prev || err.message || "Gagal memuat daftar aplikasi yang tersedia."
          );
        }
      })
      .finally(() => {
        if (!ignore) {
          setAppsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenApp = (app) => {
    if (!app?.url) {
      setError("URL aplikasi belum dikonfigurasi. Hubungi administrator.");
      return;
    }
    const ssoToken = window.localStorage.getItem("sso_token");
    let finalUrl = app.url;

    if (ssoToken) {
      try {
        const parsed = new URL(finalUrl);
        parsed.searchParams.set("sso_token", ssoToken);
        finalUrl = parsed.toString();
      } catch {
        const separator = finalUrl.includes("?") ? "&" : "?";
        finalUrl = `${finalUrl}${separator}sso_token=${encodeURIComponent(
          ssoToken
        )}`;
      }
    }

    window.open(finalUrl, "_blank", "noopener,noreferrer");
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0f2a48] to-[#274964] text-white font-sans">
        <div className="text-center">
          <p className="text-lg font-semibold mb-4">Memuat dashboard...</p>
          <div className="w-12 h-12 border-4 border-white/40 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!hasToken()) {
    return null;
  }

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
          <span>SSO Integrated IT Dashboard</span>
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
          {user && (
            <div className="text-right">
              <p className="text-xs text-gray-400">Logged in as</p>
              <p className="text-sm font-semibold text-[#093757]">
                {user.name}
              </p>
            </div>
          )}
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#25577a]"
          />
          <button
            onClick={handleLogout}
            className="bg-[#093757] text-white text-sm px-5 py-2 rounded-md hover:bg-[#0e4f76] transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ==== SPACER supaya konten tidak tertutup navbar ==== */}
      <div className="h-20"></div>

      {/* ==== HERO SECTION ==== */}
      <section className="flex flex-col md:flex-row items-center justify-between px-12 py-20 max-w-[1200px] mx-auto w-full">
        <div className="max-w-lg text-[#093757]">
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Integrated IT Ecosystem in One Dashboard
          </h1>
          <p className="text-[#294659] text-base leading-relaxed">
            Access and manage assets, tickets, and configurations seamlessly with one secure login.
          </p>
        </div>
        <div className="mt-10 md:mt-0">
          <img
            src="src/assets/dashboard.png"
            alt="Dashboard preview"
          />
        </div>
      </section>

      {error && (
        <div className="mx-12 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error}
        </div>
      )}

      {/* ==== OUR SERVICES (tambahkan ID agar bisa discroll ke sini) ==== */}
      <section id="applications" className="text-center py-16 bg-[#aee1ea]">
        <h2 className="text-3xl font-bold mb-12 text-[#093757]">Our Services Apps</h2>
        {appsLoading ? (
          <div className="text-[#093757] text-base">Memuat daftar aplikasi...</div>
        ) : apps.length === 0 ? (
          <p className="text-[#294659] text-base">
            Belum ada aplikasi yang dapat diakses dengan akun ini.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-10 px-8 md:px-24 max-w-6xl mx-auto">
            {apps.map((app) => {
              let logo = APP_LOGOS[app.code] || "src/assets/dashboard.png";
              if (app.icon) {
                logo = /^https?:\/\//i.test(app.icon)
                  ? app.icon
                  : app.icon.startsWith("src/")
                  ? app.icon
                  : `src/assets/${app.icon}`;
              }
              const description =
                app.description ||
                APP_DESCRIPTIONS[app.code] ||
                "Aplikasi terintegrasi";
              return (
                <button
                  key={app.code}
                  type="button"
                  onClick={() => handleOpenApp(app)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-10 flex flex-col items-center gap-4 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#0f2a48]/20"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img
                      src={logo}
                      alt={app.name || app.code}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <h3 className="font-semibold text-xl text-[#093757]">
                    {app.name || app.code.toUpperCase()}
                  </h3>
                  <p className="text-sm text-[#294659] mt-1 text-center">{description}</p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ==== REPORT SECTION ==== */}
      <section id="reports" className="py-20 text-center bg-white">
        <h2 className="text-3xl font-bold text-[#093757] mb-6">
          Why Organizations Trust Our Integrated Platform
        </h2>
        <p className="text-[#4a4a4a] max-w-3xl mx-auto mb-14 text-base">
          Streamline your IT operations with centralized control, enhanced efficiency, and complete SLA compliance through our comprehensive integration solution.
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              title: "Unified Access",
              desc: "Single login to manage assets, tickets, and configuration data across all your IT systems seamlessly.",
            },
            {
              title: "Smart Automation",
              desc: "Workflow automation following ITIL standards to reduce manual work and improve operational efficiency.",
            },
            {
              title: "Secure & Reliable",
              desc: "Enterprise-grade authentication and comprehensive audit logs ensure maximum security and compliance.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-[#dff0f3] p-8 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-[#093757] text-white rounded-full flex items-center justify-center mb-4 text-lg">
                ⚙️
              </div>
              <h3 className="font-semibold text-[#093757] mb-2">{item.title}</h3>
              <p className="text-[#4a4a4a] text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATISTICS */}
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

      {/* INFO CARDS */}
      <section className="max-w-6xl mx-auto px-8 md:px-24 py-20 grid md:grid-cols-3 gap-8 w-full">
        {[
          {
            title: "Asset Management",
            desc: "Track, audit, and maintain government inventory with comprehensive asset lifecycle management and automated reporting.",
          },
          {
            title: "Service Desk",
            desc: "Manage tickets, assign technicians, and monitor SLA compliance with intelligent routing and automated escalations.",
          },
          {
            title: "Change & Configuration",
            desc: "Log RFCs, control versioning, and review impact changes with comprehensive approval workflows and rollback capabilities.",
          },
        ].map((app, i) => (
          <div
            key={i}
            className="bg-[#dff0f3] p-8 rounded-lg shadow-md hover:shadow-lg transition cursor-default"
          >
            <h3 className="text-lg font-semibold mb-2 text-[#093757]">{app.title}</h3>
            <p className="text-sm text-[#294659] leading-relaxed">{app.desc}</p>
            <a
              href="#"
              className="text-[#093757] text-sm font-semibold mt-4 inline-block hover:underline"
            >
            </a>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="bg-[#093757] text-[#b4cadd] py-12 px-8 md:px-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white rounded-md"></div>
              <span className="font-semibold text-white">SSO IT Dashboard</span>
            </div>
            <p className="text-sm">
              Streamlining government IT operations through integrated solutions and secure access management.
            </p>
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

export default DashboardPage;

