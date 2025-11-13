import React from 'react';

// Define the props the button will accept
interface CancelButtonProps {
  onClick: () => void; // A function to call when clicked
  children?: React.ReactNode; // Optional custom text, defaults to "Cancel"
  disabled?: boolean; // Optional disabled state
}

const CancelButton: React.FC<CancelButtonProps> = ({ onClick, children, disabled }) => {
  return (
    <button
      // Crucially, type="button" prevents the form from being submitted
      type="button" 
      onClick={onClick}
      disabled={disabled}
      className={`bg-gray-200 text-gray-800 px-4 py-2 rounded transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'
      }`}
    >
      {children || 'Cancel'}
    </button>
  );
};

export default CancelButton;