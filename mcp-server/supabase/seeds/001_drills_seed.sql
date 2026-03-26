-- AK Golf Academy — Drill Library Seed
-- Basert på Masterdokument v2.0 øktmaler og metodikk
-- Alle driller er source = 'ak_original' og auto-godkjent

-- ============================================================
-- TEK — DRIVER / TEE (10 driller)
-- ============================================================

INSERT INTO drills (name, description, goal, instructions, duration_minutes, pyramid_level, training_areas, l_phases, cs_min, cs_max, environments, press_levels, p_positions, life_codes, min_category, max_category, difficulty, equipment, players_min, players_max, trackman_metrics, source, tags, sg_area, is_approved, is_active) VALUES

-- TEK TEE: L-KROPP
('Speilsving — Rotasjon uten kølle', 
'Stå foran speil eller kamera. Utfør full rotasjon fra address til finish uten kølle. Fokus på hofterotasjon, skulderrotasjon og balanse.',
'Etablere korrekt rotasjonsmønster uten ytre forstyrrelser',
'1. Address-posisjon foran speil. 2. Kryss armene over brystet. 3. Roter til topp (P4.0) — sjekk skuldervridning 90°. 4. Start nedsving med hofter. 5. Roter gjennom til finish (P10.0). 6. Hold balanse 3 sek. 7. Video-sjekk etter hver 5. rep.',
10, 'TEK', '{TEE}', '{L-KROPP}', 'CS0', 'CS0', '{M0,M1}', '{PR1}', '{P1.0,P4.0,P7.0,P10.0}', '{LIFE-SELV}',
'K', 'A', 'nybegynner', '{speil,kamera}', 1, 4, '{}', 'ak_original', '{rotasjon,grunnlag,oppvarming}', 'tee', true, true),

-- TEK TEE: L-ARM
('Takeaway-guide — Armer og kropp synkront',
'Øv takeaway (P1.0→P2.0) med fokus på synkronisering av armer og kropp. Ingen kølle. Hendene fører, kroppen følger.',
'Synkronisere arm- og kroppsbevegelse i takeaway',
'1. Address uten kølle. 2. La venstre arm styre takeaway. 3. Stopp ved P2.0 (skaft parallelt). 4. Sjekk: hendene foran brystet, skuldrene har begynt å rotere. 5. Tilbake til start. 6. 20 repetisjoner med video.',
8, 'TEK', '{TEE}', '{L-ARM}', 'CS0', 'CS0', '{M0,M1}', '{PR1}', '{P1.0,P2.0}', '{LIFE-SELV}',
'K', 'D', 'nybegynner', '{kamera}', 1, 2, '{}', 'ak_original', '{takeaway,synkronisering}', 'tee', true, true),

-- TEK TEE: L-KØLLE halvsvinger
('Halvsving med kølle — CS30',
'Sving fra P2.0 til P8.0 med driver i lav hastighet. Fokus på plan og face-kontroll.',
'Etablere korrekt svingplan og face-kontroll i halvsving',
'1. Setup med driver. 2. Backswing til P2.0 (skaft parallelt). 3. Nedsvinge til P8.0. 4. CS30 — aldri raskere. 5. Video face-on og DTL. 6. 15 repetisjoner. 7. Sjekk face-vinkel ved P6.0.',
12, 'TEK', '{TEE}', '{L-KØLLE}', 'CS20', 'CS40', '{M1,M2}', '{PR1}', '{P2.0,P6.0,P8.0}', NULL,
'J', 'C', 'rekrutt', '{driver,kamera,kamerastativ}', 1, 2, '{face_angle,club_path}', 'ak_original', '{halvsving,face_kontroll,plan}', 'tee', true, true),

-- TEK TEE: L-BALL slow
('Gate Drill — Face ved impact',
'Plasser to alignment sticks 10cm fra hverandre foran ballen. Slå gjennom gaten. Fokus på kvadratisk face ved P7.0.',
'Trene face-kontroll ved impact under lavhastighets balltrening',
'1. Sett opp gate med alignment sticks, 10cm bredde, 30cm foran ball. 2. Driver, CS50. 3. Mål: ball gjennom gaten. 4. Treff=rett face. Miss venstre=lukket. Miss høyre=åpen. 5. 20 baller. 6. Score antall gjennom gate.',
15, 'TEK', '{TEE}', '{L-BALL}', 'CS50', 'CS60', '{M1,M2}', '{PR2}', '{P6.0,P7.0}', '{LIFE-EMO}',
'H', 'A', 'klubb', '{driver,alignment_sticks,kamera}', 1, 1, '{face_angle,face_to_path}', 'ak_original', '{gate,face_kontroll,impact}', 'tee', true, true),

-- TEK TEE: L-BALL transition
('Pump Drill — Transition P4.0→P5.0',
'Sving til topp (P4.0), pump ned til P5.0, tilbake til topp, deretter fullfør svingen. Trener korrekt transition.',
'Programmere korrekt nedsvingssekvens: hofter først, overkropp følger',
'1. Full backswing til P4.0. 2. Start nedsving til P5.0 (lead arm parallelt). 3. STOPP. 4. Tilbake til P4.0. 5. Gjenta pump 2 ganger. 6. Tredje gang: fullfør svingen helt. 7. CS50-60. 8. 10 repetisjoner.',
15, 'TEK', '{TEE}', '{L-BALL,L-KØLLE}', 'CS50', 'CS60', '{M1,M2}', '{PR2}', '{P4.0,P5.0,P5.5}', NULL,
'G', 'A', 'klubb', '{driver,kamera}', 1, 2, '{club_path,attack_angle}', 'ak_original', '{pump,transition,sekvens,shallowing}', 'tee', true, true),

-- TEK TEE: L-AUTO overføring
('Blokk til random — Driver overføring',
'10 slag i blokk (samme mål). Deretter 10 slag random (nytt mål hvert slag). Sjekk om teknikk holder.',
'Overføre teknikkendring fra blokk-øving til random/spillignende kontekst',
'1. Velg mål 200m ut. 2. 10 driver-slag mot samme mål, CS70. 3. Pause 2 min. 4. 10 driver-slag med nytt mål hvert slag (venstre/rett/midt). 5. CS80. 6. Sammenlign spredning blokk vs random på TrackMan.',
20, 'TEK', '{TEE}', '{L-AUTO}', 'CS70', 'CS80', '{M1,M2}', '{PR3}', '{P7.0}', '{LIFE-EMO}',
'F', 'A', 'regional', '{driver,TrackMan,kamera}', 1, 1, '{lateral_landing,face_angle,club_path}', 'ak_original', '{overføring,random,blokk,variabilitet}', 'tee', true, true),

-- TEK TEE: P-posisjon spesifikk
('Delivery Position Drill — P6.0 kontroll',
'Isoler delivery position (P6.0). Slow motion fra topp til P6.0, hold, sjekk video, fortsett.',
'Etablere korrekt delivery position med skaft parallelt bakken i nedsving',
'1. Backswing til topp (P4.0). 2. Nedsving i sakte film til P6.0. 3. HOLD posisjon. 4. Sjekk på video: skaft parallelt, hendene nær høyre hofte, vekt på lead-side. 5. Fortsett til finish. 6. CS30-40.',
12, 'TEK', '{TEE}', '{L-KØLLE}', 'CS30', 'CS40', '{M1,M2}', '{PR1}', '{P4.0,P5.0,P5.5,P6.0}', '{LIFE-SELV}',
'H', 'A', 'klubb', '{driver,kamera,kamerastativ}', 1, 2, '{club_path,attack_angle}', 'ak_original', '{delivery,P6,nedsving,posisjon}', 'tee', true, true),

-- TEK TEE: Breaking point test
('CS Trappetest — Finn breaking point',
'Slå 5 baller på CS50, 5 på CS60, 5 på CS70, 5 på CS80. Identifiser hvor teknikk bryter sammen.',
'Kartlegge spillerens CS breaking point for ny teknikkendring',
'1. 5 driver-slag CS50, fokus på ny bevegelse. 2. Treff 4/5 = gå videre. 3. 5 slag CS60. 4. 5 slag CS70. 5. 5 slag CS80. 6. Merk nivået der teknikk bryter. 7. Logg breaking point i app.',
20, 'TEK', '{TEE}', '{L-BALL,L-AUTO}', 'CS50', 'CS100', '{M1,M2}', '{PR2}', '{P7.0}', '{LIFE-SELV}',
'G', 'A', 'klubb', '{driver,TrackMan}', 1, 1, '{face_angle,club_path,club_speed}', 'ak_original', '{breaking_point,CS_test,progresjon}', 'tee', true, true),

-- TEK TEE: Gruppevariant
('Partnerfilm — Sving-analyse i par',
'To spillere filmer hverandre vekselvis. Face-on og DTL. Gi hverandre 1 observasjon per runde.',
'Utvikle evne til selv-analyse og gi teknisk feedback (LIFE-SOS)',
'1. Par opp. Spiller A slår 5 baller, Spiller B filmer DTL. 2. Bytt: B slår, A filmer face-on. 3. Se gjennom sammen. 4. Hver gir 1 observasjon: "Jeg ser at du..." 5. Gjenta 3 runder. CS50-60.',
20, 'TEK', '{TEE}', '{L-BALL}', 'CS50', 'CS60', '{M1,M2}', '{PR3}', '{P4.0,P5.0,P6.0,P7.0}', '{LIFE-SOS}',
'I', 'C', 'rekrutt', '{kamera,kamerastativ}', 2, 2, '{}', 'ak_original', '{partnerarbeid,analyse,sosial,feedback}', 'tee', true, true),

-- TEK TEE: Nybegynner
('Grepskolen — Korrekt grep fra dag 1',
'Lær neutral grep med driver. Sjekk V-formasjon, fingerplassering, trykkfordeling.',
'Etablere korrekt grep som fundament for alt videre arbeid',
'1. Venstre hånd: kølle i fingrene, V peker mot høyre skulder. 2. Høyre hånd: overlapping eller interlock. 3. Trykk: siste tre fingre venstre + langfinger/ringfinger høyre. 4. Test: sving til P2.0 og P8.0, kølle skal IKKE rotere i hendene.',
8, 'TEK', '{TEE}', '{L-KROPP,L-ARM}', 'CS0', 'CS0', '{M0,M1,M2}', '{PR1}', '{P1.0}', '{LIFE-SELV}',
'K', 'G', 'nybegynner', '{driver}', 1, 6, '{}', 'ak_original', '{grep,grunnlag,fundament}', 'tee', true, true);

-- ============================================================
-- TEK — INNSPILL (8 driller)
-- ============================================================

INSERT INTO drills (name, description, goal, instructions, duration_minutes, pyramid_level, training_areas, l_phases, cs_min, cs_max, environments, press_levels, p_positions, life_codes, min_category, max_category, difficulty, equipment, players_min, players_max, trackman_metrics, source, tags, sg_area, is_approved, is_active) VALUES

('Avstands-kalibrering 100m',
'Slå 10 baller med rett kølle mot 100m-mål. Logg carry-avstand på TrackMan. Finn gjennomsnitt og spredning.',
'Kalibrere faktisk carry-avstand for innspill-kølle',
'1. Velg kølle for 100m (typisk PW/9). 2. 10 baller, fullt sving, CS70. 3. Logg carry per slag. 4. Beregn snitt og standardavvik. 5. Mål: stddev < 5m.',
15, 'TEK', '{INN100}', '{L-BALL,L-AUTO}', 'CS70', 'CS80', '{M1,M2}', '{PR2}', '{P7.0}', NULL,
'G', 'A', 'klubb', '{TrackMan,jern}', 1, 1, '{carry_distance,club_speed,spin_rate}', 'ak_original', '{kalibrering,avstand,konsistens}', 'approach', true, true),

('Klokke-drill — Halvsving lengdekontroll',
'9-klokka (P3.0), 10.30-klokka (midt mellom P3.0 og P4.0), full (P4.0). Tre lengder per kølle.',
'Mestre tre distinkte innspilllengder med samme kølle',
'1. Velg wedge. 2. Sving til 9-klokka (lead arm parallelt). 5 baller. 3. Sving til 10.30. 5 baller. 4. Full sving. 5 baller. 5. Logg tre lengder. 6. Gjentar med neste wedge.',
20, 'TEK', '{INN50,INN100}', '{L-BALL}', 'CS50', 'CS70', '{M1,M2}', '{PR2}', '{P3.0,P4.0}', '{LIFE-SELV}',
'H', 'A', 'klubb', '{wedger,TrackMan}', 1, 1, '{carry_distance,spin_rate,launch_angle}', 'ak_original', '{klokke,lengdekontroll,wedge}', 'approach', true, true),

('Treffpunkt-tape — Impact awareness',
'Legg impact-tape på face. Slå 10 baller. Analyser treffmønster. Mål: konsistente treff senter-face.',
'Bevisstgjøre treffpunkt og forbedre senter-treff konsistens',
'1. Fest impact-tape/spray på jern-face. 2. 10 baller, CS60. 3. Sjekk tape etter hvert slag. 4. Marker treffpunkt. 5. Mål: 7/10 i sentrum ±1cm.',
12, 'TEK', '{INN100,INN150}', '{L-BALL}', 'CS60', 'CS70', '{M2}', '{PR2}', '{P7.0}', NULL,
'I', 'A', 'rekrutt', '{jern,impact_tape}', 1, 1, '{smash_factor}', 'ak_original', '{treffpunkt,senter,smash_factor}', 'approach', true, true),

('Innspill-sirkel 150m',
'Slå mot mål 150m. 10 baller. Score: 3p innen 5m, 2p innen 10m, 1p innen 15m. Mål per kategori.',
'Forbedre presisjon på innspill mellom-avstand',
'1. Mål 150m ut (flagg/kjegle). 2. Velg kølle. 3. 10 baller, score per treff. 4. Logg total. 5. Benchmark: C-D=20p, E-F=15p, G-H=10p.',
15, 'TEK', '{INN150}', '{L-AUTO}', 'CS70', 'CS80', '{M2}', '{PR2,PR3}', '{P7.0}', '{LIFE-SELV}',
'G', 'A', 'klubb', '{jern,avstandsmåler}', 1, 4, '{carry_distance,lateral_landing}', 'ak_original', '{presisjon,mål,scoring,innspill}', 'approach', true, true),

('Vindsimulering — Tilpass innspill',
'Simulator-modus med varierende vind. Slå 5 mot-vind, 5 med-vind, 5 sidevind. Tilpass kølle og sving.',
'Lære å tilpasse køllevalg og svingteknikk til vindforhold',
'1. TrackMan simulator med vind. 2. 5 slag med motvind 2-klubber opp, lavere bue. 3. 5 slag medvind normal. 4. 5 slag sidevind — siktekorrigering. 5. Logg resultat per vindtype.',
20, 'TEK', '{INN100,INN150,INN200}', '{L-AUTO}', 'CS70', 'CS90', '{M1}', '{PR3}', '{P7.0}', '{LIFE-EMO}',
'F', 'A', 'regional', '{TrackMan,simulator}', 1, 1, '{launch_angle,spin_rate,carry_distance}', 'ak_original', '{vind,tilpasning,simulator,kursmanagement}', 'approach', true, true),

('Approach-stigen — 5 avstander',
'Slå til 5 ulike mål: 60m, 80m, 100m, 120m, 140m. 3 baller per mål. Vurder køllevalg.',
'Trene køllevalg-beslutninger over hele innspillregisteret',
'1. Sett opp 5 mål. 2. Start på 60m. 3 baller, noter kølle. 3. 80m, 100m, 120m, 140m. 4. Score nærhet. 5. Identifiser svakeste avstand.',
20, 'TEK', '{INN50,INN100,INN150}', '{L-AUTO}', 'CS70', 'CS80', '{M2}', '{PR2}', '{P7.0}', NULL,
'G', 'A', 'klubb', '{hele_bag,avstandsmåler}', 1, 1, '{carry_distance}', 'ak_original', '{køllevalg,avstander,stigen}', 'approach', true, true),

('Fade/Draw på kommando',
'Slå 5 draws, 5 fades med 7-jern. Juster setup og svingbane bevisst.',
'Mestre bevisst kurvestyring for kursmanagement',
'1. Draw: lukket stance, sikte høyre, sving langs kropp. 5 baller. 2. Fade: åpen stance, sikte venstre, sving langs stance. 5 baller. 3. Logg face-to-path differanse. 4. Mål: konsistent retning.',
15, 'TEK', '{INN100,INN150}', '{L-AUTO}', 'CS70', 'CS80', '{M1,M2}', '{PR3}', '{P5.0,P6.0,P7.0}', NULL,
'E', 'A', 'regional', '{jern,TrackMan}', 1, 1, '{face_angle,club_path,face_to_path}', 'ak_original', '{draw,fade,kurve,slagform,ballkontroll}', 'approach', true, true),

('Innspill under tidspress',
'30 sekunder mellom hvert slag. Ny kølle og nytt mål hvert slag. Simulerer turneringstempo.',
'Trene beslutningstagning og gjennomføring under tidspress',
'1. Trener roper avstand. 2. 30 sek: velg kølle, setup, slå. 3. 10 slag. 4. Score nærhet. 5. Debrief: hastet du? Glemte du rutinen?',
15, 'TEK', '{INN50,INN100,INN150}', '{L-AUTO}', 'CS70', 'CS80', '{M2}', '{PR4}', '{P7.0}', '{LIFE-EMO}',
'E', 'A', 'regional', '{hele_bag,stoppeklokke}', 1, 4, '{}', 'ak_original', '{press,tidspress,beslutning,rutine}', 'approach', true, true);

-- ============================================================
-- TEK — NÆRSPILL (8 driller)
-- ============================================================

INSERT INTO drills (name, description, goal, instructions, duration_minutes, pyramid_level, training_areas, l_phases, cs_min, cs_max, environments, press_levels, p_positions, life_codes, min_category, max_category, difficulty, equipment, players_min, players_max, trackman_metrics, source, tags, sg_area, is_approved, is_active) VALUES

('Chip-stigen — 3 landingspunkter',
'Velg tre landingspunkter (1/3, 1/2, 2/3 til hull). Chip 5 baller til hvert punkt. Variér kølle.',
'Mestre landingspunkt-kontroll for chip med ulike køllevinkler',
'1. Flagg 10m ut. 2. Marker 3 landingspunkter. 3. 5 baller til hver med ulik kølle (8, PW, SW). 4. Score: treff landingspunkt ±50cm. 5. Logg beste kølle per punkt.',
15, 'TEK', '{CHIP}', '{L-BALL}', NULL, NULL, '{M3}', '{PR2}', '{P7.0,P8.0}', NULL,
'I', 'A', 'rekrutt', '{wedger,jern,flagg}', 1, 4, '{}', 'ak_original', '{chip,landingspunkt,køllevalg}', 'short_game', true, true),

('Pitch — Høydekontroll',
'Slå til samme mål fra 30m. 5 baller lav bue (8-jern), 5 medium (PW), 5 høy (SW). Samme distanse, tre buer.',
'Kontrollere bue og loft for ulike situasjoner rundt green',
'1. Mål 30m. 2. 8-jern: hendene foran, lav bue, mye rulle. 3. PW: normal pitch, medium bue. 4. SW: åpen face, høy bue, lite rulle. 5. Sammenlign stoppunkt.',
15, 'TEK', '{PITCH}', '{L-BALL}', NULL, NULL, '{M3}', '{PR2}', '{P7.0}', '{LIFE-SELV}',
'H', 'A', 'klubb', '{wedger,8_jern}', 1, 2, '{}', 'ak_original', '{pitch,bue,loft,høyde}', 'short_game', true, true),

('Bunker-basis — Splash teknikk',
'Åpen face, åpen stance. Slå sanden 5cm bak ballen. Ballen skal ri sandbølgen ut.',
'Etablere grunnleggende greenside bunker-teknikk',
'1. Grav føttene ned for stabilitet. 2. SW, åpen face 20°. 3. Sikteposisjon: sanden 5cm bak ball. 4. Sving GJENNOM sanden — ikke stopp. 5. Følelse: splash, ikke grave. 6. 20 baller. 7. Mål: alle ut av bunker.',
15, 'TEK', '{BUNKER}', '{L-BALL}', NULL, NULL, '{M3}', '{PR1}', '{P6.0,P7.0,P8.0}', NULL,
'J', 'D', 'nybegynner', '{sand_wedge}', 1, 4, '{}', 'ak_original', '{bunker,splash,greenside,grunnlag}', 'short_game', true, true),

('Lob — Flopp over hindring',
'Sett opp en kjegle/bag 1m foran ball. Slå over hindringen og stopp ballen innen 3m bak.',
'Mestre høy lob for situasjoner med kort avstand og hindring',
'1. Hindring 1m foran. 2. Flagg 8m fra ball. 3. SW/LW åpen face 30°+. 4. Lang, myk sving. 5. Ballen MÅ over hindring OG stoppe nær flagg. 6. 10 baller. Score: over+nær=2p, over+langt=1p.',
12, 'TEK', '{LOB}', '{L-BALL}', NULL, NULL, '{M3}', '{PR2}', '{P7.0,P8.0}', '{LIFE-EMO}',
'G', 'A', 'klubb', '{lob_wedge,kjegle}', 1, 2, '{}', 'ak_original', '{lob,flopp,hindring,høy}', 'short_game', true, true),

('Opp-og-ned Challenge',
'Drop ball i 5 ulike posisjoner rundt green (lang side, kort side, downhill, uphill, bunker). Chip/pitch opp, putt ned. Score.',
'Simulere reelle scoringssituasjoner rundt green',
'1. 5 posisjoner med ulik vanskelighetsgrad. 2. Chip/pitch nærmest mulig. 3. Putt ut. 4. Logg antall opp-og-ned. 5. Mål: C-D=4/5, E-F=3/5, G-H=2/5.',
20, 'TEK', '{CHIP,PITCH,LOB,BUNKER}', '{L-AUTO}', NULL, NULL, '{M3}', '{PR3,PR4}', '{P7.0}', '{LIFE-KAR}',
'H', 'A', 'klubb', '{wedger,putter}', 1, 4, '{}', 'ak_original', '{scramble,opp_og_ned,scoring,rundt_green}', 'short_game', true, true),

('Golf-bowling — Nybegynner nærspill',
'Sett opp "bowling-pins" (kjegler) ved hullet. Rul/chip ballen for å velte kjegler. Poeng per kjegle.',
'Introdusere nærspill gjennom lek for K-J spillere',
'1. 6 kjegler rundt hull. 2. Chip fra 10m. 3. 1 poeng per kjegle som veltes. 4. 3 forsøk per spiller. 5. Lagkonkurranse mulig.',
15, 'TEK', '{CHIP}', '{L-ARM,L-KØLLE}', 'CS0', 'CS30', '{M3}', '{PR1,PR3}', '{P7.0}', '{LIFE-SOS}',
'K', 'I', 'nybegynner', '{kjegler,wedge}', 2, 8, '{}', 'ak_original', '{lek,bowling,intro,barn}', 'short_game', true, true),

('Par-save Simulering',
'Trener plasserer ball i "trøbbel" (tett lie, ujevnt stance, bak tre). Spiller må finne løsning og gjennomføre.',
'Utvikle kreativitet og problemløsning i nærspill',
'1. Trener velger 5 vanskelige posisjoner. 2. Spiller vurderer: høy/lav? Chip/pitch? Hvilken kølle? 3. Maks 30 sek tenketid. 4. Gjennomfør. 5. Debrief: var valget riktig? Hva ville du gjort annerledes?',
20, 'TEK', '{CHIP,PITCH,LOB}', '{L-AUTO}', NULL, NULL, '{M3,M4}', '{PR3}', '{P7.0}', '{LIFE-RES}',
'F', 'A', 'regional', '{wedger,jern}', 1, 2, '{}', 'ak_original', '{kreativitet,problemløsning,trøbbel,recovery}', 'short_game', true, true),

('Avstandskontroll Chip — 5-10-15m',
'Chip til tre ringer: 5m, 10m, 15m fra ball. 5 baller per avstand. Score nærhet til ring.',
'Systematisk avstandskontroll i chip med repetisjoner',
'1. Legg ut tre ringer/sirkler. 2. Start 5m: 5 chips, score 0-2 per ball (innen ring=2, nær=1). 3. 10m: 5 chips. 4. 15m: 5 chips. 5. Total maks 30p.',
15, 'TEK', '{CHIP}', '{L-BALL}', NULL, NULL, '{M3}', '{PR2}', '{P7.0}', NULL,
'I', 'B', 'rekrutt', '{wedge,ringer_markeringer}', 1, 4, '{}', 'ak_original', '{avstand,kontroll,chip,systematisk}', 'short_game', true, true);

-- ============================================================
-- TEK — PUTTING (8 driller)
-- ============================================================

INSERT INTO drills (name, description, goal, instructions, duration_minutes, pyramid_level, training_areas, l_phases, cs_min, cs_max, environments, press_levels, p_positions, life_codes, min_category, max_category, difficulty, equipment, players_min, players_max, trackman_metrics, source, tags, sg_area, is_approved, is_active) VALUES

('Makk-putt Maraton — 1m sirkelen',
'100 putts fra 1 meter. Mål: 95%+ treff. Etablerer konfidens og repetisjon.',
'Bygge absolutt konfidens på 1-meter putts',
'1. Sett ball 1m fra hull, flat putt. 2. 100 putts i strekk. 3. Tell treff. 4. Mål: K-H=80%, G-F=85%, E-C=90%, A-B=95%.',
15, 'TEK', '{PUTT0-3}', '{L-BALL}', NULL, NULL, '{M3}', '{PR2}', NULL, '{LIFE-SELV}',
'K', 'A', 'nybegynner', '{putter}', 1, 1, '{}', 'ak_original', '{makk_putt,konfidens,repetisjon}', 'putting', true, true),

('Gate Putting — Startlinje',
'To tees 5cm fra hverandre, 30cm foran ball. Putt gjennom gate. Trener ren startlinje.',
'Etablere konsistent startlinje uten break-påvirkning',
'1. Flat putt 2m. 2. Gate 30cm foran ball (2 tees, 5cm mellomrom). 3. 20 putts. 4. Score: gjennom gate = 1p. 5. Mål: 18/20.',
10, 'TEK', '{PUTT3-5}', '{L-BALL}', NULL, NULL, '{M3}', '{PR2}', NULL, NULL,
'J', 'A', 'nybegynner', '{putter,tees}', 1, 2, '{}', 'ak_original', '{gate,startlinje,alignment}', 'putting', true, true),

('Speed Ladder — Lengdekontroll',
'4 baller fra 3m, 6m, 9m, 12m. Alle skal stoppe innen 30cm BAK hullet. Aldri kort.',
'Trene speed control med "aldri kort"-mentalitet',
'1. Flat eller lett downhill. 2. 4 avstander: 3m, 6m, 9m, 12m. 3. 3 baller per avstand. 4. Alle MÅ passere hullet, stoppe innen 30cm bak. 5. Kort ball = 0p, forbi innen 30cm = 2p, forbi 30-60cm = 1p.',
15, 'TEK', '{PUTT5-10,PUTT10-15}', '{L-BALL}', NULL, NULL, '{M3}', '{PR2}', NULL, '{LIFE-SELV}',
'I', 'A', 'rekrutt', '{putter}', 1, 2, '{}', 'ak_original', '{speed,lengde,aldri_kort}', 'putting', true, true),

('Break-lesning — Mynttest',
'Legg mynt 2m fra hull på skrå putt. Putt over mynten. Justér plassering til ball faller i hull.',
'Utvikle evne til å lese og føle break',
'1. Finn putt med tydelig break. 2. Estimer break: legg mynt der du tror apex er. 3. Putt over mynten. 4. Justér myntposisjon basert på resultat. 5. 10 putts, flytt mynt etter behov. 6. Når 3 på rad treffer: bytt putt.',
15, 'TEK', '{PUTT5-10,PUTT10-15}', '{L-BALL}', NULL, NULL, '{M3}', '{PR2}', NULL, NULL,
'H', 'A', 'klubb', '{putter,mynt}', 1, 1, '{}', 'ak_original', '{break,lesning,green,apex}', 'putting', true, true),

('3-6-9 Pressure Putting',
'3 baller fra 3 fot, 3 fra 6 fot, 3 fra 9 fot. MÅ holde alle 3 fra én avstand før du går videre. Miss = start på nytt.',
'Putte under press med konsekvens for miss',
'1. Start 3 fot. 2. Hold alle 3. 3. Gå til 6 fot. 4. Hold alle 3. 5. Gå til 9 fot. 6. Miss på noen avstand = tilbake til 3 fot. 7. Tidsgrense 15 min.',
15, 'TEK', '{PUTT0-3,PUTT3-5,PUTT5-10}', '{L-BALL}', NULL, NULL, '{M3}', '{PR4}', NULL, '{LIFE-RES}',
'H', 'A', 'klubb', '{putter}', 1, 4, '{}', 'ak_original', '{press,konsekvens,3_6_9,mental}', 'putting', true, true),

('Lag-putt Boks — 30+ fot',
'Putt fra 30+ fot. Mål: alle baller innen en 3-fot boks rundt hullet. Fokus på avstand, ikke linje.',
'Eliminere 3-putts ved å mestre lag-putting speed',
'1. 30+ fot putt (flat og skrå). 2. Mål 3-fot sirkel rundt hull. 3. 10 baller. 4. Score: innen 3 fot = 2p, innen 6 fot = 1p. 5. Benchmark: C-D=16p, E-F=12p.',
10, 'TEK', '{PUTT25-40,PUTT40+}', '{L-BALL}', NULL, NULL, '{M3}', '{PR2}', NULL, NULL,
'H', 'A', 'klubb', '{putter}', 1, 2, '{}', 'ak_original', '{lag_putt,avstand,3_putt}', 'putting', true, true),

('Putting-bane med hindre',
'Bygg hinderløype med tees/kopper. 9 hull med ulike utfordringer. Turneringsformat for barn.',
'Gjøre putting morsomt og utvikle berøring gjennom lek',
'1. 9 kreative hull. 2. Hvert hull har utfordring: rampe, port, kurve. 3. Poeng per hull: 1-3. 4. Lagkonkurranse mulig. 5. Feire alle gode forsøk.',
20, 'TEK', '{PUTT3-5,PUTT5-10}', '{L-BALL}', NULL, NULL, '{M3}', '{PR3}', NULL, '{LIFE-SOS}',
'K', 'I', 'nybegynner', '{putter,tees,kopper}', 2, 8, '{}', 'ak_original', '{lek,bane,hindre,barn,kreativ}', 'putting', true, true),

('Pre-shot Rutine Putting — Konsistenstest',
'Putt 10 baller med full rutine (les, prøvesving, setup, slag). Film og tell sekunder. Mål: ±2 sek variasjon.',
'Bygge konsistent pre-shot rutine for putting',
'1. Full rutine: les putt → velg linje → 2 prøvesvinger → setup → putt. 2. Timer teller fra start til slag. 3. 10 putts fra 6 fot. 4. Mål: alle innen ±2 sek av snitt.',
12, 'TEK', '{PUTT3-5,PUTT5-10}', '{L-BALL}', NULL, NULL, '{M3}', '{PR3}', NULL, '{LIFE-SELV}',
'H', 'A', 'klubb', '{putter,stoppeklokke,kamera}', 1, 1, '{}', 'ak_original', '{rutine,pre_shot,konsistens,mental}', 'putting', true, true);

-- ============================================================
-- SLAG — Slagkvalitet / Måltrening (6 driller)
-- ============================================================

INSERT INTO drills (name, description, goal, instructions, duration_minutes, pyramid_level, training_areas, l_phases, cs_min, cs_max, environments, press_levels, p_positions, life_codes, min_category, max_category, difficulty, equipment, players_min, players_max, trackman_metrics, source, tags, sg_area, is_approved, is_active) VALUES

('Nærmest mål — 5 baller',
'Alle slår 5 baller mot samme mål. Mål nærhet. Vinner velger neste øvelse.',
'Overføre teknikk til presisjon under sosial press',
'1. Velg mål (100m, 150m, etc). 2. Alle slår 5 baller. 3. Mål avstand til mål per ball (TrackMan/avstandsmåler). 4. Lavest total vinner. 5. Vinner velger neste.',
15, 'SLAG', '{INN100,INN150}', '{L-AUTO}', 'CS70', 'CS80', '{M2}', '{PR4}', '{P7.0}', '{LIFE-KAR}',
'H', 'A', 'klubb', '{jern,avstandsmåler}', 2, 6, '{carry_distance,lateral_landing}', 'ak_original', '{konkurranse,presisjon,mål,sosial}', 'approach', true, true),

('Driver Fairway-prosent',
'Marker fairway-bredde (30m) på range. 20 driver-slag. Tell antall innenfor. Mål: C-D=75%, E-F=65%, G-H=55%.',
'Måle og forbedre driver-presisjon under spillignende forhold',
'1. Marker fairway 30m bred, 200m+ ut. 2. Full pre-shot rutine hvert slag. 3. 20 driver-slag. 4. Tell treff innenfor. 5. Logg prosent.',
20, 'SLAG', '{TEE}', '{L-AUTO}', 'CS80', 'CS100', '{M2}', '{PR3}', '{P7.0}', '{LIFE-SELV}',
'G', 'A', 'klubb', '{driver,alignment_sticks}', 1, 4, '{lateral_landing,face_angle}', 'ak_original', '{fairway,prosent,driver,presisjon}', 'tee', true, true),

('Scoring-soner — Wedge Matrix',
'Lag matrise: 3 køllevinkler × 3 svinglenger = 9 avstander. Kalibrer og logg alle.',
'Kartlegge presise avstander for hele wedge-arsenalet',
'1. Tre wedger (PW, GW/52, SW/56). 2. Tre lengder: 9-klokka, 10.30, full. 3. 5 baller per kombinasjon = 45 baller. 4. Logg carry per combo i app/notat. 5. Referansekort for banen.',
30, 'SLAG', '{INN50,INN100}', '{L-AUTO}', 'CS60', 'CS80', '{M1,M2}', '{PR2}', '{P7.0}', '{LIFE-SELV}',
'G', 'A', 'klubb', '{wedger,TrackMan}', 1, 1, '{carry_distance,spin_rate,launch_angle}', 'ak_original', '{wedge_matrix,kalibrering,avstand,scoringsoner}', 'approach', true, true),

('Simulated Hole — Full bag rotation',
'Spill 9 simulerte hull på range. Hvert hull: driver, innspill, chip/pitch (tenk deg). Full rutine.',
'Trene fullstendig banestrategi og køllevalg uten å være på bane',
'1. Tegn opp 9 hull med ulike par. 2. Hull 1: driver mot fairway, deretter innspill mot green-mål. 3. Bytt kølle hvert "slag". 4. Full pre-shot rutine HVERT slag. 5. Logg tenkt score.',
30, 'SLAG', '{TEE,INN100,INN150,INN200}', '{L-AUTO}', 'CS70', 'CS90', '{M2}', '{PR3}', '{P7.0}', '{LIFE-SELV}',
'F', 'A', 'regional', '{hele_bag}', 1, 1, '{}', 'ak_original', '{simulert,bane,strategi,køllevalg,rutine}', 'approach', true, true),

('Scramble Drill — Opp-og-ned fra 5 posisjoner',
'5 baller rundt green i vanskelige posisjoner. Chip/pitch + putt. Mål opp-og-ned prosent.',
'Forbedre scramble/opp-og-ned statistikk gjennom målrettet øving',
'1. 5 utfordrende posisjoner (tett lie, lang rough, downhill, uphill, bunker). 2. Chip/pitch nærmest mulig. 3. Putt ut. 4. Opp-og-ned = 1p. 5. Gjenta 3 runder = 15 forsøk. 6. Beregn %.',
20, 'SLAG', '{CHIP,PITCH,BUNKER}', '{L-AUTO}', NULL, NULL, '{M3,M4}', '{PR3}', '{P7.0}', '{LIFE-RES}',
'H', 'A', 'klubb', '{wedger,putter}', 1, 2, '{}', 'ak_original', '{scramble,opp_og_ned,scoring}', 'short_game', true, true),

('Target Golf — 10 slag, nytt mål hvert slag',
'Trener roper avstand og retning. Spiller har 15 sek til å velge kølle og slå. Simulerer banespill.',
'Trene rask beslutningstagning og kjøring under tidspress',
'1. Trener har liste med 10 mål (avstand + retning). 2. Roper ett om gangen. 3. Spiller: velg kølle, setup, slå innen 15 sek. 4. Score nærhet. 5. Debrief: hvilke valg var gode?',
15, 'SLAG', '{INN50,INN100,INN150,INN200}', '{L-AUTO}', 'CS70', 'CS90', '{M2}', '{PR4}', '{P7.0}', '{LIFE-EMO}',
'F', 'A', 'regional', '{hele_bag,stoppeklokke}', 1, 4, '{}', 'ak_original', '{target,beslutning,tidspress,random}', 'approach', true, true);

-- ============================================================
-- FYS — Fysisk trening (6 driller)
-- ============================================================

INSERT INTO drills (name, description, goal, instructions, duration_minutes, pyramid_level, training_areas, l_phases, cs_min, cs_max, environments, press_levels, p_positions, life_codes, min_category, max_category, difficulty, equipment, players_min, players_max, trackman_metrics, source, tags, sg_area, is_approved, is_active) VALUES

('Golf-spesifikk oppvarming',
'10 min dynamisk oppvarming: hofteåpnere, skulderrotasjon, ryggmobilitet, hamstring stretch. Gjøres HVER økt.',
'Forberede kroppen for golftrening og forebygge skader',
'1. Arm-sirkler 10x hver vei. 2. Hofteåpner (90/90): 10 per side. 3. Verdens beste stretch: 5 per side. 4. Trunk rotasjon med kølle bak rygg: 10 per side. 5. Hamstring swing: 10 per bein. 6. 10 halve svinger med wedge CS30.',
10, 'FYS', '{TEE}', '{L-KROPP}', 'CS0', 'CS0', '{M0,M1,M2,M3}', '{PR1}', NULL, NULL,
'K', 'A', 'nybegynner', '{}', 1, 8, '{}', 'ak_original', '{oppvarming,mobilitet,forebygging}', NULL, true, true),

('Rotasjonskraft — Medisinball',
'Kast medisinball fra golfstance mot vegg. Fokus på hofteinitiering og kjede-sekvens.',
'Bygge rotasjonskraft og power gjennom kinetisk kjede',
'1. Medisinball 3-5kg. 2. Golfstance 2m fra vegg. 3. Last opp som backswing. 4. Kast med hofte-initiering. 5. 3×8 per side. 6. Hvile 60 sek mellom sett.',
15, 'FYS', '{TEE}', '{L-KROPP}', 'CS0', 'CS0', '{M0}', '{PR1}', NULL, '{LIFE-SELV}',
'I', 'A', 'rekrutt', '{medisinball,vegg}', 1, 4, '{}', 'ak_original', '{power,rotasjon,medisinball,styrke}', NULL, true, true),

('Kjernetest — Planke og sideliggende',
'Planke 60 sek + sideliggende planke 30 sek per side. Test av kjernestabilitet.',
'Måle og vedlikeholde kjernestyrke som fundament for svingstabilitet',
'1. Planke: albuer under skuldre, kropp rett. Hold maks tid. 2. Sideliggende venstre: hold maks. 3. Sideliggende høyre: hold maks. 4. Mål per kategori i Masterdokument sek 16.',
8, 'FYS', '{TEE}', '{L-KROPP}', 'CS0', 'CS0', '{M0}', '{PR1}', NULL, NULL,
'K', 'A', 'nybegynner', '{}', 1, 8, '{}', 'ak_original', '{kjerne,planke,test,stabilitet}', NULL, true, true),

('Hoftemobilitet — 90/90 Serie',
'Sittende 90/90-posisjon. Intern og ekstern rotasjon. Kritisk for hofte-clearance i nedsving.',
'Forbedre hoftemobilitet for bedre rotasjon og hofte-clearance i sving',
'1. Sitt på gulv, begge knær i 90°. 2. Roter begge knær til venstre (intern/ekstern). 3. Hold 10 sek. 4. Roter til høyre. 5. 10 repetisjoner per side. 6. Progresjon: legg til overkroppsrotasjon.',
10, 'FYS', '{TEE}', '{L-KROPP}', 'CS0', 'CS0', '{M0}', '{PR1}', NULL, NULL,
'K', 'A', 'nybegynner', '{matte}', 1, 8, '{}', 'ak_original', '{hofte,mobilitet,90_90,rotasjon}', NULL, true, true),

('Balanse-utfordring — Ettbeins sving',
'Stå på ett bein. Utfør 10 halve svinger med wedge. Bytt bein. Utvikler balanse og stabilitet.',
'Forbedre dynamisk balanse som er kritisk for konsistent ballkontakt',
'1. Stå på lead-bein. 2. 10 halve svinger (P3.0→P8.0) med wedge CS30. 3. Bytt til trail-bein. 4. 10 svinger. 5. Progresjon: lukk øynene.',
10, 'FYS', '{TEE}', '{L-KØLLE}', 'CS20', 'CS30', '{M0,M1,M2}', '{PR1}', '{P3.0,P8.0}', NULL,
'J', 'A', 'nybegynner', '{wedge}', 1, 4, '{}', 'ak_original', '{balanse,ettbeins,stabilitet}', NULL, true, true),

('Speed Training — Overspeed/Underspeed',
'3 svinger med lett treningskølle (overspeed), 3 med tung (underspeed), 3 med vanlig driver. Øker neuromuskulær hastighet.',
'Øke clubhead speed gjennom kontrast-trening',
'1. Lett speed-stick: 3 maks-svinger. 2. Tung speed-stick: 3 maks-svinger. 3. Vanlig driver: 3 maks-svinger, mål CS på TrackMan. 4. Hvile 30 sek mellom. 5. 3 runder totalt.',
15, 'FYS', '{TEE}', '{L-AUTO}', 'CS90', 'CS100', '{M1,M2}', '{PR2}', NULL, NULL,
'F', 'A', 'regional', '{speed_sticks,driver,TrackMan}', 1, 1, '{club_speed}', 'ak_original', '{speed,overspeed,power,fart}', 'tee', true, true);

-- ============================================================
-- SPILL — Strategi og banehåndtering (4 driller)
-- ============================================================

INSERT INTO drills (name, description, goal, instructions, duration_minutes, pyramid_level, training_areas, l_phases, cs_min, cs_max, environments, press_levels, p_positions, life_codes, min_category, max_category, difficulty, equipment, players_min, players_max, trackman_metrics, source, tags, sg_area, is_approved, is_active) VALUES

('9-hull treningsrunde med strategikort',
'Spill 9 hull med forhåndsdefinert strategi per hull. Ingen impulsvalg — følg planen.',
'Trene kursmanagement og strategisk tenkning under banespill',
'1. Lag strategikort før runden: per hull noter køllevalg tee, sikte-mål, miss-side. 2. Spill 9 hull. 3. Følg strategikort 100%. 4. Etter runden: analyse — fungerte planen? Hva endrer du?',
90, 'SPILL', '{TEE,INN100,INN150,INN200}', '{L-AUTO}', 'CS70', 'CS90', '{M4}', '{PR3}', '{P7.0}', '{LIFE-SELV}',
'G', 'A', 'klubb', '{hele_bag,strategikort}', 1, 4, '{}', 'ak_original', '{strategi,kursmanagement,plan,9_hull}', NULL, true, true),

('Verste ball — 9 hull',
'Slå to baller fra hvert sted. Spill videre fra den DÅRLIGSTE. Tvinger konservativ strategi.',
'Utvikle konservativ strategi og lære å unngå store feil',
'1. Tee: slå 2 baller, spill videre fra dårligste. 2. Innspill: 2 baller, spill dårligste. 3. Chip/putt: kun 1 ball (normal). 4. Logg score. 5. Tvinger: sikte mot senter, unngå doble feil.',
90, 'SPILL', '{TEE,INN100,INN150}', '{L-AUTO}', 'CS70', 'CS90', '{M4}', '{PR3}', '{P7.0}', '{LIFE-RES}',
'F', 'A', 'regional', '{hele_bag,ekstra_baller}', 1, 2, '{}', 'ak_original', '{verste_ball,strategi,konservativ,feilhåndtering}', NULL, true, true),

('Miss-side Mapping',
'Før runden: definer akseptabel miss-side for hvert hull. Etter runden: sjekk om du misset "riktig".',
'Bevisstgjøre at det er bedre å misse på rett side enn å prøve å treffe perfekt',
'1. Studér banekart/yardagebook. 2. Per hull: noter miss-side (venstre/høyre) basert på hazards. 3. Spill runde. 4. Etter: for hvert miss, var det "riktig" side? 5. Mål: 70%+ misser på rett side.',
120, 'SPILL', '{TEE,INN100,INN150,INN200}', '{L-AUTO}', 'CS70', 'CS90', '{M4}', '{PR3}', '{P7.0}', '{LIFE-KAR}',
'F', 'A', 'regional', '{hele_bag,banekart}', 1, 1, '{}', 'ak_original', '{miss_side,strategi,kursmanagement,analyse}', NULL, true, true),

('Par 3 Challenge — Scoring på korte hull',
'Spill kun par 3-hullene (4 hull typisk). Fokus på birdie-sjanser. Score vs par.',
'Målrettet øving på de hullene der scoring-sjansene er størst',
'1. Identifiser par 3-hull. 2. Spill alle med full rutine. 3. Fokus: riktig kølle, riktig avstand, GIR. 4. Score: birdie=3p, par=1p, bogey=0p.',
45, 'SPILL', '{INN100,INN150}', '{L-AUTO}', 'CS70', 'CS90', '{M4}', '{PR4}', '{P7.0}', '{LIFE-SELV}',
'G', 'A', 'klubb', '{hele_bag}', 1, 4, '{}', 'ak_original', '{par3,scoring,strategi,korte_hull}', NULL, true, true);

-- ============================================================
-- TURN — Turnering / Mental (4 driller)
-- ============================================================

INSERT INTO drills (name, description, goal, instructions, duration_minutes, pyramid_level, training_areas, l_phases, cs_min, cs_max, environments, press_levels, p_positions, life_codes, min_category, max_category, difficulty, equipment, players_min, players_max, trackman_metrics, source, tags, sg_area, is_approved, is_active) VALUES

('Pre-turnering Visualisering',
'15 min stille visualisering kvelden før turnering. Se for deg hvert hull, hvert slag, perfekt gjennomføring.',
'Bygge mental beredskap og redusere prestasjonsangst',
'1. Finn rolig sted. 2. Lukk øynene. 3. Gå gjennom hvert hull mentalt: se tee, velg kølle, se ballflukten, se landing. 4. Kjenn følelsen av gode slag. 5. Når du ser et feilslag: reset, spol tilbake, se perfekt slag.',
15, 'TURN', '{TEE,INN100,INN150}', '{L-AUTO}', NULL, NULL, '{M0}', '{PR1}', NULL, '{LIFE-RES}',
'G', 'A', 'klubb', '{}', 1, 1, '{}', 'ak_original', '{visualisering,mental,pre_turnering,forberedelse}', NULL, true, true),

('Matchplay Simulering — Range',
'To spillere "spiller" matchplay på range. Trener annonserer hull. Nærmest mål vinner hullet.',
'Trene konkurransementalitet uten å bruke bane',
'1. Trener: "Par 4, 350m. Driver, deretter innspill 150m." 2. Begge slår driver. Nærmest fairway-mål = 1p. 3. Begge slår innspill. Nærmest green-mål = 1p. 4. 9 "hull". 5. Debrief: håndterte du presset?',
30, 'TURN', '{TEE,INN100,INN150}', '{L-AUTO}', 'CS80', 'CS100', '{M2}', '{PR4}', '{P7.0}', '{LIFE-EMO}',
'G', 'A', 'klubb', '{hele_bag,avstandsmåler}', 2, 4, '{}', 'ak_original', '{matchplay,simulering,konkurranse,press}', NULL, true, true),

('Reset-rutine etter dårlig slag',
'Øv systematisk reset: pust 4-7-8, fysisk trigger (hanskeknapp), positivt utsagn, fokus neste slag.',
'Automatisere mental reset for å unngå at ett dårlig slag blir flere',
'1. Slå et slag. 2. Uansett resultat: gjennomfør reset. 3. Pust: inn 4 sek, hold 7 sek, ut 8 sek. 4. Fysisk trigger: stram og slipp hansken. 5. Si til deg selv: "Neste slag, ny mulighet." 6. 20 repetisjoner. 7. Tid hele sekvensen: mål < 15 sek.',
10, 'TURN', '{TEE}', '{L-AUTO}', NULL, NULL, '{M2,M4,M5}', '{PR3,PR4,PR5}', NULL, '{LIFE-EMO}',
'I', 'A', 'rekrutt', '{}', 1, 1, '{}', 'ak_original', '{reset,mental,pust,trigger,resiliens}', NULL, true, true),

('Strokeplay-simulering under press',
'9 hull treningsrunde der score teller. Trener legger inn forstyrrelser: tidspress, scenarioer, "du ligger 2 slag bak".',
'Trene gjennomføring av strategi under realistisk turneringspress',
'1. 9 hull, score teller. 2. Trener introduserer scenarioer: "Du trenger birdie siste 3 hull." 3. Full rutine hvert slag. 4. Post-runde analyse: hva endret seg under press? Holdt rutinen?',
90, 'TURN', '{TEE,INN100,INN150,INN200}', '{L-AUTO}', 'CS80', 'CS100', '{M4}', '{PR5}', '{P7.0}', '{LIFE-RES}',
'F', 'A', 'regional', '{hele_bag}', 1, 4, '{}', 'ak_original', '{strokeplay,simulering,turnering,press,scenarioer}', NULL, true, true);
