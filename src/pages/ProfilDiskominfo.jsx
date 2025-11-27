import React, { useState } from "react";

const ProfilDiskominfo = () => {
  const [profile, setProfile] = useState({
    nama: "Admin Diskominfo",
    email: "admin@sso.com",
    password: "",
    nip: "987654321",
    jabatan: "Administrator",
    unitKerja: "Diskominfo",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profil Diskominfo berhasil diperbarui!");
  };

  return (
    <div className="min-h-screen bg-[#e8f3f6] font-sans flex justify-center items-start py-20">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-[#093757]">Profil Diskominfo</h1>

        {[
          { label: "Nama", name: "nama" },
          { label: "Email", name: "email", type: "email" },
          { label: "Password", name: "password", type: "password" },
          { label: "NIP", name: "nip" },
          { label: "Jabatan", name: "jabatan" },
          { label: "Unit Kerja", name: "unitKerja" },
        ].map((field, idx) => (
          <div className="mb-4" key={idx}>
            <label className="block text-sm font-medium text-[#093757] mb-1">
              {field.label}
            </label>
            <input
              type={field.type || "text"}
              name={field.name}
              value={profile[field.name]}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#093757]"
            />
          </div>
        ))}
      </form>
    </div>
  );
};

export default ProfilDiskominfo;
