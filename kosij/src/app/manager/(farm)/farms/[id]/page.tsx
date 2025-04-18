/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import React, { useEffect, useState } from "react";
import styles from "./farmBreederProfile.module.css";
import Image from "next/image";
import ProtectedRoute from "@/app/ProtectedRoute";
import { useParams, useSearchParams } from "next/navigation";
import api from "@/config/axios.config";
import { Farm } from "@/app/[role]/farms/[id]/page";
import FarmDetailContent from "@/app/components/Farm/Farm";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
interface Info {
  accountId: string;
  fullName: string;
  role: string;
  email: string;
  sex: string;
  address: string;
  phoneNumber: string;
  urlAvatar: string;
  status: boolean;
}

function Page() {
  const { id } = useParams();
  const [value, setValue] = useState<Info | null>(null);
  const [loading, setLoading] = useState(true);
  const [farmLoading, setFarmLoading] = useState(true);
  const [farmError, setFarmError] = useState("");
  const searchParams = useSearchParams();
  const farmId = searchParams.get("farmId");
  const [farm, setFarm] = useState<Farm | null>(null);

  useEffect(() => {
    async function fetchManager() {
      try {
        const managerRes = await api.get(`/manager/user/${id}`);
        setValue(managerRes.data.value);
      } catch (err) {
        console.error("Failed to load manager profile:", err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchFarm() {
      try {
        const farmRes = await api.get(`farm/${farmId}`);
        setFarm(farmRes.data.value);
      } catch (err) {
        console.error("Failed to load farm:", err);
        setFarmError("Farm not found!");
      } finally {
        setFarmLoading(false);
      }
    }

    if (id) {
      fetchManager();
      if (farmId) fetchFarm();
    }
  }, [id]);

  if (loading) {
    return (
      <ManagerLayout title="Profile">
        <div className="text-center py-10 text-lg">Loading manager info...</div>
      </ManagerLayout>
    );
  }

  if (!value) {
    return (
      <ManagerLayout title="Profile">
        <div className="text-center text-red-500 py-10 text-lg">
          No profile data found
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <ManagerLayout title="Profile">
        <div className={styles.container}>
          {/* PROFILE CARD */}
          <div className={styles.profileCard}>
            <div className={styles.topSection}>
              <div className={styles.avatarContainer}>
                <Image
                  src={value.urlAvatar || "/default-avatar.png"}
                  alt="Avatar"
                  width={120}
                  height={120}
                  className={styles.avatar}
                />
              </div>

              <div className={styles.basicInfo}>
                <h1 className={styles.employeeName}>
                  {value.fullName || "No name provided"}
                </h1>
                <p className={styles.employeeRole}>
                  <span className={styles.infoLabel}>Role:</span>{" "}
                  {value.role || "Not specified"}
                </p>
                <p className={styles.employeeId}>
                  <span className={styles.infoLabel}>Account ID:</span>{" "}
                  {value.accountId || "N/A"}
                </p>
                <p className={styles.employeeStatus}>
                  <span className={styles.infoLabel}>Status:</span>{" "}
                  <span
                    className={value.status ? styles.active : styles.inactive}
                  >
                    {value.status ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Contact Information</h2>
              <ul className={styles.detailsList}>
                <li>
                  <span className={styles.infoLabel}>Email:</span>
                  {value.email || "No email"}
                </li>
                <li>
                  <span className={styles.infoLabel}>Phone:</span>
                  {value.phoneNumber || "N/A"}
                </li>
                <li>
                  <span className={styles.infoLabel}>Address:</span>
                  {value.address || "N/A"}
                </li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Personal Details</h2>
              <ul className={styles.detailsList}>
                <li>
                  <span className={styles.infoLabel}>Sex:</span>
                  {value.sex || "Not specified"}
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.tablesContainer}>
            {farmLoading ? (
              <div className="text-center py-10 text-lg">
                Loading farm info...
              </div>
            ) : farm ? (
              <FarmDetailContent farm={farm} />
            ) : (
              <DotLottieReact
                src="https://lottie.host/825a6411-5c6d-4faf-aee1-dd4498b0a62c/I5cPH238MB.lottie"
                loop
                autoplay
              />
            )}
          </div>
        </div>
      </ManagerLayout>
    </ProtectedRoute>
  );
}

export default Page;
