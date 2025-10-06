import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function GET() {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Missing Gemini API key" },
      { status: 500 },
    );
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch models" },
        { status: 500 },
      );
    }
    const data = await res.json();

    const deprecatedModels = [
      "gemini-pro-vision",
      "gemini-1.0-pro-vision",
      "gemini-1.0-pro-vision-latest",
      "gemini-1.0-pro-vision-001",
      "gemini-1.0-pro-vision-002",
      "gemini-pro-vision-001",
      "gemini-pro-vision-002",

      "gemini-pro",
      "gemini-1.0-pro",
      "gemini-ultra",
      "gemini-ultra-vision",
    ];

    const filteredModels = (data.models || []).filter((m) => {
      const shortModelName = m.name.split("/").pop();

      const supportsGenerateContent = (
        m.supportedGenerationMethods || []
      ).includes("generateContent");

      const isNotDeprecated = !deprecatedModels.some(
        (deprecated) =>
          shortModelName === deprecated ||
          shortModelName.startsWith(deprecated + "-"),
      );

      const notDeprecatedByPattern = !(
        m.displayName?.toLowerCase().includes("deprecated") ||
        m.description?.toLowerCase().includes("deprecated") ||
        shortModelName?.includes("1.0") // Exclude older 1.0 models as they're likely to be deprecated
      );

      return (
        supportsGenerateContent && isNotDeprecated && notDeprecatedByPattern
      );
    });

    const preferredModels = [
      {
        name: "gemini-1.5-flash",
        displayName: "Gemini 1.5 Flash",
        description: "Fast, efficient responses with multimodal support",
        supportedGenerationMethods: ["generateContent"],
      },
      {
        name: "gemini-1.5-pro",
        displayName: "Gemini 1.5 Pro",
        description: "Advanced reasoning with multimodal support",
        supportedGenerationMethods: ["generateContent"],
      },
    ];

    let finalModelsList = [...filteredModels];

    for (const model of preferredModels) {
      if (!finalModelsList.some((m) => m.name.endsWith(model.name))) {
        finalModelsList.push(model);
      }
    }

    finalModelsList.sort((a, b) => {
      if (a.name.includes("1.5") && !b.name.includes("1.5")) return -1;
      if (!a.name.includes("1.5") && b.name.includes("1.5")) return 1;
      return 0;
    });

    return NextResponse.json({ models: finalModelsList });
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 },
    );
  }
}
