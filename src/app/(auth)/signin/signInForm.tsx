"use client";

import React from "react";
import { AuthInputField } from "@/app/(auth)/components/AuthInputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
 

const FormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export type FormSchemaType = z.infer<typeof FormSchema>;


export default function SignInForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (res?.error) {
      console.log("err");
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <main>
        <form className="auth-container" onSubmit={handleSubmit(onSubmit)}>
          <div className="auth-content">
            <p className="my-5 text-center text-lg text-gray-700">SignIn with email </p>
            <AuthInputField
              name="email"
              placeholder={"Your email"}
              register={register}
              errors={errors}
            />
            <AuthInputField
              name="password"
              register={register}
              errors={errors}
              placeholder={"Password"}
            />

            <button className="auth-button type:submit" disabled={isSubmitting}>
              SingIn
            </button>

            <div className="flex flex-row justify-center">
              <p className="mr-2 text-gray-700">Don`t have an account?</p>
              <p className="text-blue-900  hover:text-green-800 cursor-pointer">
                <Link href="/signup">SignUp</Link>
              </p>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
