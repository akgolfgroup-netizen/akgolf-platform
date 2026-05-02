/** Avatar-farge basert på navn-hash. */
export function avatarColor(name: string | null | undefined): string {
  const palette = [
    "#D1F843",
    "#6FCBA1",
    "#6FB3FF",
    "#E8B967",
    "#C896E8",
    "#F49283",
    "#A5B2AD",
  ];
  if (!name) return palette[6];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return palette[hash % palette.length];
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "??";
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
