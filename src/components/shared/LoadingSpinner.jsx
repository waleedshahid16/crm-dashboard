import React from "react";

const LoadingSpinner = ({ size = "md", text = "Loading..." }) => {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[200px]">
      <div
        className={`${sizes[size]} border-blue-200 border-t-blue-500 rounded-full animate-spin`}
      />
      {text && <p className="mt-3 text-sm text-[#2f362f]">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
