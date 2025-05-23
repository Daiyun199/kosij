/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import React, { useEffect, useState } from "react";
import styles from "./consultantprofile.module.css";
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

  const handleViewOrderClick = (orderId: number) => {
    router.push(`/manager/orders/${orderId}`);
  };
  const handleViewTripClick = (BookingId: number) => {
    router.push(`/manager/passengers/${BookingId}`);
  };
  const fetchTripData = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/manager/consulting-staff/${id}/trip-assignment-history`
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
        const response = await api.get(`/account/${id}/orders`);
        const orders = response.data.value;

        const formattedOrders = orders.map((order: any) => {
          const rawDate = order.createdTime?.split(".")[0];
          const orderDate = rawDate
            ? new Date(rawDate).toISOString().substring(0, 10)
            : "";

          return {
            orderId: order.orderId,
            orderDate,
            totalAmount: `$${order.totalAmount.toFixed(2)}`,
            deliveryEmployee: order.deliveryStaffName || "Unassigned",
            consultingEmployee: order.consultingStaffName || "Unassigned",
            itemCount: order.orderDetailsNumber || 0,
            status: order.orderStatus,
            deliveryStatus:
              order.totalDeliveringAmount > 0 ? "Delivering" : "Pending",
            detail:
              order.orderDetails
                ?.map((item: any) => `${item.variety} - ${item.weight}kg`)
                .join(", ") || "",
          };
        });

        setOrderData(formattedOrders);
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
                <h2 className={styles.tableTitle}>History Order</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Delivery Employee</TableHead>
                      <TableHead>Consulting Employee</TableHead>
                      <TableHead>Item Count</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Delivery Status</TableHead>
                      <TableHead>Detail</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyOrderData.map((order) => (
                      <TableRow key={order.orderId}>
                        <TableCell>{order.orderId}</TableCell>
                        <TableCell>{order.orderDate}</TableCell>
                        <TableCell>{order.totalAmount}</TableCell>
                        <TableCell>{order.deliveryEmployee}</TableCell>
                        <TableCell>{order.consultingEmployee}</TableCell>
                        <TableCell>{order.itemCount}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell>{order.deliveryStatus}</TableCell>
                        <TableCell>
                          <button
                            className={styles.detailButton}
                            onClick={() => handleViewOrderClick(order.orderId)}
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
