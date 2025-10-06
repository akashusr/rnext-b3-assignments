import { upsertReview, deleteReview } from "@/actions/reviewActions";
import { revalidatePath } from "next/cache";
import ReviewSectionClient from "./ReviewSection.client";

const ReviewSection = async ({
  productId,
  session,
  canReview,
  reviewsPaged,
  reviewStats,
  myReview,
  autoOpen = false,
}) => {
  // server actions for forms
  async function submitReview(formData) {
    "use server";
    const rating = Number(formData.get("rating"));
    const comment = String(formData.get("comment") || "");
    const pid = String(formData.get("productId"));
    if (!session?.user?.id || !pid || !rating) return;
    await upsertReview({
      userId: session.user.id,
      productId: pid,
      rating,
      comment,
    });
    revalidatePath(`/products/${pid}`);
  }

  async function removeReview(formData) {
    "use server";
    const pid = String(formData.get("productId"));
    if (!session?.user?.id || !pid) return;
    await deleteReview({ userId: session.user.id, productId: pid });
    revalidatePath(`/products/${pid}`);
  }

  return (
    <ReviewSectionClient
      productId={productId}
      session={session}
      canReview={canReview}
      initialReviewsPaged={reviewsPaged}
      reviewStats={reviewStats}
      myReview={myReview}
      submitReview={submitReview}
      removeReview={removeReview}
      autoOpen={autoOpen}
    />
  );
};

export default ReviewSection;
