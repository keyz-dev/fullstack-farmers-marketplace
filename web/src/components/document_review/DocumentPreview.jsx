import React, { useState, useRef, useEffect } from "react";
import DocumentHeader from "./DocumentHeader";
import DocumentControls from "./DocumentControls";
import DocumentContent from "./DocumentContent";
import DocumentFooter from "./DocumentFooter";

const DocumentPreview = ({ document: documentData, isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);

  const isImage =
    documentData?.fileType?.startsWith("image/") ||
    documentData?.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
    documentData?.type?.startsWith("image/");

  const isPDF =
    documentData?.fileType === "application/pdf" ||
    documentData?.url?.toLowerCase().includes(".pdf") ||
    documentData?.name?.toLowerCase().includes(".pdf");

  const isDocument =
    isPDF ||
    documentData?.fileType?.includes("document") ||
    documentData?.url?.match(/\.(doc|docx|xls|xlsx|ppt|pptx|txt)$/i);

  // Check if URL is from Cloudinary
  const isCloudinaryURL = documentData?.url?.includes("cloudinary.com");

  // Reset state when document changes
  useEffect(() => {
    if (documentData) {
      setCurrentPage(1);
      setZoom(100);
      setRotation(0);
      setIsLoading(true);
      setError(null);
    }
  }, [documentData]);

  // Handle fullscreen
  useEffect(() => {
    if (typeof document !== "undefined" && document) {
      if (isFullscreen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }

      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isFullscreen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (typeof document === "undefined" || !document) return;

    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          if (isFullscreen) {
            setIsFullscreen(false);
          } else {
            onClose();
          }
          break;
        case "ArrowLeft":
          if (isDocument && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
          }
          break;
        case "ArrowRight":
          if (isDocument && currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
          }
          break;
        case "+":
        case "=":
          e.preventDefault();
          setZoom((prev) => Math.min(prev + 25, 300));
          break;
        case "-":
          e.preventDefault();
          setZoom((prev) => Math.max(prev - 25, 25));
          break;
        case "0":
          setZoom(100);
          break;
        case "r":
          setRotation((prev) => (prev + 90) % 360);
          break;
        case "f":
          setIsFullscreen((prev) => !prev);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isFullscreen, currentPage, totalPages, isDocument, onClose]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 300));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 25));
  const handleZoomReset = () => setZoom(100);
  const handleRotateRight = () => setRotation((prev) => (prev + 90) % 360);
  const handleRotateLeft = () => setRotation((prev) => (prev - 90 + 360) % 360);
  const handleFullscreen = () => setIsFullscreen((prev) => !prev);

  const handlePDFLoad = (data) => {
    setIsLoading(false);
    setTotalPages(data.totalPages);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError("Failed to load document");
  };

  // Add timeout for PDF loading
  useEffect(() => {
    if (isPDF && isLoading) {
      const timeout = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          setError("PDF preview timed out. Please download to view.");
        }
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }
  }, [isPDF, isLoading]);

  if (!isOpen || !documentData) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 ${
        isFullscreen ? "p-0" : ""
      }`}
    >
      <div
        ref={containerRef}
        className={`bg-white rounded-sm overflow-hidden flex flex-col ${
          isFullscreen
            ? "w-full h-full rounded-none"
            : "max-w-4xl h-[70vh]  w-full"
        }`}
      >
        <DocumentHeader
          documentData={documentData}
          isFullscreen={isFullscreen}
          onFullscreen={handleFullscreen}
          onClose={onClose}
        />

        <DocumentControls
          isDocument={isDocument}
          isImage={isImage}
          currentPage={currentPage}
          totalPages={totalPages}
          zoom={zoom}
          onPageChange={setCurrentPage}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
          onRotateLeft={handleRotateLeft}
          onRotateRight={handleRotateRight}
        />

        <DocumentContent
          documentData={documentData}
          isImage={isImage}
          isPDF={isPDF}
          isDocument={isDocument}
          isCloudinaryURL={isCloudinaryURL}
          currentPage={currentPage}
          zoom={zoom}
          rotation={rotation}
          isLoading={isLoading}
          error={error}
          onPDFLoad={handlePDFLoad}
          onIframeLoad={handleIframeLoad}
          onIframeError={handleIframeError}
          onError={setError}
          onLoading={setIsLoading}
        />

        <DocumentFooter />
      </div>
    </div>
  );
};

export default DocumentPreview;
