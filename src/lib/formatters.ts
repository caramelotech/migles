export function avatarColor(id: string) {
  const palette = [
    "bg-primary",
    "bg-emerald-500",
    "bg-sky-500",
    "bg-rose-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-teal-500",
    "bg-orange-500",
  ];
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}
