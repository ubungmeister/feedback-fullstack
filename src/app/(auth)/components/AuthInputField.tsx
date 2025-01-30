/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldErrors, UseFormRegister } from "react-hook-form";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FieldProps = {
  name: keyof FormData;
  register: UseFormRegister<any>;
  errors: FieldErrors<FormData>;
  placeholder?: string;
};

export const AuthInputField = ({
  name,
  register,
  errors,
  placeholder,
}: FieldProps) => {
  return (
    <div className="relative">
      <input
        className="auth-input"
        {...register(name)}
        placeholder={placeholder}
      />
      {errors && (
        <p className={`${errors[name]?.message && "auth-error"}`}>
          {errors[name]?.message}
        </p>
      )}
    </div>
  );
};
