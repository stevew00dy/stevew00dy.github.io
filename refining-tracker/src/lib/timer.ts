/**
 * Refining timer — based on method speed and quantity.
 * Formula: duration = (baseMinPerSCU * yieldScu * quantity) / ratingSpeed
 * ratingSpeed 1 = slowest, 3 = fastest.
 * Base tuned for ~20 min/SCU at speed 1 (approx; in-game varies by ore/station).
 */
const MINUTES_PER_SCU_AT_SPEED_1 = 20;

export function computeRefiningDurationMs(
  _methodId: string,
  quantity: number,
  yieldScu: number,
  ratingSpeed: number
): number {
  const scu = Math.max(0.1, quantity * yieldScu);
  const speed = Math.max(1, Math.min(3, ratingSpeed));
  const minutes = (MINUTES_PER_SCU_AT_SPEED_1 * scu) / speed;
  return Math.round(minutes * 60 * 1000);
}
