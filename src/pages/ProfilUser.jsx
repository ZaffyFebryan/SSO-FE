import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfilUser = () => {
  const { user: authUser, refreshUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated) {
        navigate("/");
        return;
      }

      try {
        setLoading(true);
        // Refresh user data dari server
        const data = await refreshUser();
        // API /me mengembalikan { user: {...}, menu: [...] }
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(data);
        }
      } catch (err) {
        setError("Gagal memuat data profil. Silakan coba lagi.");
        console.error("Error fetching profile:", err);
        // Fallback ke user dari context jika ada
        if (authUser) {
          setUser(authUser);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e8f3f6] font-sans flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#093757] mx-auto"></div>
          <p className="mt-4 text-[#093757]">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-[#e8f3f6] font-sans flex justify-center items-center">
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-lg">
          <div className="bg-red-500/20 border border-red-500 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-[#093757] text-white py-2 rounded-lg hover:bg-[#0a4d7a] transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e8f3f6] font-sans flex justify-center items-start py-20">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-[#093757]">Profil User</h1>

        {error && (
          <div className="mb-4 bg-yellow-500/20 border border-yellow-500 text-yellow-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* ==== DATA USER READ-ONLY ==== */}
        {user && [
          { label: "Nama", value: user.name || "-" },
          { label: "Email", value: user.email || "-" },
          { label: "NIP", value: user.nip || "-" },
          { label: "Telepon", value: user.phone || "-" },
          { label: "Jenis Kelamin", value: user.jenis_kelamin || "-" },
          { label: "Role", value: user.role || "-" },
          { label: "Unit Kerja", value: user.unit_kerja || "-" },
          { label: "Asal Dinas", value: user.asal_dinas || "-" },
        ].map((field, idx) => (
          <div className="mb-4" key={idx}>
            <label className="block text-sm font-medium text-[#093757] mb-1">
              {field.label}
            </label>
            <input
              type="text"
              value={field.value}
              readOnly
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 
              text-gray-700 cursor-not-allowed"
            />
          </div>
        ))}

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 w-full bg-[#093757] text-white py-2 rounded-lg hover:bg-[#0a4d7a] transition"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
};

export default ProfilUser;
