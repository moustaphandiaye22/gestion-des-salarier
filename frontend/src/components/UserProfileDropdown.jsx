import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { UserCircleIcon, ChevronDownIcon, ChevronUpIcon, KeyIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function UserProfileDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "" });
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      setForm({ email: user.email || "" });
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex justify-center items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-surface-700 focus:outline-none"
      >
        <UserCircleIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <span>{user?.email}</span>
        {open ? (
          <ChevronUpIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-lg bg-white dark:bg-surface-800 shadow-xl ring-1 ring-black dark:ring-surface-700 ring-opacity-5 focus:outline-none overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <UserCircleIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Mon profil</h3>
                <p className="text-xs text-primary-100">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-gray-50 dark:bg-surface-700 text-gray-600 dark:text-gray-300"
                  disabled
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Link
                to="/change-password"
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-700 rounded-md transition-colors"
                onClick={() => setOpen(false)}
              >
                <KeyIcon className="w-4 h-4" />
                Modifier mot de passe
              </Link>

              <hr className="border-gray-200 dark:border-surface-600" />

              <button
                onClick={logout}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
