import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { masterService } from "../utils/api";

const ManajemenAkun = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    jenis_kelamin: "",
    phone: "",
    nip: "",
    role_id: "",
    dinas_id: "",
    unit_kerja_id: "",
  });

  const [masterData, setMasterData] = useState({
    roles: [],
    dinas: [],
    unitKerja: [],
  });

  const [loading, setLoading] = useState(false);
  const [loadingMaster, setLoadingMaster] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch master data on mount
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        setLoadingMaster(true);
        const [rolesRes, dinasRes, unitKerjaRes] = await Promise.all([
          masterService.getRoles(),
          masterService.getDinas(),
          masterService.getUnitKerja(),
        ]);

        setMasterData({
          roles: rolesRes.success ? rolesRes.data : [],
          dinas: dinasRes.success ? dinasRes.data : [],
          unitKerja: unitKerjaRes.success ? unitKerjaRes.data : [],
        });
      } catch (err) {
        console.error("Error fetching master data:", err);
        setError("Gagal memuat data master");
      } finally {
        setLoadingMaster(false);
      }
    };

    fetchMasterData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validasi password
    if (formData.password.length < 8) {
      setError("Password minimal 8 karakter");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError("Password dan konfirmasi password tidak cocok");
      setLoading(false);
      return;
    }

    // Validasi required fields
    if (!formData.role_id) {
      setError("Role harus dipilih");
      setLoading(false);
      return;
    }

    if (!formData.dinas_id) {
      setError("Asal Dinas harus dipilih");
      setLoading(false);
      return;
    }

    if (!formData.unit_kerja_id) {
      setError("Unit Kerja harus dipilih");
      setLoading(false);
      return;
    }

    try {
      // Prepare data untuk API
      const submitData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        jenis_kelamin: formData.jenis_kelamin,
        phone: formData.phone,
        role_id: parseInt(formData.role_id),
        dinas_id: parseInt(formData.dinas_id),
        unit_kerja_id: parseInt(formData.unit_kerja_id),
      };

      // Tambahkan optional field NIP jika ada nilai
      if (formData.nip) submitData.nip = formData.nip;

      const result = await register(submitData);
      
      if (result.success) {
        setSuccess(result.message || "Akun berhasil dibuat! Kode verifikasi telah dikirim ke email.");
        setFormData({
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
          jenis_kelamin: "",
          phone: "",
          nip: "",
          role_id: "",
          dinas_id: "",
          unit_kerja_id: "",
        });
        
        // Redirect ke halaman verify setelah 2 detik
        setTimeout(() => {
          navigate("/dashboard-diskominfo");
        }, 2000);
      } else {
        setError(result.message || "Registrasi gagal");
        // Tampilkan validation errors jika ada
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(", ");
          setError(errorMessages);
        }
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3f6] to-[#cde4ea] font-sans p-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-[#093757] mb-6">Manajemen Akun</h1>
        
        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-500 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 bg-green-500/20 border border-green-500 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093757]"
              placeholder="Masukkan nama lengkap"
              required
              disabled={loading || loadingMaster}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093757]"
              placeholder="example@email.com"
              required
              disabled={loading || loadingMaster}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093757]"
              placeholder="Minimal 8 karakter"
              required
              disabled={loading || loadingMaster}
              minLength={8}
            />
            <p className="text-xs text-gray-500 mt-1">Password minimal 8 karakter</p>
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password *</label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093757]"
              placeholder="Ulangi password"
              required
              disabled={loading || loadingMaster}
            />
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin *</label>
            <select
              name="jenis_kelamin"
              value={formData.jenis_kelamin}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093757]"
              required
              disabled={loading || loadingMaster}
            >
              <option value="">Pilih jenis kelamin</option>
              <option value="laki-laki">Laki-laki</option>
              <option value="perempuan">Perempuan</option>
            </select>
          </div>

          {/* Telepon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telepon *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093757]"
              placeholder="081234567890"
              required
              disabled={loading || loadingMaster}
            />
          </div>

          {/* NIP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIP</label>
            <input
              type="text"
              name="nip"
              value={formData.nip}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093757]"
              placeholder="Masukkan NIP (opsional)"
              disabled={loading || loadingMaster}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093757]"
              required
              disabled={loading || loadingMaster}
            >
              <option value="">Pilih role</option>
              {masterData.roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Asal Dinas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asal Dinas *</label>
            <select
              name="dinas_id"
              value={formData.dinas_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093757]"
              required
              disabled={loading || loadingMaster}
            >
              <option value="">Pilih asal dinas</option>
              {masterData.dinas.map((dinas) => (
                <option key={dinas.id} value={dinas.id}>
                  {dinas.name}
                </option>
              ))}
            </select>
          </div>

          {/* Unit Kerja */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Kerja *</label>
            <select
              name="unit_kerja_id"
              value={formData.unit_kerja_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093757]"
              required
              disabled={loading || loadingMaster}
            >
              <option value="">Pilih unit kerja</option>
              {masterData.unitKerja.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-semibold mb-1">📧 Catatan:</p>
            <p>Setelah akun berhasil dibuat, kode verifikasi akan dikirim ke email yang didaftarkan. User perlu memverifikasi email sebelum dapat login.</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#093757] text-white py-3 rounded-md font-semibold hover:bg-[#0e4f76] transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || loadingMaster}
          >
            {loadingMaster ? "Memuat data..." : loading ? "Menyimpan..." : "Simpan Akun"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full bg-gray-300 text-gray-700 py-3 rounded-md font-semibold hover:bg-gray-400 transition"
            disabled={loading || loadingMaster}
          >
            Kembali
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManajemenAkun;
