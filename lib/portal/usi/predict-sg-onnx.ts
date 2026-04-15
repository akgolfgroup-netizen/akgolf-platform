/**
 * TrackMan → SG ONNX inference
 *
 * Loads the trained Random Forest model exported from Python
 * and predicts SG dimensions from aggregated TrackMan features.
 */

import { InferenceSession, Tensor } from "onnxruntime-node";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const MODEL_PATH = join(process.cwd(), "ml", "models", "trackman_sg_v1.onnx");
const METADATA_PATH = join(process.cwd(), "ml", "models", "trackman_sg_v1_metadata.json");

export interface TrackManFeatures {
  ballSpeedMean: number;
  ballSpeedStd: number;
  launchAngleMean: number;
  spinRateMean: number;
  spinAxisMean: number;
  carryDistanceMean: number;
  carryDistanceStd: number;
  totalDistanceMean: number;
  offlineDistanceMean: number;
  offlineDistanceStd: number;
  smashFactorMean: number;
  clubSpeedMean: number;
  attackAngleMean: number;
  clubPathMean: number;
  faceAngleMean: number;
  faceToPathMean: number;
  dynamicLoftMean: number;
  driverBallSpeedMean: number | null;
  driverCarryMean: number | null;
  ironBallSpeedMean: number | null;
  ironCarryMean: number | null;
  wedgeBallSpeedMean: number | null;
  wedgeCarryMean: number | null;
}

export interface SGPrediction {
  sgOtt: number;
  sgApp: number;
  sgArg: number;
  sgPutt: number;
  confidence: number; // model confidence proxy (e.g. R² average)
}

let session: InferenceSession | null = null;
let metadata: {
  feature_names: string[];
  output_names: string[];
  n_features: number;
  n_outputs: number;
  r2_scores?: Record<string, number>;
} | null = null;

function loadMetadata() {
  if (!existsSync(METADATA_PATH)) return null;
  try {
    const raw = readFileSync(METADATA_PATH, "utf-8");
    return JSON.parse(raw) as typeof metadata;
  } catch {
    return null;
  }
}

export function isOnnxModelAvailable(): boolean {
  return existsSync(MODEL_PATH);
}

async function getSession(): Promise<InferenceSession | null> {
  if (session) return session;
  if (!isOnnxModelAvailable()) return null;
  session = await InferenceSession.create(MODEL_PATH);
  metadata = loadMetadata();
  return session;
}

function featuresToArray(features: TrackManFeatures): number[] {
  // Order must match the Python training script FEATURE_COLS exactly
  return [
    features.ballSpeedMean,
    features.ballSpeedStd,
    features.launchAngleMean,
    features.spinRateMean,
    features.spinAxisMean,
    features.carryDistanceMean,
    features.carryDistanceStd,
    features.totalDistanceMean,
    features.offlineDistanceMean,
    features.offlineDistanceStd,
    features.smashFactorMean,
    features.clubSpeedMean,
    features.attackAngleMean,
    features.clubPathMean,
    features.faceAngleMean,
    features.faceToPathMean,
    features.dynamicLoftMean,
    features.driverBallSpeedMean ?? 0,
    features.driverCarryMean ?? 0,
    features.ironBallSpeedMean ?? 0,
    features.ironCarryMean ?? 0,
    features.wedgeBallSpeedMean ?? 0,
    features.wedgeCarryMean ?? 0,
  ];
}

/**
 * Predict SG dimensions from aggregated TrackMan features.
 * Returns null if the ONNX model is not available.
 */
export async function predictSGFromTrackMan(
  features: TrackManFeatures
): Promise<SGPrediction | null> {
  const sess = await getSession();
  if (!sess) return null;

  const inputArray = featuresToArray(features);
  const inputTensor = new Tensor("float32", new Float32Array(inputArray), [1, inputArray.length]);

  const feeds: Record<string, Tensor> = {};
  // ONNX runtime for sklearn models often names the first input "float_input"
  const inputName = sess.inputNames[0] ?? "float_input";
  feeds[inputName] = inputTensor;

  const results = await sess.run(feeds);
  const outputName = sess.outputNames[0];
  const output = results[outputName] as Tensor;
  const values = Array.from(output.data as Float32Array);

  const r2Map = metadata?.r2_scores ?? {};
  const avgR2 =
    Object.values(r2Map).reduce((a, b) => a + b, 0) /
    Math.max(1, Object.values(r2Map).length);

  return {
    sgOtt: values[0] ?? 0,
    sgApp: values[1] ?? 0,
    sgArg: values[2] ?? 0,
    sgPutt: values[3] ?? 0,
    confidence: avgR2,
  };
}
