export default function stripSlash(str: string) {
  if (str.startsWith("/")) return str.slice(1);
  return str;
}
