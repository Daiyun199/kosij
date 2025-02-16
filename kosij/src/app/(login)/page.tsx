"use client";
import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./login.module.css";
import useLoginMutation from "@/features/common/mutations/Login.mutation";
import Cookies from "js-cookie";
import { decodeJwt } from "@/lib/domain/User/decodeJwt.util";
import { Role } from "@/lib/domain/User/role.enum";
import consultant_uri from "@/features/consultant/uri";
import { App } from "antd";
import manager_uri from "@/features/manager/uri";

type FieldType = {
  email: string;
  password: string;
};

export default function Home() {
  const router = useRouter();
  const appContext = App.useApp();
  const message = appContext?.message;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const path = searchParams.get("path");

  const mutations = {
    LoginCredentials: useLoginMutation(),
  };

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(event.currentTarget);
    const values: FieldType = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    mutations.LoginCredentials.mutate(values, {
      onSuccess: async (token: string) => {
        const uri = path && decodeURIComponent(path.trim()).split("/");
        Cookies.set("token", token);
        const payload = decodeJwt(token);
        switch (payload.role) {
          case Role.manager: {
            if (uri && uri[1] === "manager@kosij.com") {
              router.push(path!);
              return;
            }
            router.push(manager_uri.sidebar.dashboard);
            break;
          }
          case Role.farmbreeder: {
            if (uri && uri[1] === "farmbreeder1@kosij.com") {
              router.push(path!);
              return;
            }
            router.push(consultant_uri.sidebar.dashboard);
            break;
          }
          default: {
            message.info(
              "This account has not been assigned a role. Please contact the manager."
            );
          }
        }
      },
      onError: () => {
        setLoading(false);
      },
    });
  }

  useEffect(() => {
    if (!message) return;

    message.destroy("error");
    const error = searchParams.get("error");
    if (error === "unauthenticated") {
      message
        .open({
          content:
            "You are not allowed to access this page. Please login again.",
          key: "error",
          type: "error",
        })
        .then();
    }

    return () => {
      message?.destroy("error");
    };
  }, [message, error]);

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
              name="email"
              placeholder="staff_sales@gmail.com"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              name="password"
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
