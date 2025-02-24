"use client";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import OrderDetails from "@/app/components/OrderDetail/OrderDetail";
import React from "react";

const OrderPage = () => {
  const orderData = {
    orderId: "ORD-12346",
    status: "Packaged",
    customerInfo: {
      name: "John Doe",
      email: "johndoe@email.com",
      phone: "+123 567 8900",
      address: "123 Koi Street, Fishville, FL 12345",
    },
    deliveryInfo: {
      staffName: "Mike Johnson",
      companyArrival: "February 01, 2025",
      customerDelivery: "February 15, 2025",
    },
    customerNotes: "Please handle with extra care. Prefer morning delivery.",
    items: [
      {
        id: 1,
        image: "/fish1.png",
        name: "Kohaku Koi",
        variety: "Taisho Sanke",
        quantity: 2,
        price: 30000000,
      },
      {
        id: 2,
        image: "/fish2.png",
        name: "Showa Koi",
        variety: "Taisho Sanke",
        quantity: 1,
        price: 21000000,
      },
    ],
  };

  return (
    <div>
      <ManagerLayout title="...">
        <OrderDetails {...orderData} />
      </ManagerLayout>
    </div>
  );
};

export default OrderPage;
