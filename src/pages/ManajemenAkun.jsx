import React, { useState } from "react";

const ManajemenAkun = () => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    jenisKelamin: "",
    nip: "",
    role: "",
    unitKerja: "",
    asalDinas: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data submitted:", formData);
    alert("Akun berhasil disimpan!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3f6] to-[#cde4ea] font-sans p-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-[#093757] mb-6">Manajemen Akun</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093757]"
              placeholder="Masukkan nama"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093757]"
              placeholder="Masukkan email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093757]"
              placeholder="Masukkan password"
              required
            />
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
            <select
              name="jenisKelamin"
              value={formData.jenisKelamin}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093757]"
              required
            >
              <option value="">-- Pilih Jenis Kelamin --</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
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
              placeholder="Masukkan NIP"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093757]"
              required
            >
              <option value="">-- Pilih Role --</option>
              <option value="Admin Kota">Admin Kota</option>
              <option value="Kepala Seksi">Kepala Seksi</option>
              <option value="Kepala Bidang">Kepala Bidang</option>
              <option value="Kepala Dinas">Kepala Dinas</option>
              <option value="Admin">Admin</option>
              <option value="Auditor">Auditor</option>
              <option value="Teknisi">Teknisi</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          {/* Unit Kerja */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Kerja</label>
            <input
              type="text"
              name="unitKerja"
              value={formData.unitKerja}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093757]"
              placeholder="Masukkan unit kerja"
            />
          </div>

          {/* Asal Dinas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asal Dinas</label>
            <input
              type="text"
              name="asalDinas"
              value={formData.asalDinas}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093757]"
              placeholder="Masukkan asal dinas"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#093757] text-white py-3 rounded-md font-semibold hover:bg-[#0e4f76] transition"
          >
            Simpan Akun
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManajemenAkun;
