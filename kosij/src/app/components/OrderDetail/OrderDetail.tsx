"use client";

import React from "react";

interface OrderDetailsProps {
  orderId: string;
  status: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  deliveryInfo: {
    staffName: string;
    companyArrival: string;
    customerDelivery: string;
  };
  customerNotes: string;
  items: {
    id: number;
    image: string;
    name: string;
    variety: string;
    quantity: number;
    price: number;
  }[];
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  orderId,
  status,
  customerInfo,
  deliveryInfo,
  customerNotes,
  items,
}) => {
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-xl font-bold">Order #{orderId}</h1>
          </div>
          <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
            {status}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 border-b pb-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Customer Information</h2>
            <p>
              <strong>Name:</strong> {customerInfo.name}
            </p>
            <p>
              <strong>Email:</strong> {customerInfo.email}
            </p>
            <p>
              <strong>Phone:</strong> {customerInfo.phone}
            </p>
            <p>
              <strong>Address:</strong> {customerInfo.address}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Delivery Information</h2>
            <p>
              <strong>Staff Name:</strong> {deliveryInfo.staffName}
            </p>
            <p className="flex items-center gap-2">
              <span className="text-pink-500">•</span>
              <strong>Expected Company Arrival:</strong>{" "}
              {deliveryInfo.companyArrival}
            </p>
            <p className="flex items-center gap-2">
              <span className="text-pink-500">•</span>
              <strong>Expected Customer Delivery:</strong>{" "}
              {deliveryInfo.customerDelivery}
            </p>
          </div>
        </div>

        <div className="border rounded-md p-4 mb-4 bg-gray-100">
          <h2 className="text-lg font-semibold">Customer Notes</h2>
          <p>{customerNotes}</p>
        </div>

        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">No.</th>
              <th className="border px-4 py-2">Image</th>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Variety</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">
                  <img
                    src={item.image}
                    alt={`Item ${item.id}`}
                    className="w-12 h-12 object-cover mx-auto"
                  />
                </td>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.variety}</td>
                <td className="border px-4 py-2 text-center">
                  {item.quantity}
                </td>
                <td
                  className="border px-4 py-2 text-right"
                  suppressHydrationWarning
                >
                  {item.price.toLocaleString("vi-VN")} VND
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100">
              <td colSpan={5} className="border px-4 py-2 text-right font-bold">
                Total:
              </td>
              <td
                className="border px-4 py-2 text-right font-bold"
                suppressHydrationWarning
              >
                {totalPrice.toLocaleString("vi-VN")} VND
              </td>
            </tr>
          </tfoot>
        </table>

        {status === "Packaged" && (
          <div className="mt-4 text-right">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
              Assign
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
