export const validateEmail = (email) => {
  if (!email.trim()) return "Email không được để trống";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Email không hợp lệ";
  return "";
};

export const validatePassword = (password) => {
  if (!password.trim()) return "Mật khẩu không được để trống";
  if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
  if (!/[A-Z]/.test(password))
    return "Mật khẩu phải có ít nhất 1 chữ cái viết hoa";
  if (!/[0-9]/.test(password)) return "Mật khẩu phải có ít nhất 1 chữ số";
  if (!/[!@#$%^&*]/.test(password))
    return "Mật khẩu phải có ít nhất 1 ký tự đặc biệt";
  if (password.includes(" ")) return "Mật khẩu không được chứa khoảng trắng";

  return "";
};

export const validateAvatar = (file) => {
  if (!file) return "";
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.type))
    return "Chỉ chấp nhận file ảnh định dạng jpg, jpeg, png";
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSizeInBytes)
    return "Kích thước file không được vượt quá 5MB";
  return "";
};

export const getInitials = (name) => {
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
};