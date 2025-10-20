// src/components/ui/PrimaryButton.tsx
import React from "react";

// Define allowed button styles (variants)
type Variant = "primary" | "success" | "warning" | "danger";

// Props for the button
interface PrimaryButtonProps {
  type?: "button" | "submit";   // Defines HTML button behavior
  onClick?: () => void;         // Optional click handler
  children: React.ReactNode;    // Text inside the button (e.g., "Save")
  variant?: Variant;            // For color styling
  loading?: boolean;            // To show a loading spinner
  disabled?: boolean;           // To disable button manually
  className?: string;          // Additional custom classes
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  type = "button",
  onClick,
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
}) => {
  // Define color classes based on variant
  const baseClasses =
    "px-4 py-2 rounded text-white transition-colors focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700",
    success: "bg-green-600 hover:bg-green-700",
    warning: "bg-yellow-500 hover:bg-yellow-600",
    danger: "bg-red-600 hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`${baseClasses} ${variantClasses[variant]}${className}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default PrimaryButton;