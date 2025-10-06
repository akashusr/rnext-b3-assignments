import { NextResponse } from "next/server";
import {
  getProductReviews,
  getProductReviewStats,
} from "@/actions/reviewActions";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5;
    const includeStats = searchParams.get("includeStats") === "true";

    const reviewsPaged = await getProductReviews(id, { page, limit });

    let response = reviewsPaged;

    if (includeStats) {
      const stats = await getProductReviewStats(id);
      response = {
        ...reviewsPaged,
        stats,
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
