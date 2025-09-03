import React, { useState } from "react";
import {
  X,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Eye,
} from "lucide-react";
import {
  StatusPill,
  FadeInContainer,
  ModalWrapper,
  DocumentCard,
  DocumentPreview,
} from "../../ui";
import { formatDate } from "../../../utils/dateUtils";

const ApplicationDetailModal = ({ application, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [previewDocument, setPreviewDocument] = useState(null);

  if (!application) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  const getContactInfo = (type) => {
    return (
      application.contactInfo?.find((contact) => contact.type === type)
        ?.value || "Not provided"
    );
  };

  const getDocumentStatus = (document) => {
    if (document.isApproved === true) return "approved";
    if (document.isApproved === false) return "rejected";
    return "pending";
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <div className="w-full max-w-2xl min-w-sm lg:min-w-lg mx-auto max-h-[90vh] flex flex-col p-2 lg:py-4">
        {/* Header - Fixed */}
        <div className="bg-light_bg px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Vendor Application Review
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {application.businessName} • {application.businessType}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusPill status={application.status} />
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs - Fixed */}
        <div className="border-b border-gray-200 flex-shrink-0">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-accent text-accent"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {activeTab === "overview" && (
            <FadeInContainer delay={200} duration={600}>
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Business Name
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {application.businessName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Business Type
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {application.businessType}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {application.businessDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {getContactInfo("phone")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {getContactInfo("business_email")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {getContactInfo("website") || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Business Address
                  </h4>
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                    <div className="text-sm text-gray-900">
                      {application.businessAddress?.streetAddress}
                      <br />
                      {application.businessAddress?.city},{" "}
                      {application.businessAddress?.state}
                      <br />
                      {application.businessAddress?.country}{" "}
                      {application.businessAddress?.postalCode}
                    </div>
                  </div>
                </div>

                {/* Application Timeline */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Application Timeline
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-900">
                        Submitted: {formatDate(application.submittedAt)}
                      </span>
                    </div>
                    {application.approvedAt && (
                      <div className="flex items-center gap-3">
                        <CheckCircle size={16} className="text-green-500" />
                        <span className="text-sm text-gray-900">
                          Approved: {formatDate(application.approvedAt)}
                        </span>
                      </div>
                    )}
                    {application.rejectedAt && (
                      <div className="flex items-center gap-3">
                        <XCircle size={16} className="text-red-500" />
                        <span className="text-sm text-gray-900">
                          Rejected: {formatDate(application.rejectedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Review History */}
                {application.adminReview && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Previous Review
                    </h4>
                    <div className="bg-gray-50 rounded-sm p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          Reviewed by:{" "}
                          {application.adminReview.reviewedBy?.name || "Admin"}
                        </span>
                      </div>
                      {application.adminReview.remarks && (
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Remarks:</strong>{" "}
                          {application.adminReview.remarks}
                        </p>
                      )}
                      {application.adminReview.rejectionReason && (
                        <p className="text-sm text-red-700">
                          <strong>Rejection Reason:</strong>{" "}
                          {application.adminReview.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </FadeInContainer>
          )}

          {activeTab === "documents" && (
            <FadeInContainer delay={200} duration={600}>
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Uploaded Documents
                </h4>

                {application.documents && application.documents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {application.documents.map((document, index) => (
                      <DocumentCard
                        key={index}
                        document={document}
                        status={getDocumentStatus(document)}
                        onPreview={setPreviewDocument}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText
                      size={48}
                      className="mx-auto mb-4 text-gray-300"
                    />
                    <p>No documents uploaded</p>
                  </div>
                )}
              </div>
            </FadeInContainer>
          )}
        </div>
      </div>

      {/* Document Preview Modal */}
      <DocumentPreview
        document={previewDocument}
        isOpen={!!previewDocument}
        onClose={() => setPreviewDocument(null)}
      />
    </ModalWrapper>
  );
};

export default ApplicationDetailModal;
