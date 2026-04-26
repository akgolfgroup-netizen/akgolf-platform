/* ════════════════════════════════════════════════════════
   AK Golf — Booking V2 prototype interactivity
   Vanilla JS for step navigation, flow + edge toggles,
   payment-method picker, auth toggle, and calendar render.
   Designreferanse — ikke produksjonskode.
   ════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  const body = document.body;

  // ── Step navigation ───────────────────────────────────
  const stepPages = document.querySelectorAll(".step-page");
  const stepNav = document.querySelectorAll("#stepper .step");
  const stepJumpBtns = document.querySelectorAll("#step-jump button");

  function setStep(stepKey) {
    stepPages.forEach((p) => p.classList.toggle("active", String(p.dataset.step) === String(stepKey)));
    stepNav.forEach((n) => {
      const k = Number(n.dataset.step);
      const target = Number(stepKey);
      n.classList.toggle("active", k === target);
      n.classList.toggle("done", !Number.isNaN(target) && k < target);
    });
    stepJumpBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.step) === String(stepKey)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.addEventListener("click", function (e) {
    const goBtn = e.target.closest("[data-go]");
    if (goBtn) {
      const target = goBtn.dataset.go;
      if (target) {
        body.dataset.edge = "none";
        applyEdge();
        setStep(target);
      }
    }
  });

  stepJumpBtns.forEach((b) =>
    b.addEventListener("click", () => {
      body.dataset.edge = "none";
      applyEdge();
      setStep(b.dataset.step);
    })
  );

  // ── Flow toggle (Abonnement / Flex / Bane / Bedrift) ──
  const flowSeg = document.getElementById("flow-seg");
  const FLOWS = {
    abo: {
      service: "Performance 1:1",
      meta: "2 × 20 min / mnd",
      price: "1 400 kr",
      priceUnit: "/mnd",
      payHeading: "Løpende abonnement",
      payNote: "Trekkes hver 30. dag. Si opp når som helst på Min side.",
    },
    flex: {
      service: "Flex 50",
      meta: "50 min · enkeltsesjon",
      price: "1 500 kr",
      priceUnit: "",
      payHeading: "Engangsbetaling",
      payNote: "Ingen binding. Belastes nå.",
    },
    bane: {
      service: "Banecoaching 9 hull",
      meta: "~3 t · på bane",
      price: "3 000 kr",
      priceUnit: "/spiller",
      payHeading: "Engangsbetaling",
      payNote: "Belastes ved bekreftelse. Sted avtales separat.",
    },
    bedrift: {
      service: "Bedriftspakke",
      meta: "Tilpasset gruppe",
      price: "Faktura",
      priceUnit: "14 dagers forfall",
      payHeading: "EHF-faktura",
      payNote: "Sendes til organisasjonsnummer etter bekreftelse.",
    },
  };

  function applyFlow(flow) {
    const f = FLOWS[flow] || FLOWS.abo;
    body.dataset.flow = flow;
    document.querySelectorAll("#recap-svc-1, #recap-svc-2, #recap-svc-3").forEach((el) => {
      el.firstChild ? (el.firstChild.nodeValue = f.service) : (el.textContent = f.service);
    });
    flowSeg && flowSeg.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.flow === flow)));
  }

  flowSeg &&
    flowSeg.addEventListener("click", function (e) {
      const btn = e.target.closest("button[data-flow]");
      if (btn) applyFlow(btn.dataset.flow);
    });

  // ── Edge toggle ───────────────────────────────────────
  const edgeSeg = document.getElementById("edge-seg");
  const slotsNormal = document.getElementById("slots-normal");
  const slotsEmpty = document.getElementById("slots-empty-state");
  const alertAbandon = document.getElementById("alert-abandon");
  const slot1430 = document.getElementById("slot-1430");

  function applyEdge() {
    const edge = body.dataset.edge || "none";
    edgeSeg && edgeSeg.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.edge === edge)));

    // Reset
    if (slotsNormal) slotsNormal.style.display = "";
    if (slotsEmpty) slotsEmpty.style.display = "none";
    if (alertAbandon) alertAbandon.style.display = "none";
    if (slot1430) {
      slot1430.classList.remove("taken");
      slot1430.disabled = false;
    }

    if (edge === "taken") {
      setStep(4);
      if (slot1430) {
        slot1430.classList.add("taken");
        slot1430.disabled = true;
      }
    } else if (edge === "abandon") {
      setStep(6);
      if (alertAbandon) alertAbandon.style.display = "";
    } else if (edge === "quota") {
      setStep("quota");
    } else if (edge === "empty") {
      setStep("empty");
    }
  }

  edgeSeg &&
    edgeSeg.addEventListener("click", function (e) {
      const btn = e.target.closest("button[data-edge]");
      if (btn) {
        body.dataset.edge = btn.dataset.edge;
        applyEdge();
      }
    });

  // ── Auth toggle (steg 5) ──────────────────────────────
  const authToggle = document.getElementById("auth-toggle");
  authToggle &&
    authToggle.addEventListener("click", function (e) {
      const btn = e.target.closest("button[data-auth]");
      if (!btn) return;
      authToggle.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      const newForm = document.getElementById("form-new");
      const retForm = document.getElementById("form-returning");
      if (btn.dataset.auth === "new") {
        newForm.style.display = "";
        retForm.style.display = "none";
      } else {
        newForm.style.display = "none";
        retForm.style.display = "";
      }
    });

  // ── Payment-method picker (steg 6) ────────────────────
  const payList = document.getElementById("pay-list");
  const cardFields = document.getElementById("card-fields");
  payList &&
    payList.addEventListener("click", function (e) {
      const row = e.target.closest(".pay-row");
      if (!row) return;
      payList.querySelectorAll(".pay-row").forEach((r) => r.classList.toggle("selected", r === row));
      if (cardFields) cardFields.style.display = row.dataset.pay === "card" ? "" : "none";
    });

  // ── Slot pick (steg 4) ────────────────────────────────
  document.querySelectorAll(".slot-grid").forEach((grid) => {
    grid.addEventListener("click", function (e) {
      const btn = e.target.closest(".slot");
      if (!btn || btn.disabled) return;
      document.querySelectorAll(".slot-grid .slot").forEach((s) => s.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  // ── Instructor pick (steg 3) ──────────────────────────
  document.querySelectorAll(".inst-card").forEach((card) => {
    card.addEventListener("click", function () {
      document.querySelectorAll(".inst-card").forEach((c) => c.classList.toggle("selected", c === card));
    });
  });

  // ── Calendar render ───────────────────────────────────
  const cal = document.getElementById("cal-grid");
  if (cal) {
    const dows = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
    const html = [];
    dows.forEach((d) => html.push('<div class="dow">' + d + "</div>"));
    // April 2026 starts Wednesday → 2 muted leading from March
    [30, 31].forEach((d) => html.push('<button class="day muted" disabled>' + d + "</button>"));
    for (let d = 1; d <= 30; d++) {
      const dow = (d + 2) % 7; // 0 = Mon
      const isWeekend = dow === 5 || dow === 6;
      const past = d < 26;
      const today = d === 26;
      const selected = d === 28;
      const available = !past && !isWeekend && d % 3 !== 0;
      const cls = ["day"];
      if (past) cls.push("muted");
      if (today) cls.push("today");
      if (selected) cls.push("selected");
      if (available) cls.push("available");
      const dot = available ? '<span class="dot"></span>' : "";
      html.push('<button class="' + cls.join(" ") + '"' + (past ? " disabled" : "") + ">" + d + dot + "</button>");
    }
    [1, 2, 3].forEach((d) => html.push('<button class="day muted" disabled>' + d + "</button>"));
    cal.innerHTML = html.join("");
  }

  // ── Init ──────────────────────────────────────────────
  applyFlow(body.dataset.flow || "abo");
  setStep(1);
})();
