"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/common/Modal";
import RegisterForm from "@/components/register/RegisterForm";

export default function RegisterModal() {
  const router = useRouter();
  return (
    <Modal
      title="Register"
      onClose={() => router.back()}
      contentClassName="max-w-3xl"
    >
      <RegisterForm />
    </Modal>
  );
}
