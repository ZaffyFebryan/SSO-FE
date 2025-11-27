import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Dummy data — nanti diganti API backend
const dummyUsers = [
  {
    id: 1,
    nama: "Budi Santoso",
    email: "budi@sso.com",
    password: "********",
    jenisKelamin: "Laki-laki",
    nip: "123456789",
    role: "Staff",
    unitKerja: "IT Support",
    asalDinas: "Dinas Kominfo",
  },
  {
    id: 2,
    nama: "Siti Aminah",
    email: "siti@sso.com",
    password: "********",
    jenisKelamin: "Perempuan",
    nip: "987654321",
    role: "Teknisi",
    unitKerja: "Teknologi",
    asalDinas: "Dinas Kominfo",
  },
];

const roles = [
  "Admin Kota",
  "Kepala Seksi",
  "Kepala Bidang",
  "Kepala Dinas",
  "Admin",
  "Auditor",
  "Teknisi",
  "Staff",
];

const jenisKelaminList = ["Laki-laki", "Perempuan"];

const UpdateDataUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Ambil data berdasarkan ID
  const selectedUser = dummyUsers.find((u) => u.id === parseInt(id));

  // State form
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

  // Isi otomatis saat component dimount
  useEffect(() => {
    if (selectedUser) {
      setFormData(selectedUser);
    }
  }, [selectedUser]);

  // Handler perubahan nilai form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit update (sementara alert saja)
  const handleUpdate = (e) => {
    e.preventDefault();

    alert("Data user berhasil diupdate! (simulasi)");
    navigate(`/detail-data-user/${id}`);
  };

  if (!selectedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold">
        User tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3f6] to-[#cde4ea] px-6 py-10 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-[#093757] mb-6">
          Update Data User
        </h1>

        <form onSubmit={handleUpdate} className="space-y-5">

          <div>
            <label className="block font-semibold mb-1">Nama Lengkap</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">NIP</label>
            <input
              type="text"
              name="nip"
              value={formData.nip}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Jenis Kelamin</label>
            <select
              name="jenisKelamin"
              value={formData.jenisKelamin}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              {jenisKelaminList.map((jk) => (
                <option key={jk} value={jk}>{jk}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Unit Kerja</label>
            <input
              type="text"
              name="unitKerja"
              value={formData.unitKerja}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Asal Dinas</label>
            <input
              type="text"
              name="asalDinas"
              value={formData.asalDinas}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition"
            >
              Kembali
            </button>

            <button
              type="submit"
              className="bg-[#093757] text-white px-6 py-2 rounded-md hover:bg-[#0e4f76] transition"
            >
              Update Data
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UpdateDataUser;
