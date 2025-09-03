export const USER_ROLES = {
  ADMIN: "admin",
  DELIVERY_AGENT: "delivery_agent",
  CLIENT: "client",
  FARMER: "farmer",
};

export const ROLE_CONFIGS = {
  [USER_ROLES.ADMIN]: {
    basePath: "/admin",
    displayName: "Administrator",
    navItems: [
      { path: "", label: "Overview", icon: "LayoutDashboard" },
      {
        path: "user-applications",
        label: "User Applications",
        icon: "FileClock",
      },
      { path: "orders", label: "All Orders", icon: "ShoppingCart" },
      { path: "categories", label: "Categories", icon: "FolderOpen" },
      { path: "products", label: "All Products", icon: "Package" },
      { path: "users", label: "All Users", icon: "Users" },
      { path: "notifications", label: "Notifications", icon: "Bell" },
      { path: "profile", label: "My Profile", icon: "User" },
      { path: "settings", label: "App Settings", icon: "Settings" },
    ],
  },

  [USER_ROLES.FARMER]: {
    basePath: "/farmer",
    displayName: "Farmer",
    navItems: [
      { path: "", label: "Overview", icon: "LayoutDashboard" },
      { path: "home", label: "Home", icon: "Home" },
      { path: "orders", label: "Orders", icon: "ShoppingCart" },
      { path: "products", label: "My Products", icon: "Package" },
      { path: "posts", label: "My Posts", icon: "PenTool" },
      { path: "notifications", label: "My Notifications", icon: "Bell" },
      { path: "profile", label: "My Profile", icon: "User" },
      { path: "settings", label: "Settings", icon: "Settings" },
    ],
  },

  [USER_ROLES.DELIVERY_AGENT]: {
    basePath: "/delivery-agent",
    displayName: "Delivery_agent",
    navItems: [{ path: "", label: "Overview", icon: "LayoutDashboard" }],
  },

  [USER_ROLES.CLIENT]: {
    basePath: "/client",
    displayName: "Client",
    navItems: [
      { path: "", label: "Overview", icon: "LayoutDashboard" },
      { path: "home", label: "Home", icon: "Home" },
      {
        path: "book-appointment",
        label: "Book Appointment",
        icon: "CalendarPlus",
      },
      { path: "orders", label: "Orders", icon: "ShoppingBag" },
      { path: "profile", label: "My Profile", icon: "User" },
      {
        path: "farmer-application",
        label: "Farmer Application",
        icon: "FilePlus",
      },
      { path: "settings", label: "Settings", icon: "Settings" },
      { path: "notifications", label: "Notifications", icon: "Bell" },
    ],
  },
};
