export function formatDate(iso) {
  if (!iso) return "--";
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch (e) {
    return `${e}: no change in date formatting ${iso}`;
  }
}
