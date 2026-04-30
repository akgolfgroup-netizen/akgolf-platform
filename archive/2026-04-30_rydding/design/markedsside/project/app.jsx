/* AK Golf — landing app */
const { useState, useEffect } = React;

const PHOTOS = {
  hero: "https://images.unsplash.com/photo-1592919505780-303950717480?w=2000&q=80&auto=format&fit=crop",
  coach: "https://images.unsplash.com/photo-1611374243906-d8a59c4abf4d?w=1200&q=80&auto=format&fit=crop",
  prog1: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1200&q=80&auto=format&fit=crop",
  prog2: "https://images.unsplash.com/photo-1500932334442-8761ee4810a7?w=1200&q=80&auto=format&fit=crop",
  prog3: "https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?w=1200&q=80&auto=format&fit=crop",
  prog4: "https://images.unsplash.com/photo-1605144156244-a4f9b41d3a30?w=1200&q=80&auto=format&fit=crop",
  av1: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80&auto=format&fit=crop",
  av2: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&q=80&auto=format&fit=crop",
  av3: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80&auto=format&fit=crop",
  av4: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&q=80&auto=format&fit=crop",
  av5: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&q=80&auto=format&fit=crop",
  av6: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&q=80&auto=format&fit=crop",
};

const HERO_VARIANTS = {
  athletic: {
    tags: ["1:1 Coaching", "TrackMan Certified", "Tour-Level Method"],
    title: <>DRIVE <span className="it">your</span><br/>BETTER GAME</>,
    sub: "Explosive distance, surgical accuracy, sharper course IQ — built rep-by-rep with a PGA-certified coach who plays like you do.",
  },
  refined: {
    tags: ["Private Lessons", "Performance Audit", "Custom Fitting"],
    title: <>Refine <span className="it">every</span><br/>swing.</>,
    sub: "Precision coaching for the player who measures progress in tenths. Data-led sessions, bespoke practice plans, real results.",
  },
  technical: {
    tags: ["TrackMan 4", "GEARS 3D", "Force Plates"],
    title: <>Numbers <span className="it">don't</span><br/>lie.</>,
    sub: "Every lesson backed by tour-grade biomechanics. Clubhead speed, attack angle, face-to-path — we measure what matters and coach the difference.",
  },
};

const Icon = {
  arrow: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>,
  play: <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>,
  flag: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22V3M5 3l13 4-6 4 6 4H5"/></svg>,
  target: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>,
  bolt: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  data: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 5-5"/></svg>,
  brain: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/></svg>,
  ig: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>,
  yt: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16 5 12 5 12 5s-4 0-7.2.1c-.4 0-1.2 0-2 .9C2.2 6.6 2 8 2 8S1.8 9.6 1.8 11.3v1.4C1.8 14.4 2 16 2 16s.2 1.4.8 2c.8.8 1.8.8 2.3.9 1.7.2 7 .2 7 .2s4 0 7.2-.1c.4 0 1.2 0 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.3v-1.4C22.2 9.6 22 8 22 8zM10 15V9l5 3-5 3z"/></svg>,
  x: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h3l-7.5 8.6L22 22h-7l-5-6.5L4 22H1l8-9.2L1.5 2h7l4.5 6L18 2z"/></svg>,
};

function Nav({ logo }) {
  return (
    <nav className="nav">
      <a className="nav-brand" href="#">
        <img src={logo} alt="AK Golf"/>
        <span className="wordmark">AK Golf Group</span>
      </a>
      <div className="nav-links">
        <a href="#programs">Programs</a>
        <a href="#coach">Coach</a>
        <a href="#results">Results</a>
        <a href="#pricing">Pricing</a>
        <a href="#journal">Journal</a>
      </div>
      <a className="nav-cta" href="#book">
        Book a session
        <span className="arr">{Icon.arrow}</span>
      </a>
    </nav>
  );
}

function Hero({ variant }) {
  const v = HERO_VARIANTS[variant] || HERO_VARIANTS.athletic;
  return (
    <section className="hero">
      <div className="hero-photo" style={{backgroundImage: `url(${PHOTOS.hero})`}}/>
      <div className="hero-noise"/>

      <div className="hero-inner">
        <div>
          <div className="hero-tags">
            {v.tags.map(t => (
              <span key={t} className="hero-tag"><span className="dot"/>{t}</span>
            ))}
          </div>
          <h1 className="hero-title">{v.title}</h1>
          <p className="hero-sub">{v.sub}</p>
          <div className="hero-actions">
            <a className="btn-primary" href="#book">Start your assessment <span className="arr">{Icon.arrow}</span></a>
            <a className="btn-ghost" href="#"><span className="play">{Icon.play}</span> Watch the method</a>
          </div>

          <div className="hero-rating">
            <div className="avatars">
              <div className="a" style={{backgroundImage: `url(${PHOTOS.av1})`}}/>
              <div className="a" style={{backgroundImage: `url(${PHOTOS.av2})`}}/>
              <div className="a" style={{backgroundImage: `url(${PHOTOS.av3})`}}/>
              <div className="a" style={{backgroundImage: `url(${PHOTOS.av4})`}}/>
            </div>
            <div className="stars">★★★★★</div>
            <span><b>4.96</b> from 280+ players · avg. handicap drop <b>4.2</b></span>
          </div>
        </div>

        <div className="hero-side">
          <div className="card-glass card-coach">
            <div className="ph" style={{backgroundImage: `url(${PHOTOS.av5})`}}/>
            <div>
              <h4>Anders Kjær</h4>
              <p>PGA Class A · Head Coach</p>
            </div>
          </div>

          <div className="card-glass" style={{display: 'flex', gap: 16}}>
            <div className="card-stat">
              <div className="num">+12<em>mph</em></div>
              <div className="desc">Avg. clubhead speed gain over 8 weeks</div>
            </div>
            <div style={{width: 1, background: 'rgba(255,255,255,0.12)'}}/>
            <div className="card-stat">
              <div className="num">−4.2</div>
              <div className="desc">Mean handicap drop, full season</div>
            </div>
          </div>

          <div className="card-feature">
            <div className="label">Featured · This week</div>
            <h4>Winter Performance Audit</h4>
            <div className="price">
              <span className="big">£249</span>
              <span className="unit">/ 90-min session</span>
            </div>
            <div className="cta-row">
              <span>Limited slots — book now</span>
              <span className="arr">{Icon.arrow}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    "PGA Certified Coach", "TrackMan 4", "GEARS 3D Motion",
    "Custom Club Fitting", "Performance Analytics",
    "Tour-Level Method", "1:1 Mentorship", "Force Plate Analysis",
  ];
  const all = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {all.map((t, i) => (
          <span key={i} className="marquee-item">
            <span className="star">✦</span> {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Programs() {
  return (
    <section id="programs" className="section">
      <div className="section-head">
        <div>
          <div className="section-eyebrow">What we coach</div>
          <h2 className="section-title">Programs built for <span className="it">measurable</span> progress.</h2>
        </div>
        <a className="section-link" href="#">View all programs <span className="arr">{Icon.arrow}</span></a>
      </div>

      <div className="programs">
        <div className="program large">
          <div className="program-photo" style={{backgroundImage: `url(${PHOTOS.prog1})`}}/>
          <div className="num">01 / Flagship</div>
          <div className="arrow">{Icon.arrow}</div>
          <h3>Performance Block</h3>
          <p>An 8-week intensive: weekly 1:1 sessions, TrackMan-led practice plan, video review, and a measured handicap target.</p>
          <div className="meta"><span>8 weeks</span><span>£1,495</span><span>4 slots / month</span></div>
        </div>
        <div className="program med">
          <div className="program-photo" style={{backgroundImage: `url(${PHOTOS.prog2})`}}/>
          <div className="num">02</div>
          <div className="arrow">{Icon.arrow}</div>
          <h3>On-Course Coaching</h3>
          <p>Strategy, course management, decision-making — coached live during 9 or 18 holes at your home course.</p>
          <div className="meta"><span>9 / 18 holes</span><span>From £290</span></div>
        </div>
        <div className="program small">
          <div className="program-photo" style={{backgroundImage: `url(${PHOTOS.prog3})`}}/>
          <div className="num">03</div>
          <div className="arrow">{Icon.arrow}</div>
          <h3>Short Game Lab</h3>
          <p>Wedge spin, lag putting, scrambling. Lower scores without changing your full swing.</p>
          <div className="meta"><span>2 hrs</span><span>£180</span></div>
        </div>
        <div className="program small">
          <div className="program-photo" style={{backgroundImage: `url(${PHOTOS.prog4})`}}/>
          <div className="num">04</div>
          <div className="arrow">{Icon.arrow}</div>
          <h3>Speed & Power</h3>
          <p>Strength + speed protocols engineered for golfers. Add 10–20mph clubhead speed.</p>
          <div className="meta"><span>6 weeks</span><span>£695</span></div>
        </div>
        <div className="program small">
          <div className="program-photo" style={{backgroundImage: `url(${PHOTOS.prog2})`}}/>
          <div className="num">05</div>
          <div className="arrow">{Icon.arrow}</div>
          <h3>Junior Pathway</h3>
          <p>Long-term athletic development for ages 10–17. Technical, tactical, mental.</p>
          <div className="meta"><span>Termly</span><span>From £420</span></div>
        </div>
      </div>
    </section>
  );
}

function Coach() {
  return (
    <section id="coach" className="section">
      <div className="coach">
        <div className="coach-photo">
          <div className="ph" style={{backgroundImage: `url(${PHOTOS.coach})`}}/>
          <div className="coach-stats">
            <div className="big">14<span style={{color: 'var(--ak-accent)'}}>+</span></div>
            <div className="desc">Years coaching</div>
          </div>
          <div className="coach-badge">
            <div className="pgalogo">PGA</div>
            <div>
              <div style={{fontSize: 11, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em'}}>Certified</div>
              <div>Class A Professional</div>
            </div>
          </div>
        </div>

        <div className="coach-text">
          <div className="section-eyebrow">Meet your coach</div>
          <h2 className="section-title">A method, <span className="it">not</span> a swing tip.</h2>
          <p>I'm Anders. I've coached tour pros, club champions, and weekend warriors — and the thing that changes scores isn't a tip on the lesson tee. It's a system: measured baselines, a plan that fits your life, and weekly reps with someone in your corner.</p>

          <div className="coach-pillars">
            <div className="pillar">
              <div className="ic">{Icon.target}</div>
              <h4>Measure first</h4>
              <p>TrackMan baseline before we change a thing.</p>
            </div>
            <div className="pillar">
              <div className="ic">{Icon.bolt}</div>
              <h4>Train athletically</h4>
              <p>Speed, mobility and force plate work.</p>
            </div>
            <div className="pillar">
              <div className="ic">{Icon.data}</div>
              <h4>Track everything</h4>
              <p>Weekly progress reports, no guessing.</p>
            </div>
            <div className="pillar">
              <div className="ic">{Icon.brain}</div>
              <h4>Coach the player</h4>
              <p>Course management and mental game.</p>
            </div>
          </div>

          <a className="btn-primary" href="#book" style={{background: 'var(--ak-primary)', color: '#fff'}}>
            Book an intro call
            <span className="arr" style={{background: 'var(--ak-accent)', color: 'var(--ak-dark-bg)'}}>{Icon.arrow}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section id="results" className="section" style={{paddingTop: 0}}>
      <div className="stats-strip">
        <div className="stat-cell">
          <div className="big">280<em>+</em></div>
          <div className="desc">Players coached this year</div>
        </div>
        <div className="stat-cell">
          <div className="big">−4.2</div>
          <div className="desc">Average handicap drop in 12 weeks</div>
        </div>
        <div className="stat-cell">
          <div className="big">96<em>%</em></div>
          <div className="desc">Hit their measured season target</div>
        </div>
        <div className="stat-cell">
          <div className="big">14<em>yrs</em></div>
          <div className="desc">Coaching tour and club players</div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section" style={{paddingTop: 0}}>
      <div className="section-head">
        <div>
          <div className="section-eyebrow">In their words</div>
          <h2 className="section-title">Real players.<br/><span className="it">Real</span> handicap drops.</h2>
        </div>
        <a className="section-link" href="#">All case studies <span className="arr">{Icon.arrow}</span></a>
      </div>
      <div className="testimonials">
        <div className="testimonial">
          <div className="stars">★★★★★</div>
          <p className="quote">"Went from a 14 to a 7 in one season. Anders doesn't sell tips — he builds a real plan and holds you to it."</p>
          <div className="author">
            <div className="ph" style={{backgroundImage: `url(${PHOTOS.av2})`}}/>
            <div><b>Sarah M.</b><small>HCP 7 · Wentworth GC</small></div>
          </div>
        </div>
        <div className="testimonial feat">
          <div className="stars">★★★★★</div>
          <p className="quote">"The TrackMan sessions are a game-changer. I finally understand why my misses miss — and how to fix it on the course, not just the range."</p>
          <div className="author">
            <div className="ph" style={{backgroundImage: `url(${PHOTOS.av4})`}}/>
            <div><b>James R.</b><small>HCP 4 · Sunningdale</small></div>
          </div>
        </div>
        <div className="testimonial">
          <div className="stars">★★★★★</div>
          <p className="quote">"Added 18 mph of clubhead speed in six weeks. My iron play caught up six months later. Worth every penny."</p>
          <div className="author">
            <div className="ph" style={{backgroundImage: `url(${PHOTOS.av6})`}}/>
            <div><b>Tom K.</b><small>HCP 12 · The Berkshire</small></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="section" style={{paddingTop: 0}}>
      <div className="section-head">
        <div>
          <div className="section-eyebrow">Membership</div>
          <h2 className="section-title">Pick your <span className="it">level</span> of commitment.</h2>
        </div>
      </div>
      <div className="pricing">
        <div className="tier">
          <div className="tier-head">
            <div className="tier-name">Single Session</div>
          </div>
          <div className="tier-price"><span className="num">£140</span><span className="unit">/ 60 min</span></div>
          <p className="tier-desc">Try the method. One 1:1 lesson with full TrackMan data and a written follow-up.</p>
          <ul>
            <li>60-minute private lesson</li>
            <li>TrackMan ball + club data</li>
            <li>Slow-mo video review</li>
            <li>Written practice plan</li>
          </ul>
          <a className="cta" href="#"><span>Book a session</span><span>{Icon.arrow}</span></a>
        </div>

        <div className="tier feat">
          <div className="tier-head">
            <div className="tier-name">Performance Block</div>
            <div className="tier-tag">Most popular</div>
          </div>
          <div className="tier-price"><span className="num">£1,495</span><span className="unit">/ 8 weeks</span></div>
          <p className="tier-desc">The flagship: 8 weekly sessions, a measured handicap target, full coaching support between visits.</p>
          <ul>
            <li>8 × 60-min weekly sessions</li>
            <li>Baseline + final assessment</li>
            <li>Weekly practice programme</li>
            <li>Direct WhatsApp access</li>
            <li>2 on-course playing lessons</li>
          </ul>
          <a className="cta" href="#"><span>Start the block</span><span>{Icon.arrow}</span></a>
        </div>

        <div className="tier">
          <div className="tier-head">
            <div className="tier-name">Tour Retainer</div>
          </div>
          <div className="tier-price"><span className="num">£3,950</span><span className="unit">/ season</span></div>
          <p className="tier-desc">For competitive amateurs and club professionals who want a coach in their corner all season.</p>
          <ul>
            <li>Unlimited 1:1 sessions</li>
            <li>Tournament travel support</li>
            <li>Strength + speed program</li>
            <li>Club fitting included</li>
            <li>Priority scheduling</li>
          </ul>
          <a className="cta" href="#"><span>Apply to join</span><span>{Icon.arrow}</span></a>
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="section" style={{paddingTop: 0}}>
      <div className="cta-banner">
        <h2>Your best round <span className="it">is</span><br/>still ahead of you.</h2>
        <a className="btn-primary" href="#book">Book your assessment <span className="arr">{Icon.arrow}</span></a>
      </div>
    </section>
  );
}

function Footer({ logoWhite }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <img src={logoWhite} alt="AK Golf"/>
          <p>Premium 1:1 golf coaching, performance training and on-course mentorship — measured, athletic, honest.</p>
          <form className="newsletter" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="your@email.com"/>
            <button type="submit">Subscribe</button>
          </form>
        </div>
        <div className="footer-col">
          <h5>Programs</h5>
          <ul>
            <li><a href="#">Performance Block</a></li>
            <li><a href="#">On-Course Coaching</a></li>
            <li><a href="#">Short Game Lab</a></li>
            <li><a href="#">Speed & Power</a></li>
            <li><a href="#">Junior Pathway</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Company</h5>
          <ul>
            <li><a href="#">About Anders</a></li>
            <li><a href="#">Method</a></li>
            <li><a href="#">Journal</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Legal</h5>
          <ul>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">Cookies</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 AK Golf Group. All rights reserved.</span>
        <div className="socials">
          <a href="#">{Icon.ig}</a>
          <a href="#">{Icon.yt}</a>
          <a href="#">{Icon.x}</a>
        </div>
      </div>
    </footer>
  );
}

// ─── App ───────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "lime",
  "heroVariant": "athletic"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const isDark = tweaks.theme === "dark";
  const logo = isDark
    ? "assets/logos/ak-golf-logo-white-on-dark.svg"
    : "assets/logos/ak-golf-logo-primary-on-light.svg";
  const logoWhite = "assets/logos/ak-golf-logo-white-on-dark.svg";

  // Body class for theme + accent
  useEffect(() => {
    document.body.classList.toggle('theme-dark', isDark);
    document.body.classList.toggle('theme-white-accent', tweaks.accent === 'white');
  }, [tweaks.theme, tweaks.accent, isDark]);

  return (
    <>
      <div className="page" data-screen-label="AK Golf — Landing">
        <Nav logo={logo}/>
        <Hero variant={tweaks.heroVariant}/>
        <Marquee/>
        <Programs/>
        <Coach/>
        <Stats/>
        <Testimonials/>
        <Pricing/>
        <CtaBanner/>
      </div>
      <Footer logoWhite={logoWhite}/>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Theme">
          <TweakRadio
            label="Page theme"
            value={tweaks.theme}
            onChange={(v) => setTweak('theme', v)}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
          />
          <TweakRadio
            label="Accent"
            value={tweaks.accent}
            onChange={(v) => setTweak('accent', v)}
            options={[
              { value: "lime", label: "Lime" },
              { value: "white", label: "White" },
            ]}
          />
        </TweakSection>
        <TweakSection title="Hero copy">
          <TweakRadio
            label="Tone"
            value={tweaks.heroVariant}
            onChange={(v) => setTweak('heroVariant', v)}
            options={[
              { value: "athletic", label: "Bold" },
              { value: "refined", label: "Refined" },
              { value: "technical", label: "Technical" },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
