// AK Golf Academy — Constants from Masterdokument v2.0
// These are the authoritative enum values for the AK training system.

export const PLAYER_CATEGORIES = ['A','B','C','D','E','F','G','H','I','J','K'] as const;
export type PlayerCategory = typeof PLAYER_CATEGORIES[number];

export const PYRAMID_LEVELS = ['FYS','TEK','SLAG','SPILL','TURN'] as const;
export type PyramidLevel = typeof PYRAMID_LEVELS[number];

export const TRAINING_AREAS = [
  'TEE','INN200','INN150','INN100','INN50',
  'CHIP','PITCH','LOB','BUNKER',
  'PUTT0-3','PUTT3-5','PUTT5-10','PUTT10-15','PUTT15-25','PUTT25-40','PUTT40+'
] as const;
export type TrainingArea = typeof TRAINING_AREAS[number];

export const L_PHASES = ['L-KROPP','L-ARM','L-KØLLE','L-BALL','L-AUTO'] as const;
export type LPhase = typeof L_PHASES[number];

export const CS_LEVELS = ['CS0','CS20','CS30','CS40','CS50','CS60','CS70','CS80','CS90','CS100'] as const;
export type CSLevel = typeof CS_LEVELS[number];

export const ENVIRONMENTS = ['M0','M1','M2','M3','M4','M5'] as const;
export type Environment = typeof ENVIRONMENTS[number];

export const PRESS_LEVELS = ['PR1','PR2','PR3','PR4','PR5'] as const;
export type PressLevel = typeof PRESS_LEVELS[number];

export const LIFE_CODES = ['LIFE-SELV','LIFE-SOS','LIFE-EMO','LIFE-KAR','LIFE-RES'] as const;
export type LifeCode = typeof LIFE_CODES[number];

export const PERIODS = ['GRUNN','SPES','TURN'] as const;
export type Period = typeof PERIODS[number];

export const WEEK_TYPES = ['TURNERINGSUKE','TRENINGSUKE'] as const;
export type WeekType = typeof WEEK_TYPES[number];

export const DRILL_SOURCES = ['ak_original','external','ai_generated'] as const;
export type DrillSource = typeof DRILL_SOURCES[number];

export const DRILL_DIFFICULTIES = ['nybegynner','rekrutt','klubb','regional','nasjonal','elite'] as const;
export type DrillDifficulty = typeof DRILL_DIFFICULTIES[number];

export const FYS_SUBTYPES = ['FYS_STYRKE_M0','FYS_MOBILITET_M0','FYS_POWER_M0'] as const;
export const TURN_SUBTYPES = ['TURN_RES','TURN_UTV','TURN_TRE'] as const;
export const PUTTING_FOCUSES = ['GREEN','SIKTE','TEKN','BALL','SPEED'] as const;

export const SG_AREAS = ['tee','approach','short_game','putting'] as const;

export const TRACKMAN_METRICS = [
  'club_speed','ball_speed','smash_factor','launch_angle','spin_rate',
  'carry_distance','total_distance','face_angle','club_path','attack_angle',
  'face_to_path','apex_height','landing_angle','lateral_landing'
] as const;

// Pyramidefordeling per kategori og periode (fra seksjon 7)
export const DISTRIBUTION_TEMPLATES: Record<string, Record<string, number>> = {
  // GRUNNPERIODE
  'C_GRUNN': { TEK: 35, SLAG: 15, SPILL: 5, TURN: 0, FYS: 45 },
  'D_GRUNN': { TEK: 35, SLAG: 10, SPILL: 5, TURN: 0, FYS: 50 },
  'E_GRUNN': { TEK: 35, SLAG: 10, SPILL: 5, TURN: 0, FYS: 50 },
  'F_GRUNN': { TEK: 35, SLAG: 10, SPILL: 5, TURN: 0, FYS: 50 },
  'G_GRUNN': { TEK: 40, SLAG: 5, SPILL: 0, TURN: 0, FYS: 55 },
  'H_GRUNN': { TEK: 40, SLAG: 5, SPILL: 0, TURN: 0, FYS: 55 },
  'I_GRUNN': { TEK: 45, SLAG: 0, SPILL: 0, TURN: 0, FYS: 55 },
  'J_GRUNN': { TEK: 40, SLAG: 0, SPILL: 0, TURN: 0, FYS: 60 },
  'K_GRUNN': { TEK: 35, SLAG: 0, SPILL: 0, TURN: 0, FYS: 65 },
  // SPESIALISERINGSPERIODE
  'C_SPES': { TEK: 20, SLAG: 30, SPILL: 30, TURN: 10, FYS: 10 },
  'D_SPES': { TEK: 20, SLAG: 30, SPILL: 25, TURN: 10, FYS: 15 },
  'E_SPES': { TEK: 25, SLAG: 25, SPILL: 25, TURN: 10, FYS: 15 },
  'F_SPES': { TEK: 25, SLAG: 25, SPILL: 20, TURN: 10, FYS: 20 },
  'G_SPES': { TEK: 30, SLAG: 20, SPILL: 20, TURN: 10, FYS: 20 },
  'H_SPES': { TEK: 30, SLAG: 20, SPILL: 15, TURN: 10, FYS: 25 },
  'I_SPES': { TEK: 35, SLAG: 15, SPILL: 15, TURN: 5, FYS: 30 },
  'J_SPES': { TEK: 35, SLAG: 10, SPILL: 15, TURN: 5, FYS: 35 },
  'K_SPES': { TEK: 30, SLAG: 10, SPILL: 15, TURN: 5, FYS: 40 },
  // TURNERINGSPERIODE — turneringsuke
  'C_TURN_T': { TEK: 20, SLAG: 20, SPILL: 25, TURN: 25, FYS: 10 },
  'D_TURN_T': { TEK: 20, SLAG: 20, SPILL: 25, TURN: 20, FYS: 15 },
  'E_TURN_T': { TEK: 20, SLAG: 20, SPILL: 25, TURN: 20, FYS: 15 },
  'F_TURN_T': { TEK: 20, SLAG: 20, SPILL: 25, TURN: 15, FYS: 20 },
  'G_TURN_T': { TEK: 25, SLAG: 20, SPILL: 20, TURN: 15, FYS: 20 },
  'H_TURN_T': { TEK: 25, SLAG: 20, SPILL: 20, TURN: 10, FYS: 25 },
  'I_TURN_T': { TEK: 25, SLAG: 15, SPILL: 20, TURN: 10, FYS: 30 },
  'J_TURN_T': { TEK: 30, SLAG: 10, SPILL: 20, TURN: 10, FYS: 30 },
  'K_TURN_T': { TEK: 25, SLAG: 10, SPILL: 20, TURN: 10, FYS: 35 },
  // TURNERINGSPERIODE — treningsuke
  'C_TURN_TR': { TEK: 30, SLAG: 25, SPILL: 30, TURN: 0, FYS: 15 },
  'D_TURN_TR': { TEK: 25, SLAG: 25, SPILL: 25, TURN: 0, FYS: 25 },
  'E_TURN_TR': { TEK: 25, SLAG: 25, SPILL: 25, TURN: 0, FYS: 25 },
  'F_TURN_TR': { TEK: 30, SLAG: 20, SPILL: 20, TURN: 0, FYS: 30 },
  'G_TURN_TR': { TEK: 30, SLAG: 20, SPILL: 20, TURN: 0, FYS: 30 },
  'H_TURN_TR': { TEK: 35, SLAG: 15, SPILL: 15, TURN: 0, FYS: 35 },
  'I_TURN_TR': { TEK: 35, SLAG: 15, SPILL: 15, TURN: 0, FYS: 35 },
  'J_TURN_TR': { TEK: 35, SLAG: 10, SPILL: 15, TURN: 0, FYS: 40 },
  'K_TURN_TR': { TEK: 30, SLAG: 10, SPILL: 15, TURN: 0, FYS: 45 },
};

// Timer per uke per kategori (seksjon 5.1)
export const HOURS_PER_WEEK: Record<PlayerCategory, { summer: [number, number]; winter: [number, number] }> = {
  A: { summer: [30, 35], winter: [20, 25] },
  B: { summer: [25, 30], winter: [18, 22] },
  C: { summer: [20, 25], winter: [15, 18] },
  D: { summer: [15, 20], winter: [12, 15] },
  E: { summer: [12, 15], winter: [10, 12] },
  F: { summer: [10, 12], winter: [8, 10] },
  G: { summer: [8, 10], winter: [6, 8] },
  H: { summer: [6, 8], winter: [4, 6] },
  I: { summer: [4, 6], winter: [3, 4] },
  J: { summer: [3, 4], winter: [2, 3] },
  K: { summer: [2, 3], winter: [1, 2] },
};

export const CHARACTER_LIMIT = 8000;
