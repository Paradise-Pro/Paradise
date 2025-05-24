function createTimestampFooter() {
  const now = new Date();

  const dateOnly = now.toLocaleDateString("el-GR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Nicosia",
  });

  const timeOnly = now.toLocaleTimeString("el-GR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Europe/Nicosia",
  });

  const isDST =
    now.getTimezoneOffset() <
    new Date(now.getFullYear(), 0, 1).getTimezoneOffset();

  const timeType = isDST ? "Θερινή ώρα" : "Χειμερινή ώρα";

  return [
    "🌴 Paradise logs system",
    `🗓️ ${dateOnly}  - 🕖 Ώρα: ${timeOnly} - 🌎 Ζώνη ώρας: ${timeType}`,
  ].join("\n");
}

module.exports = createTimestampFooter;
