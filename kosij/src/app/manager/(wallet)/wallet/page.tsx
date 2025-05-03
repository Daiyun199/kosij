/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/app/ProtectedRoute";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import "./wallet.css";
import api from "@/config/axios.config";
import Image from "next/image";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
interface WalletResponse {
  balance: number;
  currency: string;
  isLocked: boolean;
}

function Page() {
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/wallet/current-user")
      .then((res) => setWallet(res.data.value))
      .catch((err) => console.error("Failed to fetch wallet:", err))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <ManagerLayout title="Wallet">
        <div className="wallet-container">
          {loading ? (
            <div className="loading">Loading wallet data...</div>
          ) : wallet ? (
            <div className="wallet-card">
              {/* Hình ảnh minh họa */}
              <div className="wallet-image-wrapper">
                <DotLottieReact
                  src="https://lottie.host/4287ad0e-a542-4a8e-9596-17cc87ecaff3/oB6m50S7se.lottie"
                  loop
                  autoplay
                />
              </div>

              <h2 className="wallet-title">Current Balance</h2>
              <p className="wallet-amount">
                {formatCurrency(wallet.balance, wallet.currency)}
              </p>
              <p
                className={`wallet-status ${
                  wallet.isLocked ? "locked" : "unlocked"
                }`}
              >
                {wallet.isLocked
                  ? "🔒 Wallet is locked"
                  : "🔓 Wallet is active"}
              </p>
            </div>
          ) : (
            <p className="error">Unable to load wallet information.</p>
          )}
        </div>
      </ManagerLayout>
    </ProtectedRoute>
  );
}

export default Page;
