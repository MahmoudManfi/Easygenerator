import React from "react";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface FormInputProps {
  id: string;
  type: string;
  label: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  placeholder: string;
  hint?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  type,
  label,
  register,
  error,
  placeholder,
  hint,
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        {...register}
        className={error ? "error" : ""}
        placeholder={placeholder}
      />
      {error && <span className="error-message">{error.message}</span>}
      {hint && !error && <div className="password-hint">{hint}</div>}
    </div>
  );
};

export default FormInput;
