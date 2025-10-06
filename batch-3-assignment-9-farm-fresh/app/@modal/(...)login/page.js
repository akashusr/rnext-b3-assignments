"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/common/Modal";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginModal() {
  const router = useRouter();
  return (
    <Modal title="Login" onClose={() => router.back()}>
      <LoginForm />
    </Modal>
  );
}
