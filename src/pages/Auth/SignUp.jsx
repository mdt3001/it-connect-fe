import React from 'react'
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  Loader,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useState } from 'react';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
    avatar: null,
  });

  const [formState, setFormState] = useState({
    loading: false,
    error: null,
    success: null,
    showPassword: false,
    avatarPreview: null,
  });

  return (
    <div>SignUp</div>
  )
}

export default SignUp