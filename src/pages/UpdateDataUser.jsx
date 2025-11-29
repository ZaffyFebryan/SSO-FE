import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authService, masterService } from "../utils/api";

const UpdateDataUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nip: "",
    jenis_kelamin: "",
    role_id: "",
    dinas_id: "",
    unit_kerja_id: "",
  });

  const [masterData, setMasterData] = useState({
    roles: [],
    dinas: [],
    unitKerja: [],
  });

  const [loading, setLoading] = useState(true);
  const [loadingMaster, setLoadingMaster] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch user data dan master data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadingMaster(true);

        // Fetch user detail dan master data secara parallel
        const [userRes, rolesRes, dinasRes, unitKerjaRes] = await Promise.all([
          authService.getUserById(parseInt(id)),
          masterService.getRoles(),
          masterService.getDinas(),
          masterService.getUnitKerja(),
        ]);

        // Set master data first
        const roles = rolesRes.success ? rolesRes.data : [];
        const dinas = dinasRes.success ? dinasRes.data : [];
        const unitKerja = unitKerjaRes.success ? unitKerjaRes.data : [];

        setMasterData({
          roles,
          dinas,
          unitKerja,
        });

        // Set user data
        if (userRes.success) {
          const user = userRes.data;
          
          // Helper function untuk mencari ID berdasarkan nama
          const findIdByName = (list, name) => {
            if (!name) return "";
            const item = list.find(
              (item) => item.name?.toLowerCase() === name.toLowerCase()
            );
            return item ? item.id : "";
          };

          // Set form data dengan prioritas: gunakan ID jika ada, jika tidak cari dari nama
          setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            nip: user.nip || "",
            jenis_kelamin: user.jenis_kelamin || "",
            role_id: user.role_id || findIdByName(roles, user.role) || "",
            dinas_id: user.dinas_id || findIdByName(dinas, user.asal_dinas) || "",
            unit_kerja_id: user.unit_kerja_id || findIdByName(unitKerja, user.unit_kerja) || "",
          });
        } else {
          setError("Data user tidak ditemukan");
        }

        setLoadingMaster(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    setSuccess("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Prepare data - hanya kirim field yang diisi
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        jenis_kelamin: formData.jenis_kelamin,
      };

      // Tambahkan optional fields jika ada
      if (formData.nip) updateData.nip = formData.nip;
      if (formData.role_id) updateData.role_id = parseInt(formData.role_id);
      if (formData.dinas_id) updateData.dinas_id = parseInt(formData.dinas_id);
      if (formData.unit_kerja_id) updateData.unit_kerja_id = parseInt(formData.unit_kerja_id);

      const response = await authService.updateUser(parseInt(id), updateData);

      if (response.success) {
        setSuccess(response.message || "Data user berhasil diupdate!");
        setTimeout(() => {
          navigate(`/detail-data-user/${id}`);
        }, 1500);
      } else {
        setError(response.message || "Gagal mengupdate data user");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.response?.data?.message || "Terjadi kesalahan saat mengupdate data");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e8f3f6] to-[#cde4ea] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#093757] mx-auto"></div>
          <p className="mt-4 text-[#093757]">Memuat data user...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e8f3f6] to-[#cde4ea] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <button
            onClick={() => navigate("/data-user")}
            className="bg-[#093757] px-6 py-2 text-white rounded-md hover:bg-[#0e4f76]"
          >
            Kembali ke Data User
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3f6] to-[#cde4ea] px-6 py-10 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-[#093757] mb-6">
          Update Data User
        </h1>

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

        <form onSubmit={handleUpdate} className="space-y-5">
          {/* Nama */}
          <div>
            <label className="block font-semibold mb-1">Nama Lengkap *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#093757]"
              required
              disabled={submitting || loadingMaster}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#093757]"
              required
              disabled={submitting || loadingMaster}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-semibold mb-1">Telepon *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#093757]"
              placeholder="081234567890"
              required
              disabled={submitting || loadingMaster}
            />
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="block font-semibold mb-1">Jenis Kelamin *</label>
            <select
              name="jenis_kelamin"
              value={formData.jenis_kelamin}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#093757]"
              required
              disabled={submitting || loadingMaster}
            >
              <option value="">Pilih jenis kelamin</option>
              <option value="laki-laki">Laki-laki</option>
              <option value="perempuan">Perempuan</option>
            </select>
          </div>

          {/* NIP */}
          <div>
            <label className="block font-semibold mb-1">NIP</label>
            <input
              type="text"
              name="nip"
              value={formData.nip}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#093757]"
              placeholder="Masukkan NIP (opsional)"
              disabled={submitting || loadingMaster}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block font-semibold mb-1">Role</label>
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#093757]"
              disabled={submitting || loadingMaster}
            >
              <option value="">Pilih role (opsional)</option>
              {masterData.roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Asal Dinas */}
          <div>
            <label className="block font-semibold mb-1">Asal Dinas</label>
            <select
              name="dinas_id"
              value={formData.dinas_id}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#093757]"
              disabled={submitting || loadingMaster}
            >
              <option value="">Pilih asal dinas (opsional)</option>
              {masterData.dinas.map((dinas) => (
                <option key={dinas.id} value={dinas.id}>
                  {dinas.name}
                </option>
              ))}
            </select>
          </div>

          {/* Unit Kerja */}
          <div>
            <label className="block font-semibold mb-1">Unit Kerja</label>
            <select
              name="unit_kerja_id"
              value={formData.unit_kerja_id}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#093757]"
              disabled={submitting || loadingMaster}
            >
              <option value="">Pilih unit kerja (opsional)</option>
              {masterData.unitKerja.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition disabled:opacity-50"
              disabled={submitting}
            >
              Kembali
            </button>

            <button
              type="submit"
              className="bg-[#093757] text-white px-6 py-2 rounded-md hover:bg-[#0e4f76] transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting || loadingMaster}
            >
              {submitting ? "Menyimpan..." : "Update Data"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDataUser;
