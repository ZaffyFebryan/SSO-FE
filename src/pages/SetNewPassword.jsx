import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SetNewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Password didn't match");
      return;
    }

    setError("");
    alert("Password berhasil diubah! Silakan login kembali.");
    navigate("/");
  };

  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center px-6"
      style={{
        background:
          "linear-gradient(135deg, #a6d0db 20%, #46738d 90%)",
        fontFamily: "Arial, sans-serif",
        color: "white",
      }}
    >
      {/* Cancel Button */}
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
      <h1 className="text-2xl font-semibold mb-2">Set New Password</h1>
      <p className="text-sm mb-6 opacity-80 text-center max-w-xs">
        Create strong and secure new password
      </p>

      {/* Password Rules */}
      <p className="text-xs text-white opacity-60 mb-2 max-w-xs text-left">
        *Password must be at least 8 characters
      </p>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-xs"
        noValidate
      >
        <input
          type="password"
          placeholder="New Password *"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full py-2 px-4 rounded-full text-[#274964] focus:outline-none focus:ring-2 focus:ring-[#274964]"
          style={{ backgroundColor: "white" }}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password *"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full py-2 px-4 rounded-full text-[#274964] focus:outline-none focus:ring-2 focus:ring-[#274964]"
          style={{ backgroundColor: "white" }}
          required
        />
        {error && (
          <p className="text-red-500 text-sm font-medium text-center">{error}</p>
        )}
        <button
          type="submit"
          className="bg-[#d8eefe] rounded-full py-2 mt-2 text-[#274964] font-semibold hover:bg-[#b5d7fb] transition"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}
