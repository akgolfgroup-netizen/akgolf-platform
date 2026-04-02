/**
 * L-Phase Types - Safe for client-side import
 *
 * These are constants and types that don't require Prisma or any server-side code.
 */

/**
 * Valid L-phases in The Foundation Method learning progression.
 * KROPP → ARM → KØLLE → BALL → AUTO
 */
export const L_PHASES = ["KROPP", "ARM", "KØLLE", "BALL", "AUTO"] as const;
export type LPhase = (typeof L_PHASES)[number];

/**
 * Valid shot types for L-phase tracking.
 */
export const SHOT_TYPES = ["DRIVER", "IRON", "WEDGE", "PUTT"] as const;
export type ShotType = (typeof SHOT_TYPES)[number];
