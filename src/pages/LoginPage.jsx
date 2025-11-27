import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "admin@sso.com" && password === "123456") {
      navigate("/dashboard");
    } else {
      alert("Email atau password salah!");
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* LEFT SECTION */}
      <div className="w-1/2 bg-gradient-to-br from-[#0f2a48] to-[#a6d0db] flex flex-col justify-between p-16">
        <div className="flex flex-col justify-center max-w-md mx-auto w-full">
          <h1 className="text-white text-3xl font-bold mb-3">Login SSO Account</h1>
          <p className="text-white/80 text-sm mb-10 leading-relaxed">
            Please log in with your SSO account and continue to dashboard
          </p>

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl bg-white/90 text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
                required
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl bg-white/90 text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => navigate("/reset-password")}
                  className="absolute right-4 top-3 text-xs text-sky-900 hover:text-sky-700 font-semibold transition"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-[#0f2a48] font-semibold py-3.5 rounded-xl shadow-md hover:bg-gray-100 transition"
            >
              Login
            </button>

            <div className="text-center text-white/80 text-xs font-semibold tracking-wide">
              OR
            </div>

            <button
              type="button"
              className="flex items-center justify-center gap-3 w-full bg-white/90 text-[#0f2a48] py-3.5 rounded-xl shadow-md hover:bg-white transition"
            >
              <FcGoogle size={20} />
              Continue with Google
            </button>
          </form>
        </div>

        {/* SSO DESCRIPTION */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mt-12 text-white/90 border border-white/30 max-w-md mx-auto shadow-lg">
          <h2 className="font-semibold text-lg mb-3 text-white">What is Single Sign On?</h2>
          <p className="text-sm leading-relaxed">
            Single sign on is an authentication method that allows users to log in to
            our applications and services with a single set of credentials. After you
            enter your account, you will automatically gain access to our connected
            systems without needing to log in again for each one.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-1/2 bg-[#274964] flex flex-col justify-between text-white p-16">
        <div className="text-center mt-10">
          <div className="bg-[#1b2f47] rounded-3xl p-8 inline-block mb-8 shadow-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-2">Single Sign On</h2>
          <p className="text-sm text-gray-300 mb-12">
            Silahkan melakukan login ke SSO sebelum melanjutkan
          </p>
        </div>

        {/* OUR SERVICES */}
        <div className="bg-[#1f405a] rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-semibold mb-8 text-center">Our Services</h3>
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                title: "Asset Management",
                desc: "Comprehensive tracking, auditing, and maintenance of government inventory with real-time lifecycle management.",
              },
              {
                title: "Service Desk",
                desc: "Efficient ticket management system with automated assignment, technician routing, and monitoring capabilities.",
              },
              {
                title: "Change & Configuration",
                desc: "Advanced RFC logging, version control management, and comprehensive impact analysis for system changes.",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white text-[#274964] rounded-xl p-5 shadow-md hover:shadow-lg transition"
              >
                <div className="w-10 h-10 bg-[#274964]/10 flex items-center justify-center rounded-lg mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="#274964"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 3L4 7v6c0 5 3.7 9 8 10 4.3-1 8-5 8-10V7l-8-4z" />
                  </svg>
                </div>
                <h4 className="font-bold text-sm mb-2">{service.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-gray-400 mt-8">
            © 2025 Pemerintah Kota Surabaya. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
