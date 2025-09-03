import React, { useRef, useEffect, useState } from "react";
import { useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Store,
  LayoutDashboard,
  Package,
  User,
  LogOut,
} from "lucide-react";
import { createNavigationHandler } from "../../utils/navigationIntent";
import { Button } from "../ui";
import { ROLE_CONFIGS } from "../../config/userRoles";

const ProfileInfo = ({ mobile = false }) => {
  const { user, logout } = useAuth();
  const imagePlaceholder =
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Create navigation handler for vendor setup
  const handleVendorSetup = createNavigationHandler(
    navigate,
    user,
    "/vendor-setup"
  );

  const handleProfileClick = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleProfileClick}
          className="flex items-center gap-3 rounded-sm hover:bg-light_bg px-4 py-2 cursor-pointer"
        >
          <img
            src={user.avatar || imagePlaceholder}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="hidden lg:block">
            <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
            <p className="text-gray-500 text-xs">{user.role}</p>
          </div>
          <ChevronDown size={20} />
        </button>

        {showUserDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-sm shadow-lg border border-gray-200 py-2 z-10">
            <a
              href=""
              onClick={() => navigate(ROLE_CONFIGS[user.role].basePath)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </a>
            <a
              href=""
              onClick={() =>
                navigate(`${ROLE_CONFIGS[user.role].basePath}/orders`)
              }
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              <Package size={16} />
              Orders
            </a>
            <a
              href=""
              onClick={() =>
                navigate(`${ROLE_CONFIGS[user.role].basePath}/profile`)
              }
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              <User size={16} />
              My Profile
            </a>
            {user.role !== "vendor" && (
              <>
                <hr className="my-2 text-line_clr" />
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    setShowUserDropdown(false);
                    handleVendorSetup();
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-accent hover:bg-gray-200"
                >
                  <Store size={16} />
                  Become a Vendor
                </a>
              </>
            )}
            <hr className="my-2 text-line_clr" />
            <a
              href=""
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-200"
            >
              <LogOut size={16} />
              Sign Out
            </a>
          </div>
        )}
      </div>
    );
  }
  return (
    <div
      className={`flex ${
        mobile ? "items-start gap-3 flex-col" : "items-center gap-2"
      }`}
    >
      <a href="/login">
        <button
          className={`bg-transparent text-black dark:text-white min-w-fit hover:bg-yellow-100 dark:hover:bg-gray-800 w-[90px] rounded px-2 py-1 ${
            mobile && "text-left"
          }`}
        >
          Login
        </button>
      </a>
      <hr className="w-0 lg:w-[2px] lg:h-8 border-none bg-slate-200 dark:bg-accent"></hr>
      <a href="/register">
        <button
          className={`bg-transparent text-black dark:text-white min-w-fit hover:bg-yellow-100 dark:hover:bg-gray-800 w-[90px] rounded px-2 py-1 ${
            mobile && "text-left"
          }`}
        >
          Join Us
        </button>
      </a>
      <hr className="w-0 lg:w-[2px] lg:h-8 border-none bg-slate-200 dark:bg-accent"></hr>
      <Button
        onClickHandler={handleVendorSetup}
        additionalClasses={`primarybtn min-h-fit ${
          mobile ? "text-left justify-start" : "justify-center"
        }`}
        text="Sell Now"
        leadingIcon={<Store size={16} />}
      />
    </div>
  );
};

export default ProfileInfo;
