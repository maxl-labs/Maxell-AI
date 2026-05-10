export function computeStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const daySet = new Set(
    dates.map((d) => {
      const local = new Date(d);
      return `${local.getFullYear()}-${local.getMonth()}-${local.getDate()}`;
    })
  );

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const check = new Date(today);
    check.setDate(today.getDate() - i);
    const key = `${check.getFullYear()}-${check.getMonth()}-${check.getDate()}`;
    if (daySet.has(key)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function weeklyMinutes(sessions: { date: Date; durationMin: number }[]): {
  thisWeek: number;
  lastWeek: number;
} {
  const now = new Date();
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - now.getDay());
  startOfThisWeek.setHours(0, 0, 0, 0);

  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

  let thisWeek = 0;
  let lastWeek = 0;

  for (const s of sessions) {
    const d = new Date(s.date);
    if (d >= startOfThisWeek) thisWeek += s.durationMin;
    else if (d >= startOfLastWeek) lastWeek += s.durationMin;
  }

  return { thisWeek, lastWeek };
}
