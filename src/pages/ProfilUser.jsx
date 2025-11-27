import React, { useState } from "react";

const ProfilUser = () => {
  const [user, setUser] = useState({
    nama: "John Doe",
    email: "johndoe@example.com",
    password: "",
    jenisKelamin: "Laki-laki",
    nip: "123456789",
    jabatan: "Staff",
    unitKerja: "IT",
    asalDinas: "Diskominfo",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profil berhasil diperbarui!");
  };

  return (
    <div className="min-h-screen bg-[#e8f3f6] font-sans flex justify-center items-start py-20">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-8 w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-[#093757]">Profil User</h1>

        {[
          { label: "Nama", name: "nama" },
          { label: "Email", name: "email", type: "email" },
          { label: "Password", name: "password", type: "password" },
          { label: "Jenis Kelamin", name: "jenisKelamin" },
          { label: "NIP", name: "nip" },
          { label: "Jabatan/Role", name: "jabatan" },
          { label: "Unit Kerja", name: "unitKerja" },
          { label: "Asal Dinas", name: "asalDinas" },
        ].map((field, idx) => (
          <div className="mb-4" key={idx}>
            <label className="block text-sm font-medium text-[#093757] mb-1">
              {field.label}
            </label>
            <input
              type={field.type || "text"}
              name={field.name}
              value={user[field.name]}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#093757]"
            />
          </div>
        ))}
      </form>
    </div>
  );
};

export default ProfilUser;
