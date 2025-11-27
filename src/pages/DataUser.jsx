import React from "react";
import { useNavigate } from "react-router-dom";

const dummyUsers = [
  {
    id: 1,
    nama: "Budi Santoso",
    email: "budi@sso.com",
    role: "Staff",
    unitKerja: "IT Support",
    asalDinas: "Dinas Kominfo",
  },
  {
    id: 2,
    nama: "Siti Aminah",
    email: "siti@sso.com",
    role: "Teknisi",
    unitKerja: "Teknologi",
    asalDinas: "Dinas Kominfo",
  },
  {
    id: 3,
    nama: "Ahmad Fauzi",
    email: "ahmad@sso.com",
    role: "Admin",
    unitKerja: "Admin Sistem",
    asalDinas: "Dinas Kominfo",
  },
];

const DataUser = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3f6] to-[#cde4ea] font-sans p-10">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-[#093757] mb-6">Data User</h1>

        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-[#093757] text-white">
            <tr>
              <th className="py-2 px-4 text-left">Nama</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Unit Kerja</th>
              <th className="py-2 px-4 text-left">Asal Dinas</th>
              <th className="py-2 px-4 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dummyUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-100 cursor-pointer">
                <td className="py-2 px-4">{user.nama}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.role}</td>
                <td className="py-2 px-4">{user.unitKerja}</td>
                <td className="py-2 px-4">{user.asalDinas}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => navigate(`/detail-data-user/${user.id}`)}
                    className="bg-[#093757] text-white px-3 py-1 rounded-md hover:bg-[#0e4f76] transition text-sm"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataUser;
