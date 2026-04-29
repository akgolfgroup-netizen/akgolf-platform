"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import {
  TestCard,
  TestDoneSummary,
  TestActionRow,
} from "./test-card";
import {
  TestInstructions,
  ScoreField,
  InputPair,
  TallyCard,
} from "./test-instructions";
import { KartleggingHero } from "./kartlegging-hero";
import { BottomProgressBar } from "./bottom-progress-bar";
import type { KartleggingData } from "@/app/portal/(dashboard)/kartlegging/actions";

interface KartleggingClientV2Props {
  data: KartleggingData;
}

export function KartleggingClientV2({ data }: KartleggingClientV2Props) {
  const router = useRouter();

  // Map test history → done/active/pending for the 3 baseline tests
  const testNumbers = useMemo(() => {
    const completed = new Set<number>();
    if (data.testHistory) {
      for (const num of Object.keys(data.testHistory.byNumber)) {
        completed.add(parseInt(num));
      }
    }
    return completed;
  }, [data.testHistory]);

  const t1Status = testNumbers.has(1) ? "done" : "active";
  const t2Status = testNumbers.has(1)
    ? testNumbers.has(2)
      ? "done"
      : "active"
    : "pending";
  const t3Status = testNumbers.has(2)
    ? testNumbers.has(3)
      ? "done"
      : "active"
    : "pending";

  const completed =
    (t1Status === "done" ? 1 : 0) +
    (t2Status === "done" ? 1 : 0) +
    (t3Status === "done" ? 1 : 0);

  // Lokal state for test-input (visuell — lagring kobles til actions ved fullføring)
  const [test2Score, setTest2Score] = useState(42);
  const [test2Putts, setTest2Putts] = useState(17);
  const [test2Fairways, setTest2Fairways] = useState(4);
  const [test2GIR, setTest2GIR] = useState(3);

  const [test3Three, setTest3Three] = useState(8);
  const [test3Six, setTest3Six] = useState(5);
  const [test3Ten, setTest3Ten] = useState(2);
  const [test3Avg, setTest3Avg] = useState(0);
  const [test3Total, setTest3Total] = useState(0);

  const minutesLeft =
    completed === 0 ? 60 : completed === 1 ? 40 : completed === 2 ? 15 : 0;

  return (
    <>
      <div className="space-y-4 pb-24">
        <KartleggingHero
          completed={completed}
          total={3}
          estimatedMinutesLeft={minutesLeft}
          location={data.profile?.tournamentContext}
        />

        {/* Test 1 — 50-100-150 */}
        <TestCard
          number={1}
          unit="50–150m"
          title="50-100-150 jern-spredning"
          meta={
            t1Status === "done"
              ? "5 BALLER × 3 LENGDER · TRACKMAN ELLER MÅL · ✓ FULLFØRT"
              : "5 BALLER × 3 LENGDER · TRACKMAN ELLER MÅL"
          }
          status={t1Status}
          footer={
            t1Status !== "done" ? (
              <TestActionRow
                leftLabel="IKKE STARTET"
                primaryLabel="Start test 1"
                primaryIcon="play"
                onPrimary={() => router.push("/portal/tester/ny")}
                onSkip={() => router.push("/portal")}
              />
            ) : undefined
          }
        >
          {t1Status === "done" ? (
            <TestDoneSummary
              message="Test 1 fullført — vi loggfører som SG-baseline."
              stats={[
                { label: "Avg 50m", value: "2.4m" },
                { label: "Avg 100m", value: "5.8m" },
                { label: "Avg 150m", value: "8.2m" },
              ]}
            />
          ) : (
            <TestInstructions
              steps={[
                "Slå 5 baller mot mål på 50m, 100m og 150m fra range eller TrackMan.",
                "Mål spredning per lengde — Anders trekker baseline ut av snitt-feilen.",
                "Logg resultatet inn under, eller la TrackMan synkes automatisk.",
              ]}
            />
          )}
        </TestCard>

        {/* Test 2 — 9-hull */}
        <TestCard
          number={2}
          unit="9 hull"
          title="9-hulls test-runde"
          meta="FRA HVITT TEE · BASELINE FOR SCORE · CA. 90 MIN"
          status={t2Status}
          footer={
            <TestActionRow
              leftLabel="SISTE LAGRING 1 MIN SIDEN"
              primaryLabel="Fullfør test"
              primaryIcon="check"
              onPrimary={() => router.push("/portal/runde/ny")}
              onSkip={() => router.push("/portal")}
            />
          }
        >
          {t2Status === "active" ? (
            <>
              <TestInstructions
                steps={[
                  "Spill hull 1–9 fra hvitt tee, normale regler — ingen mulligans, putt alt ut.",
                  "Logg score per hull i tabellen under, eller la GolfBox-runde-loggen synkes automatisk.",
                  "Noter også antall fairways truffet og antall greens i regulering. Disse er valgfrie men hjelper baselinen vår.",
                ]}
              />
              <ScoreField
                label="Total score · 9 hull"
                value={test2Score}
                onChange={setTest2Score}
                rightLabel="Mål-baseline"
                rightValue="~ 41 strokes"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                <InputPair
                  label="Putts totalt"
                  value={test2Putts}
                  unit="putts"
                  onChange={setTest2Putts}
                />
                <InputPair
                  label="Fairways truffet"
                  value={test2Fairways}
                  unit="/ 7"
                  onChange={setTest2Fairways}
                />
                <InputPair
                  label="Greens i regulering"
                  value={test2GIR}
                  unit="/ 9"
                  onChange={setTest2GIR}
                />
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-[10px] px-3.5 py-2 text-[12px] font-semibold mb-2"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Hent fra GolfBox
              </button>
            </>
          ) : t2Status === "done" ? (
            <TestDoneSummary
              message="9-hulls test logget."
              stats={[
                { label: "Score", value: `${test2Score}` },
                { label: "Putts", value: `${test2Putts}` },
                { label: "GIR", value: `${test2GIR}/9` },
              ]}
            />
          ) : (
            <TestInstructions
              steps={[
                "Fullfør test 1 først så låser vi opp 9-hulls runden.",
                "Bruker 90 minutter — fra hvitt tee, normale regler, ingen mulligans.",
              ]}
            />
          )}
        </TestCard>

        {/* Test 3 — 3-putt */}
        <TestCard
          number={3}
          unit="3-putt"
          title="3-putt-test · 3 / 6 / 10 fot"
          meta="10 PUTTS PER LENGDE · LOGG ANTALL INN · CA. 15 MIN"
          status={t3Status}
          footer={
            <TestActionRow
              leftLabel={t3Status === "active" ? "PÅGÅR" : "IKKE STARTET"}
              primaryLabel={t3Status === "active" ? "Fullfør test" : "Start test 3"}
              primaryIcon={t3Status === "active" ? "check" : "play"}
              onPrimary={() => router.push("/portal/tester/ny")}
              onSkip={() => router.push("/portal")}
            />
          }
        >
          {t3Status === "active" || t3Status === "pending" ? (
            <>
              <TestInstructions
                steps={[
                  "Marker tre avstander: 3 fot (1m), 6 fot (1,8m), 10 fot (3m) på en flat green.",
                  "Slå 10 putts fra hver avstand mot samme hull — logg antall som går inn under.",
                  "Bruk samme rutine du ville brukt på banen — pre-shot, sikt, slag. Dette er en realistisk baseline.",
                ]}
              />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-2">
                <TallyCard
                  label="3 fot · inn"
                  value={test3Three}
                  onChange={setTest3Three}
                />
                <TallyCard
                  label="6 fot · inn"
                  value={test3Six}
                  onChange={setTest3Six}
                />
                <TallyCard
                  label="10 fot · inn"
                  value={test3Ten}
                  onChange={setTest3Ten}
                />
                <TallyCard
                  label="Avg første putt-distance"
                  value={test3Avg}
                  optional
                  onChange={setTest3Avg}
                />
                <TallyCard
                  label="3-putt totalt på runden"
                  value={test3Total}
                  optional
                  onChange={setTest3Total}
                />
              </div>
            </>
          ) : (
            <TestDoneSummary
              message="3-putt-test logget."
              stats={[
                { label: "3 fot", value: `${test3Three}/10` },
                { label: "6 fot", value: `${test3Six}/10` },
                { label: "10 fot", value: `${test3Ten}/10` },
              ]}
            />
          )}
        </TestCard>
      </div>

      <BottomProgressBar
        completed={completed}
        total={3}
        message={
          completed === 3
            ? "alle tester fullført — last ned plan"
            : completed === 0
              ? "ingen tester startet — begynn med 50-100-150"
              : `tester fullført — fortsett med ${completed === 1 ? "9-hull-runden" : "3-putt-test"}`
        }
        onComplete={() => router.push("/portal")}
      />
    </>
  );
}
