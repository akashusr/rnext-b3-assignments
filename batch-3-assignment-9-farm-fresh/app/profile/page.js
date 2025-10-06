import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfilePageClient from "@/components/profile/ProfilePageClient";
import { User } from "@/models/UserModel";
import { dbConnect } from "@/mongo";

export default async function ProfilePage({ searchParams }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  await dbConnect();

  // Fetch user details from database
  const user = await User.findById(session.user.id)
    .select("-password -resetPasswordToken -resetPasswordExpires")
    .lean();

  if (!user) {
    redirect("/login");
  }

  // Determine intended role (from OAuth intent param) and missing farmer fields accordingly
  const intent = searchParams?.intent;
  const wantsFarmer = intent === "farmer";
  let missingFarmerFields = [];
  const effectiveRole =
    user.role === "farmer" ? "farmer" : wantsFarmer ? "farmer" : user.role;
  if (effectiveRole === "farmer") {
    const fd = user.farmDetails || {};
    if (!fd?.farmName) missingFarmerFields.push("farmName");
    if (!fd?.specialization) missingFarmerFields.push("specialization");
    if (fd?.farmSize === undefined || fd?.farmSize === null)
      missingFarmerFields.push("farmSize");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ProfilePageClient
        user={JSON.parse(JSON.stringify(user))}
        forceEdit={missingFarmerFields.length > 0 || wantsFarmer}
        missingFarmerFields={missingFarmerFields}
        intentRole={wantsFarmer ? "farmer" : undefined}
      />
    </div>
  );
}
