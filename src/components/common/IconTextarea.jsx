// src/components/common/IconTextarea.jsx
import React from "react";
const IconTextarea = ({ icon: Icon, ...props }) => (
    <div className="relative">
        <Icon className="absolute left-3 top-3 text-gray-400" size={18} />
        <textarea className="w-full border border-gray-300 rounded pl-10 pr-3 py-2 h-28" {...props} />
    </div>
);
export default IconTextarea;