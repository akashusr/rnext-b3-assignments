import React from "react";
import RegisterHeader from "@/components/register/RegisterHeader";
import RegisterForm from "@/components/register/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* <!-- Header --> */}
        <RegisterHeader />

        {/* <!-- Registration Form --> */}
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
