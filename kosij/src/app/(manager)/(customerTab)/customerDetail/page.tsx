"use-cilent";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import React from "react";
import customStyles from "./customerDetail.module.css";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
function Page() {
  const historyTripData = [
    {
      tripID: 1,
      tourName: "Hanoi Adventure",
      bookingDate: "2024-09-20",
      startDate: "2024-09-25",
      endDate: "2024-09-28",
      status: "Completed",
      type: "Group",
      detail: "Explore Hanoi's old quarter and cultural sites",
    },
    {
      tripID: 2,
      tourName: "Ho Chi Minh City Tour",
      bookingDate: "2024-09-18",
      startDate: "2024-09-22",
      endDate: "2024-09-27",
      status: "Pending",
      type: "Private",
      detail: "Visit landmarks and taste local cuisine",
    },
  ];

  const historyOrderData = [
    {
      orderId: 1,
      orderDate: "2024-09-26",
      totalAmount: "$20",
      employeeHandling: "Alice Nguyen",
      itemCount: 1,
      status: "Completed",
      deliveryStatus: "Delivered",
      detail: "Tarot Reading Session - 30 minutes",
    },
    {
      orderId: 2,
      orderDate: "2024-09-25",
      totalAmount: "$35",
      employeeHandling: "John Tran",
      itemCount: 2,
      status: "Pending",
      deliveryStatus: "Processing",
      detail: "Zodiac Consultation & Horoscope Analysis",
    },
  ];

  return (
    <div>
      <ManagerLayout title="Profile">
        <div className={customStyles.container}>
          <div className={customStyles.card}>
            <div className={customStyles.avatarSection}>
              <div className={customStyles.avatar}>
                <Image
                  src="https://static.wikia.nocookie.net/hoducks/images/1/14/Game_Chapter_31_%28Full_1%29.png/revision/latest?cb=20240128195103"
                  alt="Avatar"
                  width={300}
                  height={300}
                />
              </div>
              <button className={customStyles.uploadButton}>
                Upload Image
              </button>
            </div>
            <div className={customStyles.infoSection}>
              <h2 className={customStyles.title}>Manager Information</h2>
              <form className={customStyles.form}>
                <input
                  type="text"
                  placeholder="Full Name"
                  className={customStyles.input}
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className={customStyles.input}
                />
                <input
                  type="text"
                  placeholder="Address"
                  className={customStyles.input}
                />
                <input
                  type="text"
                  placeholder="Citizen identification card"
                  className={customStyles.input}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className={customStyles.input}
                />
                <button type="submit" className={customStyles.updateButton}>
                  Update
                </button>
              </form>
            </div>
          </div>
          <div className={customStyles.tableContainer}>
            <div>
              <h2 className="text-xl font-bold mb-2">History Trip</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trip ID</TableHead>
                    <TableHead>Tour Name</TableHead>
                    <TableHead>Booking Date</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Detail</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyTripData.map((trip) => (
                    <TableRow key={trip.tripID}>
                      <TableCell>{trip.tripID}</TableCell>
                      <TableCell>{trip.tourName}</TableCell>
                      <TableCell>{trip.bookingDate}</TableCell>
                      <TableCell>{trip.startDate}</TableCell>
                      <TableCell>{trip.endDate}</TableCell>
                      <TableCell>{trip.status}</TableCell>
                      <TableCell>{trip.type}</TableCell>
                      <TableCell>
                        <button className={customStyles.detailButton}>
                          View
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">History Order</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Employee Handling</TableHead>
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
                      <TableCell>{order.employeeHandling}</TableCell>
                      <TableCell>{order.itemCount}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>{order.deliveryStatus}</TableCell>
                      <TableCell>
                        <button className={customStyles.detailButton}>
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
  );
}

export default Page;
