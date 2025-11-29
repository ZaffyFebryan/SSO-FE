import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
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
    <AuthProvider>
      <Router>
        <Routes>
        {/* Public routes - tidak perlu authentication */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />

        {/* Protected routes - perlu authentication */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/profil-user" element={
          <ProtectedRoute>
            <ProfilUser />
          </ProtectedRoute>
        } />
        <Route path="/profil-diskominfo" element={
          <ProtectedRoute>
            <ProfilDiskominfo />
          </ProtectedRoute>
        } />
        <Route path="/dashboard-diskominfo" element={
          <ProtectedRoute>
            <DashboardDiskominfo />
          </ProtectedRoute>
        } />
        <Route path="/manajemen-akun" element={
          <ProtectedRoute>
            <ManajemenAkun />
          </ProtectedRoute>
        } />
        <Route path="/data-user" element={
          <ProtectedRoute>
            <DataUser />
          </ProtectedRoute>
        } />
        <Route path="/detail-data-user/:id" element={
          <ProtectedRoute>
            <DetailDataUser />
          </ProtectedRoute>
        } />
        <Route path="/update-data-user/:id" element={
          <ProtectedRoute>
            <UpdateDataUser />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
    </AuthProvider>
  );
}
