export default async function waitTime(mult = 1): Promise<void> {
  const delay = 100 + Math.random() * 300;
  return new Promise((resolve) => setTimeout(resolve, mult * delay));
}
