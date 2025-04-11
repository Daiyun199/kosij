"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { App } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { isWindowDefined } from "swr/_internal";

export default function useLogout() {
  const router = useRouter();
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  async function logout() {
    if (isWindowDefined) {
      localStorage.removeItem("staff-task");
      localStorage.removeItem("scanned-cache-headstaff");
      Cookies.remove("token");
      window.dispatchEvent(new Event("tokenChanged"));
      message.success("Sign out successfull!");
      queryClient.clear();
      router.push("/");
    }
  }

  return [logout];
}
