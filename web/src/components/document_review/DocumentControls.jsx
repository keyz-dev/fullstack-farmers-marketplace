import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
} from "lucide-react";

const DocumentControls = ({
  isDocument,
  isImage,
  currentPage,
  totalPages,
  zoom,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onRotateLeft,
  onRotateRight,
}) => {
  if (!isDocument && !isImage) return null;

  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        {/* Page Navigation for Documents */}
        {isDocument && totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage <= 1}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                onPageChange(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage >= totalPages}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Zoom Controls */}
        <button
          onClick={onZoomOut}
          className="p-1 text-gray-400 hover:text-gray-600"
          title="Zoom out"
        >
          <ZoomOut size={16} />
        </button>
        <span className="text-sm text-gray-600 min-w-[60px] text-center">
          {zoom}%
        </span>
        <button
          onClick={onZoomIn}
          className="p-1 text-gray-400 hover:text-gray-600"
          title="Zoom in"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={onZoomReset}
          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 rounded"
          title="Reset zoom"
        >
          Reset
        </button>

        {/* Rotation Controls */}
        <button
          onClick={onRotateLeft}
          className="p-1 text-gray-400 hover:text-gray-600"
          title="Rotate left"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={onRotateRight}
          className="p-1 text-gray-400 hover:text-gray-600"
          title="Rotate right"
        >
          <RotateCw size={16} />
        </button>
      </div>
    </div>
  );
};

export default DocumentControls;
