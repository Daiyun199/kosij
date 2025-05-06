/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/app/ProtectedRoute";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import "./wallet.css";
import api from "@/config/axios.config";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FiArrowDownCircle, FiArrowUpCircle } from "react-icons/fi";

interface WalletResponse {
  balance: number;
  currency: string;
  isLocked: boolean;
}

interface Transaction {
  id: number;
  docId: number;
  transactionType: string;
  createdTime: string;
  transactor: string;
  amount: number;
  transactionStatus: string;
}

function Page() {
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletAndTransactions = async () => {
      try {
        const [walletRes, transactionsRes] = await Promise.all([
          api.get("/wallet/current-user"),
          api.get("/transactions/manager"),
        ]);
        setWallet(walletRes.data.value);
        setTransactions(transactionsRes.data.value || []);
      } catch (err) {
        console.error("Error fetching wallet or transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletAndTransactions();
  }, []);

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <ManagerLayout title="Wallet">
        <div className="wallet-container">
          {loading ? (
            <div className="loading">Loading wallet data...</div>
          ) : wallet ? (
            <>
              <div className="wallet-card">
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

              <div className="transactions-section">
                <h3 className="transactions-title">Recent Transactions</h3>
                {transactions.length === 0 ? (
                  <p className="no-transactions">No transactions found.</p>
                ) : (
                  <>
                    <div className="transactions-list">
                      {paginatedTransactions.map((tx) => {
                        const isSent = tx.transactor === "manager";
                        return (
                          <div key={tx.id} className="transaction-card">
                            <div className="tx-type">
                              {isSent ? (
                                <FiArrowUpCircle className="tx-icon sent" />
                              ) : (
                                <FiArrowDownCircle className="tx-icon received" />
                              )}{" "}
                              {tx.transactionType}
                            </div>
                            <div className="tx-details">
                              <span className="tx-amount">
                                {formatCurrency(tx.amount, wallet.currency)}
                              </span>
                              <span className="tx-time">
                                {new Date(tx.createdTime).toLocaleString()}
                              </span>
                              <span
                                className={`tx-status ${tx.transactionStatus.toLowerCase()}`}
                              >
                                {tx.transactionStatus}
                              </span>
                            </div>
                            <div className="tx-meta">By: {tx.transactor}</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination controls */}
                    <div className="pagination">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        ◀ Prev
                      </button>
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        return (
                          <button
                            key={page}
                            className={
                              page === currentPage ? "active-page" : ""
                            }
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next ▶
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <p className="error">Unable to load wallet information.</p>
          )}
        </div>
      </ManagerLayout>
    </ProtectedRoute>
  );
}

export default Page;
