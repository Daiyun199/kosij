/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import React, { useEffect, useState } from "react";
import styles from "./saleprofile.module.css";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProtectedRoute from "@/app/ProtectedRoute";
import { useParams, useRouter } from "next/navigation";
import api from "@/config/axios.config";
import { toast } from "react-toastify";
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
  const [historyTripData, setTripData] = useState<any[]>([]);
  const { id } = useParams();
  const [value, setValue] = useState<Info | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [historyOrderData, setOrderData] = useState<any[]>([]);
  const router = useRouter();

  const handleViewRequestClick = (orderId: number) => {
    router.push(`/manager/requests/${orderId}`);
  };
  const handleViewTripClick = (tripID: number) => {
    router.push(`/manager/trip/${tripID}`);
  };
  const fetchTripData = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/manager/sales-staff/${id}/trip-assignment-history`
      );

      const transformedData = response.data.value.map(
        (trip: any, index: number) => {
          const [depDay, depMonth, depYear] = trip.departureDate.split("-");
          const [retDay, retMonth, retYear] = trip.returnDate.split("-");

          return {
            id: trip.id,
            stt: index + 1,
            tripType: trip.tripType,
            departureDate: new Date(
              `${depYear}-${depMonth}-${depDay}`
            ).toLocaleDateString(),
            returnDate: new Date(
              `${retYear}-${retMonth}-${retDay}`
            ).toLocaleDateString(),
            minGroupSize: trip.minGroupSize,
            maxGroupSize: trip.maxGroupSize,
            pricingRate: trip.pricingRate,
            tripStatus: trip.tripStatus,
            isDeleted: trip.isDeleted ? "Yes" : "No",
            isReplaced: trip.isReplaced ? "Yes" : "No",
          };
        }
      );
      setTripData(transformedData);
    } catch (error) {
      console.log("Failed to fetch trip assignment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const response = await api.get(`/manager/user/${id}`);
        setValue(response.data.value);
      } catch (err) {
        setError("Failed to fetch manager data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchManagerData();
      fetchTripData();
    }
  }, [id]);
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(
          `/manager/sales-staff/${id}/trip-request-history`
        );

        const formattedRequests = response.data.value.map(
          (req: any, index: number) => {
            const rawDate = req.requestTime?.split(".")[0];
            const requestDate = rawDate
              ? new Date(rawDate).toISOString().substring(0, 10)
              : "";

            return {
              id: req.id,
              stt: index + 1,
              name: req.nameContact,
              phone: req.phoneContact,
              email: req.emailContact,
              requestTime: requestDate,
              status: req.requestStatus,
              isDeleted: req.isDeleted ? "Yes" : "No",
              isReplaced: req.isReplaced ? "Yes" : "No",
            };
          }
        );
        setOrderData(formattedRequests);
      } catch (error) {
        console.error("Failed to fetch order data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);
  if (loading) return <ManagerLayout title="Profile">Loading...</ManagerLayout>;
  if (error) return <ManagerLayout title="Profile">{error}</ManagerLayout>;
  if (!value)
    return <ManagerLayout title="Profile">No data found.</ManagerLayout>;

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div>
        <ManagerLayout title="Profile">
          <div className={styles.container}>
            {/* Left Profile Section */}
            <div className={styles.profileCard}>
              {/* Top Section: Avatar + Basic Info */}
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
                    {value.email || "No email provided"}
                  </li>
                  <li>
                    <span className={styles.infoLabel}>Phone:</span>
                    {value.phoneNumber || "No phone number"}
                  </li>
                  <li>
                    <span className={styles.infoLabel}>Address:</span>
                    {value.address || "No address"}
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

            {/* Right Tables Section */}
            <div className={styles.tablesContainer}>
              {/* History Trip Table */}
              <div className={styles.tableSection}>
                <h2 className={styles.tableTitle}>Trip Assignment History</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Trip Type</TableHead>
                      <TableHead>Departure Date</TableHead>
                      <TableHead>Return Date</TableHead>
                      <TableHead>Min Group Size</TableHead>
                      <TableHead>Max Group Size</TableHead>
                      <TableHead>Pricing Rate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Deleted</TableHead>
                      <TableHead>Replaced</TableHead>
                      <TableHead>Detail</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyTripData.map((trip, index) => (
                      <TableRow key={trip.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{trip.tripType}</TableCell>
                        <TableCell>{trip.departureDate}</TableCell>
                        <TableCell>{trip.returnDate}</TableCell>
                        <TableCell>{trip.minGroupSize}</TableCell>
                        <TableCell>{trip.maxGroupSize}</TableCell>
                        <TableCell>{trip.pricingRate}</TableCell>
                        <TableCell>{trip.tripStatus}</TableCell>
                        <TableCell>{trip.isDeleted}</TableCell>
                        <TableCell>{trip.isReplaced}</TableCell>
                        <TableCell>
                          <button
                            className={styles.detailButton}
                            onClick={() => handleViewTripClick(trip.id)}
                          >
                            View
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* History Order Table */}
              <div className={styles.tableSection}>
                <h2 className={styles.tableTitle}>History Request</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No.</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Request Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Deleted</TableHead>
                      <TableHead>Replaced</TableHead>
                      <TableHead>View</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyOrderData.map((req, index) => (
                      <TableRow key={req.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{req.name}</TableCell>
                        <TableCell>{req.phone}</TableCell>
                        <TableCell>{req.email}</TableCell>
                        <TableCell>{req.requestTime}</TableCell>
                        <TableCell>{req.status}</TableCell>
                        <TableCell>{req.isDeleted}</TableCell>
                        <TableCell>{req.isReplaced}</TableCell>
                        <TableCell>
                          <button
                            className={styles.detailButton}
                            onClick={() => handleViewRequestClick(req.id)}
                          >
                            View
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </ManagerLayout>
      </div>
    </ProtectedRoute>
  );
}

export default Page;
