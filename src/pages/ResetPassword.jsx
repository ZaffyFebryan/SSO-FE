import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!email) {
      setError("Masukkan email terlebih dahulu!");
      setLoading(false);
      return;
    }

    try {
      const result = await resetPassword(email);
      
      if (result.success) {
        setSuccess(result.message);
        // Simpan email untuk digunakan di halaman verify code
        localStorage.setItem('resetEmail', email);
        setTimeout(() => {
          navigate("/verify-code", { state: { email, type: 'reset' } });
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{
        background:
          "linear-gradient(135deg, #274964 20%, #a6d0db 95%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Cancel / Back Button top-left */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-1 text-white text-sm hover:underline"
        aria-label="Cancel and go back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Cancel
      </button>

      {/* Shield Icon */}
      <div className="mb-6 p-8 rounded-xl bg-[#1b2f47]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-20"
          viewBox="0 0 24 24"
          fill="white"
        >
          <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
        </svg>
      </div>

      {/* Title & Subtitle */}
      <h1 className="text-white text-2xl font-semibold mb-2">Reset Password</h1>
      <p className="text-white text-sm mb-8 opacity-90 max-w-xs text-center">
        Enter your Email to reset your password!
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 border border-green-500 text-white px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}
        
        <input
          type="email"
          placeholder="eg : test123456@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full py-2 px-4 rounded-lg text-[#274964] focus:outline-none focus:ring-2 focus:ring-[#274964]"
          style={{ backgroundColor: "white" }}
          required
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-[#d8eefe] rounded-md py-2 text-[#274964] font-semibold hover:bg-[#b5d7fb] transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
