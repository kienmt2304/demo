import type { Row, Status } from "./types";

export const roles = [
  "Admin",
  "Developer",
  "Designer",
  "Billing",
  "Support",
  "Viewer",
];
export const statuses: Status[] = ["active", "invited", "suspended"];

export const statusColors: Record<Status, string> = {
  active: "teal",
  invited: "blue",
  suspended: "red",
};

const firstNames = [
  "Ada",
  "Alan",
  "Grace",
  "Linus",
  "Margaret",
  "Ken",
  "Barbara",
  "Dennis",
  "Frances",
  "Tim",
  "Radia",
  "Guido",
  "Hedy",
  "Bjarne",
  "Katherine",
  "John",
  "Sophie",
  "Yukihiro",
  "Anita",
  "James",
];

const lastNames = [
  "Lovelace",
  "Turing",
  "Hopper",
  "Torvalds",
  "Hamilton",
  "Thompson",
  "Liskov",
  "Ritchie",
  "Allen",
  "Berners-Lee",
  "Perlman",
  "van Rossum",
  "Lamarr",
  "Stroustrup",
  "Johnson",
  "McCarthy",
  "Wilson",
  "Matsumoto",
  "Borg",
  "Gosling",
];
const a = 1664525;
const c = 1013904223;
const m = Math.pow(2, 32);
let seed = (a * Date.now() + c) % m;

function LCG(min: number, max: number) {
  const range = max - min + 1;
  return () => {
    seed = Math.floor(((a * seed + c) % m) / (m / range) + min);
    return seed;
  };
}

export function generateRows(count = 233): Row[] {
  const random = LCG(0, 99999999);
  const pick = <T>(items: T[]) =>
    items[Math.floor((random() / 100000000) * items.length)];
  const now = Date.now();
  const twoYears = 1000 * 60 * 60 * 24 * 730;

  return Array.from({ length: count }, (_, index) => {
    const first = pick(firstNames);
    const last = pick(lastNames);
    const handle = `${first}.${last}`.toLowerCase().replace(/[^a-z.]/g, "");

    return {
      id: `usr_${(index + 1).toString().padStart(3, "0")}`,
      name: `${first} ${last}`,
      email: `${handle}${index}@example.com`,
      role: pick(roles),
      status: pick(statuses),
      createdAt: new Date(now - Math.floor((random() / 100000000) * twoYears)),
      amount: Math.round(random() * 0.5) / 100,
    };
  });
}
