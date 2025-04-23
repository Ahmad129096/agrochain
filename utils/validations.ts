export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

export const validateName = (name: string): boolean => {
  return name.length >= 2 && /^[a-zA-Z\s]*$/.test(name);
};

export const validateLocation = (location: string): boolean => {
  return location.length >= 3;
};

export const validateCropName = (name: string): boolean => {
  return name.length >= 2;
};

export const validateQuantity = (quantity: string): boolean => {
  const num = parseFloat(quantity);
  return !isNaN(num) && num > 0;
};

export const validatePrice = (price: string): boolean => {
  const num = parseFloat(price);
  return !isNaN(num) && num > 0;
};

export const getValidationMessage = (field: string, value: string): string => {
  switch (field) {
    case "email":
      return !validateEmail(value) ? "Please enter a valid email address" : "";
    case "password":
      return !validatePassword(value)
        ? "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number"
        : "";
    case "name":
      return !validateName(value)
        ? "Name must be at least 2 characters and contain only letters"
        : "";
    case "location":
      return !validateLocation(value)
        ? "Location must be at least 3 characters"
        : "";
    case "cropName":
      return !validateCropName(value)
        ? "Crop name must be at least 2 characters"
        : "";
    case "quantity":
      return !validateQuantity(value)
        ? "Quantity must be a positive number"
        : "";
    case "price":
      return !validatePrice(value) ? "Price must be a positive number" : "";
    default:
      return "";
  }
};
