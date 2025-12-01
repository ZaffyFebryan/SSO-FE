// src/pages/DashboardPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchProfile,
  getStoredUser,
  hasToken,
  logout,
} from "../services/auth";
import { apiRequest } from "../services/api";

const APP_LOGOS = {
  asset: "src/assets/siprima.png",
  maintenance: "src/assets/sindra.png",
  change: "src/assets/simantic.png",
};

const APP_DESCRIPTIONS = {
  asset: "Aset Management System",
  maintenance: "Service Desk Management",
  change: "Change & Configuration Management",
};

const ROLE_OPTIONS = [
  "staff",
  "admin",
  "kepala_seksi",
  "kepala_bidang",
  "kepala_dinas",
  "diskominfo",
  "auditor",
  "teknisi",
];

const GENDER_OPTIONS = [
  { value: "laki_laki", label: "Laki - Laki" },
  { value: "perempuan", label: "Perempuan" },
];

const STAFF_USERS_PER_PAGE = 10;

const normalizeGenderValue = (value) => {
  if (!value) {
    return "";
  }
  const raw = value.toString().trim();
  const normalized = raw.toLowerCase().replace(/[\s-]+/g, "_");
  const match = GENDER_OPTIONS.find(
    (option) =>
      option.value === normalized ||
      option.label.toLowerCase() === raw.toLowerCase()
  );
  return match ? match.value : normalized;
};

const getGenderLabel = (value) => {
  if (!value) {
    return "Belum diatur";
  }
  const normalized = value.toString().trim().toLowerCase();
  const match = GENDER_OPTIONS.find(
    (option) =>
      option.value === normalized ||
      option.label.toLowerCase() === normalized
  );
  return match ? match.label : value;
};

const ACCOUNT_FORM_TEMPLATE = {
  name: "",
  email: "",
  nip: "",
  gender: "",
  unit_kerja: "",
  asal_dinas: "",
  role: "",
  password: "",
};

const buildEmptyAccountForm = () => ({ ...ACCOUNT_FORM_TEMPLATE });
const USER_STORAGE_KEY = "sso_user";

const PROFILE_FORM_TEMPLATE = {
  name: "",
  nip: "",
  gender: "",
  role: "",
  unit_kerja: "",
  asal_dinas: "",
};

const PASSWORD_FORM_TEMPLATE = {
  current_password: "",
  new_password: "",
  confirm_password: "",
};

const buildProfileFormFromUser = (user) => {
  const firstRole = user?.profile?.role || user?.roles?.[0]?.role || "";
  return {
    name: user?.name || "",
    nip: user?.profile?.nip || user?.nip || "",
    gender: normalizeGenderValue(user?.profile?.gender || user?.gender || ""),
    role: firstRole,
    unit_kerja: user?.profile?.unit_kerja || "",
    asal_dinas: user?.profile?.asal_dinas || "",
  };
};

const buildEmptyPasswordForm = () => ({ ...PASSWORD_FORM_TEMPLATE });

const formatTitleCase = (value) => {
  if (!value) {
    return "";
  }

  return value
    .toString()
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatReadableDate = (value) => {
  if (!value) {
    return "-";
  }
  try {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getStoredUser());
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [apps, setApps] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [newAccount, setNewAccount] = useState(() => buildEmptyAccountForm());
  const [accountErrors, setAccountErrors] = useState({});
  const [accountFeedback, setAccountFeedback] = useState("");
  const [profileForm, setProfileForm] = useState(() =>
    buildProfileFormFromUser(getStoredUser())
  );
  const [profileErrors, setProfileErrors] = useState({});
  const [profileFeedback, setProfileFeedback] = useState("");
  const [passwordForm, setPasswordForm] = useState(() =>
    buildEmptyPasswordForm()
  );
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [accountSubmitting, setAccountSubmitting] = useState(false);
  const [staffUsers, setStaffUsers] = useState([]);
  const [staffUsersLoading, setStaffUsersLoading] = useState(false);
  const [staffUsersError, setStaffUsersError] = useState("");
  const [staffUsersMeta, setStaffUsersMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: STAFF_USERS_PER_PAGE,
    total: 0,
  });
  const [staffUserPage, setStaffUserPage] = useState(1);
  const [staffUserSearchInput, setStaffUserSearchInput] = useState("");
  const [staffUserSearch, setStaffUserSearch] = useState("");
  const [staffUsersReloadKey, setStaffUsersReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    if (!hasToken()) {
      setPageLoading(false);
      navigate("/");
      return undefined;
    }

    fetchProfile()
      .then((profile) => {
        if (!ignore) {
          setUser(profile);
          setProfileForm(buildProfileFormFromUser(profile));
        }
      })
      .catch(async (err) => {
        if (err.status === 401) {
          await logout();
          navigate("/");
          return;
        }
        if (!ignore) {
          setError(err.message || "Gagal memuat profil pengguna.");
        }
      })
      .finally(() => {
        if (!ignore) {
          setPageLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [navigate]);

  const handleLogout = async () => {
    setError("");
    try {
      await logout();
    } catch (err) {
      setError(err.message || "Gagal logout, coba ulang lagi.");
    } finally {
      navigate("/");
    }
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    let ignore = false;

    if (!hasToken()) {
      setApps([]);
      setAppsLoading(false);
      return () => {};
    }

    setAppsLoading(true);
    apiRequest("/v1/apps")
      .then((response) => {
        if (!ignore) {
          setApps(response?.apps ?? []);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setApps([]);
          setError(
            (prev) =>
              prev || err.message || "Gagal memuat daftar aplikasi yang tersedia."
          );
        }
      })
      .finally(() => {
        if (!ignore) {
          setAppsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenApp = (app) => {
    if (!app?.url) {
      setError("URL aplikasi belum dikonfigurasi. Hubungi administrator.");
      return;
    }
    const ssoToken = window.localStorage.getItem("sso_token");
    let finalUrl = app.url;

    if (ssoToken) {
      try {
        const parsed = new URL(finalUrl);
        parsed.searchParams.set("sso_token", ssoToken);
        finalUrl = parsed.toString();
      } catch {
        const separator = finalUrl.includes("?") ? "&" : "?";
        finalUrl = `${finalUrl}${separator}sso_token=${encodeURIComponent(
          ssoToken
        )}`;
      }
    }

    window.open(finalUrl, "_blank", "noopener,noreferrer");
  };

  const isProfileModalOpen = activeModal === "profile";
  const isAddAccountModalOpen = activeModal === "addAccount";
  const isUserManagementModalOpen = activeModal === "userManagement";
  const isStaff = useMemo(() => {
    if (!user) {
      return false;
    }
    if ((user.role_slugs || []).includes("staff")) {
      return true;
    }

    return (user.roles || []).some(
      (roleItem) =>
        roleItem?.role?.toString().trim().toLowerCase() === "staff"
    );
  }, [user]);
  const canEditProfile = Boolean(user);
  const canEditPassword = true;
  const passwordFieldsDisabled = !isPasswordEditing;
  const primaryRole =
    user?.roles?.[0]?.role ||
    (user?.role_slugs && user.role_slugs.length > 0
      ? user.role_slugs[0]
      : "");
  const primaryTenantName = user?.tenants?.[0]?.nama || "";
  const profileRoleLabel =
    formatTitleCase(profileForm.role || primaryRole || "") ||
    "Belum ditetapkan";
  const profileGenderLabel = getGenderLabel(profileForm.gender);

  useEffect(() => {
    if (!isStaff) {
      setStaffUsers([]);
      setStaffUsersMeta({
        current_page: 1,
        last_page: 1,
        per_page: STAFF_USERS_PER_PAGE,
        total: 0,
      });
      setStaffUsersLoading(false);
      setStaffUsersError("");
      return;
    }

    let ignore = false;
    setStaffUsersLoading(true);
    setStaffUsersError("");

    const params = new URLSearchParams({
      page: staffUserPage.toString(),
      per_page: STAFF_USERS_PER_PAGE.toString(),
    });

    if (staffUserSearch.trim()) {
      params.set("search", staffUserSearch.trim());
    }

    apiRequest(`/v1/staff/users?${params.toString()}`)
      .then((response) => {
        if (ignore) {
          return;
        }
        const meta = response?.meta ?? {};
        setStaffUsers(response?.data ?? []);
        setStaffUsersMeta({
          current_page: meta.current_page ?? staffUserPage,
          last_page: meta.last_page ?? 1,
          per_page: meta.per_page ?? STAFF_USERS_PER_PAGE,
          total: meta.total ?? (response?.data?.length ?? 0),
        });

        if (meta.last_page && staffUserPage > meta.last_page) {
          setStaffUserPage(meta.last_page);
        }
      })
      .catch((err) => {
        if (ignore) {
          return;
        }
        setStaffUsers([]);
        setStaffUsersError(err.message || "Gagal memuat daftar akun staff.");
      })
      .finally(() => {
        if (!ignore) {
          setStaffUsersLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [isStaff, staffUserPage, staffUserSearch, staffUsersReloadKey]);
  const handleResetAccountForm = () => {
    setNewAccount(buildEmptyAccountForm());
    setAccountErrors({});
    setAccountFeedback("");
  };

  const handleResetProfileForm = () => {
    setProfileForm(buildProfileFormFromUser(user));
    setProfileErrors({});
    setProfileFeedback("");
  };

  const handleResetPasswordForm = () => {
    setPasswordForm(buildEmptyPasswordForm());
    setPasswordErrors({});
    setPasswordFeedback("");
  };

  const openProfileModal = () => {
    if (!user) {
      return;
    }
    setActiveModal("profile");
    setAccountFeedback("");
    setAccountErrors({});
    handleResetProfileForm();
    handleResetPasswordForm();
    setIsProfileEditing(false);
    setIsPasswordEditing(false);
  };

  const closeModal = (options = { reset: true }) => {
    setActiveModal(null);
    if (options.reset === false) {
      return;
    }
    handleResetAccountForm();
    handleResetProfileForm();
    handleResetPasswordForm();
    setIsProfileEditing(false);
    setIsPasswordEditing(false);
  };

  const handleStartAddAccount = () => {
    handleResetAccountForm();
    setActiveModal("addAccount");
  };

  const handleAccountChange = (field) => (event) => {
    const value = event.target.value;
    setNewAccount((prev) => ({ ...prev, [field]: value }));
  };

  const openUserManagementModal = () => {
    if (!isStaff) {
      return;
    }
    setActiveModal("userManagement");
  };

  const handleStaffSearchInput = (event) => {
    setStaffUserSearchInput(event.target.value);
  };

  const handleStaffSearchSubmit = (event) => {
    event.preventDefault();
    setStaffUserPage(1);
    setStaffUserSearch(staffUserSearchInput.trim());
  };

  const handleStaffSearchReset = () => {
    setStaffUserSearchInput("");
    setStaffUserSearch("");
    setStaffUserPage(1);
  };

  const handleStaffPageChange = (direction) => {
    setStaffUserPage((prev) => {
      const next = prev + direction;
      if (next < 1) {
        return 1;
      }

      if (staffUsersMeta.last_page && next > staffUsersMeta.last_page) {
        return staffUsersMeta.last_page;
      }

      return next;
    });
  };

  const handleRefreshStaffUsers = () => {
    setStaffUsersReloadKey((prev) => prev + 1);
  };

  const toggleProfileEditing = () => {
    if (!canEditProfile) {
      return;
    }
    setIsProfileEditing((prev) => {
      if (prev) {
        handleResetProfileForm();
        return false;
      }
      setProfileErrors({});
      setProfileFeedback("");
      return true;
    });
  };

  const togglePasswordEditing = () => {
    setIsPasswordEditing((prev) => {
      if (prev) {
        handleResetPasswordForm();
        return false;
      }
      setPasswordErrors({});
      setPasswordFeedback("");
      return true;
    });
  };

  const handleProfileChange = (field) => (event) => {
    const value = event.target.value;
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const persistUserProfile = (nextUser) => {
    if (!nextUser) {
      return;
    }
    setUser(nextUser);
    setProfileForm(buildProfileFormFromUser(nextUser));
    try {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    } catch {
      // ignore quota errors
    }
  };

  const handlePasswordChange = (field) => (event) => {
    const value = event.target.value;
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitNewAccount = async (event) => {
    event.preventDefault();
    const requiredFields = {
      name: "Nama lengkap wajib diisi.",
      email: "Email wajib diisi.",
      role: "Role wajib diisi.",
      password: "Password wajib diisi.",
    };
    const nextErrors = {};

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!newAccount[field]?.trim()) {
        nextErrors[field] = message;
      }
    });

    setAccountErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setAccountFeedback("");
      return;
    }

    setAccountSubmitting(true);
    setAccountFeedback("");

    try {
      const payload = await apiRequest("/v1/staff/users", {
        method: "POST",
        body: JSON.stringify({
          name: newAccount.name,
          email: newAccount.email,
          nip: newAccount.nip || null,
          gender: newAccount.gender || null,
          unit_kerja: newAccount.unit_kerja || null,
          asal_dinas: newAccount.asal_dinas || null,
          role: newAccount.role,
          password: newAccount.password,
        }),
      });

      setAccountErrors({});
      handleResetAccountForm();
      setAccountFeedback(payload?.message || "Akun baru berhasil dibuat.");
      handleRefreshStaffUsers();
    } catch (err) {
      const errors = err.data?.errors;
      if (errors) {
        setAccountErrors({
          name: errors.name?.[0],
          email: errors.email?.[0],
          role: errors.role?.[0],
          password: errors.password?.[0],
        });
      }
      setAccountFeedback(err.message || "Gagal menambahkan akun baru.");
    } finally {
      setAccountSubmitting(false);
    }
  };

  const handleSubmitProfile = async (event) => {
    event.preventDefault();
    if (!isProfileEditing || !canEditProfile) {
      return;
    }
    const nextErrors = {};
    if (!profileForm.name.trim()) {
      nextErrors.name = "Nama lengkap wajib diisi.";
    }
    if (profileForm.nip && profileForm.nip.length < 8) {
      nextErrors.nip = "NIP minimal 8 digit atau kosongkan jika belum ada.";
    }

    setProfileErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setProfileFeedback("");
      return;
    }

    setProfileSubmitting(true);
    setProfileFeedback("");

    try {
      const payload = await apiRequest("/v1/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: profileForm.name,
          nip: profileForm.nip || null,
          gender: profileForm.gender || null,
          unit_kerja: profileForm.unit_kerja || null,
          asal_dinas: profileForm.asal_dinas || null,
        }),
      });

      if (payload?.user) {
        persistUserProfile(payload.user);
      }

      setProfileErrors({});
      setProfileFeedback(payload?.message || "Profil berhasil diperbarui.");
      setIsProfileEditing(false);
    } catch (err) {
      const errors = err.data?.errors;
      if (errors) {
        setProfileErrors({
          name: errors.name?.[0],
          nip: errors.nip?.[0],
          gender: errors.gender?.[0],
          unit_kerja: errors.unit_kerja?.[0],
          asal_dinas: errors.asal_dinas?.[0],
        });
      }
      setProfileFeedback(err.message || "Gagal memperbarui profil.");
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handleSubmitPassword = async (event) => {
    event.preventDefault();
    if (!isPasswordEditing) {
      return;
    }
    const nextErrors = {};

    if (!passwordForm.current_password.trim()) {
      nextErrors.current_password = "Password saat ini wajib diisi.";
    }
    if (!passwordForm.new_password.trim()) {
      nextErrors.new_password = "Password baru wajib diisi.";
    } else if (passwordForm.new_password.length < 8) {
      nextErrors.new_password = "Password baru minimal 8 karakter.";
    }
    if (passwordForm.confirm_password !== passwordForm.new_password) {
      nextErrors.confirm_password = "Konfirmasi password tidak cocok.";
    }

    setPasswordErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setPasswordFeedback("");
      return;
    }

    setPasswordSubmitting(true);
    setPasswordFeedback("");

    try {
      const payload = await apiRequest("/v1/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          current_password: passwordForm.current_password,
          new_password: passwordForm.new_password,
          confirm_password: passwordForm.confirm_password,
        }),
      });

      setPasswordErrors({});
      handleResetPasswordForm();
      setPasswordFeedback(payload?.message || "Password berhasil diperbarui.");
      setIsPasswordEditing(false);
    } catch (err) {
      const errors = err.data?.errors;
      if (errors) {
        setPasswordErrors({
          current_password: errors.current_password?.[0],
          new_password: errors.new_password?.[0],
          confirm_password: errors.confirm_password?.[0],
        });
      }
      setPasswordFeedback(err.message || "Gagal memperbarui password.");
    } finally {
      setPasswordSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0f2a48] to-[#274964] text-white font-sans">
        <div className="text-center">
          <p className="text-lg font-semibold mb-4">Memuat dashboard...</p>
          <div className="w-12 h-12 border-4 border-white/40 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!hasToken()) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#e8f3f6] to-[#cde4ea] text-gray-800 font-sans">
      {/* ==== NAVBAR ==== */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-10 py-4 bg-white shadow-md backdrop-blur-sm">
        <div className="flex items-center gap-3 font-semibold text-lg text-[#093757]">
          <div className="w-9 h-9 bg-[#093757] flex items-center justify-center rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M12 2L4 5v6c0 5.25 3.25 10.25 8 11 4.75-.75 8-5.75 8-11V5l-8-3z" />
            </svg>
          </div>
          <span>SSO Integrated IT Dashboard</span>
        </div>

        <ul className="hidden md:flex gap-6 text-sm font-medium text-[#093757]">
          <li
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-[#25577a] cursor-pointer transition"
          >
            Home
          </li>
          <li
            onClick={() => scrollToSection("applications")}
            className="hover:text-[#25577a] cursor-pointer transition"
          >
            Applications
          </li>
          {isStaff && (
            <li>
              <button
                type="button"
                onClick={openUserManagementModal}
                className="hover:text-[#25577a] cursor-pointer transition"
              >
                User Management
              </button>
            </li>
          )}
          <li
            onClick={() => scrollToSection("reports")}
            className="hover:text-[#25577a] cursor-pointer transition"
          >
            Reports
          </li>
        </ul>

        <div className="flex items-center gap-4">
          {user && (
            <button
              type="button"
              onClick={openProfileModal}
              className="text-right px-3 py-2 rounded-xl border border-transparent hover:border-[#093757]/20 hover:bg-[#f5f8fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25577a] transition"
              aria-label="Lihat informasi pengguna"
            >
              <p className="text-xs text-gray-400">Logged in as</p>
              <p className="text-sm font-semibold text-[#093757]">
                {user.name}
              </p>
            </button>
          )}
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#25577a]"
          />
          <button
            onClick={handleLogout}
            className="bg-[#093757] text-white text-sm px-5 py-2 rounded-md hover:bg-[#0e4f76] transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ==== SPACER supaya konten tidak tertutup navbar ==== */}
      <div className="h-20"></div>

      {/* ==== HERO SECTION ==== */}
      <section className="flex flex-col md:flex-row items-center justify-between px-12 py-20 max-w-[1200px] mx-auto w-full">
        <div className="max-w-lg text-[#093757]">
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Integrated IT Ecosystem in One Dashboard
          </h1>
          <p className="text-[#294659] text-base leading-relaxed">
            Access and manage assets, tickets, and configurations seamlessly with one secure login.
          </p>
          {isStaff && (
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={openUserManagementModal}
                className="rounded-xl bg-[#093757] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0e4f76]"
              >
                Kelola Akun Staff
              </button>
              <button
                type="button"
                onClick={handleStartAddAccount}
                className="rounded-xl border border-[#093757] px-6 py-3 text-sm font-semibold text-[#093757] transition hover:bg-[#093757] hover:text-white"
              >
                Tambah Akun
              </button>
            </div>
          )}
        </div>
        <div className="mt-10 md:mt-0">
          <img
            src="src/assets/dashboard.png"
            alt="Dashboard preview"
          />
        </div>
      </section>

      {error && (
        <div className="mx-12 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error}
        </div>
      )}

      {/* ==== OUR SERVICES (tambahkan ID agar bisa discroll ke sini) ==== */}
      <section id="applications" className="text-center py-16 bg-[#aee1ea]">
        <h2 className="text-3xl font-bold mb-12 text-[#093757]">Our Services Apps</h2>
        {appsLoading ? (
          <div className="text-[#093757] text-base">Memuat daftar aplikasi...</div>
        ) : apps.length === 0 ? (
          <p className="text-[#294659] text-base">
            Belum ada aplikasi yang dapat diakses dengan akun ini.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-10 px-8 md:px-24 max-w-6xl mx-auto">
            {apps.map((app) => {
              let logo = APP_LOGOS[app.code] || "src/assets/dashboard.png";
              if (app.icon) {
                logo = /^https?:\/\//i.test(app.icon)
                  ? app.icon
                  : app.icon.startsWith("src/")
                  ? app.icon
                  : `src/assets/${app.icon}`;
              }
              const description =
                app.description ||
                APP_DESCRIPTIONS[app.code] ||
                "Aplikasi terintegrasi";
              return (
                <button
                  key={app.code}
                  type="button"
                  onClick={() => handleOpenApp(app)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-10 flex flex-col items-center gap-4 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#0f2a48]/20"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img
                      src={logo}
                      alt={app.name || app.code}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <h3 className="font-semibold text-xl text-[#093757]">
                    {app.name || app.code.toUpperCase()}
                  </h3>
                  <p className="text-sm text-[#294659] mt-1 text-center">{description}</p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ==== REPORT SECTION ==== */}
      <section id="reports" className="py-20 text-center bg-white">
        <h2 className="text-3xl font-bold text-[#093757] mb-6">
          Why Organizations Trust Our Integrated Platform
        </h2>
        <p className="text-[#4a4a4a] max-w-3xl mx-auto mb-14 text-base">
          Streamline your IT operations with centralized control, enhanced efficiency, and complete SLA compliance through our comprehensive integration solution.
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              title: "Unified Access",
              desc: "Single login to manage assets, tickets, and configuration data across all your IT systems seamlessly.",
            },
            {
              title: "Smart Automation",
              desc: "Workflow automation following ITIL standards to reduce manual work and improve operational efficiency.",
            },
            {
              title: "Secure & Reliable",
              desc: "Enterprise-grade authentication and comprehensive audit logs ensure maximum security and compliance.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-[#dff0f3] p-8 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-[#093757] text-white rounded-full flex items-center justify-center mb-4 text-lg">
                ⚙️
              </div>
              <h3 className="font-semibold text-[#093757] mb-2">{item.title}</h3>
              <p className="text-[#4a4a4a] text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATISTICS */}
      <section className="bg-[#eaf5f7] py-12">
        <div className="flex flex-wrap justify-center gap-16 text-center text-[#093757]">
          {[
            { icon: "📁", title: "10K+", subtitle: "Managed Assets" },
            { icon: "✅", title: "98%", subtitle: "SLA Compliance Rate" },
            { icon: "👥", title: "500+", subtitle: "Active Users" },
            { icon: "⏰", title: "24/7", subtitle: "Monitoring Enabled" },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-1 min-w-[140px]">
              <div className="text-3xl">{stat.icon}</div>
              <div className="text-xl font-bold">{stat.title}</div>
              <div className="text-sm">{stat.subtitle}</div>
            </div>
          ))}
        </div>
      </section>

      {/* INFO CARDS */}
      <section className="max-w-6xl mx-auto px-8 md:px-24 py-20 grid md:grid-cols-3 gap-8 w-full">
        {[
          {
            title: "Asset Management",
            desc: "Track, audit, and maintain government inventory with comprehensive asset lifecycle management and automated reporting.",
          },
          {
            title: "Service Desk",
            desc: "Manage tickets, assign technicians, and monitor SLA compliance with intelligent routing and automated escalations.",
          },
          {
            title: "Change & Configuration",
            desc: "Log RFCs, control versioning, and review impact changes with comprehensive approval workflows and rollback capabilities.",
          },
        ].map((app, i) => (
          <div
            key={i}
            className="bg-[#dff0f3] p-8 rounded-lg shadow-md hover:shadow-lg transition cursor-default"
          >
            <h3 className="text-lg font-semibold mb-2 text-[#093757]">{app.title}</h3>
            <p className="text-sm text-[#294659] leading-relaxed">{app.desc}</p>
            <a
              href="#"
              className="text-[#093757] text-sm font-semibold mt-4 inline-block hover:underline"
            >
            </a>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="bg-[#093757] text-[#b4cadd] py-12 px-8 md:px-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white rounded-md"></div>
              <span className="font-semibold text-white">SSO IT Dashboard</span>
            </div>
            <p className="text-sm">
              Streamlining government IT operations through integrated solutions and secure access management.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-white">Quick Links</h4>
            <ul className="text-sm space-y-1">
              <li className="hover:text-white cursor-pointer">Dashboard</li>
              <li className="hover:text-white cursor-pointer">Applications</li>
              <li className="hover:text-white cursor-pointer">Reports</li>
              <li className="hover:text-white cursor-pointer">Documentation</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-white">Support</h4>
            <ul className="text-sm space-y-1">
              <li className="hover:text-white cursor-pointer">Help Center</li>
              <li className="hover:text-white cursor-pointer">Contact Us</li>
              <li className="hover:text-white cursor-pointer">System Status</li>
              <li className="hover:text-white cursor-pointer">Training</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-white">Contact Info</h4>
            <ul className="text-sm space-y-1">
              <li>support@gov-sso.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-[#aacde6] text-sm mt-10 border-t border-[#225b7d] pt-4">
          © 2025 Pemkot Surabaya. All rights reserved. | Privacy Policy | Terms of Service
        </div>
      </footer>

      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => closeModal({ reset: false })}
              className="absolute right-5 top-5 text-[#6a889f] transition hover:text-[#093757]"
              aria-label="Tutup informasi pengguna"
            >
              &times;
            </button>
            <p className="text-center text-sm font-semibold uppercase tracking-wide text-[#6a889f]">
              Profil Pengguna
            </p>
            <h3 className="mt-2 text-center text-2xl font-semibold text-[#093757]">
              Selamat datang, {user?.name || "Pengguna"}!
            </h3>
            <p className="mt-2 mb-8 text-center text-sm text-[#294659]">
              Informasi akun Anda ditampilkan di bawah ini. Untuk pembaruan data, hubungi admin SSO.
            </p>
            <div className="mt-10 space-y-10">
              <section className="rounded-2xl border border-[#e0ecf6] bg-[#f7fbff] p-6">
                <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#6a889f]">
                      Informasi Profil
                    </p>
                    <h4 className="text-lg font-semibold text-[#093757]">
                      {isProfileEditing ? "Perbarui data Anda" : "Detail akun dan dinas"}
                    </h4>
                    <p className="text-sm text-[#294659]">
                      {isProfileEditing
                        ? "Sesuaikan data berikut lalu simpan untuk memperbarui profil SSO Anda."
                        : "Klik tombol edit untuk memperbarui informasi pribadi Anda."}
                    </p>
                  </div>
                  {canEditProfile ? (
                    <button
                      type="button"
                      onClick={toggleProfileEditing}
                      className="rounded-lg border border-[#093757] px-4 py-2 text-sm font-semibold text-[#093757] transition hover:bg-[#093757] hover:text-white"
                    >
                      {isProfileEditing ? "Batalkan" : "Edit Profil"}
                    </button>
                  ) : (
                    <span className="text-xs text-[#6a889f]">
                      Hanya staff yang dapat mengubah data ini.
                    </span>
                  )}
                </div>

                <form className="space-y-6" onSubmit={handleSubmitProfile}>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-[#6a889f]">
                        Nama lengkap
                      </span>
                      {isProfileEditing ? (
                        <input
                          id="profile-name"
                          type="text"
                          className="rounded-lg border border-[#d7e6f1] px-4 py-2 focus:border-[#093757] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                          value={profileForm.name}
                          onChange={handleProfileChange("name")}
                          autoComplete="name"
                        />
                      ) : (
                        <div className="rounded-lg border border-[#d7e6f1] bg-[#f0f6fb] px-4 py-3 text-[#0f2a48]">
                          {profileForm.name || "-"}
                        </div>
                      )}
                      {isProfileEditing && profileErrors.name && (
                        <p className="text-xs text-red-500">{profileErrors.name}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-[#6a889f]">
                        NIP
                      </span>
                      {isProfileEditing ? (
                        <input
                          id="profile-nip"
                          type="text"
                          className="rounded-lg border border-[#d7e6f1] px-4 py-2 focus:border-[#093757] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                          value={profileForm.nip}
                          onChange={handleProfileChange("nip")}
                          autoComplete="off"
                        />
                      ) : (
                        <div className="rounded-lg border border-[#d7e6f1] bg-[#f0f6fb] px-4 py-3 text-[#0f2a48]">
                          {profileForm.nip || "-"}
                        </div>
                      )}
                      {isProfileEditing && profileErrors.nip && (
                        <p className="text-xs text-red-500">{profileErrors.nip}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-[#6a889f]">
                        Jenis kelamin
                      </span>
                      {isProfileEditing ? (
                        <select
                          id="profile-gender"
                          className="rounded-lg border border-[#d7e6f1] px-4 py-2 text-sm focus:border-[#093757] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                          value={profileForm.gender}
                          onChange={handleProfileChange("gender")}
                        >
                          <option value="">Pilih jenis kelamin</option>
                          {GENDER_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="rounded-lg border border-[#d7e6f1] bg-[#f0f6fb] px-4 py-3 text-[#0f2a48]">
                          {profileGenderLabel}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-[#6a889f]">
                        Role
                      </span>
                      <div className="rounded-lg border border-dashed border-[#d7e6f1] bg-[#f0f6fb] px-4 py-3 text-[#0f2a48]">
                        {profileRoleLabel}
                      </div>
                      <p className="text-xs text-[#6a889f]">
                        Role ditentukan oleh staff SSO dan tidak dapat diubah dari sini.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-[#6a889f]">
                        Unit Kerja
                      </span>
                      {isProfileEditing ? (
                        <input
                          id="profile-unit"
                          type="text"
                          className="rounded-lg border border-[#d7e6f1] px-4 py-2 focus:border-[#093757] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                          value={profileForm.unit_kerja}
                          onChange={handleProfileChange("unit_kerja")}
                        />
                      ) : (
                        <div className="rounded-lg border border-[#d7e6f1] bg-[#f0f6fb] px-4 py-3 text-[#0f2a48]">
                          {profileForm.unit_kerja || primaryTenantName || "Belum diatur"}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-[#6a889f]">
                        Asal Dinas
                      </span>
                      {isProfileEditing ? (
                        <input
                          id="profile-dinas"
                          type="text"
                          className="rounded-lg border border-[#d7e6f1] px-4 py-2 focus:border-[#093757] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                          value={profileForm.asal_dinas}
                          onChange={handleProfileChange("asal_dinas")}
                        />
                      ) : (
                        <div className="rounded-lg border border-[#d7e6f1] bg-[#f0f6fb] px-4 py-3 text-[#0f2a48]">
                          {profileForm.asal_dinas || primaryTenantName || "Belum diatur"}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-[#6a889f]">
                        Email (dari SSO)
                      </span>
                      <div className="rounded-lg border border-dashed border-[#d7e6f1] bg-[#f0f6fb] px-4 py-3 text-[#6b7f92]">
                        {user?.email || "-"}
                      </div>
                      <p className="text-xs text-[#6a889f]">
                        Email terintegrasi dengan backend SSO dan tidak dapat diedit dari sini.
                      </p>
                    </div>
                  </div>

                  {profileFeedback && (
                    <div className="rounded-lg border border-[#b6d6f2] bg-[#e6f4ff] px-4 py-3 text-sm text-[#0f2a48]">
                      {profileFeedback}
                    </div>
                  )}

                  {isProfileEditing && canEditProfile && (
                    <div className="flex flex-wrap justify-end gap-3">
                      <button
                        type="button"
                        onClick={handleResetProfileForm}
                        disabled={profileSubmitting}
                        className={`rounded-xl border border-[#093757] px-5 py-2 text-sm font-semibold text-[#093757] transition hover:bg-[#093757] hover:text-white ${
                          profileSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        Reset
                      </button>
                      <button
                        type="submit"
                        disabled={profileSubmitting}
                        className={`rounded-xl bg-[#093757] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0e4f76] ${
                          profileSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        Simpan Profil
                      </button>
                    </div>
                  )}
                </form>
              </section>

              <section className="rounded-2xl border border-[#e0ecf6] bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#6a889f]">
                      Ganti Password
                    </p>
                    <h4 className="text-lg font-semibold text-[#093757]">
                      Perbarui kata sandi akun Anda
                    </h4>
                    <p className="text-sm text-[#294659]">
                      Demi keamanan, gunakan password yang kuat dan berbeda dari sistem lain.
                    </p>
                  </div>
                  {canEditPassword && (
                    <button
                      type="button"
                      onClick={togglePasswordEditing}
                      className="rounded-lg border border-[#093757] px-4 py-2 text-sm font-semibold text-[#093757] transition hover:bg-[#093757] hover:text-white"
                    >
                      {isPasswordEditing ? "Batalkan" : "Edit Password"}
                    </button>
                  )}
                </div>
                <form className="space-y-5" onSubmit={handleSubmitPassword}>
                  <div>
                    <label className="text-sm font-semibold text-[#0f2a48]" htmlFor="password-current">
                      Password saat ini
                    </label>
                    <input
                      id="password-current"
                      type="password"
                      className="mt-2 w-full rounded-lg border border-[#d7e6f1] px-4 py-2 focus:border-[#093757] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                      value={passwordForm.current_password}
                      onChange={handlePasswordChange("current_password")}
                      autoComplete="current-password"
                      disabled={passwordFieldsDisabled}
                    />
                    {passwordErrors.current_password && (
                      <p className="mt-1 text-xs text-red-500">{passwordErrors.current_password}</p>
                    )}
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-semibold text-[#0f2a48]" htmlFor="password-new">
                        Password baru
                      </label>
                      <input
                        id="password-new"
                        type="password"
                        className="mt-2 w-full rounded-lg border border-[#d7e6f1] px-4 py-2 focus:border-[#093757] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                        value={passwordForm.new_password}
                        onChange={handlePasswordChange("new_password")}
                        autoComplete="new-password"
                        disabled={passwordFieldsDisabled}
                      />
                      {passwordErrors.new_password && (
                        <p className="mt-1 text-xs text-red-500">{passwordErrors.new_password}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#0f2a48]" htmlFor="password-confirm">
                        Konfirmasi password baru
                      </label>
                      <input
                        id="password-confirm"
                        type="password"
                        className="mt-2 w-full rounded-lg border border-[#d7e6f1] px-4 py-2 focus:border-[#093757] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                        value={passwordForm.confirm_password}
                        onChange={handlePasswordChange("confirm_password")}
                        autoComplete="new-password"
                        disabled={passwordFieldsDisabled}
                      />
                      {passwordErrors.confirm_password && (
                        <p className="mt-1 text-xs text-red-500">{passwordErrors.confirm_password}</p>
                      )}
                    </div>
                  </div>
                  {passwordFeedback && (
                    <div className="rounded-lg border border-[#b6d6f2] bg-[#e6f4ff] px-4 py-3 text-sm text-[#0f2a48]">
                      {passwordFeedback}
                    </div>
                  )}
                  {isPasswordEditing && (
                    <div className="flex flex-wrap gap-3 justify-end">
                      <button
                        type="button"
                        onClick={handleResetPasswordForm}
                        disabled={passwordSubmitting}
                        className={`rounded-xl border border-[#093757] px-5 py-2 text-sm font-semibold text-[#093757] transition hover:bg-[#093757] hover:text-white ${
                          passwordSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        Reset
                      </button>
                      <button
                        type="submit"
                        disabled={passwordSubmitting}
                        className={`rounded-xl bg-[#093757] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0e4f76] ${
                          passwordSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        Simpan Password
                      </button>
                    </div>
                  )}
                </form>
              </section>
            </div>
            {isStaff && (
              <button
                type="button"
                onClick={handleStartAddAccount}
                className="mt-10 w-full rounded-xl bg-[#093757] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0e4f76]"
              >
                Tambahkan Akun
              </button>
            )}
          </div>
        </div>
      )}

      {isUserManagementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="relative w-full max-w-6xl rounded-2xl bg-white p-8 shadow-2xl max-h-[90vh]">
            <button
              type="button"
              onClick={() => closeModal({ reset: false })}
              className="absolute right-5 top-5 text-[#6a889f] transition hover:text-[#093757]"
              aria-label="Tutup manajemen akun"
            >
              &times;
            </button>
            <div className="flex flex-col gap-6 h-full overflow-y-auto pr-1">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6a889f]">
                    Staff Access
                  </p>
                  <h2 className="text-3xl font-bold text-[#093757] mt-2">
                    User Management
                  </h2>
                  <p className="text-[#294659] max-w-2xl mt-2">
                    Pantau akun di tenant Anda, lakukan pencarian cepat, dan kontrol akses aplikasi SIPRIMA
                    tanpa meninggalkan dashboard.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                  <button
                    type="button"
                    onClick={handleRefreshStaffUsers}
                    disabled={staffUsersLoading}
                    className={`rounded-xl border border-[#093757] px-5 py-2 text-sm font-semibold text-[#093757] transition hover:bg-[#093757] hover:text-white ${
                      staffUsersLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {staffUsersLoading ? "Memuat..." : "Refresh daftar"}
                  </button>
                  <button
                    type="button"
                    onClick={handleStartAddAccount}
                    className="rounded-xl bg-[#093757] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0e4f76]"
                  >
                    Tambah Akun Baru
                  </button>
                </div>
              </div>

              <form
                onSubmit={handleStaffSearchSubmit}
                className="flex flex-col md:flex-row items-stretch md:items-end gap-4"
              >
                <div className="flex-1">
                  <label className="text-sm font-semibold text-[#093757]" htmlFor="staff-search-modal">
                    Cari akun (nama, email, atau NIP)
                  </label>
                  <input
                    id="staff-search-modal"
                    type="text"
                    value={staffUserSearchInput}
                    onChange={handleStaffSearchInput}
                    className="mt-2 w-full rounded-xl border border-[#c8dceb] bg-white px-4 py-2 text-sm text-[#0f2a48] focus:border-[#093757] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                    placeholder="Contoh: Budi atau 19781211"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="rounded-xl bg-[#093757] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0e4f76]"
                  >
                    Cari
                  </button>
                  <button
                    type="button"
                    onClick={handleStaffSearchReset}
                    className="rounded-xl border border-[#093757] px-5 py-2 text-sm font-semibold text-[#093757] transition hover:bg-[#093757] hover:text-white"
                  >
                    Reset
                  </button>
                </div>
              </form>

              {staffUsersError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {staffUsersError}
                </div>
              )}

              <div className="rounded-2xl bg-white shadow-lg border border-[#e0ecf6] overflow-hidden">
                {staffUsersLoading ? (
                  <div className="p-10 text-center text-[#093757] text-base">
                    Memuat daftar akun staff...
                  </div>
                ) : staffUsers.length === 0 ? (
                  <div className="p-10 text-center text-[#294659] text-base">
                    Tidak ada akun yang cocok dengan pencarian Anda.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#d7e6f1] text-left">
                      <thead className="bg-[#eef5fb] text-[#0f2a48] text-xs font-semibold uppercase tracking-wide">
                        <tr>
                          <th className="px-6 py-4">Nama & Email</th>
                          <th className="px-6 py-4">Role Utama</th>
                          <th className="px-6 py-4">Unit & Dinas</th>
                          <th className="px-6 py-4">NIP</th>
                          <th className="px-6 py-4">Terdaftar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eef5fb] text-sm text-[#0f2a48]">
                        {staffUsers.map((member) => {
                          const primaryStaffRole =
                            member?.roles?.[0]?.role ||
                            (member?.role_slugs && member.role_slugs.length > 0
                              ? member.role_slugs[0]
                              : "Belum diatur");
                          const staffProfile = member?.profile || {};

                          return (
                            <tr key={member.id} className="hover:bg-[#f7fbff] transition">
                              <td className="px-6 py-4">
                                <p className="font-semibold text-[#093757]">{member.name}</p>
                                <p className="text-xs text-[#6a889f]">{member.email}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center rounded-full bg-[#e8f2fb] px-3 py-1 text-xs font-semibold text-[#0f2a48]">
                                  {formatTitleCase(primaryStaffRole)}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <p className="font-medium text-[#093757]">
                                  {staffProfile.unit_kerja || "-"}
                                </p>
                                <p className="text-xs text-[#6a889f]">
                                  {staffProfile.asal_dinas || "Belum diatur"}
                                </p>
                              </td>
                              <td className="px-6 py-4 text-[#294659]">
                                {staffProfile.nip || "-"}
                              </td>
                              <td className="px-6 py-4 text-[#294659]">
                                {formatReadableDate(member.created_at)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <p className="text-sm text-[#294659]">
                  Halaman {staffUsersMeta.current_page} dari {staffUsersMeta.last_page} •{" "}
                  {staffUsersMeta.total} akun terdaftar
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleStaffPageChange(-1)}
                    disabled={staffUsersLoading || staffUsersMeta.current_page <= 1}
                    className={`rounded-xl border border-[#093757] px-5 py-2 text-sm font-semibold text-[#093757] transition hover:bg-[#093757] hover:text-white ${
                      staffUsersLoading || staffUsersMeta.current_page <= 1
                        ? "opacity-40 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Sebelumnya
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStaffPageChange(1)}
                    disabled={
                      staffUsersLoading ||
                      staffUsersMeta.current_page >= staffUsersMeta.last_page
                    }
                    className={`rounded-xl bg-[#093757] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0e4f76] ${
                      staffUsersLoading ||
                      staffUsersMeta.current_page >= staffUsersMeta.last_page
                        ? "opacity-40 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-5 top-5 text-[#6a889f] transition hover:text-[#093757]"
              aria-label="Tutup formulir tambah akun"
            >
              &times;
            </button>
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#6a889f]">
                Registrasi Akun Staff
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-[#093757]">
                Tambahkan Akun Baru
              </h3>
              <p className="mt-1 text-sm text-[#294659]">
                Lengkapi detail pengguna berikut. Kolom role dan password wajib diisi sebelum disimpan.
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmitNewAccount}>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-[#0f2a48]" htmlFor="account-name">
                    Nama lengkap
                  </label>
                  <input
                    id="account-name"
                    type="text"
                    className="mt-2 w-full rounded-lg border border-[#d7e6f1] px-4 py-2 focus:border-[#093757] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                    placeholder="Contoh: Slamet Budianto"
                    value={newAccount.name}
                    onChange={handleAccountChange("name")}
                    autoComplete="name"
                  />
                  {accountErrors.name && (
                    <p className="mt-1 text-xs text-red-500">{accountErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#0f2a48]" htmlFor="account-email">
                    Email
                  </label>
                  <input
                    id="account-email"
                    type="email"
                    className="mt-2 w-full rounded-lg border border-[#d7e6f1] px-4 py-2 focus:border-[#093757] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                    placeholder="contoh@sso.local"
                    value={newAccount.email}
                    onChange={handleAccountChange("email")}
                    autoComplete="email"
                  />
                  {accountErrors.email && (
                    <p className="mt-1 text-xs text-red-500">{accountErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#0f2a48]" htmlFor="account-nip">
                    NIP
                  </label>
                  <input
                    id="account-nip"
                    type="text"
                    className="mt-2 w-full rounded-lg border border-[#d7e6f1] px-4 py-2 focus:border-[#093757] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                    placeholder="110920471983"
                    value={newAccount.nip}
                    onChange={handleAccountChange("nip")}
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#0f2a48]" htmlFor="account-gender">
                    Jenis kelamin
                  </label>
                  <select
                    id="account-gender"
                    className="mt-2 w-full rounded-lg border border-[#d7e6f1] px-4 py-2 text-sm focus:border-[#093757] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                    value={newAccount.gender}
                    onChange={handleAccountChange("gender")}
                  >
                    <option value="">Pilih jenis kelamin</option>
                    {GENDER_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#0f2a48]" htmlFor="account-unit">
                    Unit Kerja
                  </label>
                  <input
                    id="account-unit"
                    type="text"
                    className="mt-2 w-full rounded-lg border border-[#d7e6f1] px-4 py-2 focus:border-[#093757] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                    placeholder="Bidang Pencegahan Penyakit"
                    value={newAccount.unit_kerja}
                    onChange={handleAccountChange("unit_kerja")}
                    autoComplete="organization"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-[#0f2a48]" htmlFor="account-dinas">
                    Asal Dinas
                  </label>
                  <input
                    id="account-dinas"
                    type="text"
                    className="mt-2 w-full rounded-lg border border-[#d7e6f1] px-4 py-2 focus:border-[#093757] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                    placeholder="Dinas Kesehatan Prov. Jawa Timur"
                    value={newAccount.asal_dinas}
                    onChange={handleAccountChange("asal_dinas")}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#0f2a48]" htmlFor="account-role">
                    Role
                  </label>
                  <select
                    id="account-role"
                    className="mt-2 w-full rounded-lg border border-[#d7e6f1] px-4 py-2 text-sm focus:border-[#093757] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                    value={newAccount.role}
                    onChange={handleAccountChange("role")}
                  >
                    <option value="">Pilih role pengguna</option>
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>
                        {formatTitleCase(role)}
                      </option>
                    ))}
                  </select>
                  {accountErrors.role && (
                    <p className="mt-1 text-xs text-red-500">{accountErrors.role}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#0f2a48]" htmlFor="account-password">
                    Password
                  </label>
                  <input
                    id="account-password"
                    type="password"
                    className="mt-2 w-full rounded-lg border border-[#d7e6f1] px-4 py-2 focus:border-[#093757] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                    placeholder="Minimal 8 karakter"
                    value={newAccount.password}
                    onChange={handleAccountChange("password")}
                    autoComplete="new-password"
                  />
                  {accountErrors.password && (
                    <p className="mt-1 text-xs text-red-500">{accountErrors.password}</p>
                  )}
                </div>
              </div>

              {accountFeedback && (
                <div className="rounded-lg border border-[#b6d6f2] bg-[#e6f4ff] px-4 py-3 text-sm text-[#0f2a48]">
                  {accountFeedback}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={openProfileModal}
                  className="text-sm font-semibold text-[#093757] transition hover:text-[#0e4f76]"
                >
                  Kembali ke informasi akun
                </button>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleResetAccountForm}
                    disabled={accountSubmitting}
                    className={`rounded-xl border border-[#093757] px-5 py-2 text-sm font-semibold text-[#093757] transition hover:bg-[#093757] hover:text-white ${
                      accountSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={accountSubmitting}
                    className={`rounded-xl bg-[#093757] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0e4f76] ${
                      accountSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Simpan Akun
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
