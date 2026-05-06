# AK Golf — Funksjonsoversikt

> Komplett liste over alle funksjoner i Spillerportalen (PlayerHQ) og admin-flata (CoachHQ), beskrevet med enkel norsk tekst. Generert 2026-05-06 fra `docs/player-portal-functions.json` og `docs/coachhq-functions.json`.

---

## PlayerHQ — Spillerportalen (824 funksjoner)

Funksjoner som driver spillerens egen portal — dashboard, trening, bookinger, statistikk og AI-coach.

### Player core (524)

#### `app/portal/(dashboard)/abonnement/actions.ts`
- **getStripePortalUrl()** — Henter Stripe portal URL.
- **getSubscriptionData()** — Henter abonnement data.

#### `app/portal/(dashboard)/apper/actions.ts`
- **getApperPageData()** — Henter apper side data.

#### `app/portal/(dashboard)/bag/actions.ts`
- **addClub()** — Legger til kølle.
- **deleteClub()** — Sletter kølle.
- **getClubDispersions()** — Henter kølle dispersions.
- **getPlayerBag()** — Henter spiller bag.
- **updateClub()** — Oppdaterer kølle.

#### `app/portal/(dashboard)/coaching-historikk/actions.ts`
- **createCoachingSession()** — Oppretter coaching økt.
- **getCoachingSessions()** — Henter coaching økter.
- **saveAISummary()** — Lagrer i sammendrag.

#### `app/portal/(dashboard)/dashboard-actions.ts`
- **getAchievements()** — Henter merker.
- **getCoachInsight()** — Henter coach innsikt.
- **getDailyChecklist()** — Henter daglig sjekkliste.
- **getDashboardStats()** — Henter dashboard statistikk.
- **getDashboardTrainingIndex()** — Henter dashboard trening indeks.
- **getHandicapData()** — Henter handicap data.
- **getHandicapHistory()** — Henter handicap historikk.
- **getLatestAiInsight()** — Henter siste AI innsikt.
- **getNextBooking()** — Henter neste booking.
- **getPlayerLevel()** — Henter spiller nivå.
- **getRoundAggregateMetrics()** — Henter runde aggregate målinger.
- **getSgSummary()** — Henter Strokes Gained sammendrag.
- **getSocialData()** — Henter social data.
- **getTestProgress()** — Henter test progress.
- **getTodayTasks()** — Henter i dag oppgaver.
- **getTrackManData()** — Henter track man data.
- **getWeekRingsData()** — Henter uke ringer data.

#### `app/portal/(dashboard)/onboarding/actions.ts`
- **checkOnboardingStatus()** — Sjekker onboarding status.
- **quickOnboardAndGeneratePlan()** — Hjelpefunksjon for dashboard (quick onboard og generate plan).
- **saveOnboardingData()** — Lagrer onboarding data.
- **skipOnboarding()** — Hjelpefunksjon for dashboard (skip onboarding).

#### `app/portal/(dashboard)/profil/actions.ts`
- **getAchievements()** — Henter merker.
- **getMyProfile()** — Henter min profil.
- **getPlayerSGData()** — Henter spiller s g data.
- **getPlayerStats()** — Henter spiller statistikk.
- **updateProfile()** — Oppdaterer profil.
- **uploadAvatar()** — Laster opp avatar.

#### `app/portal/(dashboard)/profil/goal-actions.ts`
- **createGoal()** — Oppretter mål.
- **deleteGoal()** — Sletter mål.
- **getGoals()** — Henter mål.
- **updateGoal()** — Oppdaterer mål.

#### `app/portal/(dashboard)/runde/actions.ts`
- **completeRound()** — Markerer runde som ferdig.
- **getDecadeStrategy()** — Henter DECADE strategi.
- **getRoundDetail()** — Henter runde detalj.
- **saveHoleResult()** — Lagrer hull resultat.
- **searchCourses()** — Søker etter baner.
- **startRound()** — Starter runde.

#### `app/portal/(dashboard)/spill/actions.ts`
- **createGameSession()** — Oppretter game økt.
- **getChallenges()** — Henter utfordringer.
- **getGameSessions()** — Henter game økter.
- **getRecentCourses()** — Henter nylige baner.
- **joinGameSession()** — Blir med i game økt.
- **searchCourses()** — Søker etter baner.

#### `app/portal/(dashboard)/talent/access.ts`
- **canViewTalentDashboard()** — Sjekker om brukeren kan visning talent dashboard.

#### `app/portal/(dashboard)/talent/actions.ts`
- **fetchLeaderboard()** — Henter rangering.
- **fetchMyTalentDashboardData()** — Henter min talent dashboard data.
- **fetchPlayerProfile()** — Henter spiller profil.

#### `app/portal/(dashboard)/turneringer/actions.ts`
- **getTournamentPrepAction()** — Henter tournament prep action.
- **getTournaments()** — Henter tournaments.
- **registerForTournament()** — Registrerer for tournament.
- **saveTournamentPrepAction()** — Lagrer tournament prep action.

#### `app/portal/(dashboard)/turneringsplan/actions.ts`
- **getPlayerTournaments()** — Henter spiller tournaments.
- **registerForTournament()** — Registrerer for tournament.

#### `lib/portal/access.ts`
- **canLogTrainingSession()** — Sjekker om brukeren kan logg trening økt.
- **canUseAiAnalysis()** — Sjekker om brukeren kan use AI analysis.
- **completeOnboarding()** — Markerer onboarding som ferdig.
- **getPortalLimits()** — Henter portal limits.
- **getPortalUsage()** — Henter portal usage.
- **getUserModuleSlugs()** — Henter bruker module slugs.
- **hasCompletedOnboarding()** — Sjekker om fullført onboarding finnes.
- **hasModuleAccess()** — Sjekker om module access finnes.
- **incrementAiCount()** — Hjelpefunksjon for data (increment AI antall).
- **incrementLogCount()** — Hjelpefunksjon for data (increment logg antall).

#### `lib/portal/allocation/ai-adjust.ts`
- **aiAdjustAllocation()** — Hjelpefunksjon for data (AI adjust allocation).

#### `lib/portal/allocation/engine.ts`
- **computeAllocation()** — Beregner allocation.

#### `lib/portal/allocation/formulas.ts`
- **HCP_BASELINE_ALLOCATION()** — Hjelpefunksjon for data (h c p_ b s e l i n e_ l l o c t i o n).
- **hcpToBaselineKey()** — Hjelpefunksjon for data (HCP til baseline key).
- **normalizeAllocation()** — Hjelpefunksjon for data (normalize allocation).
- **PHASE_MULTIPLIERS()** — Hjelpefunksjon for data (p h s e_ m u l t i p l i e r s).
- **roundTo100()** — Hjelpefunksjon for data (runde to100).
- **SEASON_BY_MONTH()** — Hjelpefunksjon for data (s e s o n_ b y_ m o n t h).

#### `lib/portal/allocation/recompute.ts`
- **shouldRecompute()** — Avgjør om recompute.

#### `lib/portal/beta-test/rory-augusta-test.ts`
- **BENCHMARKS()** — Hjelpefunksjon for test (b e n c h m r k s).
- **calculate100mResult()** — Hjelpefunksjon for test (calculate100m resultat).
- **calculateDriverResult()** — Beregner driver resultat.
- **generateCombinedSummary()** — Genererer combined sammendrag.

#### `lib/portal/calendar/aggregator.ts`
- **getCalendarEvents()** — Henter kalender hendelser.
- **syncUserCalendar()** — Synkroniserer bruker kalender.

#### `lib/portal/calendar/google-calendar.ts`
- **getAuthUrl()** — Henter auth URL.
- **getValidTokens()** — Henter valid tokens.
- **handleCallback()** — Håndterer callback.
- **removeFromCalendar()** — Fjerner fra kalender.
- **syncBookingToCalendar()** — Synkroniserer booking til kalender.
- **verifyState()** — Verifiserer tilstand.

#### `lib/portal/coaching-signals/compute.ts`
- **computeCoachingSignalsForCoach()** — Beregner coaching signaler for coach.
- **computeCoachingSignalsForUsers()** — Beregner coaching signaler for brukere.
- **invalidateSignalCache()** — Hjelpefunksjon for coach (invalidate signal cache).

#### `lib/portal/courses/geojson-actions.ts`
- **getCourseForMap()** — Henter bane for map.
- **importCourseGeoJson()** — Importerer bane geo json.

#### `lib/portal/cowork/append-session.ts`
- **appendSessionToCowork()** — Hjelpefunksjon for data (append økt til cowork).

#### `lib/portal/economy/student-metrics.ts`
- **getStudentEconomy()** — Henter spiller økonomi.
- **tierMonthlyPriceKr()** — Hjelpefunksjon for økonomien (tier månedlig price kr).

#### `lib/portal/golf/ak-formula.ts`
- **CS_LEVELS()** — Hjelpefunksjon for data (c s_ l e v e l s).
- **generateSessionId()** — Genererer økt id.
- **getPlayerCategory()** — Henter spiller kategori.
- **getRecommendedTrainingDistribution()** — Henter recommended trening fordeling.
- **L_PHASES()** — Hjelpefunksjon for data (l_ p h s e s).
- **LIFE_DIMENSIONS()** — Hjelpefunksjon for data (l i f e_ d i m e n s i o n s).
- **M_ENVIRONMENTS()** — Hjelpefunksjon for data (m_ e n v i r o n m e n t s).
- **P_POSITIONS()** — Hjelpefunksjon for data (p_ p o s i t i o n s).
- **parseSessionId()** — Tolker økt id.
- **PERIOD_TYPES()** — Hjelpefunksjon for data (p e r i o d_ t y p e s).
- **PLAYER_CATEGORIES()** — Hjelpefunksjon for data (p l y e r_ c t e g o r i e s).
- **PR_LEVELS()** — Hjelpefunksjon for data (p r_ l e v e l s).
- **PYRAMID_LEVELS()** — Hjelpefunksjon for data (p y r m i d_ l e v e l s).
- **SLAG_CATEGORIES()** — Hjelpefunksjon for data (s l g_ c t e g o r i e s).
- **TRAINING_AREA_CATEGORIES()** — Hjelpefunksjon for data (t r i n i n g_ r e a_ c t e g o r i e s).
- **TRAINING_AREAS()** — Hjelpefunksjon for data (t r i n i n g_ r e s).

#### `lib/portal/golf/calculate-sg-from-rounds.ts`
- **calculateDifferential()** — Beregner differential.
- **calculateWeatherAdjustment()** — Beregner weather adjustment.
- **computePlayerSgProfile()** — Beregner spiller Strokes Gained profil.
- **computeRoundSg()** — Beregner runde Strokes Gained.
- **differentialToSgEquivalent()** — Hjelpefunksjon for runden (differential til Strokes Gained equivalent).
- **predictScoreFromSg()** — Hjelpefunksjon for runden (predict score fra Strokes Gained).
- **sgFromScore()** — Hjelpefunksjon for runden (Strokes Gained fra score).

#### `lib/portal/golf/clubspeed-resolver.ts`
- **getOrFallbackProfile()** — Henter eller fallback profil.
- **resolveCSTarget()** — Løser c s mål.

#### `lib/portal/golf/decade-caddy.ts`
- **calculateRoundDecadeScore()** — Beregner runde DECADE score.
- **estimateScoreForCourse()** — Estimerer score for bane.
- **evaluateDecision()** — Hjelpefunksjon for DECADE-strategien (evaluate decision).
- **generateHoleStrategy()** — Genererer hull strategi.
- **getPreShotRoutine()** — Henter pre slag routine.

#### `lib/portal/golf/decade-strategy.ts`
- **generateTournamentStrategy()** — Genererer tournament strategi.

#### `lib/portal/golf/dispersion.ts`
- **calculateDispersionEllipse()** — Beregner dispersion ellipse.
- **dispersionHitsTarget()** — Hjelpefunksjon for data (dispersion hits mål).
- **recommendClub()** — Hjelpefunksjon for data (recommend kølle).

#### `lib/portal/golf/distance-buckets.ts`
- **computeDominantBuckets()** — Beregner dominant buckets.

#### `lib/portal/golf/expected-strokes.ts`
- **getExpectedPutts()** — Henter expected putts.
- **getExpectedStrokes()** — Henter expected Strokes Gained.

#### `lib/portal/golf/golfbox-importer.ts`
- **importGolfBoxRounds()** — Importerer golf box runder.
- **parseGolfBoxCSV()** — Tolker golf box c s v.

#### `lib/portal/golf/golfbox/handicap.ts`
- **calculateAdjustedGrossScore()** — Beregner adjusted gross score.
- **calculateHandicapDifferential()** — Beregner handicap differential.
- **calculateHandicapIndex()** — Beregner handicap indeks.
- **calculatePlayingHandicap()** — Beregner playing handicap.
- **generateAttestationData()** — Genererer attestation data.

#### `lib/portal/golf/gps/distance-calculator.ts`
- **haversineDistance()** — Hjelpefunksjon for data (haversine distance).

#### `lib/portal/golf/scorecard-photo-parser.ts`
- **parseScorecardPhoto()** — Tolker scorecard bilde.

#### `lib/portal/golf/skill-levels.ts`
- **getNextLevel()** — Henter neste nivå.
- **getSkillLevelByCode()** — Henter skill nivå via code.
- **getSkillLevelByHandicap()** — Henter skill nivå via handicap.
- **getSkillLevelByScore()** — Henter skill nivå via score.
- **SKILL_LEVELS()** — Hjelpefunksjon for ferdighetsnivået (s k i l l_ l e v e l s).

#### `lib/portal/golf/units.ts`
- **APPROACH_BUCKETS_YARDS()** — Hjelpefunksjon for data (p p r o c h_ b u c k e t s_ y r d s).
- **feetToMeters()** — Hjelpefunksjon for data (feet til meters).
- **formatApproachBucket()** — Formaterer approach bucket.
- **formatDistance()** — Formaterer distance.
- **formatPuttingDistance()** — Formaterer putting distance.
- **formatPuttingLabel()** — Formaterer putting etikett.
- **formatTrainingAreaLabel()** — Formaterer trening område etikett.
- **getDefaultUnitSystem()** — Henter standard unit system.
- **metersToFeet()** — Hjelpefunksjon for data (meters til feet).
- **metersToYards()** — Hjelpefunksjon for data (meters til yards).
- **parseDistanceInput()** — Tolker distance input.
- **PUTTING_RANGES_FEET()** — Hjelpefunksjon for data (p u t t i n g_ r n g e s_ f e e t).
- **TRAINING_AREA_RANGES_METERS()** — Hjelpefunksjon for data (t r i n i n g_ r e a_ r n g e s_ m e t e r s).
- **yardsToMeters()** — Hjelpefunksjon for data (yards til meters).

#### `lib/portal/google-calendar/sync.ts`
- **disconnectGoogleCalendar()** — Hjelpefunksjon for kalenderen (disconnect Google kalender).
- **fetchCalendarList()** — Henter kalender liste.
- **getImportedEvents()** — Henter imported hendelser.
- **getSyncStatus()** — Henter sync status.
- **getValidAccessToken()** — Henter valid access token.
- **syncAllGoogleCalendars()** — Synkroniserer alle Google calendars.
- **syncGoogleCalendar()** — Synkroniserer Google kalender.

#### `lib/portal/google-calendar/webhook.ts`
- **handleWebhookNotification()** — Håndterer webhook varsel.
- **renewExpiringWebhooks()** — Hjelpefunksjon for kalenderen (renew expiring webhooks).
- **stopWatchingCalendar()** — Stopper watching kalender.

#### `lib/portal/invoice.ts`
- **generateInvoice()** — Genererer faktura.

#### `lib/portal/library/generator.ts`
- **generateLibraryItems()** — Genererer library items.

#### `lib/portal/library/prompts.ts`
- **buildSystemPrompt()** — Bygger system prompt.
- **buildUserPrompt()** — Bygger bruker prompt.

#### `lib/portal/library/queries.ts`
- **countByStatus()** — Teller via status.
- **findApprovedForPlanner()** — Finner approved for planner.
- **getLibraryItem()** — Henter library item.
- **incrementUsage()** — Hjelpefunksjon for data (increment usage).

#### `lib/portal/library/types.ts`
- **ITEM_TYPE_LABELS()** — Hjelpefunksjon for data (i t e m_ t y p e_ l b e l s).
- **SOURCE_LABELS()** — Hjelpefunksjon for data (s o u r c e_ l b e l s).
- **STATUS_LABELS()** — Hjelpefunksjon for data (s t t u s_ l b e l s).

#### `lib/portal/notifications.ts`
- **createNotification()** — Oppretter varsel.
- **createNotifications()** — Oppretter varsler.

#### `lib/portal/notion/client.ts`
- **getNotionClient()** — Henter Notion client.
- **queryDatabase()** — Henter database.

#### `lib/portal/notion/content-sync.ts`
- **fetchContentFromNotion()** — Henter content fra Notion.
- **syncContentToNotion()** — Synkroniserer content til Notion.

#### `lib/portal/notion/drill-sync.ts`
- **syncAllDrillsToNotion()** — Synkroniserer alle øvelser til Notion.
- **syncDrillToNotion()** — Synkroniserer øvelse til Notion.

#### `lib/portal/notion/player-profiles.ts`
- **appendCoachingSessionToProfile()** — Hjelpefunksjon for spillerprofil (append coaching økt til profil).
- **createPlayerProfile()** — Oppretter spiller profil.

#### `lib/portal/notion/task-sync.ts`
- **createTaskInNotion()** — Oppretter oppgave in Notion.
- **syncTasksFromNotion()** — Synkroniserer oppgaver fra Notion.

#### `lib/portal/page-tabs-config.ts`
- **getActiveTab()** — Henter aktiv tab.
- **getTabGroupForPath()** — Henter tab gruppe for path.
- **PORTAL_TAB_GROUPS()** — Hjelpefunksjon for data (p o r t l_ t b_ g r o u p s).

#### `lib/portal/parent/relations.ts`
- **canViewPlayerData()** — Sjekker om brukeren kan visning spiller data.
- **getChildrenForParent()** — Henter children for parent.
- **getParentsForChild()** — Henter parents for child.
- **linkParentToChild()** — Kobler parent til child.
- **unlinkParentFromChild()** — Kobler fra parent fra child.

#### `lib/portal/playerhq-access.ts`
- **getPlayerHQAccess()** — Henter spiller h q access.
- **hasPlayerHQAccess()** — Sjekker om spiller h q access finnes.

#### `lib/portal/preferences/actions.ts`
- **getDefaultView()** — Henter standard visning.
- **getUserPreferences()** — Henter bruker preferanser.
- **setDefaultView()** — Setter standard visning.
- **toggleWidget()** — Slår av/på widget.
- **updateDashboardLayout()** — Oppdaterer dashboard layout.

#### `lib/portal/pro-challenge/pro-players-config.ts`
- **CHALLENGE_SCENARIOS()** — Hjelpefunksjon for utfordringen (c h l l e n g e_ s c e n r i o s).
- **compareToPro()** — Hjelpefunksjon for utfordringen (compare til pro).
- **getAllPros()** — Henter alle pros.
- **getAllScenarios()** — Henter alle scenarios.
- **getProPlayer()** — Henter pro spiller.
- **getProsByCountry()** — Henter pros via country.
- **getProsByPlayStyle()** — Henter pros via play style.
- **getProStats()** — Henter pro statistikk.
- **getScenario()** — Henter scenario.
- **getScenariosForPro()** — Henter scenarios for pro.
- **getSupportedScenarios()** — Henter supported scenarios.
- **PRO_PLAYERS()** — Hjelpefunksjon for utfordringen (p r o_ p l y e r s).
- **PRO_STATS()** — Hjelpefunksjon for utfordringen (p r o_ s t t s).

#### `lib/portal/rate-limit.ts`
- **checkRateLimit()** — Sjekker rate limit.
- **getClientIp()** — Henter client ip.
- **RATE_LIMITS()** — Hjelpefunksjon for data (r t e_ l i m i t s).

#### `lib/portal/round/club-suggester.ts`
- **getPlayerClubs()** — Henter spiller køller.
- **suggestClubFromDistance()** — Hjelpefunksjon for runden (suggest kølle fra distance).

#### `lib/portal/round/lie-detection.ts`
- **detectLieFromGps()** — Hjelpefunksjon for runden (detect lie fra gps).

#### `lib/portal/round/live-actions.ts`
- **startLiveRound()** — Starter live runde.
- **togglePauseRound()** — Slår av/på pause runde.

#### `lib/portal/round/map-shot-actions.ts`
- **logShotWithGps()** — Logger slag med gps.

#### `lib/portal/round/shot-actions.ts`
- **completeHole()** — Markerer hull som ferdig.
- **completeRound()** — Markerer runde som ferdig.
- **logShot()** — Logger slag.

#### `lib/portal/sms/send-booking-sms.ts`
- **sendBookingCancellationSms()** — Sender booking cancellation SMS.
- **sendBookingConfirmationSms()** — Sender booking confirmation SMS.
- **sendPaymentLinkSms()** — Sender betaling lenke SMS.

#### `lib/portal/sms/send-reminder-sms.ts`
- **sendReminderSms()** — Sender reminder SMS.

#### `lib/portal/sms/twilio.ts`
- **getTwilioClient()** — Henter Twilio client.

#### `lib/portal/sponsor/data.ts`
- **getActiveSponsors()** — Henter aktiv sponsors.

#### `lib/portal/strokes-gained/expected-strokes.ts`
- **calculateShotSg()** — Beregner slag Strokes Gained.
- **expectedStrokesForHole()** — Hjelpefunksjon for Strokes Gained (expected Strokes Gained for hull).
- **expectedStrokesFromLie()** — Hjelpefunksjon for Strokes Gained (expected Strokes Gained fra lie).
- **getSgCategory()** — Henter Strokes Gained kategori.

#### `lib/portal/technical-plan/service.ts`
- **createDrill()** — Oppretter øvelse.
- **createPhase()** — Oppretter phase.
- **createPlanSessionWithMatch()** — Oppretter plan økt med treff.
- **createTechnicalPlan()** — Oppretter technical plan.
- **deletePhase()** — Sletter phase.
- **deleteTechnicalPlan()** — Sletter technical plan.
- **getActivePlanForPlayer()** — Henter aktiv plan for spiller.
- **getPlanWithPhasesAndSessions()** — Henter plan med phases og økter.
- **getTechnicalPlanById()** — Henter technical plan via id.
- **listDrills()** — Lister øvelser.
- **listTechnicalPlansForCoach()** — Lister technical planer for coach.
- **listTechnicalPlansForPlayer()** — Lister technical planer for spiller.
- **logProgress()** — Logger progress.
- **updatePhase()** — Oppdaterer phase.
- **updateTechnicalPlan()** — Oppdaterer technical plan.
- **verifyProgress()** — Verifiserer progress.

#### `lib/portal/technical-plan/types.ts`
- **ENVIRONMENT_LABELS()** — Hjelpefunksjon for treningsplan (e n v i r o n m e n t_ l b e l s).
- **PHASE_STATUS_LABELS()** — Hjelpefunksjon for treningsplan (p h s e_ s t t u s_ l b e l s).
- **TECHNICAL_PLAN_STATUS_LABELS()** — Hjelpefunksjon for treningsplan (t e c h n i c l_ p l n_ s t t u s_ l b e l s).
- **TRAINING_AREA_LABELS()** — Hjelpefunksjon for treningsplan (t r i n i n g_ r e a_ l b e l s).

#### `lib/portal/tests/calculate.ts`
- **calculateValue()** — Beregner value.
- **getInputLabel()** — Henter input etikett.

#### `lib/portal/tests/category-requirements.ts`
- **CATEGORY_REQUIREMENTS()** — Hjelpefunksjon for test (c t e g o r y_ r e q u i r e m e n t s).
- **getAchievedCategory()** — Henter achieved kategori.
- **getRequirementForCategory()** — Henter requirement for kategori.
- **meetsRequirement()** — Hjelpefunksjon for test (meets requirement).

#### `lib/portal/tests/test-battery.ts`
- **calculateAvgPEI()** — Beregner avg p e i.
- **calculatePEI()** — Beregner p e i.
- **getTestArea()** — Henter test område.
- **getTestCategoryLabel()** — Henter test kategori etikett.
- **getTestGroup()** — Henter test gruppe.
- **getTestName()** — Henter test navn.
- **getTestPyramid()** — Henter test pyramide.
- **getTestSource()** — Henter test kilde.
- **isTestExercise()** — Sjekker om test øvelse.

#### `lib/portal/tests/validation.ts`
- **getInputRange()** — Henter input range.
- **isInputComplete()** — Sjekker om input complete.
- **validateInputs()** — Validerer inputs.

#### `lib/portal/tier-utils.ts`
- **getLimitsForTier()** — Henter limits for tier.
- **isFreeTier()** — Sjekker om free tier.
- **isPaidTier()** — Sjekker om paid tier.
- **PORTAL_LIMITS()** — Hjelpefunksjon for data (p o r t l_ l i m i t s).

#### `lib/portal/timezone.ts`
- **formatTimeInTimezone()** — Formaterer tid in timezone.
- **getDayOfWeekInTimezone()** — Henter dag av uke in timezone.
- **nowInTimezone()** — Hjelpefunksjon for data (now in timezone).
- **parseTimeInTimezone()** — Tolker tid in timezone.

#### `lib/portal/utils.ts`
- **cn()** — Hjelpefunksjon for data (cn).

#### `lib/portal/utils/cn.ts`
- **cn()** — Hjelpefunksjon for data (cn).

#### `lib/portal/views/registry.ts`
- **getDefaultViewId()** — Henter standard visning id.
- **getScreenViews()** — Henter screen visninger.
- **getViewLabel()** — Henter visning etikett.
- **isValidView()** — Sjekker om valid visning.
- **VIEW_REGISTRY()** — Hjelpefunksjon for data (v i e w_ r e g i s t r y).

#### `lib/portal/widgets/actions.ts`
- **getDegradationAlerts()** — Henter degradation varsler.
- **getLeaderboard()** — Henter rangering.
- **getMentalTrends()** — Henter mental form trends.
- **getNextCompetition()** — Henter neste competition.
- **getPeriodSummary()** — Henter period sammendrag.
- **getPlanProgress()** — Henter plan progress.
- **getRecentCoachingFeedback()** — Henter nylige coaching tilbakemelding.
- **getSeasonPlan()** — Henter season plan.
- **getTrainingVolume()** — Henter trening volume.

#### `lib/portal/widgets/registry.ts`
- **getWidgetDef()** — Henter widget def.
- **WIDGET_REGISTRY()** — Hjelpefunksjon for data (w i d g e t_ r e g i s t r y).
- **WIDGET_SIZE_CLASSES()** — Hjelpefunksjon for data (w i d g e t_ s i z e_ c l s s e s).

### Training (228)

#### `app/portal/(dashboard)/dagbok/actions.ts`
- **addCoachFeedback()** — Legger til coach tilbakemelding.
- **deleteTrainingLog()** — Sletter trening logg.
- **getLastSession()** — Henter last økt.
- **getLoggedSessionIds()** — Henter logged økt ids.
- **getSessionWithExercises()** — Henter økt med øvelser.
- **getTrainingLogs()** — Henter trening logger.
- **logSession()** — Logger økt.
- **logSessionWithExercises()** — Logger økt med øvelser.
- **quickLogSession()** — Hjelpefunksjon for dashboard (quick logg økt).
- **repeatLastSession()** — Hjelpefunksjon for dashboard (repeat last økt).
- **updateExerciseLog()** — Oppdaterer øvelse logg.
- **updateTrainingLog()** — Oppdaterer trening logg.

#### `app/portal/(dashboard)/kartlegging/actions.ts`
- **getKartleggingData()** — Henter kartlegging data.
- **recordDataConsent()** — Registrerer data samtykke.
- **withdrawDataConsent()** — Hjelpefunksjon for dashboard (withdraw data samtykke).

#### `app/portal/(dashboard)/tester/[testNumber]/actions.ts`
- **submitTestResult()** — Sender inn test resultat.

#### `app/portal/(dashboard)/tester/actions.ts`
- **getTesterStats()** — Henter tester statistikk.
- **getTestsOverview()** — Henter tester overview.

#### `app/portal/(dashboard)/treningsplan/actions.ts`
- **acceptSuggestion()** — Aksepterer suggestion.
- **activatePlan()** — Aktiverer plan.
- **addExerciseToSession()** — Legger til øvelse til økt.
- **adjustPlanVolume()** — Hjelpefunksjon for dashboard (adjust plan volume).
- **analyzePlanDeviation()** — Analyserer plan deviation.
- **applyTemplateToWeek()** — Hjelpefunksjon for dashboard (apply template til uke).
- **archivePlan()** — Arkiverer plan.
- **checkSessionConflicts()** — Sjekker økt conflicts.
- **createManualPlan()** — Oppretter manual plan.
- **createPlanFromChoice()** — Oppretter plan fra choice.
- **createSessionForWeek()** — Oppretter økt for uke.
- **deletePlan()** — Sletter plan.
- **deleteSession()** — Sletter økt.
- **dismissPlanAdjustment()** — Hjelpefunksjon for dashboard (dismiss plan adjustment).
- **duplicateOwnPlan()** — Hjelpefunksjon for dashboard (duplicate own plan).
- **duplicateSession()** — Hjelpefunksjon for dashboard (duplicate økt).
- **getActivePlan()** — Henter aktiv plan.
- **getCurrentPeriodization()** — Henter nåværende periodization.
- **getCurrentWeekSessions()** — Henter nåværende uke økter.
- **getPlanGoalsProgress()** — Henter plan mål progress.
- **getTestsAsExercises()** — Henter tester as øvelser.
- **listAvailableFacilities()** — Lister available fasiliteter.
- **listMyPendingSuggestions()** — Lister min ventende suggestions.
- **listMyPlans()** — Lister min planer.
- **listStandardTemplates()** — Lister standard templates.
- **logLiveSession()** — Logger live økt.
- **moveSessionToDay()** — Flytter økt til dag.
- **rejectSuggestion()** — Avslår suggestion.
- **reorderSessionsInDay()** — Hjelpefunksjon for dashboard (reorder økter in dag).
- **saveSessionProgress()** — Lagrer økt progress.
- **searchTestsAsExercises()** — Søker etter tester as øvelser.
- **setPlanPlayerComment()** — Setter plan spiller kommentar.
- **toggleRestDay()** — Slår av/på rest dag.
- **toggleSessionComplete()** — Slår av/på økt complete.
- **updateSession()** — Oppdaterer økt.
- **updateSessionTime()** — Oppdaterer økt tid.

#### `app/portal/(dashboard)/treningsplan/group-rsvp-actions.ts`
- **listMyUpcomingGroupSessions()** — Lister min kommende gruppe økter.
- **respondToGroupSession()** — Hjelpefunksjon for dashboard (respond til gruppe økt).

#### `app/portal/(dashboard)/treningsplan/overview-helpers.ts`
- **buildLibraryItems()** — Bygger library items.
- **computeWeeklyTargets()** — Beregner ukentlig targets.
- **getActiveCoachName()** — Henter aktiv coach navn.

#### `lib/portal/calendar/training-plan-sync.ts`
- **removeTrainingSessionFromCalendar()** — Fjerner trening økt fra kalender.
- **syncPlanToGoogleCalendar()** — Synkroniserer plan til Google kalender.
- **syncTrainingSessionToCalendar()** — Synkroniserer trening økt til kalender.

#### `lib/portal/golf/exercise-types.ts`
- **EQUIPMENT_PRESETS()** — Hjelpefunksjon for data (e q u i p m e n t_ p r e s e t s).
- **INTENSITY_LEVELS()** — Hjelpefunksjon for data (i n t e n s i t y_ l e v e l s).

#### `lib/portal/golf/training-areas.ts`
- **getTrainingArea()** — Henter trening område.
- **getTrainingAreaGroup()** — Henter trening område gruppe.
- **TRAINING_AREA_GROUPS()** — Hjelpefunksjon for treningsplan (t r i n i n g_ r e a_ g r o u p s).

#### `lib/portal/kartlegging/coach-access.ts`
- **assignPlayerToCoach()** — Tildeler spiller til coach.
- **canViewPlayer()** — Sjekker om brukeren kan visning spiller.
- **endPlayerAssignment()** — Hjelpefunksjon for coach (slutt spiller assignment).
- **getMyPlayers()** — Henter min spillere.
- **pausePlayerAssignment()** — Pauser spiller assignment.

#### `lib/portal/kartlegging/profile.ts`
- **getGapAnalysis()** — Henter gap analysis.
- **getPlayerProfile()** — Henter spiller profil.

#### `lib/portal/kartlegging/test-history.ts`
- **getTestHistory()** — Henter test historikk.

#### `lib/portal/kartlegging/training-index.ts`
- **getTrainingIndex()** — Henter trening indeks.

#### `lib/portal/notion/training-plan-sync.ts`
- **syncTrainingPlanToNotion()** — Synkroniserer trening plan til Notion.

#### `lib/portal/tests/test-exercise-bridge.ts`
- **testToSessionExercise()** — Hjelpefunksjon for test (test til økt øvelse).

#### `lib/portal/training-research/constants.ts`
- **DATA_QUALITY_SCORE()** — Hjelpefunksjon for treningsplan (d t a_ q u l i t y_ s c o r e).
- **DELIBERATE_PRACTICE_RATIO()** — Hjelpefunksjon for treningsplan (d e l i b e r t e_ p r c t i c e_ r t i o).
- **DIMINISHING_RETURNS()** — Hjelpefunksjon for treningsplan (d i m i n i s h i n g_ r e t u r n s).
- **getCategoryLabel()** — Henter kategori etikett.
- **getFocusTimeStatus()** — Henter fokus tid status.
- **getPlayerCategory()** — Henter spiller kategori.
- **getRepsStatus()** — Henter reps status.
- **getSpacingStatus()** — Henter spacing status.
- **getVolumeStatus()** — Henter volume status.
- **SPACING_EFFECT()** — Hjelpefunksjon for treningsplan (s p c i n g_ e f f e c t).
- **VOLUME_LIMITS()** — Hjelpefunksjon for treningsplan (v o l u m e_ l i m i t s).

#### `lib/portal/training-research/myelin-decay.ts`
- **calculateMyelinStatus()** — Beregner myelin status.
- **checkPlanMyelinStatus()** — Sjekker plan myelin status.
- **formatDaysSince()** — Formaterer dager since.

#### `lib/portal/training-research/volume-engine.ts`
- **assessSessionVolume()** — Hjelpefunksjon for treningsplan (assess økt volume).
- **assessSpacing()** — Hjelpefunksjon for treningsplan (assess spacing).
- **calculateProgressiveVolume()** — Beregner progressive volume.
- **getWeeklyTarget()** — Henter ukentlig mål.

#### `lib/portal/training/ak-taxonomy.ts`
- **byggOktId()** — Hjelpefunksjon for treningsplan (bygg okt id).
- **CS_NIVAER()** — Hjelpefunksjon for treningsplan (c s_ n i v e r).
- **L_FASER()** — Hjelpefunksjon for treningsplan (l_ f s e r).
- **labelForLFase()** — Hjelpefunksjon for treningsplan (etikett for l fase).
- **labelForOmraade()** — Hjelpefunksjon for treningsplan (etikett for omraade).
- **labelForPyramide()** — Hjelpefunksjon for treningsplan (etikett for pyramide).
- **LIFE_KODER()** — Hjelpefunksjon for treningsplan (l i f e_ k o d e r).
- **M_MILJO()** — Hjelpefunksjon for treningsplan (m_ m i l j o).
- **OMRADE_GRUPPER()** — Hjelpefunksjon for treningsplan (o m r d e_ g r u p p e r).
- **P_POSISJONER()** — Hjelpefunksjon for treningsplan (p_ p o s i s j o n e r).
- **PR_PRESS()** — Hjelpefunksjon for treningsplan (p r_ p r e s s).
- **PUTTING_FASER()** — Hjelpefunksjon for treningsplan (p u t t i n g_ f s e r).
- **PUTTING_FOKUS()** — Hjelpefunksjon for treningsplan (p u t t i n g_ f o k u s).
- **PYRAMIDE()** — Hjelpefunksjon for treningsplan (p y r m i d e).
- **SPILLERKATEGORIER()** — Hjelpefunksjon for treningsplan (s p i l l e r k t e g o r i e r).
- **TEMPLATE_FOCUS()** — Hjelpefunksjon for treningsplan (t e m p l t e_ f o c u s).
- **TRENINGSOMRADER()** — Hjelpefunksjon for treningsplan (t r e n i n g s o m r d e r).

#### `lib/portal/training/analysis-actions.ts`
- **analyzeTraining()** — Analyserer trening.
- **compareTrainingFilters()** — Hjelpefunksjon for treningsplan (compare trening filtre).

#### `lib/portal/training/conflict-detector.ts`
- **detectSessionConflicts()** — Hjelpefunksjon for treningsplan (detect økt conflicts).

#### `lib/portal/training/degradation-service.ts`
- **calculateDegradation()** — Beregner degradation.
- **getEnvironmentDistribution()** — Henter environment fordeling.
- **getTekSlagSpillGap()** — Henter tek slag spill gap.

#### `lib/portal/training/exercise-actions.ts`
- **createUserExercise()** — Oppretter bruker øvelse.
- **registerExerciseUsage()** — Registrerer øvelse usage.
- **toggleFavoriteExercise()** — Slår av/på favorite øvelse.

#### `lib/portal/training/l-phase-service.ts`
- **getAllLPhasesForUser()** — Henter alle l phases for bruker.
- **getLPhaseForShotType()** — Henter l phase for slag type.
- **getLPhaseHistory()** — Henter l phase historikk.
- **setLPhaseForShotType()** — Setter l phase for slag type.

#### `lib/portal/training/pdf-export.tsx`
- **renderPlanPdf()** — Viser plan pdf.

#### `lib/portal/training/plan-access.ts`
- **canAccessPlan()** — Sjekker om brukeren kan access plan.
- **canEditPlan()** — Sjekker om brukeren kan edit plan.

#### `lib/portal/training/plan-generator.ts`
- **generatePlan()** — Genererer plan.

#### `lib/portal/training/plan-suggestion-service.ts`
- **applySessionDiff()** — Hjelpefunksjon for treningsplan (apply økt diff).
- **buildSessionDiff()** — Bygger økt diff.
- **createSuggestion()** — Oppretter suggestion.
- **listPendingSuggestionsForPlan()** — Lister ventende suggestions for plan.

#### `lib/portal/training/session-exercise-types.ts`
- **parseSessionExercises()** — Tolker økt øvelser.
- **sumExerciseDurations()** — Summerer øvelse durations.
- **validateSessionExercise()** — Validerer økt øvelse.

#### `lib/portal/training/standard-templates.ts`
- **DURATION_OPTIONS()** — Hjelpefunksjon for treningsplan (d u r t i o n_ o p t i o n s).
- **getTemplate()** — Henter template.
- **STANDARD_TEMPLATES()** — Hjelpefunksjon for treningsplan (s t n d r d_ t e m p l t e s).

#### `lib/portal/training/template-service.ts`
- **getActiveTemplates()** — Henter aktiv templates.
- **getAllTemplatesForAdmin()** — Henter alle templates for admin.
- **getTemplateById()** — Henter template via id.

#### `lib/portal/training/test-scheduler.ts`
- **calculateRetestDate()** — Beregner retest dato.
- **isTestOverdue()** — Sjekker om test overdue.

### Booking (81)

#### `app/portal/(dashboard)/bookinger/actions.ts`
- **cancelBooking()** — Kansellerer booking.
- **getPastBookings()** — Henter tidligere bookinger.
- **getUpcomingBookings()** — Henter kommende bookinger.

#### `app/portal/(dashboard)/bookinger/venteliste/actions.ts`
- **cancelWaitlistEntry()** — Kansellerer venteliste entry.

#### `app/portal/(dashboard)/kalender/actions.ts`
- **getCalendarEvents()** — Henter kalender hendelser.
- **getPeriodizationBands()** — Henter periodization bands.

#### `lib/portal/availability/parse-time-range.ts`
- **parseTimeRange()** — Tolker tid range.

#### `lib/portal/booking/auto-create-user.ts`
- **autoCreateUser()** — Hjelpefunksjon for booking (auto create bruker).
- **verifyPassword()** — Verifiserer passord.

#### `lib/portal/booking/available-slots-compute.ts`
- **computeRemainingSlots()** — Beregner remaining tidsslots.
- **endOfWeek()** — Hjelpefunksjon for booking (slutt av uke).

#### `lib/portal/booking/available-slots.ts`
- **countAvailableSlotsThisWeek()** — Teller available tidsslots this uke.

#### `lib/portal/booking/cache.ts`
- **CACHE_TAGS()** — Hjelpefunksjon for booking (c c h e_ t g s).
- **CACHE_TTL()** — Hjelpefunksjon for booking (c c h e_ t t l).
- **invalidateBookingsCache()** — Hjelpefunksjon for booking (invalidate bookinger cache).
- **invalidateSlotsCache()** — Hjelpefunksjon for booking (invalidate tidsslots cache).

#### `lib/portal/booking/conflict-check.ts`
- **checkAllConflicts()** — Sjekker alle conflicts.
- **checkBlockedTimeConflict()** — Sjekker blocked tid conflict.
- **checkDoubleBookingConflict()** — Sjekker double booking conflict.
- **createBookingWithConflictCheck()** — Oppretter booking med conflict check.
- **detectExistingDoubleBookings()** — Hjelpefunksjon for booking (detect existing double bookinger).
- **getBookingStats()** — Henter booking statistikk.
- **validateInstructorAvailability()** — Validerer coach availability.

#### `lib/portal/booking/refund-idempotency.ts`
- **buildRefundIdempotencyKey()** — Bygger tilbakebetaling idempotency key.

#### `lib/portal/booking/refund-policy.ts`
- **calculateRefund()** — Beregner tilbakebetaling.

#### `lib/portal/booking/refund.ts`
- **getRefundStatus()** — Henter tilbakebetaling status.
- **processRefund()** — Behandler tilbakebetaling.

#### `lib/portal/booking/reschedule.ts`
- **rescheduleBooking()** — Flytter booking.

#### `lib/portal/booking/slot-hold.ts`
- **holdSlot()** — Hjelpefunksjon for booking (hold tidsslot).
- **isSlotAvailable()** — Sjekker om tidsslot available.
- **releaseSlot()** — Hjelpefunksjon for booking (release tidsslot).

#### `lib/portal/booking/subscription-quota.ts`
- **cancelSubscriptionQuota()** — Kansellerer abonnement quota.
- **checkBookingWindow()** — Sjekker booking window.
- **checkUserQuota()** — Sjekker bruker quota.
- **checkWeeklyLimit()** — Sjekker ukentlig limit.
- **consumeSession()** — Hjelpefunksjon for booking (consume økt).
- **createQuotaForNewSubscription()** — Oppretter quota for new abonnement.
- **getQuotaStatus()** — Henter quota status.
- **getSessionLimits()** — Henter økt limits.
- **releaseSession()** — Hjelpefunksjon for booking (release økt).
- **resetQuotaForNewPeriod()** — Tilbakestiller quota for new period.

#### `lib/portal/booking/validation.ts`
- **formatValidationErrors()** — Formaterer validation errors.
- **isRetryableError()** — Sjekker om retryable feil.
- **sanitizeValidationInput()** — Hjelpefunksjon for booking (sanitize validation input).
- **validateBooking()** — Validerer booking.

#### `lib/portal/booking/waitlist.ts`
- **addToWaitlist()** — Legger til til venteliste.
- **notifyNextOnWaitlist()** — Sender varsel om neste på venteliste.

#### `lib/portal/facility/conflict-check.ts`
- **checkFacilityConflicts()** — Sjekker fasilitet conflicts.
- **checkMultipleFacilityConflicts()** — Sjekker multiple fasilitet conflicts.

#### `lib/portal/facility/defaults.ts`
- **getAllFacilities()** — Henter alle fasiliteter.
- **getDefaultFacility()** — Henter standard fasilitet.
- **getFacilitiesByLocation()** — Henter fasiliteter via location.
- **getFacilityBySlug()** — Henter fasilitet via slug.

#### `lib/portal/slots.ts`
- **__smartSlotsInternals()** — Hjelpefunksjon for data (__smart tidsslots internals).
- **generateSlots()** — Genererer tidsslots.
- **generateSlotsWithOverrides()** — Genererer tidsslots med overrides.
- **generateSmartSlotsForWindow()** — Genererer smart tidsslots for window.
- **getAvailabilityForDate()** — Henter availability for dato.

### Social (34)

#### `app/portal/(dashboard)/meldinger/actions.ts`
- **getConversationMessages()** — Henter conversation meldinger.
- **getMyConversations()** — Henter min conversations.
- **markConversationAsRead()** — Markerer conversation as read.
- **sendDirectMessage()** — Sender direct melding.

#### `app/portal/(dashboard)/sosialt/actions.ts`
- **acceptFriendRequest()** — Aksepterer venn forespørsel.
- **createChallenge()** — Oppretter utfordring.
- **declineFriendRequest()** — Avslår venn forespørsel.
- **getActiveChallenges()** — Henter aktiv utfordringer.
- **getFriends()** — Henter venner.
- **getPendingRequests()** — Henter ventende forespørsler.
- **joinChallenge()** — Blir med i utfordring.
- **removeFriend()** — Fjerner venn.
- **searchUsers()** — Søker etter brukere.
- **sendFriendRequest()** — Sender venn forespørsel.

#### `lib/portal/achievements/check-achievements.ts`
- **checkAchievements()** — Sjekker merker.

#### `lib/portal/achievements/definitions.ts`
- **ACHIEVEMENT_DEFINITIONS()** — Hjelpefunksjon for merket (c h i e v e m e n t_ d e f i n i t i o n s).

### Analytics (164)

#### `app/portal/(dashboard)/analyse/actions.ts`
- **addHandicapEntry()** — Legger til handicap entry.
- **getAnalyseStats()** — Henter analyse statistikk.
- **getStrokesGainedData()** — Henter Strokes Gained Gained data.
- **getTrackManStats()** — Henter track man statistikk.

#### `app/portal/(dashboard)/benchmark/actions.ts`
- **getPlayerSGProfile()** — Henter spiller s g profil.
- **getProComparison()** — Henter pro sammenligning.
- **getProPlayers()** — Henter pro spillere.

#### `app/portal/(dashboard)/sammenligning/actions.ts`
- **getPeerComparisonData()** — Henter peer sammenligning data.

#### `app/portal/(dashboard)/statistikk/actions.ts`
- **addRoundStats()** — Legger til runde statistikk.
- **computeAggregates()** — Beregner aggregates.
- **getGolfProfileSummary()** — Henter golf profil sammendrag.
- **getHcpForecast()** — Henter HCP prognose.
- **getLatestHandicap()** — Henter siste handicap.

#### `app/portal/(dashboard)/statistikk/ny-runde/actions.ts`
- **getCourses()** — Henter baner.
- **saveRound()** — Lagrer runde.

#### `app/portal/(dashboard)/trackman/actions.ts`
- **generateTrackManInsights()** — Genererer track man innsikt.
- **getTrackManOverview()** — Henter track man overview.
- **getTrackManV2Data()** — Henter track man v2 data.

#### `lib/portal/ai/prompts/trackman-insights.ts`
- **buildTrackManInsightsPrompt()** — Bygger track man innsikt prompt.

#### `lib/portal/datagolf/cache.ts`
- **getCachedPlayerStats()** — Henter cached spiller statistikk.
- **setCachedPlayerStats()** — Setter cached spiller statistikk.

#### `lib/portal/datagolf/client.ts`
- **getDGRankings()** — Henter d g rankings.
- **getPlayerList()** — Henter spiller liste.

#### `lib/portal/datagolf/player-benchmark.ts`
- **findClosestPgaPeer()** — Finner closest pga peer.

#### `lib/portal/datagolf/pro-challenge.ts`
- **calculatePlayerResult()** — Beregner spiller resultat.
- **DEMO_PRO_STATS()** — Hjelpefunksjon for utfordringen (d e m o_ p r o_ s t t s).
- **describeDistribution()** — Hjelpefunksjon for utfordringen (describe fordeling).
- **formatDistance()** — Formaterer distance.
- **getPerformanceEmoji()** — Henter Performance emoji.
- **getProPlayerStats()** — Henter pro spiller statistikk.
- **PRO_CHALLENGE_SCENARIOS()** — Hjelpefunksjon for utfordringen (p r o_ c h l l e n g e_ s c e n r i o s).

#### `lib/portal/datagolf/tour-benchmarks.ts`
- **calculateTourPercentile()** — Beregner tour percentile.
- **CATEGORY_LABELS()** — Hjelpefunksjon for DataGolf (c t e g o r y_ l b e l s).
- **getPercentileColor()** — Henter percentile color.
- **getPercentileLabel()** — Henter percentile etikett.
- **PGA_TOUR_PERCENTILES()** — Hjelpefunksjon for DataGolf (p g a_ t o u r_ p e r c e n t i l e s).

#### `lib/portal/golf/benchmarks.ts`
- **PEER_BENCHMARK()** — Hjelpefunksjon for sammenligningen (p e e r_ b e n c h m r k).
- **PYRAMID_BENCHMARK()** — Hjelpefunksjon for sammenligningen (p y r m i d_ b e n c h m r k).

#### `lib/portal/golf/clubspeed-benchmarks.ts`
- **getBenchmarkByHcp()** — Henter sammenligning via HCP.
- **HCP_CLUBSPEED_BENCHMARKS()** — Hjelpefunksjon for sammenligningen (h c p_ c l u b s p e e d_ b e n c h m r k s).

#### `lib/portal/golf/sg-benchmarks.ts`
- **getBenchmarkByCategory()** — Henter sammenligning via kategori.
- **getBenchmarkByHandicap()** — Henter sammenligning via handicap.
- **getBenchmarkByScore()** — Henter sammenligning via score.
- **SG_BENCHMARKS()** — Hjelpefunksjon for sammenligningen (s g_ b e n c h m r k s).
- **SG_DIMENSION_LABEL()** — Hjelpefunksjon for sammenligningen (s g_ d i m e n s i o n_ l b e l).

#### `lib/portal/golf/sg-calculator.ts`
- **calculateHoleSG()** — Beregner hull s g.
- **calculateShotSG()** — Beregner slag s g.
- **categorizeSGShot()** — Hjelpefunksjon for data (categorize s g slag).
- **expectedHoleScore()** — Hjelpefunksjon for data (expected hull score).

#### `lib/portal/golf/sg-to-handicap.ts`
- **handicapToCategory()** — Hjelpefunksjon for handicap (handicap til kategori).
- **sgToCategory()** — Hjelpefunksjon for handicap (Strokes Gained til kategori).
- **sgToHandicap()** — Hjelpefunksjon for handicap (Strokes Gained til handicap).
- **sgToHandicapCategory()** — Hjelpefunksjon for handicap (Strokes Gained til handicap kategori).

#### `lib/portal/golf/trackman-parser.ts`
- **aggregateByClub()** — Samler sammen via kølle.
- **convertToMetric()** — Konverterer til måling.
- **parseTrackManCSV()** — Tolker track man c s v.

#### `lib/portal/sammenligning/actions.ts`
- **getNationalBenchmark()** — Henter national sammenligning.
- **getNationalPercentages()** — Henter national percentages.
- **getPyramidLevels()** — Henter pyramide nivåer.
- **pyramidLevelCodeForHcp()** — Hjelpefunksjon for sammenligningen (pyramide nivå code for HCP).

#### `lib/portal/trackman/aggregate.ts`
- **getClubAggregates()** — Henter kølle aggregates.

#### `lib/portal/trackman/ai-insights.ts`
- **generateTrackManInsightsCore()** — Genererer track man innsikt core.

#### `lib/portal/trackman/import-service.ts`
- **importTrackManSession()** — Importerer track man økt.

#### `lib/portal/trackman/plan-matcher.ts`
- **getMyelinStatus()** — Henter myelin status.
- **matchTrackManSessionToPlan()** — Hjelpefunksjon for TrackMan (treff track man økt til plan).
- **savePlanMatch()** — Lagrer plan treff.

#### `lib/portal/trackman/quality-engine.ts`
- **assessSessionQuality()** — Hjelpefunksjon for TrackMan (assess økt quality).
- **calculateTrackManPhaseMatch()** — Beregner track man phase treff.
- **qualifiesForTrackManVerification()** — Hjelpefunksjon for TrackMan (qualifies for track man verification).

#### `lib/portal/trackman/session-analytics.ts`
- **computeSessionAnalytics()** — Beregner økt analytics.
- **updateClubDispersion()** — Oppdaterer kølle dispersion.
- **updatePlayerMetrics()** — Oppdaterer spiller målinger.

#### `lib/portal/trackman/upload-actions.ts`
- **deleteTrackmanSession()** — Sletter TrackMan økt.
- **previewTrackmanCsv()** — Hjelpefunksjon for TrackMan (forhåndsvisning TrackMan csv).
- **uploadTrackmanCsv()** — Laster opp TrackMan csv.
- **uploadTrackmanImage()** — Laster opp TrackMan bilde.

#### `lib/portal/trackman/vision-parser.ts`
- **parseVisionResponse()** — Tolker vision response.

#### `lib/portal/usi/actions.ts`
- **getCachedUSI()** — Henter cached u s i.
- **getLatestTrainingPrescription()** — Henter siste trening prescription.

#### `lib/portal/usi/compute-usi.ts`
- **computeUSI()** — Beregner u s i.

#### `lib/portal/usi/gap-analysis.ts`
- **analyzeGaps()** — Analyserer gaps.

#### `lib/portal/usi/generate-prescription.ts`
- **generateTrainingPrescription()** — Genererer trening prescription.

#### `lib/portal/usi/kalman-filter.ts`
- **forecastHcpFromSnapshots()** — Hjelpefunksjon for ferdighetsnivået (prognose HCP fra snapshots).

#### `lib/portal/usi/ml-dataset.ts`
- **exportTrackManSGDataset()** — Eksporterer track man s g dataset.

#### `lib/portal/usi/predict-sg-onnx.ts`
- **isOnnxModelAvailable()** — Sjekker om onnx model available.
- **predictSGFromTrackMan()** — Hjelpefunksjon for ferdighetsnivået (predict s g fra track man).

### AI (50)

#### `app/portal/(dashboard)/ai-coach/actions.ts`
- **getChatContext()** — Henter chat kontekst.
- **getQuickInsight()** — Henter quick innsikt.

#### `lib/portal/ai/coaching-summary.ts`
- **generateCoachingSummary()** — Genererer coaching sammendrag.

#### `lib/portal/ai/focus-recommendation.ts`
- **generateFocusRecommendation()** — Genererer fokus anbefaling.

#### `lib/portal/ai/generate-drill.ts`
- **generateDrill()** — Genererer øvelse.
- **validateDrillInput()** — Validerer øvelse input.

#### `lib/portal/ai/learning-style-prompt.ts`
- **enrichPromptWithLearningStyle()** — Hjelpefunksjon for AI-coach (enrich prompt med learning style).
- **getLearningStyleHint()** — Henter learning style hint.

#### `lib/portal/ai/next-session-orchestrator.ts`
- **generateNextSessionDraft()** — Genererer neste økt draft.

#### `lib/portal/ai/session-planner.ts`
- **generateSessionPlan()** — Genererer økt plan.

#### `lib/portal/ai/training-plan-adjustment.ts`
- **analyzeProgressionAndAdjust()** — Analyserer progression og adjust.
- **buildAdjustmentGoals()** — Bygger adjustment mål.

#### `lib/portal/ai/training-plan.ts`
- **generateTrainingPlan()** — Genererer trening plan.

#### `lib/portal/ai/transcribe-audio.ts`
- **transcribeAudio()** — Hjelpefunksjon for AI-coach (transcribe audio).

#### `lib/portal/ai/weakness-analysis.ts`
- **analyzeWeakness()** — Analyserer weakness.

#### `lib/portal/ai/weekly-insights.ts`
- **generateWeeklyInsight()** — Genererer ukentlig innsikt.
- **saveWeeklyInsight()** — Lagrer ukentlig innsikt.

#### `lib/portal/forecast/long-term.ts`
- **getLongTermForecast()** — Henter long term prognose.

#### `lib/portal/forecast/talent-insights.ts`
- **getTalentInsights()** — Henter talent innsikt.

#### `lib/portal/predictions/coaching-forecast-service.ts`
- **backfillActualOutcome()** — Hjelpefunksjon for prognosen (backfill actual outcome).
- **buildForecastInput()** — Bygger prognose input.
- **getLatestForecast()** — Henter siste prognose.
- **listForecasts()** — Lister forecasts.
- **runAndSaveForecast()** — Kjører og save prognose.

#### `lib/portal/predictions/generate-coaching-forecast.ts`
- **generateCoachingForecast()** — Genererer coaching prognose.

#### `lib/portal/predictions/hours-per-sg-table.ts`
- **applyOverlapFactor()** — Hjelpefunksjon for data (apply overlap factor).
- **estimateHoursForSgDelta()** — Estimerer hours for Strokes Gained delta.
- **getDisclaimers()** — Henter disclaimers.
- **getEmpiricalShare()** — Henter empirical deling.
- **getHoursPerTenthSg()** — Henter hours per tenth Strokes Gained.
- **getLastCalibrationDate()** — Henter last calibration dato.
- **getOverlapFactor()** — Henter overlap factor.
- **getRegularizationWeight()** — Henter regularization weight.
- **getStatus()** — Henter status.
- **getTableVersion()** — Henter tabell version.
- **levelGroupFromCategory()** — Hjelpefunksjon for data (nivå gruppe fra kategori).
- **regularizeAllocation()** — Hjelpefunksjon for data (regularize allocation).

### Infrastructure (166)

#### `lib/portal/agents/birthday.ts`
- **runBirthday()** — Kjører fødselsdag.

#### `lib/portal/agents/booking-confirm.ts`
- **runBookingConfirm()** — Kjører booking confirm.

#### `lib/portal/agents/cancellation.ts`
- **runCancellation()** — Kjører cancellation.

#### `lib/portal/agents/coach-payout.ts`
- **runCoachPayout()** — Kjører coach payout.

#### `lib/portal/agents/coach-plan-agent.ts`
- **createOrContinueSession()** — Oppretter eller continue økt.
- **getActiveSessions()** — Henter aktiv økter.

#### `lib/portal/agents/degradation-flag.ts`
- **runDegradationFlag()** — Kjører degradation flagg.

#### `lib/portal/agents/dunning.ts`
- **runDunning()** — Kjører betalingspåminnelse.

#### `lib/portal/agents/log.ts`
- **clearAgentIdCache()** — Tømmer agent id cache.
- **getAgentIdByName()** — Henter agent id via navn.
- **logAgentRun()** — Logger agent run.

#### `lib/portal/agents/no-show.ts`
- **runNoShow()** — Kjører no show.

#### `lib/portal/agents/onboarding.ts`
- **runOnboarding()** — Kjører onboarding.

#### `lib/portal/agents/payment-collect.ts`
- **runPaymentCollect()** — Kjører betaling collect.

#### `lib/portal/agents/runner.ts`
- **onBookingCompleted()** — Hjelpefunksjon for AI-agenten (på booking fullført).
- **onCoachingSessionPublished()** — Hjelpefunksjon for AI-agenten (på coaching økt published).
- **onMetricSnapshotComputed()** — Hjelpefunksjon for AI-agenten (på måling snapshot computed).
- **onTestResultLogged()** — Hjelpefunksjon for AI-agenten (på test resultat logged).
- **onUSISnapshotChanged()** — Hjelpefunksjon for AI-agenten (på u s i snapshot changed).

#### `lib/portal/agents/sponsor-report.ts`
- **runSponsorReport()** — Kjører sponsor report.

#### `lib/portal/agents/test-retest-reminder.ts`
- **runTestRetestReminder()** — Kjører test retest reminder.

#### `lib/portal/agents/types.ts`
- **AGENT_REGISTRY()** — Hjelpefunksjon for AI-agenten (g e n t_ r e g i s t r y).

#### `lib/portal/agents/winback.ts`
- **runWinback()** — Kjører winback.

#### `lib/portal/auth.ts`
- **canAccessFeature()** — Sjekker om brukeren kan access feature.
- **getCurrentUserId()** — Henter nåværende bruker id.
- **getPortalUser()** — Henter portal bruker.
- **getUserSubscriptionTier()** — Henter bruker abonnement tier.
- **hasActiveSubscription()** — Sjekker om aktiv abonnement finnes.
- **isAuthenticated()** — Sjekker om authenticated.
- **logout()** — Hjelpefunksjon for innlogging (utlogging).
- **requireAuth()** — Krever auth.
- **requirePortalUser()** — Krever portal bruker.

#### `lib/portal/auth/age-check.ts`
- **isJunior()** — Sjekker om Junior.

#### `lib/portal/auth/parent-rbac.ts`
- **getChildVisibleData()** — Henter child visible data.
- **isParentOf()** — Sjekker om parent av.

#### `lib/portal/capabilities/catalog.ts`
- **CAPABILITY_CATALOG()** — Hjelpefunksjon for tilgang (c p b i l i t y_ c t l o g).
- **CAPABILITY_GROUPS()** — Hjelpefunksjon for tilgang (c p b i l i t y_ g r o u p s).
- **getCapabilitiesByGroup()** — Henter tilganger via gruppe.
- **getCapabilityDefinition()** — Henter tilgang definition.
- **getGroupDefinition()** — Henter gruppe definition.

#### `lib/portal/capabilities/check.ts`
- **clearCapabilityCache()** — Tømmer tilgang cache.
- **getUserCapabilities()** — Henter bruker tilganger.
- **hasAllCapabilities()** — Sjekker om alle tilganger finnes.
- **hasAnyCapability()** — Sjekker om noen tilgang finnes.
- **hasCapability()** — Sjekker om tilgang finnes.
- **requireAnyCapability()** — Krever noen tilgang.
- **requireCapability()** — Krever tilgang.

#### `lib/portal/capabilities/presets.ts`
- **CAPABILITY_PRESETS()** — Hjelpefunksjon for tilgang (c p b i l i t y_ p r e s e t s).
- **getPreset()** — Henter preset.

#### `lib/portal/capabilities/sensitive-guard.ts`
- **clearSensitiveAuth()** — Tømmer sensitive auth.
- **confirmSensitiveAuth()** — Bekrefter sensitive auth.
- **hasRecentSensitiveAuth()** — Sjekker om nylige sensitive auth finnes.
- **requireSensitiveAuth()** — Krever sensitive auth.

#### `lib/portal/consent/service.ts`
- **filterByConsent()** — Filtrerer via samtykke.
- **getAllConsents()** — Henter alle consents.
- **getDataAccessLogs()** — Henter data access logger.
- **grantConsent()** — Gir samtykke.
- **hasConsent()** — Sjekker om samtykke finnes.
- **logDataAccess()** — Logger data access.

#### `lib/portal/csrf.ts`
- **verifyCsrf()** — Verifiserer csrf.

#### `lib/portal/email/resend.ts`
- **getResend()** — Henter Resend.

#### `lib/portal/email/send-booking-email.ts`
- **sendBookingCancellation()** — Sender booking cancellation.
- **sendBookingConfirmation()** — Sender booking confirmation.
- **sendRescheduleNotification()** — Sender flytting varsel.

#### `lib/portal/email/send-monthly-reset-email.ts`
- **sendMonthlyResetEmail()** — Sender månedlig tilbakestilling e-post.

#### `lib/portal/email/send-welcome-email.ts`
- **sendWelcomeEmail()** — Sender welcome e-post.

#### `lib/portal/email/templates/abandoned-checkout.tsx`
- **AbandonedCheckoutEmail()** — React-komponent (e-post) — abandoned checkout e-post.

#### `lib/portal/email/templates/booking-cancelled.tsx`
- **BookingCancelledEmail()** — React-komponent (booking) — booking cancelled e-post.

#### `lib/portal/email/templates/booking-confirmed.tsx`
- **BookingConfirmedEmail()** — React-komponent (booking) — booking confirmed e-post.

#### `lib/portal/email/templates/booking-reminder.tsx`
- **BookingReminderEmail()** — React-komponent (booking) — booking reminder e-post.

#### `lib/portal/email/templates/instructor-new-booking.tsx`
- **InstructorNewBookingEmail()** — React-komponent (booking) — coach new booking e-post.

#### `lib/portal/email/templates/monthly-reset-notification.tsx`
- **MonthlyResetNotificationEmail()** — React-komponent (e-post) — månedlig tilbakestilling varsel e-post.

#### `lib/portal/email/templates/waitlist-available.tsx`
- **WaitlistAvailableEmail()** — React-komponent (e-post) — venteliste available e-post.

#### `lib/portal/email/templates/weekly-summary.tsx`
- **WeeklySummaryEmail()** — React-komponent (e-post) — ukentlig sammendrag e-post.

#### `lib/portal/email/templates/welcome-day0.tsx`
- **WelcomeDay0Email()** — React-komponent (e-post) — welcome day0 e-post.

#### `lib/portal/email/templates/welcome-day1.tsx`
- **WelcomeDay1Email()** — React-komponent (e-post) — welcome day1 e-post.

#### `lib/portal/email/templates/welcome-day3.tsx`
- **WelcomeDay3Email()** — React-komponent (e-post) — welcome day3 e-post.

#### `lib/portal/email/templates/welcome-new-user.tsx`
- **WelcomeNewUserEmail()** — React-komponent (e-post) — welcome new bruker e-post.

#### `lib/portal/email/templates/win-back-day14.tsx`
- **WinBackDay14Email()** — React-komponent (e-post) — win back day14 e-post.

#### `lib/portal/email/templates/win-back-day3.tsx`
- **WinBackDay3Email()** — React-komponent (e-post) — win back day3 e-post.

#### `lib/portal/email/templates/win-back-day7.tsx`
- **WinBackDay7Email()** — React-komponent (e-post) — win back day7 e-post.

#### `lib/portal/export/csv-stats.ts`
- **roundStatsToCsv()** — Hjelpefunksjon for statistikk (runde statistikk til csv).

#### `lib/portal/feature-flags.ts`
- **isPlayerHQRouteVisible()** — Sjekker om spiller h q route visible.

#### `lib/portal/health/rehab-protocols.ts`
- **estimateReturnToPlay()** — Estimerer return til play.
- **getRehabProtocol()** — Henter rehab protocol.

#### `lib/portal/notifications/create.ts`
- **createBulkNotifications()** — Oppretter bulk varsler.
- **createNotification()** — Oppretter varsel.
- **getNotifications()** — Henter varsler.
- **getUnreadCount()** — Henter unread antall.
- **markAllNotificationsAsRead()** — Markerer alle varsler as read.
- **markNotificationAsRead()** — Markerer varsel as read.

#### `lib/portal/notifications/triggers.ts`
- **notifyBookingCancelled()** — Sender varsel om booking cancelled.
- **notifyBookingConfirmed()** — Sender varsel om booking confirmed.
- **notifyBookingReminder()** — Sender varsel om booking reminder.
- **notifyBookingRescheduled()** — Sender varsel om booking rescheduled.
- **notifyCoachingNotesAdded()** — Sender varsel om coaching notater added.
- **notifyDiaryEntry()** — Sender varsel om diary entry.
- **notifyGoalAchieved()** — Sender varsel om mål achieved.
- **notifyNewBooking()** — Sender varsel om new booking.
- **notifyPlanCoachFeedback()** — Sender varsel om plan coach tilbakemelding.
- **notifyPlanPlayerComment()** — Sender varsel om plan spiller kommentar.
- **notifyPlanSuggestionCreated()** — Sender varsel om plan suggestion created.
- **notifyPlanSuggestionResolved()** — Sender varsel om plan suggestion resolved.
- **notifyPlayerQuestion()** — Sender varsel om spiller question.
- **notifyTrainingPlanReady()** — Sender varsel om trening plan ready.
- **notifyVideoUploaded()** — Sender varsel om video uploaded.
- **sendAdminDailySummary()** — Sender admin daglig sammendrag.
- **sendBookingReminders()** — Sender booking reminders.

#### `lib/portal/notifications/types.ts`
- **DEFAULT_ADMIN_CONFIG()** — Hjelpefunksjon for varsler (d e f u l t_ d m i n_ c o n f i g).

#### `lib/portal/prisma.ts`
- **prisma()** — Hjelpefunksjon for data (prisma).

#### `lib/portal/rbac.ts`
- **canAccessMCPage()** — Sjekker om brukeren kan access m c side.
- **canAccessMissionControl()** — Sjekker om brukeren kan access mission control.
- **hasTierAccess()** — Sjekker om tier access finnes.
- **isAdmin()** — Sjekker om admin.
- **isInstructor()** — Sjekker om coach.
- **isInvited()** — Sjekker om invited.
- **isStaff()** — Sjekker om staff.
- **isStudent()** — Sjekker om spiller.
- **MC_PAGE_CAPABILITY()** — Hjelpefunksjon for data (m c_ p g e_ c p b i l i t y).

#### `lib/portal/stripe.ts`
- **getStripe()** — Henter Stripe.
- **stripe()** — Hjelpefunksjon for betalingen (Stripe).

#### `lib/portal/stripe/catalog.ts`
- **archiveStripePrice()** — Arkiverer Stripe price.
- **archiveStripeProduct()** — Arkiverer Stripe product.
- **createStripeServiceProduct()** — Oppretter Stripe tjeneste product.

#### `lib/portal/stripe/invoice.ts`
- **createInvoiceForBooking()** — Oppretter faktura for booking.

#### `lib/portal/stripe/off-session.ts`
- **chargeOffSession()** — Hjelpefunksjon for betalingen (charge av økt).

#### `lib/portal/stripe/payment-link.ts`
- **createBookingPaymentLink()** — Oppretter booking betaling lenke.

#### `lib/portal/sync/hooks/useBookings.ts`
- **useBooking()** — React-hook for booking.
- **useBookings()** — React-hook for bookinger.
- **useCancelBooking()** — React-hook for cancel booking.
- **useCreateBooking()** — React-hook for create booking.
- **useInstructorBookings()** — React-hook for coach bookinger.
- **useStudentBookings()** — React-hook for spiller bookinger.
- **useUpdateBooking()** — React-hook for update booking.

#### `lib/portal/sync/optimistic.ts`
- **addBookingOptimistically()** — Legger til booking optimistically.
- **addItemToListOptimistically()** — Legger til item til liste optimistically.
- **blockTimeOptimistically()** — Hjelpefunksjon for data (blokk tid optimistically).
- **invalidateMultiple()** — Hjelpefunksjon for data (invalidate multiple).
- **markAllNotificationsAsReadOptimistically()** — Markerer alle varsler as read optimistically.
- **markNotificationAsReadOptimistically()** — Markerer varsel as read optimistically.
- **optimisticUpdate()** — Hjelpefunksjon for data (optimistic update).
- **removeBookingOptimistically()** — Fjerner booking optimistically.
- **removeItemFromListOptimistically()** — Fjerner item fra liste optimistically.
- **updateBookingOptimistically()** — Oppdaterer booking optimistically.
- **updateItemInListOptimistically()** — Oppdaterer item in liste optimistically.

#### `lib/portal/sync/query-client.ts`
- **createSyncQueryClient()** — Oppretter sync spørring client.
- **syncQueryClientConfig()** — Synkroniserer spørring client konfigurasjon.

#### `lib/portal/sync/query-keys.ts`
- **matchQueryKey()** — Hjelpefunksjon for data (treff spørring key).
- **queryKeys()** — Henter keys.
- **syncEventToQueryKeys()** — Synkroniserer hendelse til spørring keys.

#### `lib/portal/sync/server.ts`
- **broadcastSyncEvent()** — Hjelpefunksjon for data (broadcast sync hendelse).
- **cleanupExpiredEvents()** — Hjelpefunksjon for data (cleanup expired hendelser).
- **createSyncEvent()** — Oppretter sync hendelse.
- **emitAvailabilityEvent()** — Hjelpefunksjon for data (emit availability hendelse).
- **emitBookingEvent()** — Hjelpefunksjon for data (emit booking hendelse).
- **emitCoachingNotesEvent()** — Hjelpefunksjon for data (emit coaching notater hendelse).
- **emitSyncEvent()** — Hjelpefunksjon for data (emit sync hendelse).
- **getPendingEventsForUser()** — Henter ventende hendelser for bruker.
- **logAuditEvent()** — Logger revisjon hendelse.
- **markEventsAsDelivered()** — Markerer hendelser as delivered.
- **markEventsAsFailed()** — Markerer hendelser as feilede.
- **registerConnection()** — Registrerer connection.
- **unregisterConnection()** — Hjelpefunksjon for data (unregister connection).
- **updateConnectionPing()** — Oppdaterer connection ping.

#### `lib/portal/sync/useSync.ts`
- **useSync()** — React-hook for sync.
- **useSyncStatus()** — React-hook for sync status.

---

## CoachHQ — Admin/coach-flata (326 funksjoner)

Funksjoner som driver coach- og admin-flata — spillere, økter, grupper, kommunikasjon, økonomi og drift.

### Players (27)

#### `app/admin/(authed)/elever/[id]/actions.ts`
- **getStudentProfile()** — Henter spiller profil.
- **updateCoachingNotes()** — Oppdaterer coaching notater.

#### `app/admin/(authed)/elever/[id]/communication-actions.ts`
- **addCommunicationLog()** — Legger til communication logg.
- **getCommunicationLogs()** — Henter communication logger.

#### `app/admin/(authed)/elever/[id]/student-training-actions.ts`
- **addCoachNote()** — Legger til coach notat.
- **getStudentDegradation()** — Henter spiller degradation.
- **getStudentLPhases()** — Henter spiller l phases.
- **getStudentRounds()** — Henter spiller runder.
- **getStudentRoundStats()** — Henter spiller runde statistikk.
- **getStudentTrackManSessions()** — Henter spiller track man økter.
- **getStudentTrainingLogs()** — Henter spiller trening logger.
- **getStudentTrainingPlan()** — Henter spiller trening plan.
- **setStudentLPhase()** — Setter spiller l phase.

#### `app/admin/(authed)/elever/[id]/tester/actions.ts`
- **getCoachTestRegister()** — Henter coach test register.

#### `app/admin/(authed)/elever/[id]/v2/get-student-360.ts`
- **getStudent360()** — Henter student360.

#### `app/admin/(authed)/elever/actions.ts`
- **fetchStudents()** — Henter spillere.
- **searchStudents()** — Søker etter spillere.

#### `app/admin/(authed)/elever/arbeidsflate-actions.ts`
- **getArbeidsflateActiveSession()** — Henter arbeidsflate aktiv økt.
- **getArbeidsflateKpis()** — Henter arbeidsflate kpis.
- **getArbeidsflateStudentList()** — Henter arbeidsflate spiller liste.

#### `app/admin/(authed)/elever/create-actions.ts`
- **createStudent()** — Oppretter spiller.

#### `app/admin/(authed)/elever/oversikt/actions.ts`
- **getElevOversikt()** — Henter elev oversikt.

#### `app/admin/(authed)/elever/parent-actions.ts`
- **createParentAndLink()** — Oppretter parent og lenke.
- **linkExistingParent()** — Kobler existing parent.
- **listParentsForChild()** — Lister parents for child.
- **removeParentLink()** — Fjerner parent lenke.
- **searchPotentialParents()** — Søker etter potential parents.

### Training (32)

#### `app/admin/(authed)/okter/actions.ts`
- **getSessionOverview()** — Henter økt overview.
- **saveSessionNotes()** — Lagrer økt notater.

#### `app/admin/(authed)/talent/actions.ts`
- **fetchTalentPlayerDetail()** — Henter talent spiller detalj.
- **fetchTalentPlayers()** — Henter talent spillere.
- **updateTalentPlayer()** — Oppdaterer talent spiller.

#### `app/admin/(authed)/teknisk-plan/actions.ts`
- **createPhaseAction()** — Oppretter phase action.
- **createTechnicalPlanAction()** — Oppretter technical plan action.
- **deletePhaseAction()** — Sletter phase action.
- **deleteTechnicalPlanAction()** — Sletter technical plan action.
- **getDrillOptions()** — Henter øvelse valg.
- **getPlayerOptions()** — Henter spiller valg.
- **getTechnicalPlanDetail()** — Henter technical plan detalj.
- **getTechnicalPlansForAdmin()** — Henter technical planer for admin.
- **updatePhaseAction()** — Oppdaterer phase action.
- **updateTechnicalPlanAction()** — Oppdaterer technical plan action.

#### `app/admin/(authed)/treningsplan/actions.ts`
- **addSession()** — Legger til økt.
- **createManualPlan()** — Oppretter manual plan.
- **deleteSession()** — Sletter økt.
- **duplicatePlan()** — Hjelpefunksjon for treningsplan (duplicate plan).
- **getDrills()** — Henter øvelser.
- **getExistingPlans()** — Henter existing planer.
- **getStudentPlans()** — Henter spiller planer.
- **getStudents()** — Henter spillere.
- **proposeSessionEdit()** — Hjelpefunksjon for treningsplan (propose økt edit).
- **setPlanCoachFeedback()** — Setter plan coach tilbakemelding.
- **updateSession()** — Oppdaterer økt.
- **updateWeekFocus()** — Oppdaterer uke fokus.

#### `app/admin/(authed)/treningsplan/maler/actions.ts`
- **createTemplate()** — Oppretter template.
- **deleteTemplate()** — Sletter template.
- **listTemplatesForAdmin()** — Lister templates for admin.
- **toggleTemplateActive()** — Slår av/på template aktiv.
- **updateTemplate()** — Oppdaterer template.

### Booking (46)

#### `app/admin/(authed)/bookinger/actions.ts`
- **adminCancelBooking()** — Hjelpefunksjon for booking (admin cancel booking).
- **adminRescheduleBooking()** — Hjelpefunksjon for booking (admin flytting booking).
- **bulkCancelBookings()** — Behandler flere cancel bookinger samtidig.
- **searchBookings()** — Søker etter bookinger.

#### `app/admin/(authed)/bookinger/create-actions.ts`
- **adminCreateBooking()** — Hjelpefunksjon for booking (admin create booking).
- **adminCreateBookingWithPayment()** — Hjelpefunksjon for booking (admin create booking med betaling).
- **bulkSendReminder()** — Behandler flere send reminder samtidig.
- **getFacilities()** — Henter fasiliteter.
- **getInstructorDefaultFacility()** — Henter coach standard fasilitet.
- **getInstructors()** — Henter coacher.
- **getServiceTypes()** — Henter tjeneste typer.
- **searchStudentsForBooking()** — Søker etter spillere for booking.

#### `app/admin/(authed)/denne-uken/actions.ts`
- **getThisWeekBookings()** — Henter this uke bookinger.
- **getWeekStats()** — Henter uke statistikk.

#### `app/admin/(authed)/fasiliteter/actions.ts`
- **createFacilityBooking()** — Oppretter fasilitet booking.
- **deleteFacilityBooking()** — Sletter fasilitet booking.
- **getLiveStatus()** — Henter live status.
- **getWeekBookings()** — Henter uke bookinger.

#### `app/admin/(authed)/kalender/actions.ts`
- **addAdminNote()** — Legger til admin notat.
- **createBlockedTimePrisma()** — Oppretter blocked tid prisma.
- **deleteBlockedTimePrisma()** — Sletter blocked tid prisma.
- **deleteInstructorAvailabilityPrisma()** — Sletter coach availability prisma.
- **getBlockedTimesForPeriod()** — Henter blocked times for period.
- **getBookingsForDay()** — Henter bookinger for dag.
- **getBookingsForPeriod()** — Henter bookinger for period.
- **getBookingsForWeek()** — Henter bookinger for uke.
- **getInstructorAvailabilityPrisma()** — Henter coach availability prisma.
- **getInstructors()** — Henter coacher.
- **getServiceTypesPrisma()** — Henter tjeneste typer prisma.
- **markBookingCompleted()** — Markerer booking fullført.
- **markNoShow()** — Markerer no show.
- **upsertInstructorAvailabilityPrisma()** — Lagrer eller oppdaterer coach availability prisma.

#### `app/admin/(authed)/kapasitet/actions.ts`
- **getCapacityData()** — Henter capacity data.

#### `app/admin/(authed)/kapasitet/week-actions.ts`
- **deleteWeekOverride()** — Sletter uke override.
- **getInstructors()** — Henter coacher.
- **getPackageDemand()** — Henter pakke demand.
- **getWeekCapacityWithOverrides()** — Henter uke capacity med overrides.
- **saveWeekOverride()** — Lagrer uke override.

#### `app/admin/(authed)/tilgjengelighet/actions.ts`
- **createBlockedTime()** — Oppretter blocked tid.
- **createClosedPeriod()** — Oppretter closed period.
- **deleteBlockedTime()** — Sletter blocked tid.
- **getAvailability()** — Henter availability.
- **getBlockedTimes()** — Henter blocked times.
- **getInstructors()** — Henter coacher.
- **syncGoogleCalendar()** — Synkroniserer Google kalender.
- **upsertAvailability()** — Lagrer eller oppdaterer availability.

### Groups (21)

#### `app/admin/(authed)/grupper/actions.ts`
- **addMember()** — Legger til medlem.
- **createGroup()** — Oppretter gruppe.
- **deleteGroup()** — Sletter gruppe.
- **getGroupMembers()** — Henter gruppe medlemmer.
- **getGroupPlan()** — Henter gruppe plan.
- **listAvailablePlayers()** — Lister available spillere.
- **listGroups()** — Lister grupper.
- **removeMember()** — Fjerner medlem.
- **syncGroupPlanToMembers()** — Synkroniserer gruppe plan til medlemmer.
- **updateGroup()** — Oppdaterer gruppe.

#### `app/admin/(authed)/grupper/plan-actions.ts`
- **createGroupPlanFromTemplate()** — Oppretter gruppe plan fra template.
- **listTemplatesForGroupPlan()** — Lister templates for gruppe plan.

#### `app/admin/(authed)/grupper/session-actions.ts`
- **createGroupSession()** — Oppretter gruppe økt.
- **deleteGroupSession()** — Sletter gruppe økt.
- **getExpandedGroupSessions()** — Henter expanded gruppe økter.
- **listGroupSessions()** — Lister gruppe økter.
- **setOccurrenceOverride()** — Setter occurrence override.
- **updateGroupSession()** — Oppdaterer gruppe økt.

#### `app/admin/(authed)/turneringer/actions.ts`
- **deleteTournament()** — Sletter tournament.
- **getTournaments()** — Henter tournaments.

#### `app/admin/(authed)/turneringer/oversikt/actions.ts`
- **getCoachTournamentOverview()** — Henter coach tournament overview.

### Comms (13)

#### `app/admin/(authed)/e-postmaler/actions.ts`
- **createTemplate()** — Oppretter template.
- **deleteTemplate()** — Sletter template.
- **getTemplates()** — Henter templates.
- **updateTemplate()** — Oppdaterer template.

#### `app/admin/(authed)/meldinger/actions.ts`
- **approveMessage()** — Godkjenner melding.
- **getInboxMessages()** — Henter inbox meldinger.
- **regenerateAIResponse()** — Hjelpefunksjon for chat-meldingen (regenerate i response).
- **rejectMessage()** — Avslår melding.

#### `app/admin/(authed)/meldinger/chat-actions.ts`
- **getConversationMessages()** — Henter conversation meldinger.
- **getMyConversations()** — Henter min conversations.
- **getOrCreateConversation()** — Henter eller create conversation.
- **markConversationAsRead()** — Markerer conversation as read.
- **sendDirectMessage()** — Sender direct melding.

### AI (5)

#### `app/admin/(authed)/agenter/actions.ts`
- **getAgents()** — Henter agenter.
- **getAgentStats()** — Henter agent statistikk.
- **toggleAgent()** — Slår av/på agent.

#### `app/admin/elever/[id]/coach-agent/actions.ts`
- **listCoachAgentSessions()** — Lister coach agent økter.
- **sendCoachAgentMessage()** — Sender coach agent melding.

### Ops (41)

#### `app/admin/(authed)/analytics/actions.ts`
- **getAnalyticsData()** — Henter analytics data.
- **getDashboardData()** — Henter dashboard data.

#### `app/admin/(authed)/coaching-board/actions.ts`
- **fetchCoachingBoardData()** — Henter coaching board data.
- **fetchKanbanBoardData()** — Henter kanban board data.

#### `app/admin/(authed)/focus/actions.ts`
- **createTask()** — Oppretter oppgave.
- **deleteTask()** — Sletter oppgave.
- **getDivisionStats()** — Henter division statistikk.
- **getTasks()** — Henter oppgaver.
- **getTodayBookingsByDivision()** — Henter i dag bookinger via division.
- **updateTask()** — Oppdaterer oppgave.
- **updateTaskStatus()** — Oppdaterer oppgave status.

#### `app/admin/(authed)/godkjenninger/actions.ts`
- **approveActivity()** — Godkjenner aktivitet.
- **approveBooking()** — Godkjenner booking.
- **getPendingItems()** — Henter ventende items.
- **rejectActivity()** — Avslår aktivitet.
- **rejectBooking()** — Avslår booking.

#### `app/admin/(authed)/hub/hub-actions.ts`
- **getHubActivity()** — Henter hub aktivitet.
- **getHubModuleCounts()** — Henter hub module counts.
- **getHubStats()** — Henter hub statistikk.

#### `app/admin/(authed)/lokasjoner/actions.ts`
- **createLocation()** — Oppretter location.
- **getLocationsConfigData()** — Henter locations konfigurasjon data.
- **setInstructorLocation()** — Setter coach location.
- **setLocationServices()** — Setter location tjenester.

#### `app/admin/(authed)/mission-board/actions.ts`
- **fetchMissionBoardKanban()** — Henter mission board kanban.

#### `app/admin/(authed)/okonomi/actions.ts`
- **getOkonomiData()** — Henter okonomi data.

#### `app/admin/(authed)/rapporter/actions.ts`
- **exportBookingsCSV()** — Eksporterer bookinger c s v.
- **exportRevenueCSV()** — Eksporterer inntekt c s v.
- **exportStudentsCSV()** — Eksporterer spillere c s v.

#### `app/admin/(authed)/team/actions.ts`
- **applyPreset()** — Hjelpefunksjon for innlogging (apply preset).
- **confirmSensitiveAction()** — Bekrefter sensitive action.
- **deactivateUser()** — Deaktiverer bruker.
- **fetchAuditLog()** — Henter revisjon logg.
- **fetchTeamMembers()** — Henter team medlemmer.
- **inviteTeamMember()** — Inviterer til team medlem.
- **listPresets()** — Lister presets.
- **reactivateUser()** — Hjelpefunksjon for innlogging (reactivate bruker).
- **updateUserCapabilities()** — Oppdaterer bruker tilganger.
- **updateUserRole()** — Oppdaterer bruker rolle.

#### `app/admin/(authed)/tjenester/actions.ts`
- **createServiceType()** — Oppretter tjeneste type.
- **listServiceTypes()** — Lister tjeneste typer.
- **updateServiceType()** — Oppdaterer tjeneste type.

### Infrastructure (141)

#### `lib/portal/admin/dagens-fokus-actions.ts`
- **getDagensFokusKpis()** — Henter dagens fokus kpis.
- **getDagensFokusSignals()** — Henter dagens fokus signaler.
- **getDagensFokusTasks()** — Henter dagens fokus oppgaver.

#### `lib/portal/agents/birthday.ts`
- **runBirthday()** — Kjører fødselsdag.

#### `lib/portal/agents/booking-confirm.ts`
- **runBookingConfirm()** — Kjører booking confirm.

#### `lib/portal/agents/cancellation.ts`
- **runCancellation()** — Kjører cancellation.

#### `lib/portal/agents/coach-payout.ts`
- **runCoachPayout()** — Kjører coach payout.

#### `lib/portal/agents/coach-plan-agent.ts`
- **createOrContinueSession()** — Oppretter eller continue økt.
- **getActiveSessions()** — Henter aktiv økter.

#### `lib/portal/agents/degradation-flag.ts`
- **runDegradationFlag()** — Kjører degradation flagg.

#### `lib/portal/agents/dunning.ts`
- **runDunning()** — Kjører betalingspåminnelse.

#### `lib/portal/agents/log.ts`
- **clearAgentIdCache()** — Tømmer agent id cache.
- **getAgentIdByName()** — Henter agent id via navn.
- **logAgentRun()** — Logger agent run.

#### `lib/portal/agents/no-show.ts`
- **runNoShow()** — Kjører no show.

#### `lib/portal/agents/onboarding.ts`
- **runOnboarding()** — Kjører onboarding.

#### `lib/portal/agents/park.ts`
- **runAgent()** — Kjører agent.
- **runAgentInBackground()** — Kjører agent in background.

#### `lib/portal/agents/payment-collect.ts`
- **runPaymentCollect()** — Kjører betaling collect.

#### `lib/portal/agents/runner.ts`
- **onBookingCompleted()** — Hjelpefunksjon for AI-agenten (på booking fullført).
- **onCoachingSessionPublished()** — Hjelpefunksjon for AI-agenten (på coaching økt published).
- **onMetricSnapshotComputed()** — Hjelpefunksjon for AI-agenten (på måling snapshot computed).
- **onTestResultLogged()** — Hjelpefunksjon for AI-agenten (på test resultat logged).
- **onUSISnapshotChanged()** — Hjelpefunksjon for AI-agenten (på u s i snapshot changed).

#### `lib/portal/agents/sponsor-report.ts`
- **runSponsorReport()** — Kjører sponsor report.

#### `lib/portal/agents/test-retest-reminder.ts`
- **runTestRetestReminder()** — Kjører test retest reminder.

#### `lib/portal/agents/types.ts`
- **AGENT_REGISTRY()** — Hjelpefunksjon for AI-agenten (g e n t_ r e g i s t r y).

#### `lib/portal/agents/winback.ts`
- **runWinback()** — Kjører winback.

#### `lib/portal/booking/auto-create-user.ts`
- **autoCreateUser()** — Hjelpefunksjon for booking (auto create bruker).
- **verifyPassword()** — Verifiserer passord.

#### `lib/portal/booking/available-slots-compute.ts`
- **computeRemainingSlots()** — Beregner remaining tidsslots.
- **endOfWeek()** — Hjelpefunksjon for booking (slutt av uke).

#### `lib/portal/booking/available-slots.ts`
- **countAvailableSlotsThisWeek()** — Teller available tidsslots this uke.

#### `lib/portal/booking/cache.ts`
- **CACHE_TAGS()** — Hjelpefunksjon for booking (c c h e_ t g s).
- **CACHE_TTL()** — Hjelpefunksjon for booking (c c h e_ t t l).
- **getCachedSlots()** — Henter cached tidsslots.
- **invalidateBookingsCache()** — Hjelpefunksjon for booking (invalidate bookinger cache).
- **invalidateSlotsCache()** — Hjelpefunksjon for booking (invalidate tidsslots cache).
- **realtimeCache()** — Hjelpefunksjon for booking (realtime cache).

#### `lib/portal/booking/cancellation-policy.ts`
- **evaluateCancellationPolicy()** — Hjelpefunksjon for booking (evaluate cancellation vilkår).

#### `lib/portal/booking/conflict-check.ts`
- **checkAllConflicts()** — Sjekker alle conflicts.
- **checkBlockedTimeConflict()** — Sjekker blocked tid conflict.
- **checkDoubleBookingConflict()** — Sjekker double booking conflict.
- **createBookingWithConflictCheck()** — Oppretter booking med conflict check.
- **detectExistingDoubleBookings()** — Hjelpefunksjon for booking (detect existing double bookinger).
- **getBookingStats()** — Henter booking statistikk.
- **validateInstructorAvailability()** — Validerer coach availability.

#### `lib/portal/booking/refund-idempotency.ts`
- **buildRefundIdempotencyKey()** — Bygger tilbakebetaling idempotency key.

#### `lib/portal/booking/refund-policy.ts`
- **calculateRefund()** — Beregner tilbakebetaling.

#### `lib/portal/booking/refund.ts`
- **getRefundStatus()** — Henter tilbakebetaling status.
- **processRefund()** — Behandler tilbakebetaling.

#### `lib/portal/booking/reschedule.ts`
- **rescheduleBooking()** — Flytter booking.

#### `lib/portal/booking/slot-hold.ts`
- **holdSlot()** — Hjelpefunksjon for booking (hold tidsslot).
- **isSlotAvailable()** — Sjekker om tidsslot available.
- **releaseSlot()** — Hjelpefunksjon for booking (release tidsslot).

#### `lib/portal/booking/subscription-quota.ts`
- **cancelSubscriptionQuota()** — Kansellerer abonnement quota.
- **checkBookingWindow()** — Sjekker booking window.
- **checkUserQuota()** — Sjekker bruker quota.
- **checkWeeklyLimit()** — Sjekker ukentlig limit.
- **consumeSession()** — Hjelpefunksjon for booking (consume økt).
- **createQuotaForNewSubscription()** — Oppretter quota for new abonnement.
- **getQuotaStatus()** — Henter quota status.
- **getSessionLimits()** — Henter økt limits.
- **releaseSession()** — Hjelpefunksjon for booking (release økt).
- **resetQuotaForNewPeriod()** — Tilbakestiller quota for new period.

#### `lib/portal/booking/validation.ts`
- **formatValidationErrors()** — Formaterer validation errors.
- **isRetryableError()** — Sjekker om retryable feil.
- **sanitizeValidationInput()** — Hjelpefunksjon for booking (sanitize validation input).
- **validateBooking()** — Validerer booking.

#### `lib/portal/booking/waitlist.ts`
- **addToWaitlist()** — Legger til til venteliste.
- **notifyNextOnWaitlist()** — Sender varsel om neste på venteliste.

#### `lib/portal/capabilities/catalog.ts`
- **CAPABILITY_CATALOG()** — Hjelpefunksjon for tilgang (c p b i l i t y_ c t l o g).
- **CAPABILITY_GROUPS()** — Hjelpefunksjon for tilgang (c p b i l i t y_ g r o u p s).
- **getCapabilitiesByGroup()** — Henter tilganger via gruppe.
- **getCapabilityDefinition()** — Henter tilgang definition.
- **getGroupDefinition()** — Henter gruppe definition.

#### `lib/portal/capabilities/check.ts`
- **clearCapabilityCache()** — Tømmer tilgang cache.
- **getUserCapabilities()** — Henter bruker tilganger.
- **hasAllCapabilities()** — Sjekker om alle tilganger finnes.
- **hasAnyCapability()** — Sjekker om noen tilgang finnes.
- **hasCapability()** — Sjekker om tilgang finnes.
- **requireAnyCapability()** — Krever noen tilgang.
- **requireCapability()** — Krever tilgang.

#### `lib/portal/capabilities/presets.ts`
- **ADMIN_DEFAULT_CAPABILITIES()** — Hjelpefunksjon for tilgang (d m i n_ d e f u l t_ c p b i l i t i e s).
- **CAPABILITY_PRESETS()** — Hjelpefunksjon for tilgang (c p b i l i t y_ p r e s e t s).
- **getPreset()** — Henter preset.
- **INSTRUCTOR_DEFAULT_CAPABILITIES()** — Hjelpefunksjon for tilgang (i n s t r u c t o r_ d e f u l t_ c p b i l i t i e s).
- **INVITED_DEFAULT_CAPABILITIES()** — Hjelpefunksjon for tilgang (i n v i t e d_ d e f u l t_ c p b i l i t i e s).
- **STUDENT_DEFAULT_CAPABILITIES()** — Hjelpefunksjon for tilgang (s t u d e n t_ d e f u l t_ c p b i l i t i e s).

#### `lib/portal/capabilities/sensitive-guard.ts`
- **clearSensitiveAuth()** — Tømmer sensitive auth.
- **confirmSensitiveAuth()** — Bekrefter sensitive auth.
- **hasRecentSensitiveAuth()** — Sjekker om nylige sensitive auth finnes.
- **requireSensitiveAuth()** — Krever sensitive auth.

#### `lib/portal/google-calendar/sync.ts`
- **disconnectGoogleCalendar()** — Hjelpefunksjon for kalenderen (disconnect Google kalender).
- **fetchCalendarList()** — Henter kalender liste.
- **getImportedEvents()** — Henter imported hendelser.
- **getSyncStatus()** — Henter sync status.
- **getValidAccessToken()** — Henter valid access token.
- **syncAllGoogleCalendars()** — Synkroniserer alle Google calendars.
- **syncGoogleCalendar()** — Synkroniserer Google kalender.

#### `lib/portal/google-calendar/webhook.ts`
- **handleWebhookNotification()** — Håndterer webhook varsel.
- **renewExpiringWebhooks()** — Hjelpefunksjon for kalenderen (renew expiring webhooks).
- **startWatchingCalendar()** — Starter watching kalender.
- **stopWatchingCalendar()** — Stopper watching kalender.

#### `lib/portal/notifications/create.ts`
- **cleanupOldNotifications()** — Hjelpefunksjon for varsler (cleanup old varsler).
- **createBulkNotifications()** — Oppretter bulk varsler.
- **createNotification()** — Oppretter varsel.
- **getNotifications()** — Henter varsler.
- **getUnreadCount()** — Henter unread antall.
- **markAllNotificationsAsRead()** — Markerer alle varsler as read.
- **markNotificationAsRead()** — Markerer varsel as read.

#### `lib/portal/notifications/triggers.ts`
- **notifyBookingCancelled()** — Sender varsel om booking cancelled.
- **notifyBookingConfirmed()** — Sender varsel om booking confirmed.
- **notifyBookingReminder()** — Sender varsel om booking reminder.
- **notifyBookingRescheduled()** — Sender varsel om booking rescheduled.
- **notifyCoachingNotesAdded()** — Sender varsel om coaching notater added.
- **notifyDiaryEntry()** — Sender varsel om diary entry.
- **notifyGoalAchieved()** — Sender varsel om mål achieved.
- **notifyNewBooking()** — Sender varsel om new booking.
- **notifyPlanCoachFeedback()** — Sender varsel om plan coach tilbakemelding.
- **notifyPlanPlayerComment()** — Sender varsel om plan spiller kommentar.
- **notifyPlanSuggestionCreated()** — Sender varsel om plan suggestion created.
- **notifyPlanSuggestionResolved()** — Sender varsel om plan suggestion resolved.
- **notifyPlayerQuestion()** — Sender varsel om spiller question.
- **notifyTrainingPlanReady()** — Sender varsel om trening plan ready.
- **notifyVideoUploaded()** — Sender varsel om video uploaded.
- **sendAdminDailySummary()** — Sender admin daglig sammendrag.
- **sendBookingReminders()** — Sender booking reminders.

#### `lib/portal/notifications/types.ts`
- **DEFAULT_ADMIN_CONFIG()** — Hjelpefunksjon for varsler (d e f u l t_ d m i n_ c o n f i g).

#### `lib/portal/notion/client.ts`
- **getNotionClient()** — Henter Notion client.
- **notionRetry()** — Hjelpefunksjon for Notion (Notion retry).
- **queryDatabase()** — Henter database.

#### `lib/portal/notion/content-sync.ts`
- **fetchContentFromNotion()** — Henter content fra Notion.
- **syncContentToNotion()** — Synkroniserer content til Notion.

#### `lib/portal/notion/drill-sync.ts`
- **syncAllDrillsToNotion()** — Synkroniserer alle øvelser til Notion.
- **syncDrillToNotion()** — Synkroniserer øvelse til Notion.

#### `lib/portal/notion/player-profiles.ts`
- **appendCoachingSessionToProfile()** — Hjelpefunksjon for spillerprofil (append coaching økt til profil).
- **createPlayerProfile()** — Oppretter spiller profil.

#### `lib/portal/notion/task-sync.ts`
- **createTaskInNotion()** — Oppretter oppgave in Notion.
- **syncTasksFromNotion()** — Synkroniserer oppgaver fra Notion.

#### `lib/portal/notion/training-plan-sync.ts`
- **syncTrainingPlanToNotion()** — Synkroniserer trening plan til Notion.

