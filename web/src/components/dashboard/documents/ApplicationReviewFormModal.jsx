import React, { useState } from "react";
import {
  X,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Download,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import {
  Button,
  FadeInContainer,
  ModalWrapper,
  DocumentPreview,
  TextArea,
} from "../../ui";
import { vendorAppApi } from "../../../api/vendorApp";
import { toast } from "react-toastify";
import { DocumentReviewCard } from "./index";

const ApplicationReviewFormModal = ({
  application,
  action, // "approve" or "reject"
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [formData, setFormData] = useState({
    remarks: "",
    documentReviews: [],
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDocumentReview = (documentId, isApproved, remarks) => {
    setFormData((prev) => {
      const existing = prev.documentReviews.find(
        (doc) => doc.documentId === documentId
      );
      const updated = existing
        ? prev.documentReviews.map((doc) =>
            doc.documentId === documentId
              ? { ...doc, isApproved, remarks }
              : doc
          )
        : [...prev.documentReviews, { documentId, isApproved, remarks }];

      return {
        ...prev,
        documentReviews: updated,
      };
    });
  };

  const handleSubmit = async () => {
    if (action === "reject" && !formData.remarks.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setLoading(true);
    try {
      const reviewData = {
        status: action === "approve" ? "approved" : "rejected",
        remarks: formData.remarks,
        ...(action === "reject" && {
          rejectionReason: formData.remarks,
        }),
        ...(formData.documentReviews.length > 0 && {
          documentReviews: formData.documentReviews,
        }),
      };

      await vendorAppApi.reviewVendorApplication(application._id, reviewData);

      toast.success(`Application ${action}d successfully`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Review submission failed:", error);
      toast.error(
        error.response?.data?.message || `Failed to ${action} application`
      );
    } finally {
      setLoading(false);
    }
  };

  const getActionConfig = () => {
    if (action === "approve") {
      return {
        title: "Approve Application",
        icon: CheckCircle,
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-800",
        buttonColor: "bg-green-600 hover:bg-green-700",
        iconColor: "text-green-600",
      };
    } else {
      return {
        title: "Reject Application",
        icon: XCircle,
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-800",
        buttonColor: "bg-red-600 hover:bg-red-700",
        iconColor: "text-red-600",
      };
    }
  };

  const config = getActionConfig();
  const Icon = config.icon;

  // Check if submit button should be disabled
  const isSubmitDisabled =
    loading || (action === "reject" && !formData.remarks.trim());

  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <div className="w-full max-w-2xl min-w-sm lg:min-w-lg mx-auto max-h-[90vh] flex flex-col p-2 lg:py-4">
        {/* Header - Fixed */}
        <div
          className={`${config.bgColor} ${config.borderColor} border-b px-6 py-4 flex-shrink-0`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon size={24} className={config.iconColor} />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {config.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {application?.businessName} • {application?.businessType}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <FadeInContainer delay={200} duration={600}>
            <div className="space-y-6">
              {/* Remarks Field - Dynamic based on action */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {action === "approve"
                    ? "General Remarks"
                    : "Rejection Reason"}
                  {action === "reject" && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <TextArea
                  value={formData.remarks}
                  onChangeHandler={(e) =>
                    handleInputChange("remarks", e.target.value)
                  }
                  placeholder={
                    action === "approve"
                      ? "Provide any additional feedback or instructions for the new vendor (optional)..."
                      : "Please provide a clear reason for rejecting this application..."
                  }
                  additionalClasses={` ${
                    action === "reject" && !formData.remarks.trim()
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-line_clr"
                  }`}
                  error={
                    action === "reject" && !formData.remarks.trim()
                      ? "Rejection reason is required"
                      : ""
                  }
                  rows={3}
                  required={action === "reject"}
                />
              </div>

              {/* Document Reviews */}
              {application?.documents && application.documents.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Document Reviews
                  </label>
                  <div className="space-y-4">
                    {application.documents.map((document, index) => (
                      <DocumentReviewCard
                        key={index}
                        document={document}
                        action={action}
                        formData={formData}
                        onDocumentReview={handleDocumentReview}
                        onPreview={setPreviewDocument}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Warning for rejections */}
              {action === "reject" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Important
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    Rejecting this application will prevent the user from
                    becoming a vendor. They will need to submit a new
                    application if they wish to try again.
                  </p>
                </div>
              )}
            </div>
          </FadeInContainer>
        </div>

        {/* Fixed Action Buttons */}
        <div className="flex gap-3 p-6 border-t border-gray-200 flex-shrink-0">
          <Button
            onClickHandler={onClose}
            additionalClasses="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
            isDisabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClickHandler={handleSubmit}
            additionalClasses={`flex-1 ${
              isSubmitDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : config.buttonColor
            } text-white`}
            isDisabled={isSubmitDisabled}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {action === "approve" ? "Approving..." : "Rejecting..."}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Icon size={16} />
                {action === "approve"
                  ? "Approve Application"
                  : "Reject Application"}
              </div>
            )}
          </Button>
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

export default ApplicationReviewFormModal;
