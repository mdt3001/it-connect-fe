import React from "react";

const Card = ({ title, subtitle, headerAction, className, children }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md ${className}`}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            {title && <h3 className="text-lg font-semibold">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          {headerAction}
        </div>
      )}

      <div className={title ? "px-6 pb-6" : "p-6"}>{children}</div>
    </div>
  );
};

export default Card;
