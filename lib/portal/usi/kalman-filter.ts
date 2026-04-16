/**
 * 1D Kalman Filter for temporal smoothing of USI dimensions.
 *
 * Used to smooth out noisy USI snapshots and generate short-term
 * predictions (30d / 90d HCP forecasts).
 */

export interface KalmanState {
  x: number; // estimated state
  P: number; // error covariance
}

export class KalmanFilter1D {
  private Q: number; // process noise
  private R: number; // measurement noise

  constructor(Q = 0.01, R = 0.1) {
    this.Q = Q;
    this.R = R;
  }

  predict(state: KalmanState): KalmanState {
    // x = x (transition = identity)
    // P = P + Q
    return { x: state.x, P: state.P + this.Q };
  }

  update(state: KalmanState, measurement: number): KalmanState {
    // Kalman gain
    const K = state.P / (state.P + this.R);
    // Updated estimate
    const x = state.x + K * (measurement - state.x);
    // Updated covariance
    const P = (1 - K) * state.P;
    return { x, P };
  }

  filter(measurements: number[]): KalmanState[] {
    if (measurements.length === 0) return [];
    const states: KalmanState[] = [];
    let state: KalmanState = { x: measurements[0], P: 1 };
    for (const z of measurements) {
      state = this.predict(state);
      state = this.update(state, z);
      states.push({ ...state });
    }
    return states;
  }

  /**
   * Forecast n steps ahead from the current state.
   */
  forecast(state: KalmanState, steps: number): number {
    // With identity transition, the prediction is just the current state
    // but uncertainty grows: P = P + steps * Q
    return state.x;
  }
}

export interface HcpForecast {
  predictedHcp30d: number | null;
  predictedHcp90d: number | null;
  trendSlope: number; // change per day
}

/**
 * Run Kalman smoothing on historical USI snapshots and forecast HCP.
 */
export function forecastHcpFromSnapshots(
  snapshots: { estimatedHandicap: number; createdAt: Date }[]
): HcpForecast {
  if (snapshots.length < 3) {
    return { predictedHcp30d: null, predictedHcp90d: null, trendSlope: 0 };
  }

  const sorted = [...snapshots].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  );
  const hcpValues = sorted.map((s) => s.estimatedHandicap);

  const kf = new KalmanFilter1D(0.005, 0.15);
  const smoothed = kf.filter(hcpValues);
  const lastState = smoothed[smoothed.length - 1];

  // Estimate trend slope from last N smoothed points (simple linear regression)
  const n = Math.min(10, smoothed.length);
  const recent = smoothed.slice(-n);
  const xs = recent.map((_, i) => i);
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = recent.reduce((sum, s) => sum + s.x, 0) / n;
  const num = recent.reduce((sum, s, i) => sum + (i - meanX) * (s.x - meanY), 0);
  const den = recent.reduce((sum, _, i) => sum + (i - meanX) ** 2, 0);
  const slope = den === 0 ? 0 : num / den; // HCP change per snapshot interval

  // Assume snapshots are roughly daily (cron runs daily)
  const predicted30 = lastState.x + slope * 30;
  const predicted90 = lastState.x + slope * 90;

  return {
    predictedHcp30d: Math.max(0, predicted30),
    predictedHcp90d: Math.max(0, predicted90),
    trendSlope: slope,
  };
}
