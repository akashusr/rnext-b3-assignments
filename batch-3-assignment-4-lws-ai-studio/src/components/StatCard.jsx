import React from "react";

const StatCard = ({ title, value, data, unit = "" }) => {
  const maxValue = data ? Math.max(...data.map((d) => d.count), 0) : 0;
  const yAxisLabels = [
    Math.round(maxValue * 0.75),
    Math.round(maxValue * 0.5),
    Math.round(maxValue * 0.25),
    0,
  ];

  return (
    <div className="stat-card">
      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">
        {value}
        {unit && <span className="stat-unit">{unit}</span>}
      </p>

      {data && data.length > 0 && (
        <div className="bar-chart-container">
          <div className="y-axis">
            {yAxisLabels.map((label, i) => (
              <div key={i} className="y-axis-label">
                <span>{label}</span>
              </div>
            ))}
          </div>

          <ul className="bar-chart">
            {data.map((item, index) => (
              <li
                key={index}
                className="bar-item"
                style={{
                  "--value": `${maxValue > 0 ? (item.count / maxValue) * 100 : 0}%`,
                }}
              >
                <div className="bar segmented-bar">
                  {/* ✅ New Tooltip Structure */}
                  <div className="bar-tooltip">
                    <span className="tooltip-label">{item.label}</span>
                    <span className="tooltip-value">{item.count}</span>
                  </div>
                </div>
                <span className="bar-label-bottom">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StatCard;
