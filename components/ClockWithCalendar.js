import React, { useEffect, useState } from "react";

const ClockWithCalendar = ({ onClick }) => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const locale =
    typeof navigator !== "undefined" ? navigator.language : "el-GR";

  const dateString = dateTime.toLocaleDateString(locale, {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const timeString = dateTime.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      onClick={onClick}
      style={{
        fontSize: "0.85rem",
        fontWeight: 500,
        whiteSpace: "nowrap",
        cursor: "pointer",
        opacity: 0.95,
      }}
    >
      {dateString} {timeString}
    </div>
  );
};

export default ClockWithCalendar;
