"use client";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { AuthInputField } from "@/app/(auth)/components/AuthInputField";
import { useRouter } from "next/navigation";
import Link from "next/link";

const FormSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormSchemaType = z.infer<typeof FormSchema>;

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    try {
      const res = await await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Failed to create user");
      }
      toast.success("User created!");
      router.push("/signin");
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to create user");
    }
  };

  return (
    <main>
      <form className="auth-container" onSubmit={handleSubmit(onSubmit)}>
        <div className="auth-content">
          <p className=" text-center text-lg text-gray-700">Enter your details</p>
          <AuthInputField
            name="name"
            register={register}
            errors={errors}
            placeholder={"Name"}
          />
          <AuthInputField
            name="email"
            register={register}
            errors={errors}
            placeholder={"Email"}
          />
          <AuthInputField
            name="password"
            register={register}
            errors={errors}
            placeholder={"Password"}
          />
          <AuthInputField
            name="confirmPassword"
            register={register}
            errors={errors}
            placeholder={"Confirm password"}
          />
          <button className="auth-button type:submit" disabled={isSubmitting}>
            SingUp
          </button>

          <div className="flex flex-row justify-center">
            <p className="mr-2 text-gray-700">Already registered?</p>
            <p className="text-green-700 hover:text-green-800 cursor-pointer">
              <Link href={"/signin"}>SignIn</Link>
            </p>
          </div>
        </div>
      </form>
    </main>
  );
}
