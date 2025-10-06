import AdditionalHelp from "@/components/forget-password/AdditionalHelp";
import ForgetHero from "@/components/forget-password/ForgetHero";
import RegisterLink from "@/components/forget-password/RegisterLink";
import ResetPasswordForm from "@/components/forget-password/ResetPasswordForm";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <ForgetHero />
        <ResetPasswordForm />
        <AdditionalHelp />
        <RegisterLink />
      </div>
    </div>
  );
};

export default page;
