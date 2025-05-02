"use client";

import SaleStaffLayout from "@/app/components/SaleStaffLayout/SaleStaffLayout";
import Chat from "./Chat";
import ProtectedRoute from "@/app/ProtectedRoute";

export default function ChatPage() {

  return (
    <ProtectedRoute allowedRoles={["salesstaff"]}>
      <SaleStaffLayout title="Chat with Customer">
        <Chat />
      </SaleStaffLayout>
    </ProtectedRoute>
  );
}
