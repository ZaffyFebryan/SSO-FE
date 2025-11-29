import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VerifyCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, resetPassword } = useAuth();
  
  const email = location.state?.email || localStorage.getItem('resetEmail') || "";
  const type = location.state?.type || 'reset'; // 'reset' or 'verify'
  
  const [code, setCode] = useState(new Array(6).fill("")); // 6 digit kode
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(5 * 60); // 5 minutes countdown in seconds

  const inputsRef = useRef([]);

  // Handle input change for individual digits
  const handleChange = (element, index) => {
    if (!/^\d*$/.test(element.value)) return; // hanya angka
    
    const newCode = [...code];
    newCode[index] = element.value;
    setCode(newCode);

    // Fokus ke input berikutnya jika terisi
    if (element.value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Handle backspace to balik ke input sebelumnya
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // Timer countdown untuk kadaluarsa kode
  useEffect(() => {
    if (timer <= 0) return;
    const intervalId = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timer]);

  // Format timer mm:ss
  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const enteredCode = code.join("");
    if (enteredCode.length < 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (type === 'verify') {
        // Verifikasi email registrasi
        const result = await verifyEmail({ email, otp: enteredCode });
        if (result.success) {
          setSuccess(true);
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          setError(result.message || "Verification code incorrect");
        }
      } else {
        // Untuk reset password, simpan OTP dan lanjut ke set password
        localStorage.setItem('resetOTP', enteredCode);
        setSuccess(true);
        setTimeout(() => {
          navigate("/set-new-password", { state: { email, otp: enteredCode } });
        }, 1000);
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      if (type === 'reset') {
        const result = await resetPassword(email);
        if (result.success) {
          setCode(new Array(6).fill(""));
          inputsRef.current[0].focus();
          setError("");
          setTimer(5 * 60);
          alert("Verification code resent.");
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError("Gagal mengirim ulang kode.");
    }
  };

  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center px-6"
      style={{
        background:
          "radial-gradient(circle at top right, #a6dcd9 20%, #46738d 90%)",
        fontFamily: "Arial, sans-serif",
        color: "white",
      }}
    >
      {/* Cancel Top Left */}
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

      {/* Icon Shield */}
      <div className="mb-8 p-8 rounded-xl bg-[#1b2f47]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-20"
          viewBox="0 0 24 24"
          fill="white"
        >
          <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-semibold mb-2">Reset Email Send!</h1>
      <p className="text-center max-w-md mb-8 text-sm leading-relaxed opacity-90">
        We have send all required instructions details to your mail.
        <br />
        Please check your inbox and enter the 6-digit code below
      </p>

      {/* Verification Code Inputs */}
      <form onSubmit={handleVerify} className="flex flex-col items-center gap-6 w-full max-w-md">
        <div className="flex justify-center gap-3 mb-2">
          {code.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              ref={(el) => (inputsRef.current[idx] = el)}
              className="w-12 h-12 text-center rounded-lg border-0 bg-[#d8eefe] text-[#46738d] font-bold text-xl focus:outline-none focus:ring-2 focus:ring-[#46738d] caret-[#46738d]"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              aria-label={`Digit ${idx + 1}`}
              required
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-500 font-medium text-center mb-2">{error}</p>
        )}

        <button
          type="submit"
          className="w-48 bg-white text-[#46738d] rounded-md py-2 font-semibold hover:bg-[#d8eefe] transition"
        >
          Verify Code
        </button>
      </form>

      {/* Timer and Resend */}
      <p className="mt-4 text-xs opacity-70">
        Code Expires in{" "}
        <span className="font-bold">{formatTimer(timer)}</span>
      </p>
      <p className="mt-1 text-xs opacity-70">
        Didn&apos;t receive the code?{" "}
        <button
          onClick={handleResend}
          className="underline cursor-pointer font-medium text-white"
        >
          Resend Code
        </button>
      </p>

      {/* Success Popup */}
      {success && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center w-[350px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="green"
              className="w-12 h-12 mx-auto mb-3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Verification Successful
            </h2>
            <p className="text-sm text-gray-500">Redirecting to set new password...</p>
          </div>
        </div>
      )}
    </div>
  );
}
