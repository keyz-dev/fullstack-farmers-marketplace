import { Eye, Download, FileText } from "lucide-react";
import PDFPlaceholder from "../../../assets/icons/pdf.png";
import { TextArea } from "../../ui";

// Document Review Card Component
const DocumentReviewCard = ({
  document,
  action,
  formData,
  onDocumentReview,
  onPreview,
}) => {
  const isImage =
    document.fileType?.startsWith("image/") ||
    document.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const currentReview = formData.documentReviews.find(
    (doc) => doc.documentId === (document._id || document.documentName)
  );

  // Check if document URL is accessible (basic check)
  const isUrlAccessible = document.url && !document.url.includes("404");

  return (
    <div className="border border-line_clr rounded-xs p-4">
      <div className="flex items-start gap-4">
        {/* Document Preview */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-100 rounded-xs overflow-hidden flex items-center justify-center">
            {isImage ? (
              <img
                src={document.url}
                alt={document.documentName || document.originalName}
                className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onPreview(document)}
              />
            ) : (
              <img
                src={PDFPlaceholder}
                alt="PDF"
                className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
              />
            )}
          </div>
        </div>

        {/* Document Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {document.documentName || document.originalName}
                </h4>
                {!isUrlAccessible && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Not Accessible
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {document.fileType} • {(document.size / 1024 / 1024).toFixed(2)}{" "}
                MB
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => onPreview(document)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Preview document"
              >
                <Eye size={16} />
              </button>
              <button
                onClick={async () => {
                  try {
                    // Check if it's a Cloudinary URL
                    const isCloudinaryURL =
                      document.url.includes("cloudinary.com");

                    if (isCloudinaryURL) {
                      // For Cloudinary URLs, fetch the file first
                      const response = await fetch(document.url);
                      if (!response.ok) throw new Error("Failed to fetch file");

                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);

                      const link = document.createElement("a");
                      link.href = url;
                      link.download =
                        document.documentName ||
                        document.originalName ||
                        document.name ||
                        "document";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);

                      // Clean up the object URL
                      window.URL.revokeObjectURL(url);
                      console.log("Download initiated for:", document.url);
                    } else {
                      // For non-Cloudinary URLs, try direct download
                      const link = document.createElement("a");
                      link.href = document.url;
                      link.download =
                        document.documentName ||
                        document.originalName ||
                        document.name ||
                        "document";
                      link.setAttribute("download", ""); // Force download attribute
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      console.log("Download initiated for:", document.url);
                    }
                  } catch (error) {
                    console.error("Download failed:", error);
                    // Fallback: open in new tab
                    window.open(document.url, "_blank");
                  }
                }}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Download document"
              >
                <Download size={16} />
              </button>
              <button
                onClick={() => window.open(document.url, "_blank")}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Open in new tab"
              >
                <FileText size={16} />
              </button>
            </div>
          </div>

          {/* Document Review Actions */}
          <div className="flex gap-2 mb-3">
            {!isUrlAccessible && (
              <div className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                ⚠️ Document not accessible - review with caution
              </div>
            )}
            {action === "approve" ? (
              // For approval, only show approve button
              <button
                onClick={() =>
                  onDocumentReview(
                    document._id || document.documentName,
                    true,
                    currentReview?.remarks || ""
                  )
                }
                disabled={!isUrlAccessible}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  currentReview?.isApproved === true
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : !isUrlAccessible
                    ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                    : "bg-gray-100 text-gray-600 hover:bg-green-50 border border-gray-200"
                }`}
              >
                ✓ Approve
              </button>
            ) : (
              // For rejection, show both approve and reject
              <>
                <button
                  onClick={() =>
                    onDocumentReview(
                      document._id || document.documentName,
                      true,
                      currentReview?.remarks || ""
                    )
                  }
                  disabled={!isUrlAccessible}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    currentReview?.isApproved === true
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : !isUrlAccessible
                      ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                      : "bg-gray-100 text-gray-600 hover:bg-green-50 border border-gray-200"
                  }`}
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    onDocumentReview(
                      document._id || document.documentName,
                      false,
                      currentReview?.remarks || ""
                    )
                  }
                  disabled={!isUrlAccessible}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    currentReview?.isApproved === false
                      ? "bg-red-100 text-red-800 border border-red-200"
                      : !isUrlAccessible
                      ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                      : "bg-gray-100 text-gray-600 hover:bg-red-50 border border-gray-200"
                  }`}
                >
                  Reject
                </button>
              </>
            )}
          </div>

          {/* Review Notes */}
          {currentReview && (
            <TextArea
              value={currentReview.remarks || ""}
              onChangeHandler={(e) =>
                onDocumentReview(
                  document._id || document.documentName,
                  currentReview.isApproved,
                  e.target.value
                )
              }
              placeholder="Add notes about this document (optional)..."
              additionalClasses="text-xs text-secondary border-line_clr"
              rows={2}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentReviewCard;
