import React from "react";

const Card = ({ className, children }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md ${className}`}
    >
      <div className={"p-6"}>{children}</div>
    </div>
  );
};

export default Card;
