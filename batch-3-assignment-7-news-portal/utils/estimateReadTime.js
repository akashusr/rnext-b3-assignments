function estimateReadTime(text, wordsPerMinute = 200) {
  const words = text.trim().split(/\s+/).length;
  const totalMinutes = words / wordsPerMinute;
  const minutes = Math.floor(totalMinutes);
  const seconds = Math.round((totalMinutes - minutes) * 60);
  return { minutes, seconds };
}

export default estimateReadTime;
