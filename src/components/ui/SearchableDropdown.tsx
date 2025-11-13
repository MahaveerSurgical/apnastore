import React, { useState, useRef, useEffect } from 'react';

interface Option {
  id: string;
  label: string;
}

interface SearchableDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export default function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  required = false
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(opt => opt.id === value);
  
  // Filter options based on search text
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchText.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Reset search text to selected value when closing
        setSearchText(selectedOption?.label || '');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedOption]);

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true);
  };

  // Handle option selection
  const handleSelect = (option: Option) => {
    onChange(option.id);
    setSearchText(option.label);
    setIsOpen(false);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setIsOpen(true);
    if (!e.target.value) {
      onChange('');
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <input
        type="text"
        className={`w-full px-3 py-2 border rounded ${className}`}
        value={searchText}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        required={required}
      />
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.id}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500">No options found</div>
          )}
        </div>
      )}
    </div>
  );
}