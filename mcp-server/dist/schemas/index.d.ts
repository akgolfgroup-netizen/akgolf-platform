import { z } from 'zod';
export declare const DrillCreateInput: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    goal: z.ZodString;
    instructions: z.ZodOptional<z.ZodString>;
    duration_minutes: z.ZodDefault<z.ZodNumber>;
    pyramid_level: z.ZodEnum<["FYS", "TEK", "SLAG", "SPILL", "TURN"]>;
    training_areas: z.ZodArray<z.ZodEnum<["TEE", "INN200", "INN150", "INN100", "INN50", "CHIP", "PITCH", "LOB", "BUNKER", "PUTT0-3", "PUTT3-5", "PUTT5-10", "PUTT10-15", "PUTT15-25", "PUTT25-40", "PUTT40+"]>, "many">;
    l_phases: z.ZodArray<z.ZodEnum<["L-KROPP", "L-ARM", "L-KØLLE", "L-BALL", "L-AUTO"]>, "many">;
    cs_min: z.ZodOptional<z.ZodEnum<["CS0", "CS20", "CS30", "CS40", "CS50", "CS60", "CS70", "CS80", "CS90", "CS100"]>>;
    cs_max: z.ZodOptional<z.ZodEnum<["CS0", "CS20", "CS30", "CS40", "CS50", "CS60", "CS70", "CS80", "CS90", "CS100"]>>;
    environments: z.ZodArray<z.ZodEnum<["M0", "M1", "M2", "M3", "M4", "M5"]>, "many">;
    press_levels: z.ZodDefault<z.ZodArray<z.ZodEnum<["PR1", "PR2", "PR3", "PR4", "PR5"]>, "many">>;
    p_positions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    life_codes: z.ZodOptional<z.ZodArray<z.ZodEnum<["LIFE-SELV", "LIFE-SOS", "LIFE-EMO", "LIFE-KAR", "LIFE-RES"]>, "many">>;
    min_category: z.ZodDefault<z.ZodEnum<["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"]>>;
    max_category: z.ZodDefault<z.ZodEnum<["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"]>>;
    difficulty: z.ZodDefault<z.ZodEnum<["nybegynner", "rekrutt", "klubb", "regional", "nasjonal", "elite"]>>;
    equipment: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    players_min: z.ZodDefault<z.ZodNumber>;
    players_max: z.ZodDefault<z.ZodNumber>;
    trackman_metrics: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    source: z.ZodDefault<z.ZodEnum<["ak_original", "external", "ai_generated"]>>;
    source_url: z.ZodOptional<z.ZodString>;
    source_author: z.ZodOptional<z.ZodString>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    sg_area: z.ZodOptional<z.ZodEnum<["tee", "approach", "short_game", "putting"]>>;
    is_approved: z.ZodDefault<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    name: string;
    pyramid_level: "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN";
    difficulty: "nybegynner" | "rekrutt" | "klubb" | "regional" | "nasjonal" | "elite";
    goal: string;
    duration_minutes: number;
    environments: ("M0" | "M1" | "M2" | "M3" | "M4" | "M5")[];
    description: string;
    training_areas: ("TEE" | "INN200" | "INN150" | "INN100" | "INN50" | "CHIP" | "PITCH" | "LOB" | "BUNKER" | "PUTT0-3" | "PUTT3-5" | "PUTT5-10" | "PUTT10-15" | "PUTT15-25" | "PUTT25-40" | "PUTT40+")[];
    l_phases: ("L-KROPP" | "L-ARM" | "L-KØLLE" | "L-BALL" | "L-AUTO")[];
    press_levels: ("PR1" | "PR2" | "PR3" | "PR4" | "PR5")[];
    min_category: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K";
    max_category: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K";
    equipment: string[];
    players_min: number;
    players_max: number;
    trackman_metrics: string[];
    source: "ak_original" | "external" | "ai_generated";
    tags: string[];
    is_approved: boolean;
    instructions?: string | undefined;
    cs_min?: "CS0" | "CS20" | "CS30" | "CS40" | "CS50" | "CS60" | "CS70" | "CS80" | "CS90" | "CS100" | undefined;
    cs_max?: "CS0" | "CS20" | "CS30" | "CS40" | "CS50" | "CS60" | "CS70" | "CS80" | "CS90" | "CS100" | undefined;
    p_positions?: string[] | undefined;
    life_codes?: ("LIFE-SELV" | "LIFE-SOS" | "LIFE-EMO" | "LIFE-KAR" | "LIFE-RES")[] | undefined;
    source_url?: string | undefined;
    source_author?: string | undefined;
    sg_area?: "tee" | "approach" | "short_game" | "putting" | undefined;
}, {
    name: string;
    pyramid_level: "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN";
    goal: string;
    environments: ("M0" | "M1" | "M2" | "M3" | "M4" | "M5")[];
    description: string;
    training_areas: ("TEE" | "INN200" | "INN150" | "INN100" | "INN50" | "CHIP" | "PITCH" | "LOB" | "BUNKER" | "PUTT0-3" | "PUTT3-5" | "PUTT5-10" | "PUTT10-15" | "PUTT15-25" | "PUTT25-40" | "PUTT40+")[];
    l_phases: ("L-KROPP" | "L-ARM" | "L-KØLLE" | "L-BALL" | "L-AUTO")[];
    difficulty?: "nybegynner" | "rekrutt" | "klubb" | "regional" | "nasjonal" | "elite" | undefined;
    duration_minutes?: number | undefined;
    instructions?: string | undefined;
    cs_min?: "CS0" | "CS20" | "CS30" | "CS40" | "CS50" | "CS60" | "CS70" | "CS80" | "CS90" | "CS100" | undefined;
    cs_max?: "CS0" | "CS20" | "CS30" | "CS40" | "CS50" | "CS60" | "CS70" | "CS80" | "CS90" | "CS100" | undefined;
    press_levels?: ("PR1" | "PR2" | "PR3" | "PR4" | "PR5")[] | undefined;
    p_positions?: string[] | undefined;
    life_codes?: ("LIFE-SELV" | "LIFE-SOS" | "LIFE-EMO" | "LIFE-KAR" | "LIFE-RES")[] | undefined;
    min_category?: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | undefined;
    max_category?: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | undefined;
    equipment?: string[] | undefined;
    players_min?: number | undefined;
    players_max?: number | undefined;
    trackman_metrics?: string[] | undefined;
    source?: "ak_original" | "external" | "ai_generated" | undefined;
    source_url?: string | undefined;
    source_author?: string | undefined;
    tags?: string[] | undefined;
    sg_area?: "tee" | "approach" | "short_game" | "putting" | undefined;
    is_approved?: boolean | undefined;
}>;
export declare const DrillSearchInput: z.ZodObject<{
    pyramid_level: z.ZodOptional<z.ZodEnum<["FYS", "TEK", "SLAG", "SPILL", "TURN"]>>;
    training_area: z.ZodOptional<z.ZodEnum<["TEE", "INN200", "INN150", "INN100", "INN50", "CHIP", "PITCH", "LOB", "BUNKER", "PUTT0-3", "PUTT3-5", "PUTT5-10", "PUTT10-15", "PUTT15-25", "PUTT25-40", "PUTT40+"]>>;
    l_phase: z.ZodOptional<z.ZodEnum<["L-KROPP", "L-ARM", "L-KØLLE", "L-BALL", "L-AUTO"]>>;
    environment: z.ZodOptional<z.ZodEnum<["M0", "M1", "M2", "M3", "M4", "M5"]>>;
    category: z.ZodOptional<z.ZodEnum<["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"]>>;
    difficulty: z.ZodOptional<z.ZodEnum<["nybegynner", "rekrutt", "klubb", "regional", "nasjonal", "elite"]>>;
    trackman_metric: z.ZodOptional<z.ZodString>;
    tag: z.ZodOptional<z.ZodString>;
    sg_area: z.ZodOptional<z.ZodEnum<["tee", "approach", "short_game", "putting"]>>;
    approved_only: z.ZodDefault<z.ZodBoolean>;
    query: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    approved_only: boolean;
    limit: number;
    offset: number;
    category?: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | undefined;
    pyramid_level?: "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN" | undefined;
    difficulty?: "nybegynner" | "rekrutt" | "klubb" | "regional" | "nasjonal" | "elite" | undefined;
    sg_area?: "tee" | "approach" | "short_game" | "putting" | undefined;
    training_area?: "TEE" | "INN200" | "INN150" | "INN100" | "INN50" | "CHIP" | "PITCH" | "LOB" | "BUNKER" | "PUTT0-3" | "PUTT3-5" | "PUTT5-10" | "PUTT10-15" | "PUTT15-25" | "PUTT25-40" | "PUTT40+" | undefined;
    l_phase?: "L-KROPP" | "L-ARM" | "L-KØLLE" | "L-BALL" | "L-AUTO" | undefined;
    environment?: "M0" | "M1" | "M2" | "M3" | "M4" | "M5" | undefined;
    trackman_metric?: string | undefined;
    tag?: string | undefined;
    query?: string | undefined;
}, {
    category?: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | undefined;
    pyramid_level?: "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN" | undefined;
    difficulty?: "nybegynner" | "rekrutt" | "klubb" | "regional" | "nasjonal" | "elite" | undefined;
    sg_area?: "tee" | "approach" | "short_game" | "putting" | undefined;
    training_area?: "TEE" | "INN200" | "INN150" | "INN100" | "INN50" | "CHIP" | "PITCH" | "LOB" | "BUNKER" | "PUTT0-3" | "PUTT3-5" | "PUTT5-10" | "PUTT10-15" | "PUTT15-25" | "PUTT25-40" | "PUTT40+" | undefined;
    l_phase?: "L-KROPP" | "L-ARM" | "L-KØLLE" | "L-BALL" | "L-AUTO" | undefined;
    environment?: "M0" | "M1" | "M2" | "M3" | "M4" | "M5" | undefined;
    trackman_metric?: string | undefined;
    tag?: string | undefined;
    approved_only?: boolean | undefined;
    query?: string | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
}>;
export declare const DrillApproveInput: z.ZodObject<{
    drill_id: z.ZodString;
    approved: z.ZodBoolean;
}, "strict", z.ZodTypeAny, {
    drill_id: string;
    approved: boolean;
}, {
    drill_id: string;
    approved: boolean;
}>;
export declare const PlayerCreateInput: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    birth_date: z.ZodOptional<z.ZodString>;
    category: z.ZodDefault<z.ZodEnum<["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"]>>;
    avg_score: z.ZodOptional<z.ZodNumber>;
    handicap: z.ZodOptional<z.ZodNumber>;
    max_cs_driver: z.ZodOptional<z.ZodNumber>;
    max_cs_7iron: z.ZodOptional<z.ZodNumber>;
    max_cs_wedge: z.ZodOptional<z.ZodNumber>;
    current_period: z.ZodDefault<z.ZodEnum<["GRUNN", "SPES", "TURN"]>>;
    facilities: z.ZodDefault<z.ZodArray<z.ZodEnum<["M0", "M1", "M2", "M3", "M4", "M5"]>, "many">>;
    notes: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    name: string;
    category: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K";
    current_period: "TURN" | "GRUNN" | "SPES";
    facilities: ("M0" | "M1" | "M2" | "M3" | "M4" | "M5")[];
    handicap?: number | undefined;
    avg_score?: number | undefined;
    email?: string | undefined;
    birth_date?: string | undefined;
    max_cs_driver?: number | undefined;
    max_cs_7iron?: number | undefined;
    max_cs_wedge?: number | undefined;
    notes?: string | undefined;
}, {
    name: string;
    category?: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | undefined;
    handicap?: number | undefined;
    avg_score?: number | undefined;
    current_period?: "TURN" | "GRUNN" | "SPES" | undefined;
    email?: string | undefined;
    birth_date?: string | undefined;
    max_cs_driver?: number | undefined;
    max_cs_7iron?: number | undefined;
    max_cs_wedge?: number | undefined;
    facilities?: ("M0" | "M1" | "M2" | "M3" | "M4" | "M5")[] | undefined;
    notes?: string | undefined;
}>;
export declare const PlayerGetInput: z.ZodObject<{
    player_id: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    name?: string | undefined;
    player_id?: string | undefined;
}, {
    name?: string | undefined;
    player_id?: string | undefined;
}>;
export declare const SessionLogInput: z.ZodObject<{
    player_id: z.ZodString;
    date: z.ZodOptional<z.ZodString>;
    formula_id: z.ZodOptional<z.ZodString>;
    pyramid_level: z.ZodEnum<["FYS", "TEK", "SLAG", "SPILL", "TURN"]>;
    training_area: z.ZodOptional<z.ZodEnum<["TEE", "INN200", "INN150", "INN100", "INN50", "CHIP", "PITCH", "LOB", "BUNKER", "PUTT0-3", "PUTT3-5", "PUTT5-10", "PUTT10-15", "PUTT15-25", "PUTT25-40", "PUTT40+"]>>;
    l_phase: z.ZodOptional<z.ZodEnum<["L-KROPP", "L-ARM", "L-KØLLE", "L-BALL", "L-AUTO"]>>;
    cs_level: z.ZodOptional<z.ZodEnum<["CS0", "CS20", "CS30", "CS40", "CS50", "CS60", "CS70", "CS80", "CS90", "CS100"]>>;
    environment: z.ZodOptional<z.ZodEnum<["M0", "M1", "M2", "M3", "M4", "M5"]>>;
    press_level: z.ZodOptional<z.ZodEnum<["PR1", "PR2", "PR3", "PR4", "PR5"]>>;
    p_positions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    life_code: z.ZodOptional<z.ZodEnum<["LIFE-SELV", "LIFE-SOS", "LIFE-EMO", "LIFE-KAR", "LIFE-RES"]>>;
    period: z.ZodOptional<z.ZodEnum<["GRUNN", "SPES", "TURN"]>>;
    week_type: z.ZodOptional<z.ZodEnum<["TURNERINGSUKE", "TRENINGSUKE"]>>;
    duration_minutes: z.ZodNumber;
    drill_ids: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    notes: z.ZodOptional<z.ZodString>;
    coach_notes: z.ZodOptional<z.ZodString>;
    rating: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    pyramid_level: "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN";
    duration_minutes: number;
    player_id: string;
    drill_ids: string[];
    date?: string | undefined;
    p_positions?: string[] | undefined;
    training_area?: "TEE" | "INN200" | "INN150" | "INN100" | "INN50" | "CHIP" | "PITCH" | "LOB" | "BUNKER" | "PUTT0-3" | "PUTT3-5" | "PUTT5-10" | "PUTT10-15" | "PUTT15-25" | "PUTT25-40" | "PUTT40+" | undefined;
    l_phase?: "L-KROPP" | "L-ARM" | "L-KØLLE" | "L-BALL" | "L-AUTO" | undefined;
    environment?: "M0" | "M1" | "M2" | "M3" | "M4" | "M5" | undefined;
    notes?: string | undefined;
    formula_id?: string | undefined;
    cs_level?: "CS0" | "CS20" | "CS30" | "CS40" | "CS50" | "CS60" | "CS70" | "CS80" | "CS90" | "CS100" | undefined;
    press_level?: "PR1" | "PR2" | "PR3" | "PR4" | "PR5" | undefined;
    life_code?: "LIFE-SELV" | "LIFE-SOS" | "LIFE-EMO" | "LIFE-KAR" | "LIFE-RES" | undefined;
    period?: "TURN" | "GRUNN" | "SPES" | undefined;
    week_type?: "TURNERINGSUKE" | "TRENINGSUKE" | undefined;
    coach_notes?: string | undefined;
    rating?: number | undefined;
}, {
    pyramid_level: "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN";
    duration_minutes: number;
    player_id: string;
    date?: string | undefined;
    p_positions?: string[] | undefined;
    training_area?: "TEE" | "INN200" | "INN150" | "INN100" | "INN50" | "CHIP" | "PITCH" | "LOB" | "BUNKER" | "PUTT0-3" | "PUTT3-5" | "PUTT5-10" | "PUTT10-15" | "PUTT15-25" | "PUTT25-40" | "PUTT40+" | undefined;
    l_phase?: "L-KROPP" | "L-ARM" | "L-KØLLE" | "L-BALL" | "L-AUTO" | undefined;
    environment?: "M0" | "M1" | "M2" | "M3" | "M4" | "M5" | undefined;
    notes?: string | undefined;
    formula_id?: string | undefined;
    cs_level?: "CS0" | "CS20" | "CS30" | "CS40" | "CS50" | "CS60" | "CS70" | "CS80" | "CS90" | "CS100" | undefined;
    press_level?: "PR1" | "PR2" | "PR3" | "PR4" | "PR5" | undefined;
    life_code?: "LIFE-SELV" | "LIFE-SOS" | "LIFE-EMO" | "LIFE-KAR" | "LIFE-RES" | undefined;
    period?: "TURN" | "GRUNN" | "SPES" | undefined;
    week_type?: "TURNERINGSUKE" | "TRENINGSUKE" | undefined;
    drill_ids?: string[] | undefined;
    coach_notes?: string | undefined;
    rating?: number | undefined;
}>;
export declare const SessionHistoryInput: z.ZodObject<{
    player_id: z.ZodString;
    days: z.ZodDefault<z.ZodNumber>;
    pyramid_level: z.ZodOptional<z.ZodEnum<["FYS", "TEK", "SLAG", "SPILL", "TURN"]>>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    limit: number;
    player_id: string;
    days: number;
    pyramid_level?: "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN" | undefined;
}, {
    player_id: string;
    pyramid_level?: "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN" | undefined;
    limit?: number | undefined;
    days?: number | undefined;
}>;
export declare const TrackmanShotInput: z.ZodObject<{
    club: z.ZodString;
    club_speed: z.ZodOptional<z.ZodNumber>;
    ball_speed: z.ZodOptional<z.ZodNumber>;
    smash_factor: z.ZodOptional<z.ZodNumber>;
    launch_angle: z.ZodOptional<z.ZodNumber>;
    spin_rate: z.ZodOptional<z.ZodNumber>;
    carry_distance: z.ZodOptional<z.ZodNumber>;
    total_distance: z.ZodOptional<z.ZodNumber>;
    face_angle: z.ZodOptional<z.ZodNumber>;
    club_path: z.ZodOptional<z.ZodNumber>;
    attack_angle: z.ZodOptional<z.ZodNumber>;
    face_to_path: z.ZodOptional<z.ZodNumber>;
    apex_height: z.ZodOptional<z.ZodNumber>;
    landing_angle: z.ZodOptional<z.ZodNumber>;
    lateral_landing: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    club: string;
    club_speed?: number | undefined;
    ball_speed?: number | undefined;
    smash_factor?: number | undefined;
    launch_angle?: number | undefined;
    spin_rate?: number | undefined;
    carry_distance?: number | undefined;
    total_distance?: number | undefined;
    face_angle?: number | undefined;
    club_path?: number | undefined;
    attack_angle?: number | undefined;
    face_to_path?: number | undefined;
    apex_height?: number | undefined;
    landing_angle?: number | undefined;
    lateral_landing?: number | undefined;
}, {
    club: string;
    club_speed?: number | undefined;
    ball_speed?: number | undefined;
    smash_factor?: number | undefined;
    launch_angle?: number | undefined;
    spin_rate?: number | undefined;
    carry_distance?: number | undefined;
    total_distance?: number | undefined;
    face_angle?: number | undefined;
    club_path?: number | undefined;
    attack_angle?: number | undefined;
    face_to_path?: number | undefined;
    apex_height?: number | undefined;
    landing_angle?: number | undefined;
    lateral_landing?: number | undefined;
}>;
export declare const TrackmanLogInput: z.ZodObject<{
    player_id: z.ZodString;
    session_id: z.ZodOptional<z.ZodString>;
    source: z.ZodDefault<z.ZodEnum<["screenshot", "csv", "manual"]>>;
    shots: z.ZodArray<z.ZodObject<{
        club: z.ZodString;
        club_speed: z.ZodOptional<z.ZodNumber>;
        ball_speed: z.ZodOptional<z.ZodNumber>;
        smash_factor: z.ZodOptional<z.ZodNumber>;
        launch_angle: z.ZodOptional<z.ZodNumber>;
        spin_rate: z.ZodOptional<z.ZodNumber>;
        carry_distance: z.ZodOptional<z.ZodNumber>;
        total_distance: z.ZodOptional<z.ZodNumber>;
        face_angle: z.ZodOptional<z.ZodNumber>;
        club_path: z.ZodOptional<z.ZodNumber>;
        attack_angle: z.ZodOptional<z.ZodNumber>;
        face_to_path: z.ZodOptional<z.ZodNumber>;
        apex_height: z.ZodOptional<z.ZodNumber>;
        landing_angle: z.ZodOptional<z.ZodNumber>;
        lateral_landing: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        club: string;
        club_speed?: number | undefined;
        ball_speed?: number | undefined;
        smash_factor?: number | undefined;
        launch_angle?: number | undefined;
        spin_rate?: number | undefined;
        carry_distance?: number | undefined;
        total_distance?: number | undefined;
        face_angle?: number | undefined;
        club_path?: number | undefined;
        attack_angle?: number | undefined;
        face_to_path?: number | undefined;
        apex_height?: number | undefined;
        landing_angle?: number | undefined;
        lateral_landing?: number | undefined;
    }, {
        club: string;
        club_speed?: number | undefined;
        ball_speed?: number | undefined;
        smash_factor?: number | undefined;
        launch_angle?: number | undefined;
        spin_rate?: number | undefined;
        carry_distance?: number | undefined;
        total_distance?: number | undefined;
        face_angle?: number | undefined;
        club_path?: number | undefined;
        attack_angle?: number | undefined;
        face_to_path?: number | undefined;
        apex_height?: number | undefined;
        landing_angle?: number | undefined;
        lateral_landing?: number | undefined;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    source: "screenshot" | "csv" | "manual";
    player_id: string;
    shots: {
        club: string;
        club_speed?: number | undefined;
        ball_speed?: number | undefined;
        smash_factor?: number | undefined;
        launch_angle?: number | undefined;
        spin_rate?: number | undefined;
        carry_distance?: number | undefined;
        total_distance?: number | undefined;
        face_angle?: number | undefined;
        club_path?: number | undefined;
        attack_angle?: number | undefined;
        face_to_path?: number | undefined;
        apex_height?: number | undefined;
        landing_angle?: number | undefined;
        lateral_landing?: number | undefined;
    }[];
    session_id?: string | undefined;
}, {
    player_id: string;
    shots: {
        club: string;
        club_speed?: number | undefined;
        ball_speed?: number | undefined;
        smash_factor?: number | undefined;
        launch_angle?: number | undefined;
        spin_rate?: number | undefined;
        carry_distance?: number | undefined;
        total_distance?: number | undefined;
        face_angle?: number | undefined;
        club_path?: number | undefined;
        attack_angle?: number | undefined;
        face_to_path?: number | undefined;
        apex_height?: number | undefined;
        landing_angle?: number | undefined;
        lateral_landing?: number | undefined;
    }[];
    source?: "screenshot" | "csv" | "manual" | undefined;
    session_id?: string | undefined;
}>;
export declare const TrackmanAnalyzeInput: z.ZodObject<{
    player_id: z.ZodString;
    days: z.ZodDefault<z.ZodNumber>;
    club: z.ZodOptional<z.ZodString>;
    metrics: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strict", z.ZodTypeAny, {
    player_id: string;
    days: number;
    club?: string | undefined;
    metrics?: string[] | undefined;
}, {
    player_id: string;
    days?: number | undefined;
    club?: string | undefined;
    metrics?: string[] | undefined;
}>;
export declare const VoiceNoteCreateInput: z.ZodObject<{
    player_id: z.ZodOptional<z.ZodString>;
    session_id: z.ZodOptional<z.ZodString>;
    author_type: z.ZodDefault<z.ZodEnum<["coach", "player"]>>;
    transcript: z.ZodString;
    summary: z.ZodOptional<z.ZodString>;
    key_points: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    duration_seconds: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    tags: string[];
    author_type: "coach" | "player";
    transcript: string;
    player_id?: string | undefined;
    session_id?: string | undefined;
    summary?: string | undefined;
    key_points?: string[] | undefined;
    duration_seconds?: number | undefined;
}, {
    transcript: string;
    tags?: string[] | undefined;
    player_id?: string | undefined;
    session_id?: string | undefined;
    author_type?: "coach" | "player" | undefined;
    summary?: string | undefined;
    key_points?: string[] | undefined;
    duration_seconds?: number | undefined;
}>;
export declare const VoiceNoteSearchInput: z.ZodObject<{
    player_id: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    days: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    limit: number;
    days: number;
    query?: string | undefined;
    player_id?: string | undefined;
}, {
    query?: string | undefined;
    limit?: number | undefined;
    player_id?: string | undefined;
    days?: number | undefined;
}>;
export declare const TrainingPlanGenerateInput: z.ZodObject<{
    player_id: z.ZodString;
    week_start: z.ZodString;
    period: z.ZodOptional<z.ZodEnum<["GRUNN", "SPES", "TURN"]>>;
    week_type: z.ZodOptional<z.ZodEnum<["TURNERINGSUKE", "TRENINGSUKE"]>>;
    focus_areas: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    exclude_drills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strict", z.ZodTypeAny, {
    player_id: string;
    week_start: string;
    period?: "TURN" | "GRUNN" | "SPES" | undefined;
    week_type?: "TURNERINGSUKE" | "TRENINGSUKE" | undefined;
    focus_areas?: string[] | undefined;
    exclude_drills?: string[] | undefined;
}, {
    player_id: string;
    week_start: string;
    period?: "TURN" | "GRUNN" | "SPES" | undefined;
    week_type?: "TURNERINGSUKE" | "TRENINGSUKE" | undefined;
    focus_areas?: string[] | undefined;
    exclude_drills?: string[] | undefined;
}>;
export declare const TrainingPlanGetInput: z.ZodObject<{
    player_id: z.ZodString;
    week_start: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    player_id: string;
    week_start?: string | undefined;
}, {
    player_id: string;
    week_start?: string | undefined;
}>;
export declare const TestLogInput: z.ZodObject<{
    player_id: z.ZodString;
    test_date: z.ZodOptional<z.ZodString>;
    driver_cs: z.ZodOptional<z.ZodNumber>;
    iron7_cs: z.ZodOptional<z.ZodNumber>;
    wedge_cs: z.ZodOptional<z.ZodNumber>;
    driver_pei: z.ZodOptional<z.ZodNumber>;
    iron7_pei: z.ZodOptional<z.ZodNumber>;
    wedge_pei: z.ZodOptional<z.ZodNumber>;
    approach_50m_distance: z.ZodOptional<z.ZodNumber>;
    approach_100m_distance: z.ZodOptional<z.ZodNumber>;
    putt_3ft_pct: z.ZodOptional<z.ZodNumber>;
    putt_6ft_pct: z.ZodOptional<z.ZodNumber>;
    putt_15ft_distance: z.ZodOptional<z.ZodNumber>;
    putt_30ft_distance: z.ZodOptional<z.ZodNumber>;
    stableford_9: z.ZodOptional<z.ZodNumber>;
    stableford_18: z.ZodOptional<z.ZodNumber>;
    scramble_pct: z.ZodOptional<z.ZodNumber>;
    flexibility_score: z.ZodOptional<z.ZodNumber>;
    plank_seconds: z.ZodOptional<z.ZodNumber>;
    balance_seconds: z.ZodOptional<z.ZodNumber>;
    focus_test: z.ZodOptional<z.ZodString>;
    preshot_score: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
    tested_by: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    player_id: string;
    notes?: string | undefined;
    test_date?: string | undefined;
    driver_cs?: number | undefined;
    iron7_cs?: number | undefined;
    wedge_cs?: number | undefined;
    driver_pei?: number | undefined;
    iron7_pei?: number | undefined;
    wedge_pei?: number | undefined;
    approach_50m_distance?: number | undefined;
    approach_100m_distance?: number | undefined;
    putt_3ft_pct?: number | undefined;
    putt_6ft_pct?: number | undefined;
    putt_15ft_distance?: number | undefined;
    putt_30ft_distance?: number | undefined;
    stableford_9?: number | undefined;
    stableford_18?: number | undefined;
    scramble_pct?: number | undefined;
    flexibility_score?: number | undefined;
    plank_seconds?: number | undefined;
    balance_seconds?: number | undefined;
    focus_test?: string | undefined;
    preshot_score?: number | undefined;
    tested_by?: string | undefined;
}, {
    player_id: string;
    notes?: string | undefined;
    test_date?: string | undefined;
    driver_cs?: number | undefined;
    iron7_cs?: number | undefined;
    wedge_cs?: number | undefined;
    driver_pei?: number | undefined;
    iron7_pei?: number | undefined;
    wedge_pei?: number | undefined;
    approach_50m_distance?: number | undefined;
    approach_100m_distance?: number | undefined;
    putt_3ft_pct?: number | undefined;
    putt_6ft_pct?: number | undefined;
    putt_15ft_distance?: number | undefined;
    putt_30ft_distance?: number | undefined;
    stableford_9?: number | undefined;
    stableford_18?: number | undefined;
    scramble_pct?: number | undefined;
    flexibility_score?: number | undefined;
    plank_seconds?: number | undefined;
    balance_seconds?: number | undefined;
    focus_test?: string | undefined;
    preshot_score?: number | undefined;
    tested_by?: string | undefined;
}>;
export declare const BPLogInput: z.ZodObject<{
    player_id: z.ZodString;
    session_id: z.ZodOptional<z.ZodString>;
    bp_type: z.ZodEnum<["CS", "M", "PR"]>;
    threshold: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    player_id: string;
    bp_type: "CS" | "M" | "PR";
    threshold: string;
    description?: string | undefined;
    session_id?: string | undefined;
}, {
    player_id: string;
    bp_type: "CS" | "M" | "PR";
    threshold: string;
    description?: string | undefined;
    session_id?: string | undefined;
}>;
export declare const PaginatedOutput: z.ZodObject<{
    total: z.ZodNumber;
    count: z.ZodNumber;
    offset: z.ZodNumber;
    has_more: z.ZodBoolean;
    next_offset: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    offset: number;
    total: number;
    count: number;
    has_more: boolean;
    next_offset?: number | undefined;
}, {
    offset: number;
    total: number;
    count: number;
    has_more: boolean;
    next_offset?: number | undefined;
}>;
export declare const DrillOutput: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    goal: z.ZodString;
    pyramid_level: z.ZodString;
    training_areas: z.ZodArray<z.ZodString, "many">;
    difficulty: z.ZodString;
    duration_minutes: z.ZodNumber;
    is_approved: z.ZodBoolean;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodString;
    name: z.ZodString;
    goal: z.ZodString;
    pyramid_level: z.ZodString;
    training_areas: z.ZodArray<z.ZodString, "many">;
    difficulty: z.ZodString;
    duration_minutes: z.ZodNumber;
    is_approved: z.ZodBoolean;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodString;
    name: z.ZodString;
    goal: z.ZodString;
    pyramid_level: z.ZodString;
    training_areas: z.ZodArray<z.ZodString, "many">;
    difficulty: z.ZodString;
    duration_minutes: z.ZodNumber;
    is_approved: z.ZodBoolean;
}, z.ZodTypeAny, "passthrough">>;
export declare const PlayerOutput: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    category: z.ZodString;
    handicap: z.ZodNullable<z.ZodNumber>;
    avg_score: z.ZodNullable<z.ZodNumber>;
    current_period: z.ZodNullable<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodString;
    name: z.ZodString;
    category: z.ZodString;
    handicap: z.ZodNullable<z.ZodNumber>;
    avg_score: z.ZodNullable<z.ZodNumber>;
    current_period: z.ZodNullable<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodString;
    name: z.ZodString;
    category: z.ZodString;
    handicap: z.ZodNullable<z.ZodNumber>;
    avg_score: z.ZodNullable<z.ZodNumber>;
    current_period: z.ZodNullable<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
export declare const SessionSummaryOutput: z.ZodObject<{
    period_days: z.ZodNumber;
    total_sessions: z.ZodNumber;
    total_minutes: z.ZodNumber;
    total_hours: z.ZodNumber;
    distribution_pct: z.ZodRecord<z.ZodString, z.ZodNumber>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    period_days: z.ZodNumber;
    total_sessions: z.ZodNumber;
    total_minutes: z.ZodNumber;
    total_hours: z.ZodNumber;
    distribution_pct: z.ZodRecord<z.ZodString, z.ZodNumber>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    period_days: z.ZodNumber;
    total_sessions: z.ZodNumber;
    total_minutes: z.ZodNumber;
    total_hours: z.ZodNumber;
    distribution_pct: z.ZodRecord<z.ZodString, z.ZodNumber>;
}, z.ZodTypeAny, "passthrough">>;
export declare const TrackmanAnalysisOutput: z.ZodObject<{
    player_id: z.ZodString;
    period_days: z.ZodNumber;
    total_shots: z.ZodNumber;
    total_sessions: z.ZodNumber;
    by_club: z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodNumber>>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    player_id: z.ZodString;
    period_days: z.ZodNumber;
    total_shots: z.ZodNumber;
    total_sessions: z.ZodNumber;
    by_club: z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodNumber>>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    player_id: z.ZodString;
    period_days: z.ZodNumber;
    total_shots: z.ZodNumber;
    total_sessions: z.ZodNumber;
    by_club: z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodNumber>>>;
}, z.ZodTypeAny, "passthrough">>;
export declare const TestComparisonOutput: z.ZodObject<{
    player: z.ZodString;
    current_category: z.ZodString;
    next_category: z.ZodNullable<z.ZodString>;
    categories_passed: z.ZodNullable<z.ZodNumber>;
    promotion_ready: z.ZodBoolean;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    player: z.ZodString;
    current_category: z.ZodString;
    next_category: z.ZodNullable<z.ZodString>;
    categories_passed: z.ZodNullable<z.ZodNumber>;
    promotion_ready: z.ZodBoolean;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    player: z.ZodString;
    current_category: z.ZodString;
    next_category: z.ZodNullable<z.ZodString>;
    categories_passed: z.ZodNullable<z.ZodNumber>;
    promotion_ready: z.ZodBoolean;
}, z.ZodTypeAny, "passthrough">>;
//# sourceMappingURL=index.d.ts.map