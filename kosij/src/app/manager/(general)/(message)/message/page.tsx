"use client";

import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import Chat from "./Chat";
import ProtectedRoute from "@/app/ProtectedRoute";

export default function ChatPage() {

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <ManagerLayout title="Chat with Customer">
        <Chat />
      </ManagerLayout>
    </ProtectedRoute>
  );
}
