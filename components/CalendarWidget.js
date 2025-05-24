import React, { useState } from "react";

const CalendarWidget = ({ onClose }) => {
  const today = new Date();
  const locale =
    typeof navigator !== "undefined" ? navigator.language : "en-US";
  const day = today.getDate();
  const month = today.toLocaleString(locale, { month: "long" }).toUpperCase();
  const [isExpanded, setIsExpanded] = useState(false);

  const weekdays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(2023, 9, 2 + i); // Monday
    return date.toLocaleDateString(locale, { weekday: "short" });
  });

  const styles = {
    container: {
      background: "#1f1f1f",
      color: "#fff",
      borderRadius: "24px",
      padding: "20px",
      width: isExpanded ? "300px" : "240px",
      fontFamily: "'SF Pro Display', sans-serif",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
      position: "relative",
      textAlign: "center",
    },
    header: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "1rem",
      fontWeight: "600",
      marginBottom: "1.5rem",
      position: "relative",
    },
    iconGroup: {
      position: "absolute",
      right: 0,
      top: 0,
      display: "flex",
      gap: "8px",
    },
    icon: {
      width: 16,
      height: 16,
      cursor: "pointer",
      opacity: 0.8,
    },
    iconBtn: {
      background: "transparent",
      border: "none",
      padding: 0,
      cursor: "pointer",
    },
    calendarGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      textAlign: "center",
      gap: "6px",
      fontSize: "13px",
    },
    dayCell: (currentDay) => ({
      padding: "6px 0",
      borderRadius: "50%",
      backgroundColor: currentDay === day ? "#4A3AFF" : "transparent",
      color: currentDay === day ? "#fff" : "#fff",
      fontWeight: currentDay === day ? "bold" : "normal",
      transition: "0.2s",
    }),
  };

  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  const calendarDays = [];
  for (let i = 0; i < offset; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {month}
        <div style={styles.iconGroup}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={styles.iconBtn}
          >
            <img src="/icons/expand.png" alt="expand" style={styles.icon} />
          </button>
          <button onClick={onClose} style={styles.iconBtn}>
            <img src="/icons/close.png" alt="close" style={styles.icon} />
          </button>
        </div>
      </div>

      <div style={styles.calendarGrid}>
        {weekdays.map((w, i) => (
          <div key={i} style={{ opacity: 0.6, fontWeight: "bold" }}>
            {w}
          </div>
        ))}
        {calendarDays.map((d, i) => (
          <div key={i} style={styles.dayCell(d)}>
            {d || ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarWidget;
