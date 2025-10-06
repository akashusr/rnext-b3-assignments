import React, { useMemo } from "react";
import { useDownloads } from "../context/DownloadsContext";
import { useFavourites } from "../context/FavouritesContext";
import { useImageGeneration } from "../context/ImageGenerationContext";
import { useCollections } from "../context/CollectionsContext";
import StatCard from "../components/StatCard";

const StatsPage = () => {
  const { state: downloadsState } = useDownloads();
  const { state: favouritesState } = useFavourites();
  const { state: generationState } = useImageGeneration();
  const { state: collectionsState } = useCollections();

  const stats = useMemo(() => {
    const totalDownloads = downloadsState.downloads.length;
    const totalFavourites = Object.keys(favouritesState.favourites).length;
    const totalPrompts = generationState.promptHistory.length;
    const totalImagesGenerated = generationState.promptHistory.length * 9;

    const allCuratedImages = [
      ...downloadsState.downloads,
      ...Object.values(favouritesState.favourites),
    ];

    const modelCounts = allCuratedImages.reduce((acc, image) => {
      if (image.model) acc[image.model] = (acc[image.model] || 0) + 1;
      return acc;
    }, {});
    const topModels = Object.entries(modelCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([label, count]) => ({ label, count }));

    const ignoredWords = new Set([
      "a",
      "an",
      "the",
      "in",
      "on",
      "of",
      "with",
      "and",
      "to",
      "by",
      "is",
      "at",
      "for",
      "from",
      "as",
      "it",
    ]);
    const keywordCounts = generationState.promptHistory.reduce(
      (acc, historyItem) => {
        const words = historyItem.prompt
          .toLowerCase()
          .replace(/[,.!?;:]/g, "")
          .split(/\s+/);
        words.forEach((word) => {
          if (word && word.length > 3 && !ignoredWords.has(word))
            acc[word] = (acc[word] || 0) + 1;
        });
        return acc;
      },
      {},
    );
    const topKeywords = Object.entries(keywordCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([label, count]) => ({ label, count }));

    const dimensionCounts = allCuratedImages.reduce((acc, image) => {
      if (image.width && image.height) {
        const dim = `${image.width}x${image.height}`;
        acc[dim] = (acc[dim] || 0) + 1;
      }
      return acc;
    }, {});
    const topDimensions = Object.entries(dimensionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([label, count]) => ({ label, count }));

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayCounts = downloadsState.downloads.reduce((acc, download) => {
      if (download.downloadedAt) {
        const dayIndex = new Date(download.downloadedAt).getDay();
        const day = dayNames[dayIndex];
        acc[day] = (acc[day] || 0) + 1;
      }
      return acc;
    }, {});
    const busiestDays = dayNames.map((day) => ({
      label: day,
      count: dayCounts[day] || 0,
    }));

    const timeSegments = {
      "Morning (6-12)": 0,
      "Afternoon (12-18)": 0,
      "Evening (18-24)": 0,
      "Night (0-6)": 0,
    };
    downloadsState.downloads.forEach((d) => {
      const hour = new Date(d.downloadedAt).getHours();
      if (hour >= 6 && hour < 12) timeSegments["Morning (6-12)"]++;
      else if (hour >= 12 && hour < 18) timeSegments["Afternoon (12-18)"]++;
      else if (hour >= 18 && hour < 24) timeSegments["Evening (18-24)"]++;
      else timeSegments["Night (0-6)"]++;
    });
    const activityByTime = Object.entries(timeSegments).map(
      ([label, count]) => ({ label, count }),
    );

    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const ratioCounts = allCuratedImages.reduce((acc, image) => {
      if (image.width && image.height) {
        const divisor = gcd(image.width, image.height);
        const ratio = `${image.width / divisor}:${image.height / divisor}`;
        acc[ratio] = (acc[ratio] || 0) + 1;
      }
      return acc;
    }, {});
    const topRatios = Object.entries(ratioCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([label, count]) => ({ label, count }));

    let longestPrompt = "",
      shortestPrompt = "";
    if (totalPrompts > 0) {
      longestPrompt = generationState.promptHistory.reduce(
        (max, p) => (p.prompt.length > max.length ? p.prompt : max),
        "",
      );
      shortestPrompt = generationState.promptHistory.reduce(
        (min, p) => (p.prompt.length < min.length ? p.prompt : min),
        generationState.promptHistory[0].prompt,
      );
    }
    const allWords = generationState.promptHistory.flatMap((p) =>
      p.prompt.toLowerCase().split(/\s+/),
    );
    const uniqueWords = new Set(allWords.filter((w) => w.length > 0));
    const lexicalDiversity =
      totalPrompts > 0
        ? ((uniqueWords.size / allWords.length) * 100).toFixed(1)
        : 0;

    const curatedImageIds = new Set([
      ...Object.keys(favouritesState.favourites),
      ...Object.values(collectionsState.collections).flatMap((c) =>
        c.images.map((img) => img.id),
      ),
    ]);
    const curationRate =
      totalImagesGenerated > 0
        ? ((curatedImageIds.size / totalImagesGenerated) * 100).toFixed(1)
        : 0;

    return {
      totalDownloads,
      totalFavourites,
      totalPrompts,
      totalImagesGenerated,
      topModels,
      topKeywords,
      topDimensions,
      busiestDays,
      activityByTime,
      topRatios,
      longestPrompt,
      shortestPrompt,
      lexicalDiversity,
      curationRate,
    };
  }, [downloadsState, favouritesState, generationState, collectionsState]);

  return (
    <div>
      <h2 className="text-4xl font-bold mb-8">
        Your Creative Stats <span className="text-2xl">📊</span>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Images Generated"
          value={stats.totalImagesGenerated}
          unit="approx."
        />
        <StatCard title="Total Favourites" value={stats.totalFavourites} />
        <StatCard title="Total Downloads" value={stats.totalDownloads} />
        <StatCard title="Curation Rate" value={stats.curationRate} unit="%" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Top Prompt Keywords"
          value={stats.topKeywords[0]?.label || "N/A"}
          data={stats.topKeywords}
        />
        <StatCard
          title="Most Used AI Models"
          value={stats.topModels[0]?.label || "N/A"}
          data={stats.topModels}
        />
        <StatCard
          title="Most Used Dimensions"
          value={stats.topDimensions[0]?.label || "N/A"}
          data={stats.topDimensions}
        />
        <StatCard
          title="Most Used Aspect Ratios"
          value={stats.topRatios[0]?.label || "N/A"}
          data={stats.topRatios}
        />
        <StatCard
          title="Busiest Download Days"
          value="Activity by Day"
          data={stats.busiestDays}
        />
        <StatCard
          title="Busiest Time of Day"
          value="Activity by Time"
          data={stats.activityByTime}
        />
      </div>

      <div className="stat-card">
        <h3 className="stat-title">Prompt Analysis</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-white">
              {stats.lexicalDiversity}
              <span className="text-lg font-medium text-zinc-400 ml-1">%</span>
            </p>
            <p className="text-xs text-zinc-400 mt-1">Lexical Diversity</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">
              {stats.shortestPrompt.split(/\s+/).length}
              <span className="text-lg font-medium text-zinc-400 ml-1">
                words
              </span>
            </p>
            <p
              className="text-xs text-zinc-400 mt-1 truncate"
              title={stats.shortestPrompt}
            >
              Shortest Prompt
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">
              {stats.longestPrompt.split(/\s+/).length}
              <span className="text-lg font-medium text-zinc-400 ml-1">
                words
              </span>
            </p>
            <p
              className="text-xs text-zinc-400 mt-1 truncate"
              title={stats.longestPrompt}
            >
              Longest Prompt
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
