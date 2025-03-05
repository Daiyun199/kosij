"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import styles from "./login.module.css";
import useLoginMutation from "@/features/common/mutations/Login.mutation";
import Cookies from "js-cookie";
import { decodeJwt } from "@/lib/domain/User/decodeJwt.util";
import { Role } from "@/lib/domain/User/role.enum";
import { App } from "antd";
import manager_uri from "@/features/manager/uri";
import farmbreeder_uri from "@/features/farmbreeder/uri";
import salesstaff_uri from "@/features/sales/uri";
import Image from "next/image";
type FieldType = {
  email: string;
  password: string;
};
function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Home />
    </Suspense>
  );
}
function Home() {
  const router = useRouter();
  const appContext = App.useApp();
  const message = appContext?.message;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [cssLoaded, setCssLoaded] = useState(false);

  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [path, setPath] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams) {
      setError(searchParams.get("error"));
      setPath(searchParams.get("path"));
    }
  }, [searchParams]);

  const mutations = {
    LoginCredentials: useLoginMutation(),
  };

  useEffect(() => {
    const checkCssLoaded = () => {
      const links = document.querySelectorAll("link[rel='stylesheet']");
      for (const link of links) {
        if (link instanceof HTMLLinkElement && link.sheet) {
          setCssLoaded(true);
          return;
        }
      }
      setTimeout(checkCssLoaded, 50);
    };

    checkCssLoaded();
  }, []);

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const values: FieldType = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    mutations.LoginCredentials.mutate(values, {
      onSuccess: async (token: string | null) => {
        if (!token) {
          message.error("Login failed: Invalid token received from server.");
          return;
        }

        const uri = path && decodeURIComponent(path.trim()).split("/");
        Cookies.set("token", token);
        const payload = decodeJwt(token);
        console.log("Decoded JWT payload:", payload);

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
            router.push(farmbreeder_uri.sidebar.dashboard);
            break;
          }
          case Role.salesstaff: {
            if (uri && uri[1] === "salesstaff1@kosij.com") {
              router.push(path!);
              return;
            }
            router.push(salesstaff_uri.sidebar.dashboard);
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
    if (!message || typeof window === "undefined") return;

    message.destroy("error");
    if (error === "unauthenticated") {
      message.open({
        content: "You are not allowed to access this page. Please login again.",
        key: "error",
        type: "error",
      });
    }

    return () => {
      message?.destroy("error");
    };
  }, [message, error]);

  if (!cssLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Image
          src="/logo.png"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-full"
        />
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
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            suppressHydrationWarning
          />
          <input
            type="password"
            name="password"
            placeholder="********"
            className={styles.input}
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            suppressHydrationWarning
          />
          <div className={styles.forgotPassword}>
            <a href="#">Forgot your password?</a>
          </div>
          <button
            type="submit"
            className={styles.button}
            disabled={loading}
            suppressHydrationWarning
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
export default HomePage;
