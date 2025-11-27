import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import VerifyCode from "./pages/VerifyCode.jsx";
import SetNewPassword from "./pages/SetNewPassword.jsx";

import ProfilUser from "./pages/ProfilUser.jsx";
import ProfilDiskominfo from "./pages/ProfilDiskominfo.jsx";
import DashboardDiskominfo from "./pages/DashboardDiskominfo.jsx";
import ManajemenAkun from "./pages/ManajemenAkun.jsx";
import DataUser from "./pages/DataUser.jsx";
import DetailDataUser from "./pages/DetailDataUser.jsx";
import UpdateDataUser from "./pages/UpdateDataUser.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />

        {/* Route tambahan untuk SSO user & admin */}
        <Route path="/profil-user" element={<ProfilUser />} />
        <Route path="/profil-diskominfo" element={<ProfilDiskominfo />} />
        <Route path="/dashboard-diskominfo" element={<DashboardDiskominfo />} />
        <Route path="/manajemen-akun" element={<ManajemenAkun />} />
        <Route path="/data-user" element={<DataUser />} />
        <Route path="/detail-data-user/:id" element={<DetailDataUser />} />
        <Route path="/update-data-user/:id" element={<UpdateDataUser />} />
      </Routes>
    </Router>
  );
}
