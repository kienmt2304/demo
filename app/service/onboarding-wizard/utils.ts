import { MIN_PASSWORD_LENGTH, passwordRequirements } from "./const";

/** 0–100 score: length counts as one requirement alongside the regex checks. */
export function passwordStrength(password: string): number {
  const checks = [
    password.length >= MIN_PASSWORD_LENGTH,
    ...passwordRequirements.map((r) => r.re.test(password)),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
