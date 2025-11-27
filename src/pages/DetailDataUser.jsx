import React from "react";
import { useNavigate, useParams } from "react-router-dom";

// Dummy data
const dummyUsers = [
  {
    id: 1,
    nama: "Budi Santoso",
    email: "budi@sso.com",
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
    jenisKelamin: "Perempuan",
    nip: "987654321",
    role: "Teknisi",
    unitKerja: "Teknologi",
    asalDinas: "Dinas Kominfo",
  },
];

export default function DetailDataUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = dummyUsers.find((u) => u.id === parseInt(id));

  // ❗ INI WAJIB ADA BIAR TIDAK ERROR
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus data ini?"
    );

    if (confirmDelete) {
      alert("Data berhasil dihapus! (simulasi)");
      navigate("/data-user");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
        Data user tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="min-h-screen px-8 py-10 bg-[#e7f2f4]">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-[#093757] mb-6">
          Detail Data User
        </h1>

        <div className="space-y-3 text-lg">
          <p><strong>Nama:</strong> {user.nama}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Jenis Kelamin:</strong> {user.jenisKelamin}</p>
          <p><strong>NIP:</strong> {user.nip}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Unit Kerja:</strong> {user.unitKerja}</p>
          <p><strong>Asal Dinas:</strong> {user.asalDinas}</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-400 px-6 py-2 text-white rounded-md hover:bg-gray-500"
          >
            Kembali
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/update-data-user/${id}`)}
              className="bg-blue-600 px-6 py-2 text-white rounded-md hover:bg-blue-700"
            >
              Update
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-600 px-6 py-2 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
