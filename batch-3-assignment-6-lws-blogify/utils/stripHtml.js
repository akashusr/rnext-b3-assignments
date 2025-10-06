export default function stripHtml(html) {
  if (!html) return "";

  const text = html.replace(/<[^>]*>/g, "");

  return text;
}

