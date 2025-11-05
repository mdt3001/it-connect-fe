// src/components/common/IconInput.jsx
import React from "react";
const IconInput = ({ icon: Icon, children }) => (
    <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        {children}
    </div>
);
export default IconInput;