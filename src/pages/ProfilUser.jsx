import React, { useState } from "react";

const ProfilUser = () => {
  const [user] = useState({
    nama: "John Doe",
    email: "johndoe@example.com",
    password: "********",
    jenisKelamin: "Laki-laki",
    nip: "123456789",
    jabatan: "Staff",
    unitKerja: "IT",
    asalDinas: "Diskominfo",
  });

  return (
    <div className="min-h-screen bg-[#e8f3f6] font-sans flex justify-center items-start py-20">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-[#093757]">Profil User</h1>

        {/* ==== DATA USER READ-ONLY ==== */}
        {[
          { label: "Nama", value: user.nama },
          { label: "Email", value: user.email },
          { label: "Password", value: user.password },
          { label: "Jenis Kelamin", value: user.jenisKelamin },
          { label: "NIP", value: user.nip },
          { label: "Jabatan / Role", value: user.jabatan },
          { label: "Unit Kerja", value: user.unitKerja },
          { label: "Asal Dinas", value: user.asalDinas },
        ].map((field, idx) => (
          <div className="mb-4" key={idx}>
            <label className="block text-sm font-medium text-[#093757] mb-1">
              {field.label}
            </label>
            <input
              type="text"
              value={field.value}
              readOnly
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 
              text-gray-700 cursor-not-allowed"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilUser;
