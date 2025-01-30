import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import  SignUpForm  from "./signUpForm";

export default async function SignUp() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return <SignUpForm />;
}
