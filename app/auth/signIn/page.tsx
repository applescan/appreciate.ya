"use client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signIn } from "next-auth/react";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const [loginData, setLoginData] = useState<{
    username: string;
    password: string;
  }>({ username: "", password: "" });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const router = useRouter();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLoginSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const errors = [];
    if (!loginData.username) errors.push("User Name is required.");
    if (!loginData.password) errors.push("Password is required.");

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    const result = await signIn("credentials", {
      username: loginData.username,
      password: loginData.password,
      redirect: false,
      callbackUrl: "/",
    });

    if (result?.error) {
      setFormErrors(["Invalid email or password"]);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center px-6 py-12 lg:px-10">
      <div className="glass-panel w-full max-w-xl rounded-[32px] p-8 shadow-2xl">
        <div className="mb-6 rounded-2xl border border-[var(--color-border)] bg-white/80 px-5 py-4 text-center text-sm text-[var(--color-muted)]">
          <h3 className="text-sm font-semibold text-[var(--color-fg)]">
            Test account
          </h3>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Use this to explore
          </p>
          <p className="mt-3 font-mono text-base font-semibold text-[var(--color-fg)]">
            test@gmail.com
          </p>
          <p className="mt-2 text-xs text-[var(--color-muted)]">
            Password hint: a number from 1 to 4
          </p>
        </div>
        <h2 className="text-3xl font-semibold text-[var(--color-fg)]">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Sign in to continue celebrating your team.
        </p>

        {formErrors.length > 0 && (
          <ul className="list-disc list-inside text-sm font-normal text-red-500 py-4 grid grid-cols-1 gap-y-1">
            {formErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleLoginSubmit}>
          <div>
            <label htmlFor="email" className="text-sm font-semibold">
              Email
            </label>
            <Input
              type="text"
              id="username"
              name="username"
              placeholder="Enter Email..."
              className="mt-2 w-full"
              value={loginData.username.toLowerCase()}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-semibold">
              Password
            </label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter Password..."
              className="mt-2 w-full"
              value={loginData.password}
              onChange={handleInputChange}
            />
          </div>

          <div className="mt-6 flex w-full items-center gap-2">
            <Button
              type="submit"
              className="w-full text-center flex justify-center items-center"
            >
              Let&apos;s go
            </Button>
          </div>
        </form>
        <p className="font-normal text-center py-4 text-sm text-[var(--color-muted)]">
          Don&apos;t have an account?{" "}
          <span
            className="underline font-semibold text-sm text-[var(--color-fg)] italic cursor-pointer"
            onClick={() => router.push("/auth/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
