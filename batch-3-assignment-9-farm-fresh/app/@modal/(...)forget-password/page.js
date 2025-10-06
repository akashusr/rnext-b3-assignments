"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/common/Modal";
import ResetPasswordFormModal from "@/components/forget-password/ResetPasswordFormModal";

export default function ForgetPasswordModal() {
  const router = useRouter();

  return (
    <Modal title="Reset Password" onClose={() => router.back()}>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Forgot your password?
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>
        <ResetPasswordFormModal />
      </div>
    </Modal>
  );
}
