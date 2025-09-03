import React from "react";
import {
  Download,
  Maximize,
  Minimize,
  X,
  File,
  Calendar,
  HardDrive,
  User,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

const DocumentHeader = ({
  documentData,
  isFullscreen,
  onFullscreen,
  onClose,
}) => {
  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDocumentIcon = () => {
    const isImage =
      documentData?.fileType?.startsWith("image/") ||
      documentData?.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
      documentData?.type?.startsWith("image/");

    const isPDF =
      documentData?.fileType === "application/pdf" ||
      documentData?.url?.toLowerCase().includes(".pdf") ||
      documentData?.name?.toLowerCase().includes(".pdf");

    if (isImage) return <ImageIcon size={20} className="text-blue-500" />;
    if (isPDF) return <FileText size={20} className="text-red-500" />;
    return <File size={20} className="text-gray-500" />;
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    if (documentData?.url) {
      try {
        // Check if it's a Cloudinary URL
        const isCloudinaryURL = documentData.url.includes("cloudinary.com");

        if (isCloudinaryURL) {
          // For Cloudinary URLs, fetch the file first
          const response = await fetch(documentData.url);
          if (!response.ok) throw new Error("Failed to fetch file");

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download =
            documentData.documentName ||
            documentData.originalName ||
            documentData.name ||
            "document";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up the object URL
          window.URL.revokeObjectURL(url);
          console.log("Download initiated for:", documentData.url);
        } else {
          // For non-Cloudinary URLs, use a more reliable download method
          const response = await fetch(documentData.url);
          if (!response.ok) throw new Error("Failed to fetch file");

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download =
            documentData.documentName ||
            documentData.originalName ||
            documentData.name ||
            "document";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up the object URL
          window.URL.revokeObjectURL(url);
          console.log("Download initiated for:", documentData.url);
        }
      } catch (error) {
        console.error("Download failed:", error);
        // Fallback: open in new tab
        window.open(documentData.url, "_blank");
      }
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {getDocumentIcon()}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {documentData.documentName ||
              documentData.originalName ||
              documentData.name}
          </h3>
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <File size={12} />
              {documentData.fileType || "Unknown type"}
            </span>
            {documentData.size && (
              <span className="flex items-center gap-1">
                <HardDrive size={12} />
                {formatFileSize(documentData.size)}
              </span>
            )}
            {documentData.uploadedAt && (
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(documentData.uploadedAt)}
              </span>
            )}
            {documentData.uploadedBy && (
              <span className="flex items-center gap-1">
                <User size={12} />
                {documentData.uploadedBy}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {documentData.url && (
          <button
            onClick={handleDownload}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Download"
          >
            <Download size={20} />
          </button>
        )}
        <button
          onClick={onFullscreen}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default DocumentHeader;
