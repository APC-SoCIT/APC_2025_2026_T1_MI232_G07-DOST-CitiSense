export const generateFakeData = () => {
  const startDate = new Date("2024-01-01");
  const days = 365;

  const positive = [];
  const negative = [];
  const neutral = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];

    // Generate random values with different ranges for each sentiment
    positive.push([dateStr, Math.floor(Math.random() * 30) + 20]); // 20-50
    negative.push([dateStr, Math.floor(Math.random() * 15) + 5]); // 5-20
    neutral.push([dateStr, Math.floor(Math.random() * 20) + 10]); // 10-30
  }

  return [
    { name: "Positive", data: positive },
    { name: "Negative", data: negative },
    { name: "Neutral", data: neutral },
  ];
};
