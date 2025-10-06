function getTimeAgo(dateString, lang = "en") {
  const postDate = new Date(dateString);
  const now = new Date();

  const seconds = Math.floor((now - postDate) / 1000);
  if (isNaN(seconds)) return lang === "bn" ? "তারিখ সঠিক নয়" : "Invalid date";

  const intervals = [
    { label: "year", bn: "বছর", seconds: 31536000 },
    { label: "month", bn: "মাস", seconds: 2592000 },
    { label: "week", bn: "সপ্তাহ", seconds: 604800 },
    { label: "day", bn: "দিন", seconds: 86400 },
    { label: "hour", bn: "ঘন্টা", seconds: 3600 },
    { label: "minute", bn: "মিনিট", seconds: 60 },
    { label: "second", bn: "সেকেন্ড", seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      if (lang === "bn") {
        return `${count} ${interval.bn} আগে`;
      } else {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }
  }

  return lang === "bn" ? "এইমাত্র" : "just now";
}

export default getTimeAgo;
