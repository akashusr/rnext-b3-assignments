import React from "react";
import {
  BarChart3,
  MessageCircle,
  Bot,
  Clock,
  Zap,
  TrendingUp,
  Calendar,
  User,
} from "lucide-react";

export function AnalyticsDashboard({
  analytics,
  timeRange,
  onTimeRangeChange,
}) {
  if (!analytics) {
    return (
      <div className="p-6 animate-pulse bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 h-24 rounded-xl shadow-sm border dark:border-gray-700"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const {
    overview,
    dailyActivity,
    modelUsage,
    personaUsage,
    messageTypes,
    peakTimes,
    averageResponseLength,
    magicCommandsUsage,
  } = analytics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Usage Analytics
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mt-2 text-lg">
              Track your AI conversation patterns and insights
            </p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            className="px-6 py-3 border-2 border-purple-200 dark:border-purple-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 shadow-sm text-gray-800 dark:text-white font-medium"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<MessageCircle className="w-7 h-7" />}
            title="Total Conversations"
            value={overview.totalConversations}
            subtitle={`${overview.averageMessagesPerConversation} avg messages`}
            gradient="from-blue-500 to-cyan-500"
            bgGradient="from-blue-50 to-cyan-50"
            borderColor="border-blue-200"
          />
          <StatCard
            icon={<Bot className="w-7 h-7" />}
            title="Total Messages"
            value={overview.totalMessages}
            subtitle={`${Math.round(overview.totalCharacters / 1000)}k characters`}
            gradient="from-purple-500 to-pink-500"
            bgGradient="from-purple-50 to-pink-50"
            borderColor="border-purple-200"
          />
          <StatCard
            icon={<TrendingUp className="w-7 h-7" />}
            title="Avg Response Length"
            value={averageResponseLength}
            subtitle="characters"
            gradient="from-green-500 to-emerald-500"
            bgGradient="from-green-50 to-emerald-50"
            borderColor="border-green-200"
          />
          <StatCard
            icon={<Zap className="w-7 h-7" />}
            title="Magic Commands"
            value={magicCommandsUsage.reduce((sum, cmd) => sum + cmd.count, 0)}
            subtitle={`${magicCommandsUsage.length} unique commands`}
            gradient="from-yellow-500 to-orange-500"
            bgGradient="from-yellow-50 to-orange-50"
            borderColor="border-yellow-200"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Activity Chart */}
          <ChartCard
            title="Daily Activity"
            icon={<Calendar className="w-6 h-6 text-blue-600" />}
            gradient="from-blue-500 to-indigo-500"
          >
            <DailyActivityChart data={dailyActivity} />
          </ChartCard>

          {/* Peak Times Chart */}
          <ChartCard
            title="Peak Usage Hours"
            icon={<Clock className="w-6 h-6 text-purple-600" />}
            gradient="from-purple-500 to-pink-500"
          >
            <PeakTimesChart data={peakTimes} />
          </ChartCard>

          {/* Model Usage */}
          <ChartCard
            title="Model Usage"
            icon={<Bot className="w-6 h-6 text-green-600" />}
            gradient="from-green-500 to-teal-500"
          >
            <UsageList data={modelUsage} type="model" colorScheme="green" />
          </ChartCard>

          {/* Persona Usage */}
          <ChartCard
            title="Persona Usage"
            icon={<User className="w-6 h-6 text-indigo-600" />}
            gradient="from-indigo-500 to-blue-500"
          >
            <UsageList
              data={personaUsage}
              type="persona"
              colorScheme="indigo"
            />
          </ChartCard>
        </div>

        {/* Magic Commands Usage */}
        {magicCommandsUsage.length > 0 && (
          <ChartCard
            title="Magic Commands Usage"
            icon={<Zap className="w-6 h-6 text-yellow-600" />}
            gradient="from-yellow-500 to-orange-500"
          >
            <div className="space-y-3">
              {magicCommandsUsage.map(({ command, count }) => (
                <div
                  key={command}
                  className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800"
                >
                  <span className="font-mono text-sm bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-3 py-1 rounded-full font-medium">
                    {command}
                  </span>
                  <span className="text-gray-800 dark:text-white font-semibold">
                    {count} times
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>
        )}

        {/* Message Types Breakdown */}
        <ChartCard
          title="Message Distribution"
          icon={<MessageCircle className="w-6 h-6 text-cyan-600" />}
          gradient="from-cyan-500 to-blue-500"
        >
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {messageTypes.user}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                Your Messages
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {messageTypes.assistant}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                AI Responses
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="text-3xl font-bold text-gray-700 dark:text-gray-300 mb-1">
                {messageTypes.total}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                Total Messages
              </div>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
  gradient,
  bgGradient,
  borderColor,
}) {
  return (
    <div
      className={`bg-gradient-to-br ${bgGradient} dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border-2 ${borderColor} dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
    >
      <div
        className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${gradient} text-white mb-4 shadow-md`}
      >
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
        {title}
      </div>
      {subtitle && (
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {subtitle}
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, icon, children, gradient }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div
          className={`p-2 rounded-lg bg-gradient-to-r ${gradient} text-white shadow-md`}
        >
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function DailyActivityChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-gray-600 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
        No activity data available
      </div>
    );
  }

  const maxMessages = Math.max(...data.map((d) => d.messages));
  const maxConversations = Math.max(...data.map((d) => d.conversations));

  return (
    <div className="space-y-4">
      {data.slice(-7).map((day, index) => (
        <div key={day.date} className="flex items-center space-x-4">
          <div className="w-20 text-sm text-gray-700 dark:text-gray-300 font-medium">
            {new Date(day.date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="flex-1 flex space-x-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Messages
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {day.messages}
                </span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                  style={{
                    width: `${maxMessages > 0 ? (day.messages / maxMessages) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Conversations
                </span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">
                  {day.conversations}
                </span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                  style={{
                    width: `${maxConversations > 0 ? (day.conversations / maxConversations) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PeakTimesChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-gray-600 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
        No timing data available
      </div>
    );
  }

  // Group hours into time periods for better visualization
  const timeGroups = {
    "Morning (6-11)": {
      hours: [6, 7, 8, 9, 10, 11],
      color: "#3B82F6",
      gradient: "from-blue-400 to-blue-600",
    },
    "Afternoon (12-17)": {
      hours: [12, 13, 14, 15, 16, 17],
      color: "#10B981",
      gradient: "from-green-400 to-green-600",
    },
    "Evening (18-23)": {
      hours: [18, 19, 20, 21, 22, 23],
      color: "#8B5CF6",
      gradient: "from-purple-400 to-purple-600",
    },
    "Night (0-5)": {
      hours: [0, 1, 2, 3, 4, 5],
      color: "#F59E0B",
      gradient: "from-yellow-400 to-orange-500",
    },
  };

  // Calculate total messages for each time group
  const groupData = Object.entries(timeGroups)
    .map(([name, group]) => {
      const total = group.hours.reduce((sum, hour) => {
        const hourData = data.find((d) => d.hour === hour);
        return sum + (hourData ? hourData.count : 0);
      }, 0);
      return { name, total, ...group };
    })
    .filter((group) => group.total > 0);

  const totalMessages = groupData.reduce((sum, group) => sum + group.total, 0);

  if (totalMessages === 0) {
    return (
      <div className="text-gray-600 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
        No usage data available
      </div>
    );
  }

  // Calculate pie chart segments
  let cumulativePercentage = 0;
  const segments = groupData.map((group, index) => {
    const percentage = (group.total / totalMessages) * 100;
    const startAngle = cumulativePercentage * 3.6; // Convert to degrees
    const endAngle = (cumulativePercentage + percentage) * 3.6;
    cumulativePercentage += percentage;

    return {
      ...group,
      percentage,
      startAngle,
      endAngle,
      pathData: createArcPath(120, 120, 80, startAngle, endAngle),
      index,
    };
  });

  return (
    <div className="space-y-6">
      {/* Pie Chart */}
      <div className="flex justify-center">
        <div className="relative">
          <svg width="280" height="280" className="transform -rotate-90">
            {/* Gradient definitions - moved to the top */}
            <defs>
              {segments.map((segment, index) => (
                <linearGradient
                  key={`gradient-${index}`}
                  id={`gradient-${index}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor={segment.color}
                    stopOpacity="0.9"
                  />
                  <stop
                    offset="50%"
                    stopColor={segment.color}
                    stopOpacity="1"
                  />
                  <stop
                    offset="100%"
                    stopColor={segment.color}
                    stopOpacity="0.8"
                  />
                </linearGradient>
              ))}
              {/* Radial gradient for better effect */}
              {segments.map((segment, index) => (
                <radialGradient
                  key={`radial-${index}`}
                  id={`radial-${index}`}
                  cx="50%"
                  cy="50%"
                  r="50%"
                >
                  <stop
                    offset="0%"
                    stopColor={segment.color}
                    stopOpacity="0.9"
                  />
                  <stop
                    offset="100%"
                    stopColor={segment.color}
                    stopOpacity="0.7"
                  />
                </radialGradient>
              ))}
              {/* Center circle gradient for dark mode */}
              <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="#f8fafc" stopOpacity="1" />
              </radialGradient>
              <radialGradient id="centerGradientDark" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#374151" stopOpacity="1" />
                <stop offset="100%" stopColor="#1f2937" stopOpacity="1" />
              </radialGradient>
            </defs>

            {/* Background circle */}
            <circle
              cx="140"
              cy="140"
              r="90"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="6"
              className="dark:stroke-gray-600"
            />

            {/* Pie segments */}
            {segments.map((segment, index) => (
              <g key={segment.name}>
                {/* Shadow segment */}
                <path
                  d={createArcPath(
                    142,
                    142,
                    88,
                    segment.startAngle,
                    segment.endAngle,
                  )}
                  fill="rgba(0,0,0,0.1)"
                  stroke="none"
                />
                {/* Main segment */}
                <path
                  d={createArcPath(
                    140,
                    140,
                    88,
                    segment.startAngle,
                    segment.endAngle,
                  )}
                  fill={segment.color}
                  stroke="white"
                  strokeWidth="3"
                  className="hover:opacity-80 transition-all duration-300 cursor-pointer transform hover:scale-105 dark:stroke-gray-800"
                  style={{
                    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))",
                    transformOrigin: "140px 140px",
                  }}
                />
                {/* Highlight overlay */}
                <path
                  d={createArcPath(
                    140,
                    140,
                    88,
                    segment.startAngle,
                    segment.endAngle,
                  )}
                  fill={`url(#radial-${index})`}
                  stroke="none"
                  className="pointer-events-none"
                />
              </g>
            ))}

            {/* Center circle with gradient */}
            <circle
              cx="140"
              cy="140"
              r="45"
              fill="url(#centerGradient)"
              stroke="#e2e8f0"
              strokeWidth="3"
              className="drop-shadow-lg dark:fill-[url(#centerGradientDark)] dark:stroke-gray-600"
            />

            {/* Center text */}
            <text
              x="140"
              y="135"
              textAnchor="middle"
              className="fill-gray-700 dark:fill-gray-300 text-lg font-bold transform rotate-90"
              style={{ transformOrigin: "140px 140px" }}
            >
              Total
            </text>
            <text
              x="140"
              y="155"
              textAnchor="middle"
              className="fill-gray-600 dark:fill-gray-400 text-sm font-semibold transform rotate-90"
              style={{ transformOrigin: "140px 140px" }}
            >
              {totalMessages}
            </text>
          </svg>
        </div>
      </div>

      {/* Legend with enhanced styling */}
      <div className="grid grid-cols-2 gap-4">
        {segments.map((segment, index) => (
          <div
            key={segment.name}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-6 h-6 rounded-full shadow-md border-2 border-white dark:border-gray-600"
                style={{ backgroundColor: segment.color }}
              />
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-800 dark:text-white">
                  {segment.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {segment.total} messages ({segment.percentage.toFixed(1)}%)
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced hourly breakdown */}
      <div className="mt-8">
        <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
          Detailed Hourly Breakdown
        </h4>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
          <div className="grid grid-cols-12 gap-2">
            {Array.from({ length: 24 }, (_, hour) => {
              const hourData = data.find((d) => d.hour === hour) || {
                hour,
                count: 0,
              };
              const maxCount = Math.max(...data.map((d) => d.count));
              const height =
                maxCount > 0 ? (hourData.count / maxCount) * 100 : 0;
              const isActiveHour = hourData.count > 0;

              // Determine time group color
              let colorClass = "bg-gray-300 dark:bg-gray-600";
              let glowClass = "";
              if (timeGroups["Morning (6-11)"].hours.includes(hour)) {
                colorClass = "bg-gradient-to-t from-blue-400 to-blue-500";
                glowClass = "shadow-blue-400/50";
              } else if (timeGroups["Afternoon (12-17)"].hours.includes(hour)) {
                colorClass = "bg-gradient-to-t from-green-400 to-green-500";
                glowClass = "shadow-green-400/50";
              } else if (timeGroups["Evening (18-23)"].hours.includes(hour)) {
                colorClass = "bg-gradient-to-t from-purple-400 to-purple-500";
                glowClass = "shadow-purple-400/50";
              } else if (timeGroups["Night (0-5)"].hours.includes(hour)) {
                colorClass = "bg-gradient-to-t from-yellow-400 to-orange-500";
                glowClass = "shadow-orange-400/50";
              }

              return (
                <div key={hour} className="flex flex-col items-center group">
                  <div className="h-16 w-full flex items-end mb-2">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isActiveHour
                          ? `${colorClass} shadow-lg ${glowClass} border border-white/20 dark:border-gray-700/20`
                          : "bg-gray-200 dark:bg-gray-600"
                      } group-hover:scale-110 group-hover:shadow-xl`}
                      style={{ height: `${Math.max(height, 10)}%` }}
                      title={`${hour}:00 - ${hourData.count} messages`}
                    />
                  </div>
                  <div className="text-xs text-gray-700 dark:text-gray-300 font-semibold">
                    {hour % 4 === 0 ? `${hour}h` : ""}
                  </div>
                  {isActiveHour && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">
                      {hourData.count}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function UsageList({ data, type, colorScheme }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-gray-600 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
        No {type} data available
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);

  const colorSchemes = {
    green: "from-green-500 to-emerald-500",
    indigo: "from-indigo-500 to-blue-500",
    purple: "from-purple-500 to-pink-500",
    blue: "from-blue-500 to-cyan-500",
  };

  return (
    <div className="space-y-4">
      {data.slice(0, 5).map((item, index) => {
        const percentage = total > 0 ? (item.count / total) * 100 : 0;
        const label = item[type] || item.model || item.persona;

        return (
          <div key={label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-gray-800 dark:text-white">
                {label}
              </span>
              <span className="text-gray-700 dark:text-gray-300 font-bold">
                {item.count}
              </span>
            </div>
            <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
              <div
                className={`bg-gradient-to-r ${colorSchemes[colorScheme]} h-3 rounded-full transition-all duration-500 shadow-sm`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {percentage.toFixed(1)}% of total
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Helper function to create SVG arc path
function createArcPath(centerX, centerY, radius, startAngle, endAngle) {
  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    centerX,
    centerY,
    "L",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "Z",
  ].join(" ");
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}
