import React from "react";
import { X } from "lucide-react";

const ContactModal = ({
  isOpen,
  onClose,
  onAdd,
  contactTypes,
  usedContactTypes = [],
}) => {
  const handleContactTypeSelect = (contactType) => {
    onAdd(contactType);
    onClose();
  };

  // Filter out already used contact types
  const availableContactTypes = contactTypes.filter(
    (contactType) => !usedContactTypes.includes(contactType.label)
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center p-4 z-10"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <div className="bg-white rounded-sm p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Add Contact Information
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-secondary transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-2">
          {availableContactTypes.length > 0 ? (
            availableContactTypes.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleContactTypeSelect(contact)}
                className="w-full text-left px-4 py-3 rounded-sm border border-gray-200 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200"
              >
                {contact.label}
              </button>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                All contact types have been added.
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Remove existing ones to add different types.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
