"use client";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./login.module.css";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "abc@gmail.com" && password === "1") {
      router.push("/profile");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <>
      <Head>
        <title>Login Page</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="Logo" />
          <span>KOSIJ</span>
        </div>
        <div className={styles.loginBox}>
          <h2>LOGIN</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="staff_sales@gmail.com"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="********"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a href="#" className={styles.forgotPassword}>
              Forgot your password?
            </a>
            <button type="submit" className={styles.button}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
