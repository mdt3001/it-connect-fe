// src/components/common/IconSelect.jsx
import React from "react";
const IconSelect = ({ icon: Icon, ...props }) => (
    <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <select className="w-full border border-gray-300 rounded pl-10 pr-8 py-2 bg-white" {...props} />
    </div>
);
export default IconSelect;