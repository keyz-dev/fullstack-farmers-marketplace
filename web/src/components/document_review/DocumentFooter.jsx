import React from "react";

const DocumentFooter = () => {
  return (
    <div className="p-3 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>← → Navigate pages</span>
          <span>+ - Zoom in/out</span>
          <span>0 Reset zoom</span>
          <span>R Rotate</span>
          <span>F Fullscreen</span>
        </div>
        <span>ESC Close</span>
      </div>
    </div>
  );
};

export default DocumentFooter;
