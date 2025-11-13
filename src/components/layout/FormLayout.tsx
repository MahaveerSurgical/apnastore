import React, { useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CancelButton from "../ui/CancelButton";
import PrimaryButton from "../ui/PrimaryButton";

interface FormLayoutProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
  saveText?: string;
  onSave?: () => void;
}

export default function FormLayout({
  title,
  children,
  onClose,
  footer,
  saveText = "Save",
  onSave,
}: FormLayoutProps) {
  // ref to check if there is a form inside children
  const formRef = useRef<HTMLFormElement | null>(null);

useEffect(() => {
  const wrapper = document.querySelector(".form-layout");
  if (wrapper) {
    const formEl = wrapper.querySelector("form");
    if (formEl) formRef.current = formEl as HTMLFormElement;
  }
}, [children]);

  return (
    <div className="form-layout w-full max-w-lg mx-auto bg-white shadow-lg rounded-2xl flex flex-col overflow-hidden max-h-[90vh]">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-100 px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <button
          onClick={onClose}
          aria-label="Close form"
          className="p-1 rounded-md hover:bg-gray-200 transition-colors"
        >
          <XMarkIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">{children}</div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex justify-end gap-2">
        {footer ? (
          footer
        ) : (
          <>
            <CancelButton onClick={onClose} />
            {/** 
             * If there's a form inside, trigger its submit event when clicking Save 
             * otherwise directly call onSave
             */}
            <PrimaryButton
              type="button"
              variant="primary"
              onClick={() => {
              console.log("✅ Save button clicked");
              if (formRef.current) {
              console.log("Submitting form via requestSubmit()", formRef.current);
              formRef.current.requestSubmit();
              } else if (onSave) {
                  console.log("No form found, calling onSave directly");
                  onSave();
              } else {
      console.log("❌ No onSave or form found");
    }
  }}
>
  {saveText}
</PrimaryButton>
          </>
        )}
      </div>
    </div>
  );
}