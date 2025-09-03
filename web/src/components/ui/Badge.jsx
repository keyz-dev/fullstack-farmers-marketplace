import React from "react";

const Badge = ({ children, variant = "default", className = "", ...props }) => {
  const variantStyles = {
    default: "bg-gray-100 text-gray-800",
    secondary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    primary: "bg-indigo-100 text-indigo-800",
  };

  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variantStyle = variantStyles[variant] || variantStyles.default;

  return (
    <span className={`${baseStyles} ${variantStyle} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
