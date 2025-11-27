import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ResetPassword from "./pages/ResetPassword";
import VerifyCode from "./pages/VerifyCode";
import SetNewPassword from "./pages/SetNewPassword";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />
      </Routes>
    </Router>
  );
}
