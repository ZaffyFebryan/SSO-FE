import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authService } from "../utils/api";
import Swal from "sweetalert2";

export default function DetailDataUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        setLoading(true);
        const response = await authService.getUserById(parseInt(id));
        
        if (response.success) {
          setUser(response.data);
        } else {
          setError("Data user tidak ditemukan");
        }
      } catch (err) {
        console.error("Error fetching user detail:", err);
        setError("Gagal memuat data user");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [id]);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Hapus Data User?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await authService.deleteUser(parseInt(id));
        
        if (response.success) {
          await Swal.fire({
            title: "Berhasil!",
            text: response.message || "Data user berhasil dihapus",
            icon: "success",
            confirmButtonColor: "#093757",
          });
          navigate("/data-user");
        } else {
          Swal.fire({
            title: "Gagal!",
            text: response.message || "Gagal menghapus data user",
            icon: "error",
            confirmButtonColor: "#093757",
          });
        }
      } catch (err) {
        console.error("Error deleting user:", err);
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message || "Terjadi kesalahan saat menghapus data",
          icon: "error",
          confirmButtonColor: "#093757",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e7f2f4] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#093757] mx-auto"></div>
          <p className="mt-4 text-[#093757]">Memuat detail user...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#e7f2f4] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || "Data user tidak ditemukan"}</p>
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
    <div className="min-h-screen px-8 py-10 bg-[#e7f2f4]">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-[#093757] mb-6">
          Detail Data User
        </h1>

        <div className="space-y-3 text-lg">
          <p><strong>Nama:</strong> {user.name || "-"}</p>
          <p><strong>Email:</strong> {user.email || "-"}</p>
          <p><strong>Jenis Kelamin:</strong> {user.jenis_kelamin || "-"}</p>
          <p><strong>Telepon:</strong> {user.phone || "-"}</p>
          <p><strong>NIP:</strong> {user.nip || "-"}</p>
          <p><strong>Role:</strong> {user.role || "-"}</p>
          <p><strong>Unit Kerja:</strong> {user.unit_kerja || "-"}</p>
          <p><strong>Asal Dinas:</strong> {user.dinas || "-"}</p>
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
