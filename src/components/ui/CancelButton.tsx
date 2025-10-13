import React from 'react';

// Define the props the button will accept
interface CancelButtonProps {
  onClick: () => void; // A function to call when clicked
  children?: React.ReactNode; // Optional custom text, defaults to "Cancel"
}

const CancelButton: React.FC<CancelButtonProps> = ({ onClick, children }) => {
  return (
    <button
      // Crucially, type="button" prevents the form from being submitted
      type="button" 
      onClick={onClick}
      className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
    >
      {children || 'Cancel'}
    </button>
  );
};

export default CancelButton;