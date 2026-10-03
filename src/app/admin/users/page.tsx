"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Shield,
  KeyRound,
  Trash2,
  CheckCircle2,
  XCircle,
  Mail,
  Search,
  AlertCircle,
  X,
  Lock,
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  last_login?: string;
  created_at?: string;
}

const ROLE_BADGES: Record<string, { label: string; color: string }> = {
  SUPER_ADMIN: { label: "Super Admin", color: "bg-purple-100 text-purple-800 border-purple-200" },
  CONTENT_ADMIN: { label: "Content Editor", color: "bg-blue-100 text-blue-800 border-blue-200" },
  PROJECT_MANAGER: { label: "Project Manager", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  MARKETING: { label: "Marketing", color: "bg-amber-100 text-amber-800 border-amber-200" },
  SALES: { label: "Sales & Leads", color: "bg-rose-100 text-rose-800 border-rose-200" },
  VIEWER: { label: "Viewer", color: "bg-neutral-100 text-neutral-700 border-neutral-200" },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [resetModal, setResetModal] = useState<{ open: boolean; user: AdminUser | null }>({
    open: false,
    user: null,
  });

  // New user form
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("CONTENT_ADMIN");
  const [newPassword, setNewPassword] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Reset password form
  const [targetNewPwd, setTargetNewPwd] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function loadUsers() {
    setLoading(true);
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => {
        setUsers(d.users || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setCreateLoading(true);
    setModalError(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: newName,
          email: newEmail,
          role: newRole,
          password: newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setModalError(data.error || "Failed to create user.");
      } else {
        setAddModal(false);
        setNewName("");
        setNewEmail("");
        setNewPassword("");
        loadUsers();
      }
    } catch {
      setModalError("Network error. Please try again.");
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleToggleStatus(user: AdminUser) {
    try {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          is_active: !user.is_active,
        }),
      });
      loadUsers();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteUser(user: AdminUser) {
    if (!confirm(`Are you sure you want to remove user "${user.full_name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/users?id=${user.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) alert(data.error || "Failed to delete user.");
      else loadUsers();
    } catch {
      alert("Error deleting user.");
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!resetModal.user) return;

    setResetLoading(true);
    setResetMsg(null);

    try {
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: resetModal.user.id,
          newPassword: targetNewPwd,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setResetMsg({ type: "error", text: data.error || "Failed to reset password." });
      } else {
        setResetMsg({ type: "success", text: "Password reset successfully!" });
        setTargetNewPwd("");
        setTimeout(() => {
          setResetModal({ open: false, user: null });
          setResetMsg(null);
        }, 1500);
      }
    } catch {
      setResetMsg({ type: "error", text: "Error resetting password." });
    } finally {
      setResetLoading(false);
    }
  }

  const filteredUsers = users.filter((u) => {
    return (
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Staff & User Management</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage authorized staff accounts, assign administrative roles, and reset credentials.
          </p>
        </div>
        <button
          onClick={() => setAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#283A97] text-white text-sm font-semibold rounded-lg hover:bg-[#1e2d7a] transition-colors shadow-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Add New User
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team members by name, email, or role..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
          />
        </div>
        <span className="text-xs text-neutral-500 font-medium">
          {filteredUsers.length} account{filteredUsers.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-sm text-neutral-500">
            <div className="w-6 h-6 border-2 border-[#283A97] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading authorized team members...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-sm text-neutral-500">
            No accounts match your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50/80 border-b border-neutral-200 text-xs text-neutral-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Last Login</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredUsers.map((user) => {
                  const roleConfig = ROLE_BADGES[user.role] || {
                    label: user.role,
                    color: "bg-neutral-100 text-neutral-700 border-neutral-200",
                  };
                  const initials = user.full_name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "U";

                  return (
                    <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#283A97]/10 text-[#283A97] font-bold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-900">{user.full_name}</p>
                            <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${roleConfig.color}`}>
                          <Shield className="w-3 h-3" />
                          {roleConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className="inline-flex items-center gap-1.5 cursor-pointer"
                          title="Click to toggle active status"
                        >
                          {user.is_active ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span className="text-xs font-medium text-emerald-700">Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-neutral-400" />
                              <span className="text-xs font-medium text-neutral-500">Deactivated</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-xs text-neutral-500">
                        {user.last_login
                          ? new Date(user.last_login).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Never"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setResetModal({ open: true, user });
                              setResetMsg(null);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium rounded-md transition-colors cursor-pointer"
                            title="Reset Password for this user"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Reset Password</span>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add New User Modal */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#283A97]/10 flex items-center justify-center text-[#283A97]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">Add Team Member</h3>
                  <p className="text-xs text-neutral-500">Create an authorized administrative account</p>
                </div>
              </div>
              <button
                onClick={() => setAddModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Ramesh Gor"
                  required
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Corporate Email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. ramesh@aceselect.in"
                  required
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Assigned Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97] bg-white cursor-pointer"
                >
                  <option value="SUPER_ADMIN">Super Administrator (Full Access)</option>
                  <option value="CONTENT_ADMIN">Content Editor (Projects & Media)</option>
                  <option value="PROJECT_MANAGER">Project Manager (Portfolio Updates)</option>
                  <option value="SALES">Sales & Leads (Enquiries)</option>
                  <option value="VIEWER">Viewer (Read Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Initial Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAddModal(false)}
                  className="flex-1 py-2 px-4 border border-neutral-200 text-neutral-700 text-xs font-semibold rounded-lg hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 py-2 px-4 bg-[#283A97] hover:bg-[#1E2D7A] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {createLoading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Reset User Password Modal */}
      {resetModal.open && resetModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">Reset User Password</h3>
                  <p className="text-xs text-neutral-500">{resetModal.user.full_name} ({resetModal.user.email})</p>
                </div>
              </div>
              <button
                onClick={() => setResetModal({ open: false, user: null })}
                className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {resetMsg && (
              <div
                className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-xs ${
                  resetMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {resetMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                )}
                <span>{resetMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Set New Password for User
                </label>
                <input
                  type="password"
                  value={targetNewPwd}
                  onChange={(e) => setTargetNewPwd(e.target.value)}
                  placeholder="Enter new secure password (min 6 chars)"
                  required
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  The user can immediately log in with this new password.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModal({ open: false, user: null })}
                  className="flex-1 py-2 px-4 border border-neutral-200 text-neutral-700 text-xs font-semibold rounded-lg hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 py-2 px-4 bg-[#283A97] hover:bg-[#1E2D7A] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {resetLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
