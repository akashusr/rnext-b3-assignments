import React from "react";

const StatItem = ({ label, count }) => {
  return (
    <div>
      <span className="font-semibold">{count}</span> {label}
    </div>
  );
};

export default StatItem;
