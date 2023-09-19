"use client";

import GoogleSignInButton from "@/components/GoogleSignInButton";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const SignInForm = () => {
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const signInResponse = await signIn("credentials", {
      email: data.get("email"),
      password: data.get("password"),
      redirect: false,
    });

    if (signInResponse && !signInResponse.error) {
      router.push("/chats");
    } else {
      console.log("Error:  ", signInResponse);
    }
  };

  return (
    <div className="flex flex-col justify-center px-8 gap-y-4">
      <form onSubmit={handleSubmit} className="bg-white flex flex-col">
        <span className="text-center">Login</span>
        <div>
          <label className="flex flex-col justify-between">
            <span>Username or Email</span>
            <input type="text" name="email" />
          </label>
        </div>
        <div>
          <label className="flex flex-col justify-between">
            <span>Password</span>
            <input type="password" name="password" />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
      <GoogleSignInButton />
    </div>
  );
};

export default SignInForm;
