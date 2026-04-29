"use client";

import { useActionState } from "react";
import { joinWaitlist, type JoinWaitlistResult } from "../../app/booking-v2/actions";

const INITIAL: JoinWaitlistResult = { ok: false };

export function WaitlistForm() {
  const [state, formAction, pending] = useActionState<
    JoinWaitlistResult,
    FormData
  >(joinWaitlist, INITIAL);

  if (state.ok) {
    return (
      <div>
        <h3 className="t-card-title" style={{ margin: "0 0 16px" }}>
          Du er på ventelisten.
        </h3>
        <p style={{ color: "var(--ink-muted)" }}>
          Du er nummer{" "}
          <b style={{ color: "var(--ink)" }}>{state.position ?? "?"}</b> i
          køen. Vi varsler deg så snart noen avbestiller — du takker bare ja
          om det passer.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction}>
      <h3 className="t-card-title" style={{ margin: "0 0 24px" }}>
        Sett meg på ventelisten
      </h3>

      {state.error ? (
        <div role="alert" className="form-error" style={{ marginBottom: 16 }}>
          {state.error}
        </div>
      ) : null}

      <div className="form-grid">
        <div className="field span2">
          <label>E-post</label>
          <input
            type="email"
            name="email"
            placeholder="din@epost.no"
            required
          />
        </div>
        <div className="field">
          <label>Mobil</label>
          <input type="tel" name="phone" placeholder="+47" />
        </div>
        <div className="field">
          <label>Foretrukket dag</label>
          <select name="preferredDay" defaultValue="any">
            <option value="any">Hvilken som helst</option>
            <option value="weekday">Bare hverdager</option>
            <option value="weekend">Bare helg</option>
          </select>
        </div>
        <div className="field span2">
          <label>Tidsvindu</label>
          <select name="preferredTime" defaultValue="any">
            <option value="any">Hvilken som helst tid</option>
            <option value="morning">Morgen (07–11)</option>
            <option value="afternoon">Ettermiddag (11–17)</option>
            <option value="evening">Kveld (17–21)</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-accent"
        style={{ marginTop: 32 }}
        disabled={pending}
      >
        {pending ? "Sender …" : "Bli varslet ved første ledige →"}
      </button>
    </form>
  );
}
