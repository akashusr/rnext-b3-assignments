"use client";

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faEdit,
  faSave,
  faTimes,
  faLeaf,
  faRuler,
  faSeedling,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function ProfilePageClient({
  user,
  forceEdit = false,
  missingFarmerFields = [],
  intentRole,
}) {
  const [isEditing, setIsEditing] = useState(forceEdit);
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    bio: user.bio || "",
    farmDetails: user.farmDetails || {
      farmName: "",
      specialization: "",
      farmSize: "",
      farmSizeUnit: "acres",
    },
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(user.image || "");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("farmDetails.")) {
      const fieldName = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        farmDetails: {
          ...prev.farmDetails,
          [fieldName]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreview(url);
    }
  };

  const handleSave = async () => {
    // Validate farmer required fields if target role is farmer
    const targetFarmer = user.role === "farmer" || intentRole === "farmer";
    if (targetFarmer) {
      const required = ["farmName", "specialization", "farmSize"]; // farmSizeUnit optional
      const fd = formData.farmDetails || {};
      const missing = required.filter((k) => !fd[k] && fd[k] !== 0);
      if (missing.length > 0) {
        alert(
          `Please provide required farmer information: ${missing.join(", ")}`
        );
        return;
      }
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("phone", formData.phone);
      form.append("address", formData.address);
      form.append("bio", formData.bio);
      if (targetFarmer) {
        const fd = { ...formData.farmDetails };
        if (fd.specialization === "") delete fd.specialization;
        form.append("farmDetails", JSON.stringify(fd));
        if (user.role !== "farmer" && intentRole === "farmer") {
          form.append("role", "farmer");
        }
      }
      if (file) {
        form.append("profilePicture", file);
      }
      const response = await fetch("/api/profile", {
        method: "PUT",
        body: form,
      });

      if (response.ok) {
        setIsEditing(false);
        window.location.href = "/profile"; // reload cleans query params
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Update failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      bio: user.bio || "",
      farmDetails: user.farmDetails || {
        farmName: "",
        specialization: "",
        farmSize: "",
        farmSizeUnit: "acres",
      },
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Image
                src={
                  preview ||
                  (user.role === "farmer" ? "/chinese.png" : "/user.png")
                }
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-full"
                  >
                    Change
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.name || `${user.firstName} ${user.lastName}` || "User"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 capitalize">
                {user.role === "farmer" || intentRole === "farmer"
                  ? "🌾 Farmer"
                  : "👤 Customer"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Profile Information
        </h2>
        {forceEdit && missingFarmerFields.length > 0 && (
          <div className="mb-4 p-4 border border-red-300 bg-red-50 dark:bg-red-900/30 dark:border-red-700 rounded">
            <div className="text-sm text-red-700 dark:text-red-300 font-medium">
              Please complete the following farmer details before continuing:{" "}
              {missingFarmerFields.join(", ")}
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                Or You will be registered as a customer.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Basic Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.firstName || "Not provided"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.lastName || "Not provided"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  Email
                </label>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FontAwesomeIcon icon={faPhone} className="mr-2" />
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.phone || "Not provided"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.address || "Not provided"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Additional Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.bio || "No bio provided"}
                  </p>
                )}
              </div>

              {/* Farmer-specific fields */}
              {(user.role === "farmer" || intentRole === "farmer") && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <FontAwesomeIcon icon={faLeaf} className="mr-2" />
                      Farm Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="farmDetails.farmName"
                        value={formData.farmDetails.farmName}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your farm name"
                        required={true}
                      />
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">
                        {user.farmDetails?.farmName || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <FontAwesomeIcon icon={faSeedling} className="mr-2" />
                      Specialization
                    </label>
                    {isEditing ? (
                      <select
                        name="farmDetails.specialization"
                        value={formData.farmDetails.specialization}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required={true}
                      >
                        <option value="">Select specialization</option>
                        <option value="vegetables">Vegetables</option>
                        <option value="fruits">Fruits</option>
                        <option value="grains">Grains</option>
                        <option value="dairy">Dairy</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400 capitalize">
                        {user.farmDetails?.specialization || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <FontAwesomeIcon icon={faRuler} className="mr-2" />
                      Farm Size
                    </label>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          name="farmDetails.farmSize"
                          value={formData.farmDetails.farmSize}
                          onChange={handleInputChange}
                          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Size"
                          required={true}
                        />
                        <select
                          name="farmDetails.farmSizeUnit"
                          value={formData.farmDetails.farmSizeUnit}
                          onChange={handleInputChange}
                          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="acres">Acres</option>
                          <option value="hectares">Hectares</option>
                          <option value="sq_ft">Sq Ft</option>
                          <option value="sq_m">Sq M</option>
                        </select>
                      </div>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">
                        {user.farmDetails?.farmSize &&
                        user.farmDetails?.farmSizeUnit
                          ? `${user.farmDetails.farmSize} ${user.farmDetails.farmSizeUnit}`
                          : "Not provided"}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
