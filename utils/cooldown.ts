/**
 * Utility for client-side spam protection and cooldowns.
 * Uses localStorage to persist timestamp of the last action.
 */

const COOLDOWN_PREFIX = 'cuentatodo_cooldown_';

export interface CooldownStatus {
  isBlocked: boolean;
  remainingSeconds: number;
}

/**
 * Checks if a specific action (e.g. 'post', 'comment') is currently in cooldown.
 * @param action The name of the action.
 * @param cooldownSeconds The duration of the cooldown in seconds.
 */
export function getCooldownStatus(action: string, cooldownSeconds: number): CooldownStatus {
  if (typeof window === 'undefined') {
    return { isBlocked: false, remainingSeconds: 0 };
  }

  const key = `${COOLDOWN_PREFIX}${action}`;
  const lastActionTimeStr = localStorage.getItem(key);

  if (!lastActionTimeStr) {
    return { isBlocked: false, remainingSeconds: 0 };
  }

  const lastActionTime = parseInt(lastActionTimeStr, 10);
  const now = Date.now();
  const elapsedMs = now - lastActionTime;
  const cooldownMs = cooldownSeconds * 1000;

  if (elapsedMs < cooldownMs) {
    const remainingMs = cooldownMs - elapsedMs;
    return {
      isBlocked: true,
      remainingSeconds: Math.ceil(remainingMs / 1000)
    };
  }

  return { isBlocked: false, remainingSeconds: 0 };
}

/**
 * Records the timestamp of the action to initiate the cooldown.
 * @param action The name of the action.
 */
export function setCooldown(action: string): void {
  if (typeof window === 'undefined') return;

  const key = `${COOLDOWN_PREFIX}${action}`;
  localStorage.setItem(key, Date.now().toString());
}

/**
 * Clears the cooldown for a specific action (useful for testing or admin purposes).
 * @param action The name of the action.
 */
export function clearCooldown(action: string): void {
  if (typeof window === 'undefined') return;

  const key = `${COOLDOWN_PREFIX}${action}`;
  localStorage.removeItem(key);
}
