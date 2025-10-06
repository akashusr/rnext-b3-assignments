import { dbConnect } from "@/mongo";
import { ProductModel } from "@/models/productModel";
import { User } from "@/models/UserModel";

/**
 * Get counts of published products per category applying other active filters (q, price, location, organic)
 * but intentionally excluding current category selection so user can see full distribution.
 * Returns an object: { Vegetables: number, Fruits: number, ... }
 */
export async function getCategoryCounts({ q, price, location, organic } = {}) {
  await dbConnect();
  const filter = { publish: true };

  if (q) {
    filter.product_name = { $regex: q, $options: "i" };
  }

  if (price) {
    switch (price) {
      case "under-30":
        filter.product_price_per_kg = { $lt: 30 };
        break;
      case "30-50":
        filter.product_price_per_kg = { $gte: 30, $lte: 50 };
        break;
      case "50-100":
        filter.product_price_per_kg = { $gte: 50, $lte: 100 };
        break;
      case "over-100":
        filter.product_price_per_kg = { $gt: 100 };
        break;
    }
  }

  if (organic === "true") {
    filter.organic = true;
  }

  if (location) {
    const norm =
      location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();
    const farmersInLocation = await User.find({
      role: "farmer",
      address: { $regex: norm, $options: "i" },
    }).select("_id");
    const farmerIds = farmersInLocation.map((f) => f._id.toString());
    if (farmerIds.length) {
      filter.owner_id = { $in: farmerIds };
    } else {
      // No farmers found, all counts zero
      return {
        Vegetables: 0,
        Fruits: 0,
        Grains: 0,
        Dairy: 0,
        Honey: 0,
        Herbs: 0,
      };
    }
  }

  const pipeline = [
    { $match: filter },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ];

  const results = await ProductModel.aggregate(pipeline);
  const counts = results.reduce((acc, r) => {
    if (r && r._id) acc[r._id] = r.count;
    return acc;
  }, {});

  // Ensure all categories present
  const all = ["Vegetables", "Fruits", "Grains", "Dairy", "Honey", "Herbs"];
  for (const cat of all) if (!(cat in counts)) counts[cat] = 0;
  return counts;
}
