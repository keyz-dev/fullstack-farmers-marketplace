import React, { useState, useRef, useEffect } from "react";
import { FileText, Download } from "lucide-react";

const PDFViewer = ({ url, currentPage, zoom, rotation, onLoad, onError }) => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const loadPDF = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Try to load PDF.js dynamically
        const pdfjsLib = await import("pdfjs-dist");

        // Use CDN worker to avoid local file issues
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;

        if (mounted) {
          setPdfDoc(pdf);
          setIsLoading(false);
          onLoad?.({ totalPages: pdf.numPages });
        }
      } catch (err) {
        console.error("Error loading PDF:", err);
        if (mounted) {
          setError("Failed to load PDF - CORS or network issue");
          setIsLoading(false);
          onError?.(err);
        }
      }
    };

    loadPDF();

    return () => {
      mounted = false;
    };
  }, [url, onLoad, onError]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const viewport = page.getViewport({ scale: zoom / 100, rotation });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (err) {
        console.error("Error rendering PDF page:", err);
        setError("Failed to render PDF page");
      }
    };

    renderPage();
  }, [pdfDoc, currentPage, zoom, rotation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <FileText size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">{error}</p>
          <button
            onClick={async () => {
              try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("Failed to fetch file");

                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = "document.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Clean up the object URL
                window.URL.revokeObjectURL(blobUrl);
              } catch (error) {
                console.error("Download failed:", error);
                // Fallback: open in new tab
                window.open(url, "_blank");
              }
            }}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto bg-gray-100">
      <div className="flex justify-center p-4">
        <canvas
          ref={canvasRef}
          className="shadow-lg"
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </div>
    </div>
  );
};

export default PDFViewer;
