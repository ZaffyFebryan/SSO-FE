import React, { useState } from "react";

const ProfilDiskominfo = () => {
  const [profile] = useState({
    nama: "Admin Diskominfo",
    email: "admin@sso.com",
    password: "********",
    jenisKelamin: "Laki-laki",
    nip: "987654321",
    role: "Administrator",
    unitKerja: "Bidang Aplikasi dan Informatika",
    asalDinas: "Dinas Komunikasi dan Informatika",
  });

  return (
    <div className="min-h-screen bg-[#e8f3f6] font-sans flex justify-center items-start py-20">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-[#093757] text-center">
          Profil Diskominfo
        </h1>

        {/* ==== DATA PROFIL READ-ONLY ==== */}
        {[
          { label: "Nama", value: profile.nama },
          { label: "Email", value: profile.email },
          { label: "Password", value: profile.password },
          { label: "NIP", value: profile.nip },
          { label: "Jenis Kelamin", value: profile.jenisKelamin },
          { label: "Role", value: profile.role },
          { label: "Unit Kerja", value: profile.unitKerja },
          { label: "Asal Dinas", value: profile.asalDinas },
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

export default ProfilDiskominfo;
