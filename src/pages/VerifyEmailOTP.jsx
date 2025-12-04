import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmailOTP = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    otp: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.otp) {
      alert("Email dan OTP wajib diisi!");
      return;
    }

    if (form.otp.length !== 6) {
      alert("Kode OTP harus 6 digit!");
      return;
    }

    alert("Verifikasi email berhasil!");
    navigate("/"); // kembali ke login
  };

  return (
    <div className="min-h-screen bg-[#e8f3f6] font-sans flex justify-center items-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">

        <h1 className="text-2xl font-bold text-center mb-2 text-[#093757]">
          Verifikasi Email
        </h1>

        <p className="text-sm text-gray-600 text-center mb-6">
          Silakan masukkan email dan kode OTP yang telah dikirimkan.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#093757] mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Masukkan email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#093757]"
            />
          </div>

          {/* OTP */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#093757] mb-1">
              Kode OTP
            </label>
            <input
              type="text"
              name="otp"
              maxLength="6"
              placeholder="Masukkan 6 digit kode"
              value={form.otp}
              onChange={handleChange}
              className="w-full px-4 py-2 text-center tracking-widest rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#093757]"
            />
          </div>

          {/* Catatan */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700 mb-6">
            <strong>Catatan:</strong><br />
            Setelah akun dibuat oleh admin, kode OTP dikirim ke email.
            Silakan verifikasi sebelum login.
          </div>

          {/* Tombol Verifikasi */}
          <button
            type="submit"
            className="w-full bg-[#093757] text-white py-3 rounded-md font-medium hover:bg-[#0e4f76] transition mb-3"
          >
            Verifikasi
          </button>

          {/* Tombol Kembali */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full bg-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-400 transition"
          >
            Kembali
          </button>

          {/* Kirim Ulang OTP */}
          <p className="text-center text-sm text-gray-600 mt-5">
            Tidak menerima kode?{" "}
            <button
              type="button"
              className="text-[#093757] font-medium hover:underline"
              onClick={() => alert("Kode OTP baru telah dikirim ke email!")}
            >
              Kirim ulang
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailOTP;
