import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../utils/api";

const DataUser = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await authService.getAllUsers();
        
        if (response.success) {
          setUsers(response.data);
        } else {
          setError("Gagal memuat data user");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Terjadi kesalahan saat memuat data user");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e8f3f6] to-[#cde4ea] font-sans flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#093757] mx-auto"></div>
          <p className="mt-4 text-[#093757]">Memuat data user...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3f6] to-[#cde4ea] font-sans p-10">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-[#093757] mb-6">Data User</h1>

        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-500 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {users.length === 0 && !error ? (
          <div className="text-center py-8 text-gray-500">
            Tidak ada data user
          </div>
        ) : (
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
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-100 cursor-pointer">
                  <td className="py-2 px-4">{user.name || "-"}</td>
                  <td className="py-2 px-4">{user.email || "-"}</td>
                  <td className="py-2 px-4">{user.role || "-"}</td>
                  <td className="py-2 px-4">{user.unit_kerja || "-"}</td>
                  <td className="py-2 px-4">{user.dinas || "-"}</td>
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
        )}
      </div>
    </div>
  );
};

export default DataUser;
