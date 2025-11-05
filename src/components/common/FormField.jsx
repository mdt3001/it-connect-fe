// src/components/common/FormField.jsx
import React from "react";
const FormField = ({ label, error, children, className = "" }) => (
    <div className={className}>
        <label className="block text-sm mb-1">{label}</label>
        {children}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);
export default FormField;