# Player Portal — Funksjons-inventar

> Generert 2026-05-05 som grunnlag for portering til PlayerHQ.

## Ruter
| Rute | Filer | Status |
|------|-------|--------|
| `/` | dashboard-actions.ts,dashboard-bento-client.tsx,dashboard-client-v3.tsx,dashboard-types.ts,dashboard-v2-client.tsx,error.tsx,layout.tsx,loading.tsx,page.tsx | aktiv |
| `/abonnement` | abonnement-client.tsx,actions.ts,page.tsx | aktiv |
| `/ai-coach` | actions.ts,ai-coach-chat-client.tsx,ai-coach-client.tsx,ai-coach-dashboard-client.tsx,page.tsx | aktiv |
| `/ai-coach/chat` | page.tsx | aktiv |
| `/analyse` | actions.ts,error.tsx,loading.tsx,page.tsx | aktiv |
| `/apper` | actions.ts,apper-client.tsx,error.tsx,loading.tsx,page.tsx | aktiv |
| `/bag` | actions.ts,bag-client.tsx,page.tsx | aktiv |
| `/benchmark` | actions.ts,benchmark-client.tsx,page.tsx | aktiv |
| `/bookinger` | actions.ts,bookinger-client.tsx,error.tsx,loading.tsx,page.tsx | aktiv |
| `/bookinger/[id]` | booking-detail-client.tsx,page.tsx | aktiv |
| `/bookinger/[id]/endre` | error.tsx,loading.tsx,page.tsx | aktiv |
| `/bookinger/ny` | book-coaching-form.tsx,error.tsx,loading.tsx,page.tsx,portal-booking-wizard.tsx | aktiv |
| `/bookinger/venteliste` | actions.ts,page.tsx,waitlist-card.tsx | aktiv |
| `/coaching-historikk` | actions.ts,error.tsx,loading.tsx,page.tsx | aktiv |
| `/dagbok` | actions.ts,error.tsx,loading.tsx,page.tsx | aktiv |
| `/dagbok/[sessionId]` | error.tsx,loading.tsx,page.tsx | aktiv |
| `/dashboard-views` | athletic-grid-view.tsx |  |
| `/design-preview` | design-preview-client.tsx,page.tsx | aktiv |
| `/foreldre` | page.tsx | aktiv |
| `/foreldre/[childId]` | layout.tsx |  |
| `/foreldre/[childId]/betalinger` | page.tsx | aktiv |
| `/foreldre/[childId]/trening` | page.tsx | aktiv |
| `/foreldre/[childId]/turneringer` | page.tsx | aktiv |
| `/kalender` | actions.ts,error.tsx,loading.tsx,page.tsx | aktiv |
| `/kartlegging` | actions.ts,kartlegging-client.tsx,page.tsx | aktiv |
| `/kartlegging/components` | data-consent-dialog.tsx,dimension-grid.tsx,forecast-card.tsx,gap-analysis-card.tsx,milestones-card.tsx,player-level-hero.tsx,roi-card.tsx,test-results-card.tsx,training-index-card.tsx,training-pyramid.tsx |  |
| `/meldinger` | actions.ts,meldinger-chat-client.tsx,page.tsx | aktiv |
| `/meldinger/demo` | meldinger-demo-client.tsx,page.tsx | aktiv |
| `/mental` | page.tsx | aktiv |
| `/mental/[roundId]` | page.tsx | aktiv |
| `/mental/ny` | page.tsx | aktiv |
| `/min-plan` | min-plan-client.tsx,page.tsx | aktiv |
| `/min-plan/components` | generate-week-modal.tsx |  |
| `/onboarding` | actions.ts,error.tsx,loading.tsx,onboarding-client.tsx,page.tsx | aktiv |
| `/onboarding/components` | quick-onboarding-banner.tsx |  |
| `/playerhq` | page.tsx | aktiv |
| `/profil` | actions.ts,error.tsx,goal-actions.ts,loading.tsx,page.tsx | aktiv |
| `/profil/innstillinger` | page.tsx,settings-client.tsx | aktiv |
| `/profil/personvern` | page.tsx,privacy-client.tsx | aktiv |
| `/runde` | actions.ts,page.tsx | aktiv |
| `/runde/[id]` | live-round-client.tsx,page.tsx | aktiv |
| `/runde/[id]/hero` | course-hero-client.tsx,page.tsx | aktiv |
| `/runde/[id]/kart` | page.tsx | aktiv |
| `/runde/[id]/live` | page.tsx | aktiv |
| `/runde/[id]/oppsummering` | page.tsx | aktiv |
| `/runde/ny` | page.tsx,start-round-client.tsx | aktiv |
| `/sammenligning` | actions.ts,error.tsx,loading.tsx,page.tsx | aktiv |
| `/sosialt` | actions.ts,page.tsx,sosialt-client.tsx | aktiv |
| `/sosialt/venner` | page.tsx,venner-client.tsx | aktiv |
| `/spill` | actions.ts,page.tsx,spill-client.tsx | aktiv |
| `/spill/[gameType]` | page.tsx | aktiv |
| `/statistikk` | actions.ts,error.tsx,loading.tsx,page.tsx,statistikk-charts.tsx | aktiv |
| `/statistikk/ny-runde` | actions.ts,error.tsx,loading.tsx,ny-runde-client.tsx,page.tsx | aktiv |
| `/strategi` | page.tsx | aktiv |
| `/talent` | access.ts,actions.ts,page.tsx,talent-leaderboard.tsx | aktiv |
| `/talent/[playerId]` | page.tsx,player-profile.tsx | aktiv |
| `/teknisk-plan` | page.tsx,technical-plan-player-client.tsx | aktiv |
| `/tester` | actions.ts,page.tsx,tester-client.tsx | aktiv |
| `/tester/[testNumber]` | actions.ts,page.tsx | aktiv |
| `/tester/[testNumber]/resultat` | page.tsx | aktiv |
| `/timeplan` | page.tsx,timeplan-client.tsx | aktiv |
| `/trackman` | actions.ts,page.tsx,trackman-client.tsx | aktiv |
| `/trackman/[club]` | page.tsx | aktiv |
| `/trackman/last-opp` | page.tsx | aktiv |
| `/trackman/v2` | page.tsx | aktiv |
| `/trening` | page.tsx | aktiv |
| `/trening/ovelser` | error.tsx,loading.tsx,page.tsx | aktiv |
| `/trening/tester` | error.tsx,loading.tsx,page.tsx | aktiv |
| `/trening/tester/[id]` | error.tsx,loading.tsx,page.tsx | aktiv |
| `/trening/tester/components` | test-protocol-list.tsx |  |
| `/treningsplan` | actions.ts,error.tsx,group-rsvp-actions.ts,loading.tsx,overview-helpers.ts,page.tsx,training-plan-viewer.tsx,treningsplan-overview.tsx,treningsplan-planner.tsx,treningsplan-v3-client.tsx | aktiv |
| `/treningsplan/[sessionId]` | error.tsx,loading.tsx,page.tsx,session-view-client.tsx | aktiv |
| `/treningsplan/analyse` | page.tsx | aktiv |
| `/treningsplan/components` | plan-adjustment-banner.tsx,plan-adjustment-modal.tsx,plan-goals-card.tsx |  |
| `/treningsplan/uke` | page.tsx | aktiv |
| `/treningsplan/uke/[offset]` | page.tsx,week-detail-client.tsx | aktiv |
| `/treningsplan/v2` | page.tsx | aktiv |
| `/turneringer` | actions.ts,error.tsx,loading.tsx,page.tsx,turneringer-client.tsx | aktiv |
| `/turneringsplan` | actions.ts,error.tsx,loading.tsx,page.tsx,tournament-list-with-periods.tsx,turneringsplan-client.tsx | aktiv |
| `/utstyr` | page.tsx | aktiv |

## Server Actions

| Fil | Funksjon | Signatur | Linjer | Beskrivelse |
|-----|----------|----------|--------|-------------|
| abonnement/actions.ts | getSubscriptionData | `(): Promise<SubscriptionData>` | 97 | Henter subscription data |
| abonnement/actions.ts | getStripePortalUrl | `(): Promise<string \| null>` | 97 | Henter stripe portal url |
| ai-coach/actions.ts | getChatContext | `(): Promise<ChatContext>` | 205 | Henter chat context |
| ai-coach/actions.ts | getQuickInsight | `(): Promise<string>` | 205 | Henter quick insight |
| analyse/actions.ts | getHandicapEntries | `(months = 12)` | 455 | Henter handicap entries |
| analyse/actions.ts | addHandicapEntry | `(data:` | 455 | Legger til handicap entry |
| analyse/actions.ts | getAnalyseStats | `(): Promise<AnalyseStats>` | 455 | Henter analyse stats |
| analyse/actions.ts | getStrokesGainedData | `(): Promise<StrokesGainedData>` | 455 | Henter strokes gained data |
| analyse/actions.ts | getTrackManStats | `(): Promise<TrackManStat[]>` | 455 | Henter track man stats |
| analyse/actions.ts | getTrainingLogsForAnalyse | `(days = 90)` | 455 | Henter training logs for analyse |
| analyse/actions.ts | getPlanVsActual | `(weeks = 8)` | 455 | Henter plan vs actual |
| analyse/actions.ts | getConsistencyData | `(days = 84)` | 455 | Henter consistency data |
| apper/actions.ts | getApperPageData | `(): Promise<ApperPageData>` | 124 | Henter apper page data |
| bag/actions.ts | getPlayerBag | `(): Promise<` | 222 | Henter player bag |
| bag/actions.ts | addClub | `(data:` | 222 | Legger til club |
| bag/actions.ts | updateClub | `(` | 222 | Oppdaterer club |
| bag/actions.ts | deleteClub | `(clubId: string)` | 222 | Sletter club |
| bag/actions.ts | getClubDispersions | `()` | 222 | Henter club dispersions |
| benchmark/actions.ts | getPlayerSGProfile | `(): Promise<PlayerSGProfile \| null>` | 174 | Henter player s g profile |
| benchmark/actions.ts | getProPlayers | `(` | 174 | Henter pro players |
| benchmark/actions.ts | getProComparison | `(` | 174 | Henter pro comparison |
| bookinger/actions.ts | getUpcomingBookings | `(studentId?: string)` | 305 | Henter upcoming bookings |
| bookinger/actions.ts | getPastBookings | `(studentId?: string)` | 305 | Henter past bookings |
| bookinger/actions.ts | cancelBooking | `(` | 305 | Kansellerer booking |
| bookinger/venteliste/actions.ts | cancelWaitlistEntry | `(` | 56 | Kansellerer waitlist entry |
| coaching-historikk/actions.ts | getCoachingSessions | `()` | 119 | Henter coaching sessions |
| coaching-historikk/actions.ts | createCoachingSession | `(data:` | 119 | Oppretter coaching session |
| coaching-historikk/actions.ts | saveAISummary | `(` | 119 | Lagrer a i summary |
| dagbok/actions.ts | getTrainingLogs | `(month?: Date)` | 553 | Henter training logs |
| dagbok/actions.ts | logSession | `(input:` | 553 | logSession |
| dagbok/actions.ts | updateTrainingLog | `(` | 553 | Oppdaterer training log |
| dagbok/actions.ts | deleteTrainingLog | `(id: string)` | 553 | Sletter training log |
| dagbok/actions.ts | getLoggedSessionIds | `()` | 553 | Henter logged session ids |
| dagbok/actions.ts | quickLogSession | `(focusArea: string)` | 553 | quickLogSession |
| dagbok/actions.ts | repeatLastSession | `()` | 553 | repeatLastSession |
| dagbok/actions.ts | getLastSession | `()` | 553 | Henter last session |
| dagbok/actions.ts | logSessionWithExercises | `(input: SessionWithExercisesInput)` | 553 | logSessionWithExercises |
| dagbok/actions.ts | updateExerciseLog | `(` | 553 | Oppdaterer exercise log |
| dagbok/actions.ts | addCoachFeedback | `(` | 553 | Legger til coach feedback |
| dagbok/actions.ts | getSessionWithExercises | `(sessionId: string)` | 553 | Henter session with exercises |
| dashboard-actions.ts | getSgSummary | `(userId: string): Promise<SgSummary>` | 1036 | Henter sg summary |
| dashboard-actions.ts | getDashboardTrainingIndex | `(userId: string): Promise<TrainingIndex \| null>` | 1036 | Henter dashboard training index |
| dashboard-actions.ts | getTestProgress | `(userId: string): Promise<TestProgress>` | 1036 | Henter test progress |
| dashboard-actions.ts | getDashboardStats | `(userId: string)` | 1036 | Henter dashboard stats |
| dashboard-actions.ts | getHandicapData | `(userId: string)` | 1036 | Henter handicap data |
| dashboard-actions.ts | getNextBooking | `(userId: string)` | 1036 | Henter next booking |
| dashboard-actions.ts | getCoachInsight | `(userId: string)` | 1036 | Henter coach insight |
| dashboard-actions.ts | getLatestAiInsight | `(userId: string): Promise<WeeklyInsight \| null>` | 1036 | Henter latest ai insight |
| dashboard-actions.ts | getTrackManData | `(userId: string): Promise<TrackManData \| null>` | 1036 | Henter track man data |
| dashboard-actions.ts | getSocialData | `(userId: string): Promise<SocialData \| null>` | 1036 | Henter social data |
| dashboard-actions.ts | getPlayerLevel | `(userId: string): Promise<"beginner" \| "intermediate" \| "advanced" \| "pro">` | 1036 | Henter player level |
| dashboard-actions.ts | getHandicapHistory | `(userId: string): Promise<number[]>` | 1036 | Henter handicap history |
| dashboard-actions.ts | getWeekRingsData | `(userId: string): Promise<` | 1036 | Henter week rings data |
| dashboard-actions.ts | getDailyChecklist | `(userId: string): Promise<ChecklistItem[]>` | 1036 | Henter daily checklist |
| dashboard-actions.ts | getAchievements | `(userId: string): Promise<` | 1036 | Henter achievements |
| dashboard-actions.ts | getRoundAggregateMetrics | `(` | 1036 | Henter round aggregate metrics |
| dashboard-actions.ts | getTodayTasks | `(userId: string): Promise<TodayTask[]>` | 1036 | Henter today tasks |
| kalender/actions.ts | getCalendarEvents | `(` | 210 | Henter calendar events |
| kalender/actions.ts | getPeriodizationBands | `(` | 210 | Henter periodization bands |
| kartlegging/actions.ts | getKartleggingData | `(): Promise<KartleggingData>` | 292 | Henter kartlegging data |
| kartlegging/actions.ts | recordDataConsent | `(input:` | 292 | recordDataConsent |
| kartlegging/actions.ts | withdrawDataConsent | `(): Promise<void>` | 292 | withdrawDataConsent |
| meldinger/actions.ts | getConversationMessages | `(conversationId: string)` | 144 | Henter conversation messages |
| meldinger/actions.ts | sendDirectMessage | `(` | 144 | sendDirectMessage |
| meldinger/actions.ts | getMyConversations | `(): Promise<ConversationSummary[]>` | 144 | Henter my conversations |
| meldinger/actions.ts | markConversationAsRead | `(conversationId: string)` | 144 | markConversationAsRead |
| onboarding/actions.ts | saveOnboardingData | `(data: OnboardingGoals)` | 260 | Lagrer onboarding data |
| onboarding/actions.ts | checkOnboardingStatus | `()` | 260 | checkOnboardingStatus |
| onboarding/actions.ts | skipOnboarding | `()` | 260 | skipOnboarding |
| onboarding/actions.ts | quickOnboardAndGeneratePlan | `(` | 260 | quickOnboardAndGeneratePlan |
| profil/actions.ts | getMyProfile | `()` | 287 | Henter my profile |
| profil/actions.ts | updateProfile | `(data:` | 287 | Oppdaterer profile |
| profil/actions.ts | getPlayerStats | `()` | 287 | Henter player stats |
| profil/actions.ts | getHandicapHistory | `(months = 6)` | 287 | Henter handicap history |
| profil/actions.ts | getAchievements | `()` | 287 | Henter achievements |
| profil/actions.ts | uploadAvatar | `(formData: FormData)` | 287 | uploadAvatar |
| profil/actions.ts | getPlayerSGData | `()` | 287 | Henter player s g data |
| profil/goal-actions.ts | getGoals | `()` | 115 | Henter goals |
| profil/goal-actions.ts | createGoal | `(data:` | 115 | Oppretter goal |
| profil/goal-actions.ts | updateGoal | `(` | 115 | Oppdaterer goal |
| profil/goal-actions.ts | deleteGoal | `(id: string)` | 115 | Sletter goal |
| runde/actions.ts | searchCourses | `(query: string)` | 332 | searchCourses |
| runde/actions.ts | getCourseHoles | `(courseId: string, teeColor = "yellow")` | 332 | Henter course holes |
| runde/actions.ts | startRound | `(courseId: string, teeColor: string, weather?: string)` | 332 | startRound |
| runde/actions.ts | saveHoleResult | `(` | 332 | Lagrer hole result |
| runde/actions.ts | completeRound | `(roundId: string)` | 332 | completeRound |
| runde/actions.ts | getDecadeStrategy | `(` | 332 | Henter decade strategy |
| runde/actions.ts | getUserRounds | `(limit = 20)` | 332 | Henter user rounds |
| runde/actions.ts | getRoundDetail | `(roundId: string)` | 332 | Henter round detail |
| sammenligning/actions.ts | getPeerComparisonData | `()` | 136 | Henter peer comparison data |
| sosialt/actions.ts | getFriends | `()` | 498 | Henter friends |
| sosialt/actions.ts | getPendingRequests | `()` | 498 | Henter pending requests |
| sosialt/actions.ts | searchUsers | `(query: string)` | 498 | searchUsers |
| sosialt/actions.ts | sendFriendRequest | `(friendId: string)` | 498 | sendFriendRequest |
| sosialt/actions.ts | acceptFriendRequest | `(friendshipId: string)` | 498 | acceptFriendRequest |
| sosialt/actions.ts | declineFriendRequest | `(friendshipId: string)` | 498 | declineFriendRequest |
| sosialt/actions.ts | removeFriend | `(friendshipId: string)` | 498 | removeFriend |
| sosialt/actions.ts | getActiveChallenges | `()` | 498 | Henter active challenges |
| sosialt/actions.ts | createChallenge | `(data:` | 498 | Oppretter challenge |
| sosialt/actions.ts | joinChallenge | `(challengeId: string)` | 498 | joinChallenge |
| sosialt/actions.ts | getFriendsLeaderboard | `(` | 498 | Henter friends leaderboard |
| spill/actions.ts | getGameSessions | `(): Promise<GameSessionData[]>` | 364 | Henter game sessions |
| spill/actions.ts | getRecentCourses | `(): Promise<CourseData[]>` | 364 | Henter recent courses |
| spill/actions.ts | getChallenges | `(): Promise<ChallengeData[]>` | 364 | Henter challenges |
| spill/actions.ts | createGameSession | `(data:` | 364 | Oppretter game session |
| spill/actions.ts | joinGameSession | `(` | 364 | joinGameSession |
| spill/actions.ts | searchCourses | `(query: string): Promise<CourseData[]>` | 364 | searchCourses |
| statistikk/actions.ts | getFilteredRoundStats | `(period: PeriodKey = "30d"): Promise<RoundStatsRow[]>` | 629 | Henter filtered round stats |
| statistikk/actions.ts | computeAggregates | `(rounds: RoundStatsRow[])` | 629 | computeAggregates |
| statistikk/actions.ts | getFilteredAggregates | `(period: PeriodKey = "30d")` | 629 | Henter filtered aggregates |
| statistikk/actions.ts | getWeeklyTrainingVolume | `(period: PeriodKey = "30d"): Promise<WeeklyTrainingData[]>` | 629 | Henter weekly training volume |
| statistikk/actions.ts | getFilteredBreakdown | `(period: PeriodKey = "30d")` | 629 | Henter filtered breakdown |
| statistikk/actions.ts | addRoundStats | `(data:` | 629 | Legger til round stats |
| statistikk/actions.ts | getLatestHandicap | `()` | 629 | Henter latest handicap |
| statistikk/actions.ts | getHcpForecast | `(): Promise<HcpForecastData>` | 629 | Henter hcp forecast |
| statistikk/actions.ts | getGolfProfileSummary | `(): Promise<GolfProfileSummary>` | 629 | Henter golf profile summary |
| statistikk/ny-runde/actions.ts | saveRound | `(data:` | 53 | Lagrer round |
| statistikk/ny-runde/actions.ts | getCourses | `()` | 53 | Henter courses |
| talent/access.ts | canViewTalentDashboard | `(user:` | 19 | canViewTalentDashboard |
| talent/actions.ts | fetchLeaderboard | `(filters: LeaderboardFilters): Promise<LeaderboardData>` | 444 | fetchLeaderboard |
| talent/actions.ts | fetchPlayerProfile | `(playerId: string): Promise<PlayerProfileData \| null>` | 444 | fetchPlayerProfile |
| talent/actions.ts | fetchMyTalentDashboardData | `(): Promise<MyTalentData \| null>` | 444 | fetchMyTalentDashboardData |
| tester/[testNumber]/actions.ts | submitTestResult | `(` | 78 | submitTestResult |
| tester/actions.ts | getTestsOverview | `(): Promise<TestOverviewData[]>` | 153 | Henter tests overview |
| tester/actions.ts | getTesterStats | `(): Promise<TesterStats>` | 153 | Henter tester stats |
| trackman/actions.ts | getTrackManOverview | `(): Promise<TrackManOverview>` | 413 | Henter track man overview |
| trackman/actions.ts | getTrackManV2Data | `(): Promise<TrackManV2Data>` | 413 | Henter track man v2 data |
| trackman/actions.ts | generateTrackManInsights | `(` | 413 | generateTrackManInsights |
| treningsplan/actions.ts | saveSessionProgress | `(` | 2482 | Lagrer session progress |
| treningsplan/actions.ts | addExerciseToSession | `(` | 2482 | Legger til exercise to session |
| treningsplan/actions.ts | getActivePlan | `(studentId?: string)` | 2482 | Henter active plan |
| treningsplan/actions.ts | getCurrentPeriodization | `(studentId?: string): Promise<CurrentPeriodization \| null>` | 2482 | Henter current periodization |
| treningsplan/actions.ts | getCurrentWeekSessions | `(studentId?: string)` | 2482 | Henter current week sessions |
| treningsplan/actions.ts | createManualPlan | `(input: ManualPlanInput)` | 2482 | Oppretter manual plan |
| treningsplan/actions.ts | toggleSessionComplete | `(sessionId: string)` | 2482 | toggleSessionComplete |
| treningsplan/actions.ts | updateSessionTime | `(` | 2482 | Oppdaterer session time |
| treningsplan/actions.ts | moveSessionToDay | `(` | 2482 | moveSessionToDay |
| treningsplan/actions.ts | deleteSession | `(sessionId: string)` | 2482 | Sletter session |
| treningsplan/actions.ts | createSessionForWeek | `(data:` | 2482 | Oppretter session for week |
| treningsplan/actions.ts | updateSession | `(` | 2482 | Oppdaterer session |
| treningsplan/actions.ts | getWeekEvents | `(weekOffset = 0): Promise<V2Event[]>` | 2482 | Henter week events |
| treningsplan/actions.ts | logLiveSession | `(data:` | 2482 | logLiveSession |
| treningsplan/actions.ts | analyzePlanDeviation | `(): Promise<PlanDeviationAnalysis \| null>` | 2482 | analyzePlanDeviation |
| treningsplan/actions.ts | adjustPlanVolume | `(factor: number): Promise<{ success: boolean; adjustedCount: number; error?: string }>` | 2482 | adjustPlanVolume |
| treningsplan/actions.ts | createPlanFromChoice | `(input: CreatePlanFromChoiceInput)` | 2482 | Oppretter plan from choice |
| treningsplan/actions.ts | applyTemplateToWeek | `(` | 2482 | applyTemplateToWeek |
| treningsplan/actions.ts | listStandardTemplates | `()` | 2482 | Lister standard templates |
| treningsplan/actions.ts | listMyPlans | `()` | 2482 | Lister my plans |
| treningsplan/actions.ts | archivePlan | `(planId: string)` | 2482 | archivePlan |
| treningsplan/actions.ts | activatePlan | `(planId: string)` | 2482 | activatePlan |
| treningsplan/actions.ts | deletePlan | `(planId: string)` | 2482 | Sletter plan |
| treningsplan/actions.ts | duplicateOwnPlan | `(sourcePlanId: string)` | 2482 | duplicateOwnPlan |
| treningsplan/actions.ts | duplicateSession | `(sessionId: string)` | 2482 | duplicateSession |
| treningsplan/actions.ts | reorderSessionsInDay | `(` | 2482 | reorderSessionsInDay |
| treningsplan/actions.ts | listAvailableFacilities | `()` | 2482 | Lister available facilities |
| treningsplan/actions.ts | toggleRestDay | `(weekId: string, dayOfWeek: number)` | 2482 | toggleRestDay |
| treningsplan/actions.ts | checkSessionConflicts | `(input:` | 2482 | checkSessionConflicts |
| treningsplan/actions.ts | getPlanGoalsProgress | `(): Promise<PlanGoalsSummary>` | 2482 | Henter plan goals progress |
| treningsplan/actions.ts | dismissPlanAdjustment | `(planId: string)` | 2482 | dismissPlanAdjustment |
| treningsplan/actions.ts | setPlanPlayerComment | `(` | 2482 | setPlanPlayerComment |
| treningsplan/actions.ts | getTestsAsExercises | `(): Promise<TestAsExercise[]>` | 2482 | Henter tests as exercises |
| treningsplan/actions.ts | searchTestsAsExercises | `(` | 2482 | searchTestsAsExercises |
| treningsplan/actions.ts | listMyPendingSuggestions | `()` | 2482 | Lister my pending suggestions |
| treningsplan/actions.ts | acceptSuggestion | `(` | 2482 | acceptSuggestion |
| treningsplan/actions.ts | rejectSuggestion | `(` | 2482 | rejectSuggestion |
| treningsplan/group-rsvp-actions.ts | listMyUpcomingGroupSessions | `(): Promise<` | 80 | Lister my upcoming group sessions |
| treningsplan/group-rsvp-actions.ts | respondToGroupSession | `(input:` | 80 | respondToGroupSession |
| treningsplan/overview-helpers.ts | computeWeeklyTargets | `(` | 130 | computeWeeklyTargets |
| treningsplan/overview-helpers.ts | getActiveCoachName | `(): Promise<string \| null>` | 130 | Henter active coach name |
| treningsplan/overview-helpers.ts | buildLibraryItems | `(events: V2EventLite[]): LibraryItem[]` | 130 | buildLibraryItems |
| turneringer/actions.ts | getTournaments | `(options?:` | 117 | Henter tournaments |
| turneringer/actions.ts | registerForTournament | `(input:` | 117 | registerForTournament |
| turneringer/actions.ts | getTournamentPrepAction | `(` | 117 | Henter tournament prep action |
| turneringer/actions.ts | saveTournamentPrepAction | `(input:` | 117 | Lagrer tournament prep action |
| turneringer/actions.ts | getProTournaments | `(` | 117 | Henter pro tournaments |
| turneringsplan/actions.ts | getPlayerTournaments | `(): Promise<` | 122 | Henter player tournaments |
| turneringsplan/actions.ts | registerForTournament | `(input:` | 122 | registerForTournament |

## Komponenter
| Fil | Props | Linjer |
|-----|-------|--------|
| `components/portal/abonnement/v2/abonnement-v2-client.tsx` | - | 274 |
| `components/portal/abonnement/v2/info-card.tsx` | InfoCardProps | 69 |
| `components/portal/abonnement/v2/no-plan-view.tsx` | NoPlanViewProps | 77 |
| `components/portal/abonnement/v2/plan-hero-card.tsx` | PlanHeroCardProps | 195 |
| `components/portal/abonnement/v2/quota-card.tsx` | QuotaCardProps | 96 |
| `components/portal/abonnement/v2/tier-data.ts` | - | 73 |
| `components/portal/abonnement/v2/tier-switch.tsx` | TierSwitchProps | 113 |
| `components/portal/ai-coach/chat-history.tsx` | ChatHistoryProps | 219 |
| `components/portal/ai-coach/chat-interface.tsx` | ChatInterfaceProps | 368 |
| `components/portal/ai-coach/context-panel.tsx` | ContextPanelProps | 184 |
| `components/portal/ai-coach/index.ts` | - | 5 |
| `components/portal/ai-coach/message-bubble.tsx` | MessageBubbleProps | 86 |
| `components/portal/ai-coach/quick-questions.tsx` | QuickQuestionsProps | 106 |
| `components/portal/ai-coach/v2/ai-coach-v2-client.tsx` | - | 231 |
| `components/portal/ai-coach/v2/chat-composer.tsx` | ChatComposerProps | 69 |
| `components/portal/ai-coach/v2/chat-message.tsx` | ChatMessageProps | 66 |
| `components/portal/ai-coach/v2/context-rail.tsx` | ContextRailProps | 71 |
| `components/portal/apple/icon-map.ts` | - | 190 |
| `components/portal/bag/v2/add-club-form.tsx` | - | 123 |
| `components/portal/bag/v2/bag-client-v2.tsx` | - | 102 |
| `components/portal/bag/v2/bag-hero.tsx` | - | 172 |
| `components/portal/bag/v2/equipment-grid.tsx` | - | 105 |
| `components/portal/bag/v2/gapping-chart.tsx` | - | 176 |
| `components/portal/bag/v2/recommendation-card.tsx` | - | 66 |
| `components/portal/bag/v2/styles.ts` | - | 22 |
| `components/portal/beta-test/RoryAugustaResult.tsx` | RoryAugustaResultProps | 492 |
| `components/portal/booking/booking-status-badge.tsx` | BookingStatusBadgeProps | 24 |
| `components/portal/booking/booking-types.ts` | - | 38 |
| `components/portal/booking/reschedule-form.tsx` | - | 207 |
| `components/portal/booking/upsell-card.tsx` | BookingUpsellCardProps | 102 |
| `components/portal/bookinger/v2/booking-row.tsx` | BookingRowProps | 283 |
| `components/portal/bookinger/v2/booking-shell.tsx` | - | 25 |
| `components/portal/bookinger/v2/booking-tabs.tsx` | BookingTabsProps | 68 |
| `components/portal/bookinger/v2/booking-utils.ts` | - | 76 |
| `components/portal/bookinger/v2/cancellation-rules.tsx` | CancellationRulesProps | 74 |
| `components/portal/bookinger/v2/day-separator.tsx` | DaySeparatorProps | 34 |
| `components/portal/bookinger/v2/empty-state.tsx` | EmptyStateProps | 130 |
| `components/portal/bookinger/v2/next-booking-hero.tsx` | NextBookingHeroProps | 214 |
| `components/portal/bookinger/v2/page-header.tsx` | PageHeaderProps | 78 |
| `components/portal/charts/svg-path-utils.ts` | - | 105 |
| `components/portal/coaching-historikk/ai-summary-block.tsx` | AISummaryBlockProps | 112 |
| `components/portal/coaching-historikk/session-card.tsx` | SessionCardProps | 146 |
| `components/portal/coaching-historikk/v2/filter-row.tsx` | - | 53 |
| `components/portal/coaching-historikk/v2/historikk-client-v2.tsx` | - | 181 |
| `components/portal/coaching-historikk/v2/historikk-hero.tsx` | - | 154 |
| `components/portal/coaching-historikk/v2/session-row.tsx` | - | 193 |
| `components/portal/coaching-historikk/v2/styles.ts` | - | 19 |
| `components/portal/coaching-historikk/v2/timeline-types.ts` | - | 22 |
| `components/portal/context/achievement-context.tsx` | AchievementProviderProps | 65 |
| `components/portal/context/upgrade-context.tsx` | UpgradeProviderProps | 98 |
| `components/portal/dagbok/v2/dagbok-v2-client.tsx` | - | 341 |
| `components/portal/dagbok/v2/heatmap-90d.tsx` | - | 141 |
| `components/portal/dagbok/v2/hero-streak.tsx` | HeroStreakProps | 90 |
| `components/portal/dagbok/v2/milestone-card.tsx` | MilestoneCardProps | 96 |
| `components/portal/dagbok/v2/timeline-list.tsx` | TimelineListProps | 109 |
| `components/portal/dagbok/v2/volume-cards.tsx` | VolumeCardsProps | 220 |
| `components/portal/dashboard-bento/ai-insight-card.tsx` | AiInsightCardProps | 72 |
| `components/portal/dashboard-bento/hero-card.tsx` | HeroCardProps | 85 |
| `components/portal/dashboard-bento/kpi-card.tsx` | KpiCardProps | 134 |
| `components/portal/dashboard-bento/next-session-card.tsx` | NextSessionCardProps | 121 |
| `components/portal/dashboard-bento/onboarding-banner.tsx` | OnboardingBannerProps | 125 |
| `components/portal/dashboard-bento/sg-card.tsx` | SgCardProps | 101 |
| `components/portal/dashboard-bento/shortcuts-row.tsx` | - | 83 |
| `components/portal/dashboard-bento/streak-card.tsx` | StreakCardProps | 77 |
| `components/portal/dashboard-bento/trend-card.tsx` | TrendCardProps | 88 |
| `components/portal/dashboard/achievements-widget.tsx` | AchievementsWidgetProps | 129 |
| `components/portal/dashboard/ai-insight-card.tsx` | AiInsightCardProps | 73 |
| `components/portal/dashboard/ai-insights-v2.tsx` | - | 164 |
| `components/portal/dashboard/coach-insight-card.tsx` | CoachInsightCardProps | 73 |
| `components/portal/dashboard/empty-kpi-card.tsx` | EmptyKpiCardProps | 29 |
| `components/portal/dashboard/handicap-trend-chart-impl.tsx` | HandicapTrendChartProps | 138 |
| `components/portal/dashboard/handicap-trend-chart.tsx` | - | 9 |
| `components/portal/dashboard/hcp-trend-chart-impl.tsx` | HCPTrendChartProps | 203 |
| `components/portal/dashboard/hcp-trend-chart.tsx` | - | 9 |
| `components/portal/dashboard/index.ts` | - | 32 |
| `components/portal/dashboard/kpi-card.tsx` | KpiCardProps | 75 |
| `components/portal/dashboard/next-booking-card.tsx` | NextBookingCardProps | 116 |
| `components/portal/dashboard/number-ticker.tsx` | NumberTickerProps | 80 |
| `components/portal/dashboard/performance-chart-impl.tsx` | PerformanceChartProps | 84 |
| `components/portal/dashboard/performance-chart.tsx` | - | 9 |
| `components/portal/dashboard/player-profile-card.tsx` | PlayerProfileCardProps | 92 |
| `components/portal/dashboard/premium-card.tsx` | PremiumCardProps | 78 |
| `components/portal/dashboard/pulse-dot.tsx` | PulseDotProps | 34 |
| `components/portal/dashboard/sessions-donut-impl.tsx` | SessionsDonutProps | 101 |
| `components/portal/dashboard/sessions-donut.tsx` | - | 9 |
| `components/portal/dashboard/sg-radar-card-impl.tsx` | SGRadarCardProps | 114 |
| `components/portal/dashboard/sg-radar-card.tsx` | - | 9 |
| `components/portal/dashboard/shortcut-card.tsx` | ShortcutCardProps | 37 |
| `components/portal/dashboard/shortcut-pills.tsx` | - | 44 |
| `components/portal/dashboard/skeletons.tsx` | - | 46 |
| `components/portal/dashboard/social-widget.tsx` | SocialWidgetProps | 114 |
| `components/portal/dashboard/sparkline-impl.tsx` | SparklineProps | 133 |
| `components/portal/dashboard/sparkline.tsx` | - | 14 |
| `components/portal/dashboard/trackman-widget.tsx` | TrackManWidgetProps | 138 |
| `components/portal/dashboard/training-activity-card.tsx` | TrainingActivityCardProps | 73 |
| `components/portal/dashboard/training-distribution-impl.tsx` | TrainingDistributionProps | 148 |
| `components/portal/dashboard/training-distribution.tsx` | - | 9 |
| `components/portal/dashboard/training-plan-card.tsx` | TrainingPlanCardProps | 132 |
| `components/portal/dashboard/week-calendar.tsx` | WeekCalendarProps | 70 |
| `components/portal/dashboard/week-rings.tsx` | WeekRingsProps | 104 |
| `components/portal/dashboard/welcome-section.tsx` | WelcomeSectionProps | 51 |
| `components/portal/dataviz-index.ts` | - | 29 |
| `components/portal/gamification/streak-milestone.tsx` | StreakMilestoneProps | 123 |
| `components/portal/group-sessions/upcoming-group-sessions.tsx` | UpcomingGroupSessionsProps | 215 |
| `components/portal/kalender/calendar-sync-settings.tsx` | - | 143 |
| `components/portal/kalender/calendar-week-view.tsx` | CalendarWeekViewProps | 101 |
| `components/portal/kalender/v2/cal-toolbar.tsx` | CalToolbarProps | 120 |
| `components/portal/kalender/v2/focus-strip.tsx` | FocusStripProps | 107 |
| `components/portal/kalender/v2/kalender-client-v2.tsx` | - | 204 |
| `components/portal/kalender/v2/month-grid.tsx` | MonthGridProps | 177 |
| `components/portal/kalender/v2/right-sidebar.tsx` | RightSidebarProps | 117 |
| `components/portal/kalender/v2/side-exercises.tsx` | SideExercisesProps | 208 |
| `components/portal/kalender/v2/side-pyramid.tsx` | SidePyramidProps | 124 |
| `components/portal/kalender/v2/side-templates.tsx` | SideTemplatesProps | 78 |
| `components/portal/kalender/v2/types.ts` | - | 64 |
| `components/portal/kartlegging/v2/bottom-progress-bar.tsx` | BottomProgressBarProps | 75 |
| `components/portal/kartlegging/v2/kartlegging-client-v2.tsx` | - | 292 |
| `components/portal/kartlegging/v2/kartlegging-hero.tsx` | KartleggingHeroProps | 101 |
| `components/portal/kartlegging/v2/test-card.tsx` | TestCardProps | 267 |
| `components/portal/kartlegging/v2/test-instructions.tsx` | TestInstructionsProps | 246 |
| `components/portal/layout/dashboard-providers.tsx` | DashboardProvidersProps | 26 |
| `components/portal/layout/lenis-provider.tsx` | - | 33 |
| `components/portal/layout/mobile-header.tsx` | - | 37 |
| `components/portal/layout/notification-bell.tsx` | - | 403 |
| `components/portal/layout/page-tabs.tsx` | - | 63 |
| `components/portal/layout/service-worker-registration.tsx` | - | 117 |
| `components/portal/layout/sidebar-context.tsx` | - | 31 |
| `components/portal/layout/sidebar.tsx` | SidebarProps | 245 |
| `components/portal/layout/sub-nav-tabs.tsx` | SubNavTabsProps | 43 |
| `components/portal/layout/trial-banner-wrapper.tsx` | TrialBannerWrapperProps | 40 |
| `components/portal/meldinger/v2/composer.tsx` | ComposerProps | 113 |
| `components/portal/meldinger/v2/context-panel.tsx` | ContextPanelProps | 121 |
| `components/portal/meldinger/v2/conversation-pane.tsx` | ConversationPaneProps | 159 |
| `components/portal/meldinger/v2/meldinger-v2-client.tsx` | - | 177 |
| `components/portal/meldinger/v2/message-bubble.tsx` | MessageBubbleProps | 84 |
| `components/portal/meldinger/v2/thread-list.tsx` | ThreadListProps | 222 |
| `components/portal/mental/v2/drill-card.tsx` | - | 224 |
| `components/portal/mental/v2/izof-hero.tsx` | IzofHeroProps | 225 |
| `components/portal/mental/v2/mental-empty-rounds.tsx` | - | 64 |
| `components/portal/mental/v2/mental-page-header.tsx` | - | 58 |
| `components/portal/mental/v2/mental-shell.tsx` | - | 19 |
| `components/portal/mental/v2/mental-tabs.tsx` | MentalTabsProps | 43 |
| `components/portal/mental/v2/mood-week.tsx` | MoodWeekProps | 104 |
| `components/portal/mental/v2/routine-card.tsx` | - | 115 |
| `components/portal/mental/v2/trends-chart-impl.tsx` | TrendsChartProps | 158 |
| `components/portal/mental/v2/trends-chart.tsx` | - | 8 |
| `components/portal/min-plan/v2/build-week-from-forecast.ts` | - | 70 |
| `components/portal/min-plan/v2/coach-strip.tsx` | CoachStripProps | 63 |
| `components/portal/min-plan/v2/dark-card.tsx` | DarkCardProps | 83 |
| `components/portal/min-plan/v2/empty-state.tsx` | EmptyStateProps | 149 |
| `components/portal/min-plan/v2/focus-card.tsx` | FocusCardProps | 99 |
| `components/portal/min-plan/v2/forecast-types.ts` | - | 87 |
| `components/portal/min-plan/v2/goal-tier.tsx` | GoalTierProps | 79 |
| `components/portal/min-plan/v2/milestone-card.tsx` | MilestoneCardProps | 82 |
| `components/portal/min-plan/v2/min-plan-v2-client.tsx` | - | 252 |
| `components/portal/min-plan/v2/plan-hero.tsx` | PlanHeroProps | 126 |
| `components/portal/mission-control/coachhq-mobile-header.tsx` | - | 51 |
| `components/portal/mission-control/drill-studio.tsx` | DrillStudioProps | 328 |
| `components/portal/mission-control/forecast-display.tsx` | ForecastDisplayProps | 320 |
| `components/portal/mission-control/forecast-form.tsx` | ForecastFormProps | 259 |
| `components/portal/mission-control/forecast-history.tsx` | ForecastHistoryProps | 103 |
| `components/portal/mission-control/index.ts` | - | 14 |
| `components/portal/mission-control/mc-layout.tsx` | MCLayoutProps | 91 |
| `components/portal/mission-control/mc-nav-config.ts` | - | 143 |
| `components/portal/mission-control/mc-sidebar.tsx` | MCSidebarProps | 291 |
| `components/portal/mission-control/mc-topbar.tsx` | MCTopbarProps | 157 |
| `components/portal/mission-control/next-session-planner.tsx` | NextSessionPlannerProps | 232 |
| `components/portal/mission-control/post-session-upload.tsx` | PostSessionUploadProps | 276 |
| `components/portal/mission-control/student-forecast-tab.tsx` | StudentForecastTabProps | 161 |
| `components/portal/mission-control/student-summary-tab.tsx` | StudentSummaryTabProps | 147 |
| `components/portal/mission-control/summary-editor.tsx` | SummaryEditorProps | 264 |
| `components/portal/mission-control/test-register.tsx` | TestRegisterProps | 209 |
| `components/portal/mission-control/trackman-import-wizard.tsx` | TrackmanImportWizardProps | 300 |
| `components/portal/mission-control/ui/AdminBreadcrumbs.tsx` | AdminBreadcrumbsProps | 85 |
| `components/portal/mission-control/ui/AdminCommandPalette.tsx` | AdminCommandPaletteProps | 214 |
| `components/portal/mission-control/ui/AdminDataTable.tsx` | AdminDataTableProps | 333 |
| `components/portal/mission-control/ui/AdminDateRangePicker.tsx` | AdminDateRangePickerProps | 213 |
| `components/portal/mission-control/ui/AdminDialog.tsx` | AdminDialogProps | 104 |
| `components/portal/mission-control/ui/AdminDrawer.tsx` | AdminDrawerProps | 116 |
| `components/portal/mission-control/ui/AdminDropdown.tsx` | AdminDropdownProps | 154 |
| `components/portal/mission-control/ui/AdminEmptyState.tsx` | AdminEmptyStateProps | 45 |
| `components/portal/mission-control/ui/AdminGauge.tsx` | AdminGaugeProps | 108 |
| `components/portal/mission-control/ui/AdminHeatmap.tsx` | AdminHeatmapProps | 107 |
| `components/portal/mission-control/ui/AdminInput.tsx` | AdminInputProps | 56 |
| `components/portal/mission-control/ui/AdminPageHeader.tsx` | AdminPageHeaderProps | 77 |
| `components/portal/mission-control/ui/AdminProgressRing.tsx` | AdminProgressRingProps | 97 |
| `components/portal/mission-control/ui/AdminSelect.tsx` | AdminSelectProps | 80 |
| `components/portal/mission-control/ui/AdminSkeleton.tsx` | AdminSkeletonProps | 132 |
| `components/portal/mission-control/ui/AdminStatCard.tsx` | AdminStatCardProps | 92 |
| `components/portal/mission-control/ui/AdminTable.tsx` | AdminTableProps | 86 |
| `components/portal/mission-control/ui/AdminTextarea.tsx` | AdminTextareaProps | 63 |
| `components/portal/mission-control/ui/AdminTimeline.tsx` | AdminTimelineProps | 85 |
| `components/portal/mission-control/ui/AdminToast.tsx` | - | 138 |
| `components/portal/mission-control/ui/charts/AdminAreaChart-impl.tsx` | AdminAreaChartProps | 114 |
| `components/portal/mission-control/ui/charts/AdminAreaChart.tsx` | - | 8 |
| `components/portal/mission-control/ui/charts/AdminBarChart-impl.tsx` | AdminBarChartProps | 101 |
| `components/portal/mission-control/ui/charts/AdminBarChart.tsx` | - | 8 |
| `components/portal/mission-control/ui/charts/AdminDonutChart-impl.tsx` | AdminDonutChartProps | 128 |
| `components/portal/mission-control/ui/charts/AdminDonutChart.tsx` | - | 8 |
| `components/portal/mission-control/ui/charts/AdminLineChart-impl.tsx` | AdminLineChartProps | 107 |
| `components/portal/mission-control/ui/charts/AdminLineChart.tsx` | - | 8 |
| `components/portal/mission-control/ui/charts/AdminSparkline-impl.tsx` | AdminSparklineProps | 43 |
| `components/portal/mission-control/ui/charts/AdminSparkline.tsx` | - | 7 |
| `components/portal/mission-control/ui/division-dot.tsx` | DivisionDotProps | 31 |
| `components/portal/mission-control/ui/index.ts` | - | 62 |
| `components/portal/mission-control/webhook-health-card.tsx` | - | 191 |
| `components/portal/onboarding/onboarding-wizard.tsx` | OnboardingWizardProps | 361 |
| `components/portal/onboarding/v2/onboarding-wizard-v2.tsx` | - | 218 |
| `components/portal/onboarding/v2/progress-sidebar.tsx` | ProgressSidebarProps | 135 |
| `components/portal/onboarding/v2/step-cold-start.tsx` | StepColdStartProps | 60 |
| `components/portal/onboarding/v2/step-frequency.tsx` | StepFrequencyProps | 137 |
| `components/portal/onboarding/v2/step-goals.tsx` | StepGoalsProps | 162 |
| `components/portal/onboarding/v2/step-home-course.tsx` | StepHomeCourseProps | 85 |
| `components/portal/onboarding/v2/step-profile.tsx` | StepProfileProps | 107 |
| `components/portal/onboarding/v2/step-ready.tsx` | - | 81 |
| `components/portal/onboarding/v2/step-view.tsx` | StepViewProps | 97 |
| `components/portal/onboarding/v2/types.ts` | - | 54 |
| `components/portal/onboarding/view-picker-step.tsx` | ViewPickerStepProps | 130 |
| `components/portal/patterns/ai-attribution.tsx` | AIAttributionProps | 106 |
| `components/portal/patterns/ak-pyramide.tsx` | AKPyramideProps | 141 |
| `components/portal/patterns/bento-card.tsx` | BentoCardProps | 137 |
| `components/portal/patterns/course-hero.tsx` | CourseHeroProps | 95 |
| `components/portal/patterns/floating-topbar.tsx` | FloatingTopbarProps | 139 |
| `components/portal/patterns/glass-button.tsx` | GlassButtonProps | 62 |
| `components/portal/patterns/glass-panel.tsx` | GlassPanelProps | 103 |
| `components/portal/patterns/hero-label.tsx` | HeroLabelProps | 57 |
| `components/portal/patterns/index.ts` | - | 34 |
| `components/portal/patterns/mono-label.tsx` | MonoLabelProps | 56 |
| `components/portal/patterns/night-surface.tsx` | NightSurfaceProps | 58 |
| `components/portal/patterns/sg-ring.tsx` | SGRingProps | 142 |
| `components/portal/patterns/slim-icon-rail.tsx` | SlimIconRailProps | 122 |
| `components/portal/patterns/vertical-timeline.tsx` | VerticalTimelineProps | 112 |
| `components/portal/playerhq-trial-banner.tsx` | - | 42 |
| `components/portal/playerhq/NameList.tsx` | NameListProps | 201 |
| `components/portal/playerhq/PlayerHQSidebar.tsx` | PlayerHQSidebarProps | 98 |
| `components/portal/playerhq/hero.tsx` | KpiPillProps | 163 |
| `components/portal/playerhq/player-hq-dashboard.tsx` | PlayerHQDashboardProps | 248 |
| `components/portal/playerhq/playerhq-nav-config.ts` | - | 128 |
| `components/portal/playerhq/row-one.tsx` | ProfileCardProps | 320 |
| `components/portal/playerhq/row-two.tsx` | CalendarCardProps | 323 |
| `components/portal/premium/index.ts` | - | 10 |
| `components/portal/premium/motion-presets.ts` | - | 50 |
| `components/portal/premium/premium-stat-card.tsx` | PremiumStatCardProps | 191 |
| `components/portal/pricing/pricing-table.tsx` | PricingTableProps | 248 |
| `components/portal/profil/avatar-upload.tsx` | AvatarUploadProps | 127 |
| `components/portal/profil/profile-page-client.tsx` | ProfilePageClientProps | 296 |
| `components/portal/profil/v2/achievements-row.tsx` | AchievementsRowProps | 67 |
| `components/portal/profil/v2/coaches-row.tsx` | CoachesRowProps | 60 |
| `components/portal/profil/v2/hcp-history-card.tsx` | HcpHistoryCardProps | 126 |
| `components/portal/profil/v2/profile-hero.tsx` | ProfileHeroProps | 159 |
| `components/portal/profil/v2/profile-kpi-row.tsx` | ProfileKpiRowProps | 88 |
| `components/portal/profil/v2/profile-page-client-v2.tsx` | - | 193 |
| `components/portal/profil/v2/profile-shell.tsx` | ProfileShellProps | 20 |
| `components/portal/profil/v2/section-heading.tsx` | SectionHeadingProps | 19 |
| `components/portal/profil/v2/settings-link-row.tsx` | SettingsLinkRowProps | 34 |
| `components/portal/profil/v2/settings-page-client-v2.tsx` | - | 347 |
| `components/portal/profil/v2/settings-primitives.tsx` | - | 208 |
| `components/portal/profil/v2/settings-shell.tsx` | SettingsShellProps | 41 |
| `components/portal/providers.tsx` | - | 28 |
| `components/portal/round/club-suggester.tsx` | ClubSuggesterProps | 88 |
| `components/portal/round/hole-map.tsx` | HoleMapProps | 228 |
| `components/portal/round/map-overlay-layers.tsx` | - | 51 |
| `components/portal/round/round-map-mode.tsx` | RoundMapModeProps | 270 |
| `components/portal/runde/course-info.tsx` | CourseInfoProps | 150 |
| `components/portal/runde/hole-navigator.tsx` | HoleNavigatorProps | 164 |
| `components/portal/runde/live-round-client.tsx` | - | 385 |
| `components/portal/runde/preshot-routine.tsx` | PreShotRoutineProps | 273 |
| `components/portal/runde/shot-form.tsx` | ShotFormProps | 227 |
| `components/portal/runde/shot-list.tsx` | ShotListProps | 118 |
| `components/portal/runde/summary-scorecard.tsx` | TableProps | 138 |
| `components/portal/runde/summary-shot-table.tsx` | - | 87 |
| `components/portal/runde/v2/caddie-panel.tsx` | CaddiePanelProps | 86 |
| `components/portal/runde/v2/hole-nav-bar.tsx` | HoleNavBarProps | 72 |
| `components/portal/runde/v2/runde-v2-client.tsx` | - | 209 |
| `components/portal/runde/v2/weather-panel.tsx` | WeatherPanelProps | 58 |
| `components/portal/sammenligning/comparison-selector.tsx` | ComparisonSelectorProps | 390 |
| `components/portal/sammenligning/peer-benchmark-card.tsx` | PeerBenchmarkCardProps | 245 |
| `components/portal/sammenligning/peer-radar-chart-impl.tsx` | PeerRadarChartProps | 92 |
| `components/portal/sammenligning/peer-radar-chart.tsx` | - | 7 |
| `components/portal/sammenligning/peer-summary.tsx` | PeerSummaryProps | 34 |
| `components/portal/sammenligning/stat-comparison-row.tsx` | StatComparisonRowProps | 71 |
| `components/portal/sammenligning/v2/comparison-card.tsx` | ComparisonCardProps | 187 |
| `components/portal/sammenligning/v2/comparison-filter-bar.tsx` | ComparisonFilterBarProps | 137 |
| `components/portal/sammenligning/v2/empty-state.tsx` | EmptyStateProps | 51 |
| `components/portal/sammenligning/v2/focus-callout.tsx` | FocusCalloutProps | 77 |
| `components/portal/sammenligning/v2/percentile-hero.tsx` | PercentileHeroProps | 180 |
| `components/portal/sammenligning/v2/pyramid-card.tsx` | PyramidCardProps | 197 |
| `components/portal/sammenligning/v2/sammenligning-page-header.tsx` | SammenligningPageHeaderProps | 47 |
| `components/portal/sammenligning/v2/sammenligning-shell.tsx` | - | 21 |
| `components/portal/sammenligning/v2/section-heading.tsx` | SectionHeadingProps | 38 |
| `components/portal/social/add-friend-dialog.tsx` | AddFriendDialogProps | 219 |
| `components/portal/social/pending-requests.tsx` | PendingRequestsProps | 124 |
| `components/portal/social/v2/feed-card.tsx` | - | 142 |
| `components/portal/social/v2/friends-card.tsx` | - | 114 |
| `components/portal/social/v2/leaderboard-card.tsx` | - | 149 |
| `components/portal/social/v2/privacy-footer.tsx` | - | 23 |
| `components/portal/social/v2/sosialt-client-v2.tsx` | - | 126 |
| `components/portal/social/v2/sosialt-hero.tsx` | - | 122 |
| `components/portal/social/v2/styles.ts` | - | 19 |
| `components/portal/statistikk/combined-insights.tsx` | CombinedInsightsProps | 52 |
| `components/portal/statistikk/golf-profile-hero.tsx` | GolfProfileHeroProps | 77 |
| `components/portal/statistikk/hcp-forecast-chart.tsx` | HcpForecastChartProps | 295 |
| `components/portal/statistikk/hcp-forecast-insight.tsx` | HcpForecastInsightProps | 159 |
| `components/portal/statistikk/index.ts` | - | 11 |
| `components/portal/statistikk/score-trend-chart-impl.tsx` | ScoreTrendChartProps | 199 |
| `components/portal/statistikk/score-trend-chart.tsx` | - | 7 |
| `components/portal/statistikk/sg-breakdown-bars-impl.tsx` | SGBreakdownBarsProps | 205 |
| `components/portal/statistikk/sg-breakdown-bars.tsx` | - | 7 |
| `components/portal/statistikk/sg-radar-chart-impl.tsx` | SGRadarChartProps | 136 |
| `components/portal/statistikk/sg-radar-chart.tsx` | - | 7 |
| `components/portal/statistikk/skill-level-badge.tsx` | - | 24 |
| `components/portal/statistikk/skill-radar-impl.tsx` | SkillRadarProps | 258 |
| `components/portal/statistikk/skill-radar.tsx` | - | 7 |
| `components/portal/statistikk/statistikk-course-hero-view.tsx` | - | 191 |
| `components/portal/statistikk/training-volume-chart-impl.tsx` | TrainingVolumeChartProps | 104 |
| `components/portal/statistikk/training-volume-chart.tsx` | - | 7 |
| `components/portal/statistikk/v2/ak-pyramid-card.tsx` | AkPyramidCardProps | 289 |
| `components/portal/statistikk/v2/compare-card.tsx` | CompareCardProps | 187 |
| `components/portal/statistikk/v2/comparison-grid.tsx` | ComparisonGridProps | 258 |
| `components/portal/statistikk/v2/focus-callout.tsx` | FocusCalloutProps | 84 |
| `components/portal/statistikk/v2/hcp-trend-card.tsx` | HcpTrendCardProps | 160 |
| `components/portal/statistikk/v2/period-tabs.tsx` | PeriodTabsProps | 63 |
| `components/portal/statistikk/v2/rounds-table.tsx` | RoundsTableProps | 204 |
| `components/portal/statistikk/v2/sg-distribution-card.tsx` | SgDistributionCardProps | 172 |
| `components/portal/statistikk/v2/stats-hero-benchmark.tsx` | StatsHeroBenchmarkProps | 174 |
| `components/portal/statistikk/v2/stats-v2-client.tsx` | - | 331 |
| `components/portal/statistikk/v2/stats-v2-helpers.ts` | - | 162 |
| `components/portal/strategi/v2/course-hero.tsx` | CourseHeroProps | 213 |
| `components/portal/strategi/v2/hole-card.tsx` | - | 283 |
| `components/portal/strategi/v2/nine-toggle.tsx` | NineToggleProps | 49 |
| `components/portal/strategi/v2/strategi-ai-summary.tsx` | StrategiAiSummaryProps | 123 |
| `components/portal/strategi/v2/strategi-empty-states.tsx` | - | 106 |
| `components/portal/strategi/v2/strategi-helpers.ts` | - | 97 |
| `components/portal/strategi/v2/strategi-page-header.tsx` | StrategiPageHeaderProps | 44 |
| `components/portal/strategi/v2/strategi-section-heading.tsx` | StrategiSectionHeadingProps | 75 |
| `components/portal/strategi/v2/strategi-shell.tsx` | - | 19 |
| `components/portal/subscription/upgrade-options.tsx` | UpgradeOptionsProps | 94 |
| `components/portal/talent/v2/forecast-card.tsx` | - | 155 |
| `components/portal/talent/v2/recommended-actions.tsx` | - | 83 |
| `components/portal/talent/v2/sg-percentile-grid.tsx` | - | 72 |
| `components/portal/talent/v2/talent-empty-state.tsx` | - | 54 |
| `components/portal/talent/v2/talent-hero.tsx` | TalentHeroProps | 159 |
| `components/portal/talent/v2/talent-stats-grid.tsx` | TalentStatsGridProps | 106 |
| `components/portal/talent/v2/talent-status-client.tsx` | TalentStatusClientProps | 198 |
| `components/portal/talent/v2/tournament-results-card.tsx` | - | 109 |
| `components/portal/technical-plan/coach-myelin-overview.tsx` | CoachMyelinOverviewProps | 169 |
| `components/portal/technical-plan/index.ts` | - | 7 |
| `components/portal/technical-plan/log-progress-modal.tsx` | LogProgressModalProps | 157 |
| `components/portal/technical-plan/myelin-alert.tsx` | MyelinAlertProps | 136 |
| `components/portal/technical-plan/plan-health-auto-card.tsx` | PlanHealthAutoCardProps | 60 |
| `components/portal/technical-plan/plan-health-card.tsx` | PlanHealthCardProps | 24 |
| `components/portal/technical-plan/technical-plan-widget.tsx` | - | 119 |
| `components/portal/technical-plan/volume-dashboard.tsx` | VolumeDashboardProps | 196 |
| `components/portal/tester/v2/composite-hero.tsx` | CompositeHeroProps | 209 |
| `components/portal/tester/v2/test-leaderboard.tsx` | TestLeaderboardProps | 247 |
| `components/portal/tester/v2/test-row.tsx` | TestRowProps | 105 |
| `components/portal/tester/v2/tester-page-header.tsx` | TesterPageHeaderProps | 49 |
| `components/portal/tester/v2/tester-shell.tsx` | - | 17 |
| `components/portal/trackman-v2/filter-bar.tsx` | FilterBarProps | 128 |
| `components/portal/trackman-v2/kpi-row.tsx` | KpiRowProps | 139 |
| `components/portal/trackman-v2/shots-table.tsx` | ShotsTableProps | 212 |
| `components/portal/trackman-v2/trackman-v2-client.tsx` | - | 218 |
| `components/portal/trackman/admin-trackman-view.tsx` | AdminTrackManViewProps | 105 |
| `components/portal/trackman/club-comparison-impl.tsx` | ClubComparisonProps | 282 |
| `components/portal/trackman/club-comparison.tsx` | - | 7 |
| `components/portal/trackman/club-trend-chart.tsx` | ClubTrendChartProps | 89 |
| `components/portal/trackman/club-waveform-impl.tsx` | ClubWaveformProps | 312 |
| `components/portal/trackman/club-waveform.tsx` | - | 7 |
| `components/portal/trackman/csv-preview.tsx` | CsvPreviewProps | 122 |
| `components/portal/trackman/dispersion-plot.tsx` | DispersionPlotProps | 279 |
| `components/portal/trackman/import-match-modal.tsx` | ImportMatchModalProps | 231 |
| `components/portal/trackman/imported-sessions-list.tsx` | - | 154 |
| `components/portal/trackman/index.ts` | - | 18 |
| `components/portal/trackman/quality-badge.tsx` | QualityBadgeProps | 30 |
| `components/portal/trackman/session-matcher.tsx` | SessionMatcherProps | 51 |
| `components/portal/trackman/shot-dispersion-chart-impl.tsx` | ShotDispersionChartProps | 173 |
| `components/portal/trackman/shot-dispersion-chart.tsx` | - | 7 |
| `components/portal/trackman/trackman-analytics-card.tsx` | TrackManAnalyticsCardProps | 283 |
| `components/portal/trackman/upload-form.tsx` | UploadFormProps | 327 |
| `components/portal/trackman/upload-metadata-fields.tsx` | UploadMetadataFieldsProps | 92 |
| `components/portal/trackman/upload-status.tsx` | UploadStatusProps | 53 |
| `components/portal/trackman/v2/club-comparison-card.tsx` | ClubComparisonCardProps | 96 |
| `components/portal/trackman/v2/dispersion-card.tsx` | DispersionCardProps | 147 |
| `components/portal/trackman/v2/dispersion-illustrations.tsx` | - | 224 |
| `components/portal/trackman/v2/kpi-strip.tsx` | - | 42 |
| `components/portal/trackman/v2/lab-header.tsx` | LabHeaderProps | 71 |
| `components/portal/trackman/v2/trackman-lab-client.tsx` | TrackManLabClientProps | 168 |
| `components/portal/training/analysis-filter-bar.tsx` | AnalysisFilterBarProps | 219 |
| `components/portal/training/analysis-filter-controls.tsx` | MultiSelectProps | 250 |
| `components/portal/training/analysis-filter-types.ts` | - | 116 |
| `components/portal/training/analysis-results.tsx` | AggCardProps | 206 |
| `components/portal/training/analysis-trend-chart.tsx` | AnalysisTrendChartProps | 194 |
| `components/portal/trening/v2/category-section.tsx` | - | 58 |
| `components/portal/trening/v2/category-tabs.tsx` | - | 89 |
| `components/portal/trening/v2/drill-card.tsx` | - | 219 |
| `components/portal/trening/v2/log-session-bar.tsx` | - | 38 |
| `components/portal/trening/v2/training-client.tsx` | - | 254 |
| `components/portal/trening/v2/training-hero.tsx` | - | 142 |
| `components/portal/treningsplan-v2/day-card.tsx` | - | 83 |
| `components/portal/treningsplan-v2/session-pill.tsx` | - | 49 |
| `components/portal/treningsplan-v2/types.ts` | - | 117 |
| `components/portal/treningsplan-v2/week-strip.tsx` | - | 54 |
| `components/portal/treningsplan/ExerciseBank.tsx` | ExerciseBankProps | 376 |
| `components/portal/treningsplan/NewSessionModal.tsx` | NewSessionModalProps | 416 |
| `components/portal/treningsplan/PyramidFilter.tsx` | PyramidFilterProps | 149 |
| `components/portal/treningsplan/SessionCard.tsx` | SessionCardProps | 230 |
| `components/portal/treningsplan/SessionDetailModal.tsx` | SessionDetailModalProps | 372 |
| `components/portal/treningsplan/SidePanel.tsx` | SidePanelProps | 102 |
| `components/portal/treningsplan/StandardSessions.tsx` | StandardSessionsProps | 208 |
| `components/portal/treningsplan/WeekCalendar.tsx` | DayColumnProps | 430 |
| `components/portal/treningsplan/ak-formula-tags.tsx` | TagProps | 214 |
| `components/portal/treningsplan/exercise-card.tsx` | ExerciseCardProps | 227 |
| `components/portal/treningsplan/exercise-config-popover.tsx` | ExerciseConfigPopoverProps | 243 |
| `components/portal/treningsplan/generate-plan-button.tsx` | GeneratePlanButtonProps | 210 |
| `components/portal/treningsplan/index.ts` | - | 72 |
| `components/portal/treningsplan/manual-plan-button.tsx` | - | 29 |
| `components/portal/treningsplan/manual-plan-modal.tsx` | ManualPlanModalProps | 88 |
| `components/portal/treningsplan/plan-conversation-card.tsx` | PlanConversationCardProps | 229 |
| `components/portal/treningsplan/plan-creator-modal.tsx` | - | 352 |
| `components/portal/treningsplan/plan-suggestion-inbox.tsx` | PlanSuggestionInboxProps | 242 |
| `components/portal/treningsplan/pyramid-distribution-editor.tsx` | PyramidDistributionEditorProps | 264 |
| `components/portal/treningsplan/pyramid-indicator.tsx` | PyramidStackProps | 98 |
| `components/portal/treningsplan/session-context-menu.tsx` | - | 104 |
| `components/portal/treningsplan/session-header.tsx` | SessionHeaderProps | 263 |
| `components/portal/treningsplan/session-view.tsx` | SessionViewProps | 246 |
| `components/portal/treningsplan/types.ts` | - | 37 |
| `components/portal/treningsplan/useDragAndDrop.ts` | UseDragAndDropProps | 242 |
| `components/portal/treningsplan/v2/ak-tag.tsx` | - | 41 |
| `components/portal/treningsplan/v2/day-block.tsx` | - | 173 |
| `components/portal/treningsplan/v2/exercise-library.tsx` | - | 154 |
| `components/portal/treningsplan/v2/index.ts` | - | 20 |
| `components/portal/treningsplan/v2/mini-stats.tsx` | - | 41 |
| `components/portal/treningsplan/v2/plan-detail-hero.tsx` | - | 108 |
| `components/portal/treningsplan/v2/pyramid-actuals.tsx` | PyramidActualsProps | 147 |
| `components/portal/treningsplan/v2/section-heading.tsx` | - | 20 |
| `components/portal/treningsplan/v2/today-card.tsx` | - | 136 |
| `components/portal/treningsplan/v2/types.ts` | - | 85 |
| `components/portal/treningsplan/v2/week-note.tsx` | - | 46 |
| `components/portal/treningsplan/v2/week-strip.tsx` | - | 120 |
| `components/portal/treningsplan/v2/week-tabs.tsx` | - | 70 |
| `components/portal/turneringer/add-tournament-modal.tsx` | - | 245 |
| `components/portal/turneringer/v2/explore-list.tsx` | - | 111 |
| `components/portal/turneringer/v2/results-table.tsx` | - | 93 |
| `components/portal/turneringer/v2/styles.ts` | - | 29 |
| `components/portal/turneringer/v2/turneringer-client-v2.tsx` | - | 143 |
| `components/portal/turneringer/v2/turneringer-hero.tsx` | - | 196 |
| `components/portal/turneringer/v2/turneringer-kpi.tsx` | - | 54 |
| `components/portal/turneringer/v2/turneringer-tabs.tsx` | - | 67 |
| `components/portal/turneringer/v2/upcoming-grid.tsx` | - | 144 |
| `components/portal/ui/achievement-toast.tsx` | AchievementToastProps | 178 |
| `components/portal/ui/border-beam.tsx` | BorderBeamProps | 107 |
| `components/portal/ui/portal-button.tsx` | BaseProps | 192 |
| `components/portal/ui/portal-error.tsx` | PortalErrorProps | 120 |
| `components/portal/ui/tier-gate.tsx` | TierGateProps | 87 |
| `components/portal/ui/trial-banner.tsx` | TrialBannerProps | 124 |
| `components/portal/ui/upgrade-modal.tsx` | UpgradeModalProps | 321 |
| `components/portal/ui/usage-indicator.tsx` | UsageIndicatorProps | 128 |
| `components/portal/view-switcher.tsx` | ViewSwitcherProps | 157 |
| `components/portal/widgets/coaching-feedback-widget.tsx` | - | 78 |
| `components/portal/widgets/degradation-alert-widget.tsx` | - | 95 |
| `components/portal/widgets/index.ts` | - | 13 |
| `components/portal/widgets/leaderboard-widget.tsx` | - | 93 |
| `components/portal/widgets/mental-trends-widget.tsx` | - | 89 |
| `components/portal/widgets/module-addons-widget.tsx` | - | 83 |
| `components/portal/widgets/next-competition-widget.tsx` | - | 60 |
| `components/portal/widgets/periodisering-widget.tsx` | - | 97 |
| `components/portal/widgets/plan-progress-widget.tsx` | - | 51 |
| `components/portal/widgets/season-plan-widget.tsx` | - | 93 |
| `components/portal/widgets/training-volume-widget.tsx` | - | 79 |
| `components/portal/widgets/use-widget-data.ts` | - | 40 |
| `components/portal/widgets/widget-base.tsx` | WidgetBaseProps | 130 |
| `components/portal/widgets/widget-grid.tsx` | SortableWidgetProps | 185 |
| `components/portal/widgets/widget-renderer.tsx` | - | 45 |

## Lib/Portal
| Fil | Eksport | Beskrivelse |
|-----|---------|-------------|
| `lib/portal/access.ts` | exports=11 (372 linjer) | portal/access |
| `lib/portal/achievements/check-achievements.ts` | exports=2 (182 linjer) | achievements/check-achievements |
| `lib/portal/achievements/definitions.ts` | exports=2 (41 linjer) | achievements/definitions |
| `lib/portal/admin/dagens-fokus-actions.ts` | exports=6 (356 linjer) | admin/dagens-fokus-actions |
| `lib/portal/agents/birthday.ts` | exports=1 (74 linjer) | agents/birthday |
| `lib/portal/agents/booking-confirm.ts` | exports=1 (88 linjer) | agents/booking-confirm |
| `lib/portal/agents/cancellation.ts` | exports=1 (175 linjer) | agents/cancellation |
| `lib/portal/agents/coach-payout.ts` | exports=1 (84 linjer) | agents/coach-payout |
| `lib/portal/agents/coach-plan-agent.ts` | exports=3 (279 linjer) | agents/coach-plan-agent |
| `lib/portal/agents/degradation-flag.ts` | exports=1 (87 linjer) | agents/degradation-flag |
| `lib/portal/agents/dunning.ts` | exports=1 (108 linjer) | agents/dunning |
| `lib/portal/agents/log.ts` | exports=5 (84 linjer) | agents/log |
| `lib/portal/agents/no-show.ts` | exports=1 (60 linjer) | agents/no-show |
| `lib/portal/agents/onboarding.ts` | exports=1 (69 linjer) | agents/onboarding |
| `lib/portal/agents/park.ts` | exports=3 (158 linjer) | agents/park |
| `lib/portal/agents/payment-collect.ts` | exports=1 (122 linjer) | agents/payment-collect |
| `lib/portal/agents/runner.ts` | exports=5 (523 linjer) | agents/runner |
| `lib/portal/agents/sponsor-report.ts` | exports=1 (130 linjer) | agents/sponsor-report |
| `lib/portal/agents/test-retest-reminder.ts` | exports=1 (118 linjer) | agents/test-retest-reminder |
| `lib/portal/agents/types.ts` | exports=5 (162 linjer) | agents/types |
| `lib/portal/agents/winback.ts` | exports=1 (81 linjer) | agents/winback |
| `lib/portal/ai/coaching-summary.ts` | exports=3 (80 linjer) | ai/coaching-summary |
| `lib/portal/ai/focus-recommendation.ts` | exports=2 (98 linjer) | ai/focus-recommendation |
| `lib/portal/ai/generate-drill.ts` | exports=7 (287 linjer) | ai/generate-drill |
| `lib/portal/ai/learning-style-prompt.ts` | exports=4 (81 linjer) | ai/learning-style-prompt |
| `lib/portal/ai/next-session-orchestrator.ts` | exports=3 (191 linjer) | ai/next-session-orchestrator |
| `lib/portal/ai/prompts/trackman-insights.ts` | exports=2 (147 linjer) | prompts/trackman-insights |
| `lib/portal/ai/session-planner.ts` | exports=3 (128 linjer) | ai/session-planner |
| `lib/portal/ai/training-plan-adjustment.ts` | exports=4 (224 linjer) | ai/training-plan-adjustment |
| `lib/portal/ai/training-plan.ts` | exports=5 (154 linjer) | ai/training-plan |
| `lib/portal/ai/transcribe-audio.ts` | exports=2 (39 linjer) | ai/transcribe-audio |
| `lib/portal/ai/weakness-analysis.ts` | exports=1 (119 linjer) | ai/weakness-analysis |
| `lib/portal/ai/weekly-insights.ts` | exports=3 (141 linjer) | ai/weekly-insights |
| `lib/portal/allocation/ai-adjust.ts` | exports=3 (100 linjer) | allocation/ai-adjust |
| `lib/portal/allocation/engine.ts` | exports=6 (218 linjer) | allocation/engine |
| `lib/portal/allocation/formulas.ts` | exports=10 (86 linjer) | allocation/formulas |
| `lib/portal/allocation/recompute.ts` | exports=1 (74 linjer) | allocation/recompute |
| `lib/portal/auth.ts` | exports=10 (216 linjer) | portal/auth |
| `lib/portal/auth/age-check.ts` | exports=3 (25 linjer) | auth/age-check |
| `lib/portal/auth/parent-rbac.ts` | exports=4 (130 linjer) | auth/parent-rbac |
| `lib/portal/availability/parse-time-range.ts` | exports=2 (57 linjer) | availability/parse-time-range |
| `lib/portal/beta-test/rory-augusta-test.ts` | exports=11 (564 linjer) | beta-test/rory-augusta-test |
| `lib/portal/booking/auto-create-user.ts` | exports=2 (104 linjer) | booking/auto-create-user |
| `lib/portal/booking/available-slots-compute.ts` | exports=5 (92 linjer) | booking/available-slots-compute |
| `lib/portal/booking/available-slots.ts` | exports=3 (72 linjer) | booking/available-slots |
| `lib/portal/booking/cache.ts` | exports=6 (110 linjer) | booking/cache |
| `lib/portal/booking/cancellation-policy.ts` | exports=2 (61 linjer) | booking/cancellation-policy |
| `lib/portal/booking/conflict-check.ts` | exports=9 (264 linjer) | booking/conflict-check |
| `lib/portal/booking/index.ts` | exports=9 (55 linjer) | booking/index |
| `lib/portal/booking/locking.ts` | exports=1 (20 linjer) | booking/locking |
| `lib/portal/booking/refund-idempotency.ts` | exports=1 (19 linjer) | booking/refund-idempotency |
| `lib/portal/booking/refund-policy.ts` | exports=2 (58 linjer) | booking/refund-policy |
| `lib/portal/booking/refund.ts` | exports=3 (245 linjer) | booking/refund |
| `lib/portal/booking/reschedule.ts` | exports=1 (222 linjer) | booking/reschedule |
| `lib/portal/booking/slot-hold.ts` | exports=3 (139 linjer) | booking/slot-hold |
| `lib/portal/booking/subscription-quota.ts` | exports=12 (390 linjer) | booking/subscription-quota |
| `lib/portal/booking/validation.ts` | exports=11 (594 linjer) | booking/validation |
| `lib/portal/booking/waitlist.ts` | exports=2 (143 linjer) | booking/waitlist |
| `lib/portal/calendar/aggregator.ts` | exports=3 (150 linjer) | calendar/aggregator |
| `lib/portal/calendar/google-calendar.ts` | exports=6 (384 linjer) | calendar/google-calendar |
| `lib/portal/calendar/ical.ts` | exports=2 (107 linjer) | calendar/ical |
| `lib/portal/calendar/training-plan-sync.ts` | exports=3 (116 linjer) | calendar/training-plan-sync |
| `lib/portal/capabilities/catalog.ts` | exports=5 (357 linjer) | capabilities/catalog |
| `lib/portal/capabilities/check.ts` | exports=8 (133 linjer) | capabilities/check |
| `lib/portal/capabilities/index.ts` | exports=3 (27 linjer) | capabilities/index |
| `lib/portal/capabilities/presets.ts` | exports=6 (135 linjer) | capabilities/presets |
| `lib/portal/capabilities/sensitive-guard.ts` | exports=5 (78 linjer) | capabilities/sensitive-guard |
| `lib/portal/capabilities/types.ts` | exports=4 (36 linjer) | capabilities/types |
| `lib/portal/coaching-signals/compute.ts` | exports=4 (326 linjer) | coaching-signals/compute |
| `lib/portal/coaching-signals/index.ts` | exports=2 (14 linjer) | coaching-signals/index |
| `lib/portal/coaching-signals/types.ts` | exports=5 (39 linjer) | coaching-signals/types |
| `lib/portal/consent/service.ts` | exports=9 (206 linjer) | consent/service |
| `lib/portal/courses/geojson-actions.ts` | exports=2 (187 linjer) | courses/geojson-actions |
| `lib/portal/cowork/append-session.ts` | exports=2 (108 linjer) | cowork/append-session |
| `lib/portal/csrf.ts` | exports=1 (42 linjer) | portal/csrf |
| `lib/portal/datagolf/cache.ts` | exports=3 (72 linjer) | datagolf/cache |
| `lib/portal/datagolf/client.ts` | exports=36 (530 linjer) | datagolf/client |
| `lib/portal/datagolf/player-benchmark.ts` | exports=3 (97 linjer) | datagolf/player-benchmark |
| `lib/portal/datagolf/pro-challenge.ts` | exports=11 (597 linjer) | datagolf/pro-challenge |
| `lib/portal/datagolf/tour-benchmarks.ts` | exports=6 (107 linjer) | datagolf/tour-benchmarks |
| `lib/portal/economy/student-metrics.ts` | exports=3 (100 linjer) | economy/student-metrics |
| `lib/portal/email/resend.ts` | exports=2 (13 linjer) | email/resend |
| `lib/portal/email/send-booking-email.ts` | exports=3 (291 linjer) | email/send-booking-email |
| `lib/portal/email/send-monthly-reset-email.ts` | exports=1 (53 linjer) | email/send-monthly-reset-email |
| `lib/portal/email/send-welcome-email.ts` | exports=1 (59 linjer) | email/send-welcome-email |
| `lib/portal/email/templates/abandoned-checkout.tsx` | exports=2 (191 linjer) | templates/abandoned-checkout |
| `lib/portal/email/templates/booking-cancelled.tsx` | exports=1 (160 linjer) | templates/booking-cancelled |
| `lib/portal/email/templates/booking-confirmed.tsx` | exports=1 (158 linjer) | templates/booking-confirmed |
| `lib/portal/email/templates/booking-reminder.tsx` | exports=1 (162 linjer) | templates/booking-reminder |
| `lib/portal/email/templates/instructor-new-booking.tsx` | exports=1 (124 linjer) | templates/instructor-new-booking |
| `lib/portal/email/templates/monthly-reset-notification.tsx` | exports=1 (166 linjer) | templates/monthly-reset-notification |
| `lib/portal/email/templates/waitlist-available.tsx` | exports=1 (164 linjer) | templates/waitlist-available |
| `lib/portal/email/templates/weekly-summary.tsx` | exports=1 (219 linjer) | templates/weekly-summary |
| `lib/portal/email/templates/welcome-day0.tsx` | exports=1 (165 linjer) | templates/welcome-day0 |
| `lib/portal/email/templates/welcome-day1.tsx` | exports=1 (212 linjer) | templates/welcome-day1 |
| `lib/portal/email/templates/welcome-day3.tsx` | exports=1 (213 linjer) | templates/welcome-day3 |
| `lib/portal/email/templates/welcome-new-user.tsx` | exports=1 (218 linjer) | templates/welcome-new-user |
| `lib/portal/email/templates/win-back-day14.tsx` | exports=1 (183 linjer) | templates/win-back-day14 |
| `lib/portal/email/templates/win-back-day3.tsx` | exports=1 (142 linjer) | templates/win-back-day3 |
| `lib/portal/email/templates/win-back-day7.tsx` | exports=1 (169 linjer) | templates/win-back-day7 |
| `lib/portal/export/csv-stats.ts` | exports=1 (55 linjer) | export/csv-stats |
| `lib/portal/facility/conflict-check.ts` | exports=4 (128 linjer) | facility/conflict-check |
| `lib/portal/facility/defaults.ts` | exports=4 (97 linjer) | facility/defaults |
| `lib/portal/feature-flags.ts` | exports=2 (27 linjer) | portal/feature-flags |
| `lib/portal/forecast/long-term.ts` | exports=2 (94 linjer) | forecast/long-term |
| `lib/portal/forecast/talent-insights.ts` | exports=2 (98 linjer) | forecast/talent-insights |
| `lib/portal/golf/ak-formula.ts` | exports=26 (576 linjer) | golf/ak-formula |
| `lib/portal/golf/benchmarks.ts` | exports=4 (57 linjer) | golf/benchmarks |
| `lib/portal/golf/calculate-sg-from-rounds.ts` | exports=14 (429 linjer) | golf/calculate-sg-from-rounds |
| `lib/portal/golf/clubspeed-benchmarks.ts` | exports=3 (48 linjer) | golf/clubspeed-benchmarks |
| `lib/portal/golf/clubspeed-resolver.ts` | exports=3 (86 linjer) | golf/clubspeed-resolver |
| `lib/portal/golf/decade-caddy.ts` | exports=9 (373 linjer) | golf/decade-caddy |
| `lib/portal/golf/decade-strategy.ts` | exports=3 (128 linjer) | golf/decade-strategy |
| `lib/portal/golf/dispersion.ts` | exports=4 (133 linjer) | golf/dispersion |
| `lib/portal/golf/distance-buckets.ts` | exports=3 (77 linjer) | golf/distance-buckets |
| `lib/portal/golf/exercise-types.ts` | exports=8 (189 linjer) | golf/exercise-types |
| `lib/portal/golf/expected-strokes.ts` | exports=3 (82 linjer) | golf/expected-strokes |
| `lib/portal/golf/golfbox-importer.ts` | exports=3 (19 linjer) | golf/golfbox-importer |
| `lib/portal/golf/golfbox/handicap.ts` | exports=7 (117 linjer) | golfbox/handicap |
| `lib/portal/golf/gps/distance-calculator.ts` | exports=3 (97 linjer) | gps/distance-calculator |
| `lib/portal/golf/scorecard-photo-parser.ts` | exports=2 (14 linjer) | golf/scorecard-photo-parser |
| `lib/portal/golf/sg-benchmarks.ts` | exports=8 (164 linjer) | golf/sg-benchmarks |
| `lib/portal/golf/sg-calculator.ts` | exports=6 (139 linjer) | golf/sg-calculator |
| `lib/portal/golf/sg-to-handicap.ts` | exports=4 (219 linjer) | golf/sg-to-handicap |
| `lib/portal/golf/skill-levels.ts` | exports=6 (219 linjer) | golf/skill-levels |
| `lib/portal/golf/trackman-parser.ts` | exports=5 (262 linjer) | golf/trackman-parser |
| `lib/portal/golf/training-areas.ts` | exports=6 (71 linjer) | golf/training-areas |
| `lib/portal/golf/units.ts` | exports=19 (294 linjer) | golf/units |
| `lib/portal/google-calendar/sync.ts` | exports=7 (614 linjer) | google-calendar/sync |
| `lib/portal/google-calendar/webhook.ts` | exports=4 (333 linjer) | google-calendar/webhook |
| `lib/portal/health/rehab-protocols.ts` | exports=6 (139 linjer) | health/rehab-protocols |
| `lib/portal/invoice.ts` | exports=4 (197 linjer) | portal/invoice |
| `lib/portal/kartlegging/coach-access.ts` | exports=6 (129 linjer) | kartlegging/coach-access |
| `lib/portal/kartlegging/index.ts` | exports=6 (21 linjer) | kartlegging/index |
| `lib/portal/kartlegging/profile.ts` | exports=2 (223 linjer) | kartlegging/profile |
| `lib/portal/kartlegging/test-history.ts` | exports=1 (61 linjer) | kartlegging/test-history |
| `lib/portal/kartlegging/training-index.ts` | exports=1 (118 linjer) | kartlegging/training-index |
| `lib/portal/kartlegging/types.ts` | exports=7 (77 linjer) | kartlegging/types |
| `lib/portal/library/generator.ts` | exports=1 (144 linjer) | library/generator |
| `lib/portal/library/prompts.ts` | exports=2 (113 linjer) | library/prompts |
| `lib/portal/library/queries.ts` | exports=6 (104 linjer) | library/queries |
| `lib/portal/library/types.ts` | exports=8 (80 linjer) | library/types |
| `lib/portal/notifications.ts` | exports=2 (52 linjer) | portal/notifications |
| `lib/portal/notifications/create.ts` | exports=7 (375 linjer) | notifications/create |
| `lib/portal/notifications/index.ts` | exports=3 (41 linjer) | notifications/index |
| `lib/portal/notifications/triggers.ts` | exports=17 (734 linjer) | notifications/triggers |
| `lib/portal/notifications/types.ts` | exports=18 (190 linjer) | notifications/types |
| `lib/portal/notion/client.ts` | exports=3 (75 linjer) | notion/client |
| `lib/portal/notion/content-sync.ts` | exports=2 (333 linjer) | notion/content-sync |
| `lib/portal/notion/drill-sync.ts` | exports=2 (194 linjer) | notion/drill-sync |
| `lib/portal/notion/player-profiles.ts` | exports=2 (151 linjer) | notion/player-profiles |
| `lib/portal/notion/task-sync.ts` | exports=3 (114 linjer) | notion/task-sync |
| `lib/portal/notion/training-plan-sync.ts` | exports=1 (329 linjer) | notion/training-plan-sync |
| `lib/portal/page-tabs-config.ts` | exports=5 (130 linjer) | portal/page-tabs-config |
| `lib/portal/parent/relations.ts` | exports=8 (159 linjer) | parent/relations |
| `lib/portal/payout/calculator.ts` | exports=3 (121 linjer) | payout/calculator |
| `lib/portal/playerhq-access.ts` | exports=4 (102 linjer) | portal/playerhq-access |
| `lib/portal/predictions/coaching-forecast-service.ts` | exports=7 (253 linjer) | predictions/coaching-forecast-service |
| `lib/portal/predictions/generate-coaching-forecast.ts` | exports=9 (522 linjer) | predictions/generate-coaching-forecast |
| `lib/portal/predictions/hours-per-sg-table.ts` | exports=16 (214 linjer) | predictions/hours-per-sg-table |
| `lib/portal/preferences/actions.ts` | exports=6 (170 linjer) | preferences/actions |
| `lib/portal/prisma.ts` | exports=1 (41 linjer) | portal/prisma |
| `lib/portal/pro-challenge/pro-players-config.ts` | exports=17 (802 linjer) | pro-challenge/pro-players-config |
| `lib/portal/rate-limit.ts` | exports=5 (106 linjer) | portal/rate-limit |
| `lib/portal/rbac.ts` | exports=9 (117 linjer) | portal/rbac |
| `lib/portal/round/club-suggester.ts` | exports=2 (65 linjer) | round/club-suggester |
| `lib/portal/round/lie-detection.ts` | exports=3 (63 linjer) | round/lie-detection |
| `lib/portal/round/live-actions.ts` | exports=2 (71 linjer) | round/live-actions |
| `lib/portal/round/map-shot-actions.ts` | exports=1 (26 linjer) | round/map-shot-actions |
| `lib/portal/round/shot-actions.ts` | exports=3 (325 linjer) | round/shot-actions |
| `lib/portal/round/shot-types.ts` | exports=1 (16 linjer) | round/shot-types |
| `lib/portal/sammenligning/actions.ts` | exports=6 (216 linjer) | sammenligning/actions |
| `lib/portal/slots.ts` | exports=7 (417 linjer) | portal/slots |
| `lib/portal/sms/send-booking-sms.ts` | exports=3 (121 linjer) | sms/send-booking-sms |
| `lib/portal/sms/send-reminder-sms.ts` | exports=1 (39 linjer) | sms/send-reminder-sms |
| `lib/portal/sms/twilio.ts` | exports=1 (57 linjer) | sms/twilio |
| `lib/portal/sponsor/data.ts` | exports=4 (55 linjer) | sponsor/data |
| `lib/portal/stripe.ts` | exports=2 (24 linjer) | portal/stripe |
| `lib/portal/stripe/catalog.ts` | exports=5 (110 linjer) | stripe/catalog |
| `lib/portal/stripe/invoice.ts` | exports=2 (135 linjer) | stripe/invoice |
| `lib/portal/stripe/off-session.ts` | exports=2 (146 linjer) | stripe/off-session |
| `lib/portal/stripe/payment-link.ts` | exports=3 (88 linjer) | stripe/payment-link |
| `lib/portal/strokes-gained/expected-strokes.ts` | exports=5 (171 linjer) | strokes-gained/expected-strokes |
| `lib/portal/sync/hooks/index.ts` | exports=1 (15 linjer) | hooks/index |
| `lib/portal/sync/hooks/useBookings.ts` | exports=7 (284 linjer) | hooks/useBookings |
| `lib/portal/sync/index.ts` | exports=7 (76 linjer) | sync/index |
| `lib/portal/sync/optimistic.ts` | exports=14 (346 linjer) | sync/optimistic |
| `lib/portal/sync/query-client.ts` | exports=2 (83 linjer) | sync/query-client |
| `lib/portal/sync/query-keys.ts` | exports=4 (183 linjer) | sync/query-keys |
| `lib/portal/sync/server.ts` | exports=16 (491 linjer) | sync/server |
| `lib/portal/sync/sync-store.ts` | exports=1 (55 linjer) | sync/sync-store |
| `lib/portal/sync/types.ts` | exports=26 (300 linjer) | sync/types |
| `lib/portal/sync/useSync.ts` | exports=3 (476 linjer) | sync/useSync |
| `lib/portal/technical-plan/service.ts` | exports=21 (494 linjer) | technical-plan/service |
| `lib/portal/technical-plan/types.ts` | exports=10 (72 linjer) | technical-plan/types |
| `lib/portal/tests/calculate.ts` | exports=2 (263 linjer) | tests/calculate |
| `lib/portal/tests/category-requirements.ts` | exports=7 (156 linjer) | tests/category-requirements |
| `lib/portal/tests/test-battery.ts` | exports=11 (139 linjer) | tests/test-battery |
| `lib/portal/tests/test-exercise-bridge.ts` | exports=2 (43 linjer) | tests/test-exercise-bridge |
| `lib/portal/tests/validation.ts` | exports=5 (137 linjer) | tests/validation |
| `lib/portal/tier-utils.ts` | exports=5 (94 linjer) | portal/tier-utils |
| `lib/portal/timezone.ts` | exports=5 (65 linjer) | portal/timezone |
| `lib/portal/trackman/aggregate.ts` | exports=5 (162 linjer) | trackman/aggregate |
| `lib/portal/trackman/ai-insights.ts` | exports=2 (251 linjer) | trackman/ai-insights |
| `lib/portal/trackman/import-service.ts` | exports=3 (465 linjer) | trackman/import-service |
| `lib/portal/trackman/plan-matcher.ts` | exports=4 (181 linjer) | trackman/plan-matcher |
| `lib/portal/trackman/quality-engine.ts` | exports=5 (242 linjer) | trackman/quality-engine |
| `lib/portal/trackman/session-analytics.ts` | exports=3 (242 linjer) | trackman/session-analytics |
| `lib/portal/trackman/upload-actions.ts` | exports=10 (283 linjer) | trackman/upload-actions |
| `lib/portal/trackman/vision-parser.ts` | exports=3 (126 linjer) | trackman/vision-parser |
| `lib/portal/training-research/constants.ts` | exports=17 (192 linjer) | training-research/constants |
| `lib/portal/training-research/myelin-decay.ts` | exports=5 (138 linjer) | training-research/myelin-decay |
| `lib/portal/training-research/volume-engine.ts` | exports=6 (151 linjer) | training-research/volume-engine |
| `lib/portal/training/ak-taxonomy.ts` | exports=30 (301 linjer) | training/ak-taxonomy |
| `lib/portal/training/analysis-actions.ts` | exports=7 (274 linjer) | training/analysis-actions |
| `lib/portal/training/conflict-detector.ts` | exports=4 (155 linjer) | training/conflict-detector |
| `lib/portal/training/degradation-service.ts` | exports=8 (387 linjer) | training/degradation-service |
| `lib/portal/training/exercise-actions.ts` | exports=6 (283 linjer) | training/exercise-actions |
| `lib/portal/training/l-phase-service.ts` | exports=6 (110 linjer) | training/l-phase-service |
| `lib/portal/training/l-phase-types.ts` | exports=4 (18 linjer) | training/l-phase-types |
| `lib/portal/training/pdf-export.tsx` | exports=3 (308 linjer) | training/pdf-export |
| `lib/portal/training/plan-access.ts` | exports=5 (51 linjer) | training/plan-access |
| `lib/portal/training/plan-generator.ts` | exports=2 (277 linjer) | training/plan-generator |
| `lib/portal/training/plan-suggestion-service.ts` | exports=4 (157 linjer) | training/plan-suggestion-service |
| `lib/portal/training/plan-suggestion-types.ts` | exports=8 (78 linjer) | training/plan-suggestion-types |
| `lib/portal/training/session-exercise-types.ts` | exports=6 (169 linjer) | training/session-exercise-types |
| `lib/portal/training/standard-templates.ts` | exports=6 (147 linjer) | training/standard-templates |
| `lib/portal/training/template-service.ts` | exports=4 (116 linjer) | training/template-service |
| `lib/portal/training/test-scheduler.ts` | exports=5 (61 linjer) | training/test-scheduler |
| `lib/portal/usi/actions.ts` | exports=3 (144 linjer) | usi/actions |
| `lib/portal/usi/compute-usi.ts` | exports=2 (455 linjer) | usi/compute-usi |
| `lib/portal/usi/gap-analysis.ts` | exports=3 (143 linjer) | usi/gap-analysis |
| `lib/portal/usi/generate-prescription.ts` | exports=2 (124 linjer) | usi/generate-prescription |
| `lib/portal/usi/kalman-filter.ts` | exports=4 (104 linjer) | usi/kalman-filter |
| `lib/portal/usi/ml-dataset.ts` | exports=2 (160 linjer) | usi/ml-dataset |
| `lib/portal/usi/predict-sg-onnx.ts` | exports=4 (144 linjer) | usi/predict-sg-onnx |
| `lib/portal/utils.ts` | exports=1 (6 linjer) | portal/utils |
| `lib/portal/utils/cn.ts` | exports=1 (6 linjer) | utils/cn |
| `lib/portal/views/registry.ts` | exports=9 (516 linjer) | views/registry |
| `lib/portal/widgets/actions.ts` | exports=19 (554 linjer) | widgets/actions |
| `lib/portal/widgets/registry.ts` | exports=7 (149 linjer) | widgets/registry |

## Prisma-modeller (portal-relevante)
| Modell | Brukt av |
|--------|----------|
| agent | lib/portal/agents/log.ts |
| agentLog | lib/portal/agents/log.ts |
| appBundle | app/portal/(dashboard)/apper/actions.ts |
| appModule | app/portal/(dashboard)/apper/actions.ts |
| appSubscription | app/portal/(dashboard)/apper/actions.ts |
| blockedTime | lib/portal/booking/available-slots.ts |
| booking | app/portal/(dashboard)/dashboard-actions.ts, app/portal/(dashboard)/foreldre/page.tsx, app/portal/(dashboard)/foreldre/[childId]/trening/page.tsx, app/portal/(dashboard)/foreldre/[childId]/betalinger/page.tsx, app/portal/(dashboard)/bookinger/[id]/page.tsx, lib/portal/admin/dagens-fokus-actions.ts, lib/portal/agents/no-show.ts, lib/portal/agents/payment-collect.ts … (21 totalt) |
| calendarEvent | lib/portal/calendar/aggregator.ts |
| challenge | app/portal/(dashboard)/spill/actions.ts |
| clubDispersionData | lib/portal/golf/decade-strategy.ts, lib/portal/trackman/session-analytics.ts, lib/portal/trackman/import-service.ts, lib/portal/usi/compute-usi.ts |
| clubInBag | lib/portal/round/club-suggester.ts |
| clubSpeedProfile | lib/portal/golf/clubspeed-resolver.ts |
| coachAgentSession | lib/portal/agents/coach-plan-agent.ts |
| coachPlayerRelation | app/portal/(dashboard)/profil/page.tsx, lib/portal/coaching-signals/compute.ts, lib/portal/kartlegging/coach-access.ts, lib/portal/agents/runner.ts |
| coachingForecast | lib/portal/forecast/talent-insights.ts, lib/portal/forecast/long-term.ts, lib/portal/predictions/coaching-forecast-service.ts |
| coachingSession | lib/portal/agents/runner.ts, lib/portal/ai/next-session-orchestrator.ts, lib/portal/widgets/actions.ts |
| consentGrant | lib/portal/consent/service.ts |
| conversation | app/portal/(dashboard)/meldinger/actions.ts |
| course | app/portal/(dashboard)/spill/actions.ts, lib/portal/golf/decade-strategy.ts, lib/portal/courses/geojson-actions.ts |
| customerPaymentPreference | lib/portal/agents/payment-collect.ts, lib/portal/stripe/invoice.ts |
| dataAccessLog | lib/portal/consent/service.ts |
| dataGolfCache | lib/portal/sammenligning/actions.ts, lib/portal/datagolf/cache.ts, lib/portal/datagolf/player-benchmark.ts |
| degradationTracking | lib/portal/admin/dagens-fokus-actions.ts, lib/portal/agents/degradation-flag.ts, lib/portal/agents/runner.ts, lib/portal/widgets/actions.ts |
| dismissedAdjustment | app/portal/(dashboard)/treningsplan/actions.ts |
| exerciseDefinition | app/portal/(dashboard)/trening/ovelser/page.tsx, lib/portal/training/exercise-actions.ts, lib/portal/training/plan-generator.ts, lib/portal/training/analysis-actions.ts, lib/portal/golf/clubspeed-resolver.ts |
| facility | app/portal/(dashboard)/treningsplan/actions.ts |
| gamePlayer | app/portal/(dashboard)/spill/actions.ts |
| gameSession | app/portal/(dashboard)/spill/actions.ts |
| handicapEntry | app/portal/(dashboard)/statistikk/actions.ts, app/portal/(dashboard)/talent/actions.ts, lib/portal/kartlegging/profile.ts, lib/portal/ai/next-session-orchestrator.ts, lib/portal/agents/coach-plan-agent.ts, lib/portal/sammenligning/actions.ts |
| hole | lib/portal/courses/geojson-actions.ts |
| instructor | lib/portal/agents/runner.ts, lib/portal/google-calendar/webhook.ts |
| instructorAvailability | lib/portal/booking/available-slots.ts |
| libraryItem | lib/portal/library/generator.ts, lib/portal/library/queries.ts |
| mentalProfile | lib/portal/widgets/actions.ts |
| mentalScorecardEntry | lib/portal/usi/compute-usi.ts, lib/portal/widgets/actions.ts |
| message | app/portal/(dashboard)/meldinger/actions.ts |
| metricSnapshot | lib/portal/agents/degradation-flag.ts, lib/portal/agents/runner.ts, lib/portal/trackman/session-analytics.ts, lib/portal/trackman/import-service.ts |
| notification | lib/portal/agents/winback.ts, lib/portal/agents/coach-payout.ts, lib/portal/agents/onboarding.ts, lib/portal/agents/test-retest-reminder.ts, lib/portal/agents/booking-confirm.ts, lib/portal/agents/sponsor-report.ts, lib/portal/agents/runner.ts, lib/portal/agents/birthday.ts … (9 totalt) |
| parentChildRelation | lib/portal/parent/relations.ts |
| parentLink | lib/portal/auth/parent-rbac.ts |
| paymentTransaction | lib/portal/admin/dagens-fokus-actions.ts, lib/portal/agents/cancellation.ts, lib/portal/agents/dunning.ts, lib/portal/economy/student-metrics.ts, lib/portal/stripe/off-session.ts, lib/portal/stripe/invoice.ts |
| periodizationPeriod | lib/portal/widgets/actions.ts |
| planSuggestion | app/portal/(dashboard)/treningsplan/actions.ts, lib/portal/training/plan-suggestion-service.ts |
| playerAllocation | lib/portal/training/plan-generator.ts, lib/portal/allocation/recompute.ts, lib/portal/allocation/ai-adjust.ts |
| playerBag | app/portal/(dashboard)/trackman/last-opp/page.tsx |
| playerGoals | app/portal/(dashboard)/treningsplan/actions.ts, lib/portal/ai/next-session-orchestrator.ts |
| playerMetrics | app/portal/(dashboard)/treningsplan/actions.ts, lib/portal/trackman/session-analytics.ts, lib/portal/trackman/import-service.ts |
| playerTournamentPlan | app/portal/(dashboard)/foreldre/page.tsx, app/portal/(dashboard)/foreldre/[childId]/turneringer/page.tsx |
| round | app/portal/(dashboard)/runde/[id]/kart/page.tsx |
| roundStats | app/portal/(dashboard)/dashboard-actions.ts, app/portal/(dashboard)/statistikk/actions.ts, app/portal/(dashboard)/profil/page.tsx, lib/portal/kartlegging/profile.ts, lib/portal/admin/dagens-fokus-actions.ts, lib/portal/sammenligning/actions.ts, lib/portal/predictions/coaching-forecast-service.ts, lib/portal/usi/compute-usi.ts … (9 totalt) |
| serviceType | lib/portal/agents/coach-plan-agent.ts |
| sponsor | lib/portal/agents/sponsor-report.ts |
| talentPlayer | app/portal/(dashboard)/talent/actions.ts |
| talentScore | lib/portal/agents/coach-plan-agent.ts |
| testDefinition | app/portal/(dashboard)/treningsplan/actions.ts, app/portal/(dashboard)/tester/[testNumber]/page.tsx, app/portal/(dashboard)/tester/[testNumber]/actions.ts, app/portal/(dashboard)/tester/[testNumber]/resultat/page.tsx, lib/portal/agents/test-retest-reminder.ts, lib/portal/kartlegging/test-history.ts |
| testResult | app/portal/(dashboard)/dashboard-actions.ts, app/portal/(dashboard)/kartlegging/actions.ts, app/portal/(dashboard)/tester/[testNumber]/actions.ts, app/portal/(dashboard)/tester/[testNumber]/resultat/page.tsx, lib/portal/coaching-signals/compute.ts, lib/portal/kartlegging/test-history.ts, lib/portal/agents/test-retest-reminder.ts, lib/portal/agents/runner.ts |
| tournament | app/portal/(dashboard)/turneringsplan/actions.ts, lib/portal/coaching-signals/compute.ts |
| tournamentPrep | lib/portal/widgets/actions.ts |
| tournamentRegistration | lib/portal/calendar/aggregator.ts |
| trackManImport | lib/portal/trackman/import-service.ts |
| trackManSessionAnalytics | app/portal/(dashboard)/trackman/actions.ts, lib/portal/trackman/upload-actions.ts, lib/portal/trackman/ai-insights.ts, lib/portal/trackman/session-analytics.ts, lib/portal/trackman/import-service.ts |
| trackManShotData | app/portal/(dashboard)/trackman/actions.ts, app/portal/(dashboard)/trackman/[club]/page.tsx, app/portal/(dashboard)/statistikk/actions.ts, lib/portal/trackman/upload-actions.ts, lib/portal/trackman/aggregate.ts, lib/portal/trackman/session-analytics.ts, lib/portal/trackman/import-service.ts, lib/portal/usi/compute-usi.ts … (9 totalt) |
| trackmanSession | lib/portal/ai/next-session-orchestrator.ts, lib/portal/trackman/upload-actions.ts |
| trainingLog | app/portal/(dashboard)/dashboard-actions.ts, app/portal/(dashboard)/kartlegging/actions.ts, app/portal/(dashboard)/statistikk/actions.ts, lib/portal/kartlegging/training-index.ts, lib/portal/ai/training-plan-adjustment.ts, lib/portal/ai/next-session-orchestrator.ts, lib/portal/training/analysis-actions.ts, lib/portal/trackman/ai-insights.ts … (10 totalt) |
| trainingPlan | app/portal/(dashboard)/dashboard-actions.ts, app/portal/(dashboard)/foreldre/[childId]/trening/page.tsx, app/portal/(dashboard)/treningsplan/overview-helpers.ts, app/portal/(dashboard)/treningsplan/actions.ts, lib/portal/ai/training-plan-adjustment.ts, lib/portal/agents/coach-plan-agent.ts, lib/portal/training/plan-generator.ts, lib/portal/trackman/ai-insights.ts … (9 totalt) |
| trainingPlanSession | app/portal/(dashboard)/kartlegging/actions.ts, app/portal/(dashboard)/treningsplan/actions.ts, lib/portal/kartlegging/training-index.ts, lib/portal/agents/coach-plan-agent.ts, lib/portal/training/conflict-detector.ts, lib/portal/training/plan-generator.ts, lib/portal/training/plan-suggestion-service.ts, lib/portal/calendar/aggregator.ts … (9 totalt) |
| trainingPlanTemplate | lib/portal/training/template-service.ts |
| trainingPlanWeek | app/portal/(dashboard)/treningsplan/actions.ts, lib/portal/training/plan-generator.ts |
| trainingPrescription | app/portal/(dashboard)/treningsplan/actions.ts, lib/portal/ai/training-plan-adjustment.ts, lib/portal/usi/actions.ts |
| unifiedSkillIndex | app/portal/(dashboard)/kartlegging/actions.ts, lib/portal/coaching-signals/compute.ts, lib/portal/kartlegging/training-index.ts, lib/portal/kartlegging/profile.ts, lib/portal/agents/coach-plan-agent.ts, lib/portal/usi/actions.ts |
| unifiedSkillSnapshot | app/portal/(dashboard)/statistikk/actions.ts, app/portal/(dashboard)/tester/[testNumber]/actions.ts, lib/portal/coaching-signals/compute.ts, lib/portal/usi/compute-usi.ts |
| user | app/portal/(dashboard)/kartlegging/actions.ts, app/portal/(dashboard)/foreldre/[childId]/layout.tsx, app/portal/(dashboard)/treningsplan/actions.ts, app/portal/(dashboard)/treningsplan/overview-helpers.ts, lib/portal/coaching-signals/compute.ts, lib/portal/kartlegging/coach-access.ts, lib/portal/kartlegging/profile.ts, lib/portal/parent/relations.ts … (24 totalt) |
| userExerciseBank | lib/portal/training/exercise-actions.ts |
| userPreferences | app/portal/(dashboard)/onboarding/actions.ts, lib/portal/preferences/actions.ts |
| userSubscription | lib/portal/stripe/off-session.ts |
| waitlistEntry | app/portal/(dashboard)/bookinger/venteliste/page.tsx, app/portal/(dashboard)/bookinger/venteliste/actions.ts |

## Splitting-kandidater (>300 linjer)
| Fil | Linjer | Foreslått splitting |
|-----|--------|---------------------|
| app/portal/(dashboard)/treningsplan/actions.ts | 2482 | Splitt per domene (CRUD pr. modell i egne filer) |
| app/portal/(dashboard)/treningsplan/treningsplan-planner.tsx | 1865 | Vurder å splitte i mindre moduler/sub-komponenter |
| app/portal/(dashboard)/dashboard-actions.ts | 1036 | Trekk ut typer og helpers til separate filer |
| app/portal/(dashboard)/benchmark/benchmark-client.tsx | 961 | Trekk ut sub-komponenter og hooks til egne filer |
| app/portal/(dashboard)/turneringer/turneringer-client.tsx | 944 | Trekk ut sub-komponenter og hooks til egne filer |
| app/portal/(dashboard)/trackman/trackman-client.tsx | 858 | Trekk ut sub-komponenter og hooks til egne filer |
| lib/portal/pro-challenge/pro-players-config.ts | 802 | Trekk ut typer og helpers til separate filer |
| lib/portal/notifications/triggers.ts | 734 | Trekk ut typer og helpers til separate filer |
| app/portal/(dashboard)/dashboard-views/athletic-grid-view.tsx | 688 | Vurder å splitte i mindre moduler/sub-komponenter |
| app/portal/(dashboard)/spill/spill-client.tsx | 676 | Trekk ut sub-komponenter og hooks til egne filer |
| app/portal/(dashboard)/statistikk/actions.ts | 629 | Splitt per domene (CRUD pr. modell i egne filer) |
| lib/portal/google-calendar/sync.ts | 614 | Trekk ut typer og helpers til separate filer |
| lib/portal/datagolf/pro-challenge.ts | 597 | Trekk ut typer og helpers til separate filer |
| lib/portal/booking/validation.ts | 594 | Trekk ut typer og helpers til separate filer |
| lib/portal/golf/ak-formula.ts | 576 | Trekk ut typer og helpers til separate filer |
| app/portal/(dashboard)/bookinger/ny/book-coaching-form.tsx | 569 | Vurder å splitte i mindre moduler/sub-komponenter |
| lib/portal/beta-test/rory-augusta-test.ts | 564 | Trekk ut typer og helpers til separate filer |
| app/portal/(dashboard)/runde/[id]/live-round-client.tsx | 559 | Trekk ut sub-komponenter og hooks til egne filer |
| lib/portal/widgets/actions.ts | 554 | Splitt per domene (CRUD pr. modell i egne filer) |
| app/portal/(dashboard)/dagbok/actions.ts | 553 | Splitt per domene (CRUD pr. modell i egne filer) |
| app/portal/(dashboard)/apper/apper-client.tsx | 535 | Trekk ut sub-komponenter og hooks til egne filer |
| lib/portal/datagolf/client.ts | 530 | Trekk ut typer og helpers til separate filer |
| lib/portal/agents/runner.ts | 523 | Trekk ut typer og helpers til separate filer |
| lib/portal/predictions/generate-coaching-forecast.ts | 522 | Trekk ut typer og helpers til separate filer |
| lib/portal/views/registry.ts | 516 | Trekk ut typer og helpers til separate filer |
| app/portal/(dashboard)/talent/talent-leaderboard.tsx | 500 | Vurder å splitte i mindre moduler/sub-komponenter |
| app/portal/(dashboard)/treningsplan/treningsplan-v3-client.tsx | 498 | Trekk ut sub-komponenter og hooks til egne filer |
| app/portal/(dashboard)/sosialt/actions.ts | 498 | Splitt per domene (CRUD pr. modell i egne filer) |
| lib/portal/technical-plan/service.ts | 494 | Trekk ut typer og helpers til separate filer |
| components/portal/beta-test/RoryAugustaResult.tsx | 492 | Vurder å splitte i mindre moduler/sub-komponenter |
| lib/portal/sync/server.ts | 491 | Trekk ut typer og helpers til separate filer |
| app/portal/(dashboard)/talent/[playerId]/player-profile.tsx | 478 | Vurder å splitte i mindre moduler/sub-komponenter |
| lib/portal/sync/useSync.ts | 476 | Trekk ut typer og helpers til separate filer |
| lib/portal/trackman/import-service.ts | 465 | Trekk ut typer og helpers til separate filer |
| app/portal/(dashboard)/min-plan/min-plan-client.tsx | 464 | Trekk ut sub-komponenter og hooks til egne filer |
| app/portal/(dashboard)/analyse/page.tsx | 456 | Vurder å splitte i mindre moduler/sub-komponenter |
| lib/portal/usi/compute-usi.ts | 455 | Trekk ut typer og helpers til separate filer |
| app/portal/(dashboard)/analyse/actions.ts | 455 | Splitt per domene (CRUD pr. modell i egne filer) |
| app/portal/(dashboard)/timeplan/timeplan-client.tsx | 454 | Trekk ut sub-komponenter og hooks til egne filer |
| app/portal/(dashboard)/talent/actions.ts | 444 | Splitt per domene (CRUD pr. modell i egne filer) |
| components/portal/treningsplan/WeekCalendar.tsx | 430 | Vurder å splitte i mindre moduler/sub-komponenter |
| lib/portal/golf/calculate-sg-from-rounds.ts | 429 | Trekk ut typer og helpers til separate filer |
| lib/portal/slots.ts | 417 | Trekk ut typer og helpers til separate filer |
| components/portal/treningsplan/NewSessionModal.tsx | 416 | Vurder å splitte i mindre moduler/sub-komponenter |
| app/portal/(dashboard)/trackman/actions.ts | 413 | Splitt per domene (CRUD pr. modell i egne filer) |
| app/portal/(dashboard)/mental/[roundId]/page.tsx | 411 | Vurder å splitte i mindre moduler/sub-komponenter |
| components/portal/layout/notification-bell.tsx | 403 | Vurder å splitte i mindre moduler/sub-komponenter |
| app/portal/(dashboard)/turneringsplan/turneringsplan-client.tsx | 399 | Trekk ut sub-komponenter og hooks til egne filer |
| app/portal/(dashboard)/teknisk-plan/technical-plan-player-client.tsx | 398 | Trekk ut sub-komponenter og hooks til egne filer |
| lib/portal/booking/subscription-quota.ts | 390 | Trekk ut typer og helpers til separate filer |
| components/portal/sammenligning/comparison-selector.tsx | 390 | Vurder å splitte i mindre moduler/sub-komponenter |
| lib/portal/training/degradation-service.ts | 387 | Trekk ut typer og helpers til separate filer |
| components/portal/runde/live-round-client.tsx | 385 | Trekk ut sub-komponenter og hooks til egne filer |
| app/portal/(dashboard)/abonnement/abonnement-client.tsx | 385 | Trekk ut sub-komponenter og hooks til egne filer |
| lib/portal/calendar/google-calendar.ts | 384 | Trekk ut typer og helpers til separate filer |
| components/portal/treningsplan/ExerciseBank.tsx | 376 | Vurder å splitte i mindre moduler/sub-komponenter |
| lib/portal/notifications/create.ts | 375 | Trekk ut typer og helpers til separate filer |
| lib/portal/golf/decade-caddy.ts | 373 | Trekk ut typer og helpers til separate filer |
| lib/portal/access.ts | 372 | Trekk ut typer og helpers til separate filer |
| components/portal/treningsplan/SessionDetailModal.tsx | 372 | Vurder å splitte i mindre moduler/sub-komponenter |
| app/portal/(dashboard)/bag/bag-client.tsx | 371 | Trekk ut sub-komponenter og hooks til egne filer |
| components/portal/ai-coach/chat-interface.tsx | 368 | Vurder å splitte i mindre moduler/sub-komponenter |
| app/portal/(dashboard)/spill/actions.ts | 364 | Splitt per domene (CRUD pr. modell i egne filer) |
| components/portal/onboarding/onboarding-wizard.tsx | 361 | Vurder å splitte i mindre moduler/sub-komponenter |
| lib/portal/capabilities/catalog.ts | 357 | Trekk ut typer og helpers til separate filer |
| lib/portal/admin/dagens-fokus-actions.ts | 356 | Trekk ut typer og helpers til separate filer |
| components/portal/treningsplan/plan-creator-modal.tsx | 352 | Vurder å splitte i mindre moduler/sub-komponenter |
| app/portal/(dashboard)/treningsplan/uke/[offset]/week-detail-client.tsx | 351 | Trekk ut sub-komponenter og hooks til egne filer |
| app/portal/(dashboard)/ai-coach/ai-coach-client.tsx | 351 | Trekk ut sub-komponenter og hooks til egne filer |
| components/portal/profil/v2/settings-page-client-v2.tsx | 347 | Splitt i container + presentational sub-komponenter |
| app/portal/(dashboard)/runde/[id]/hero/course-hero-client.tsx | 347 | Trekk ut sub-komponenter og hooks til egne filer |
| lib/portal/sync/optimistic.ts | 346 | Trekk ut typer og helpers til separate filer |
| app/portal/(dashboard)/sosialt/sosialt-client.tsx | 343 | Trekk ut sub-komponenter og hooks til egne filer |
| components/portal/dagbok/v2/dagbok-v2-client.tsx | 341 | Trekk ut sub-komponenter og hooks til egne filer |
| lib/portal/notion/content-sync.ts | 333 | Trekk ut typer og helpers til separate filer |
| lib/portal/google-calendar/webhook.ts | 333 | Trekk ut typer og helpers til separate filer |
| components/portal/mission-control/ui/AdminDataTable.tsx | 333 | Vurder å splitte i mindre moduler/sub-komponenter |
| app/portal/(dashboard)/runde/actions.ts | 332 | Splitt per domene (CRUD pr. modell i egne filer) |
| components/portal/statistikk/v2/stats-v2-client.tsx | 331 | Trekk ut sub-komponenter og hooks til egne filer |
| lib/portal/notion/training-plan-sync.ts | 329 | Trekk ut typer og helpers til separate filer |
| components/portal/mission-control/drill-studio.tsx | 328 | Vurder å splitte i mindre moduler/sub-komponenter |
| app/portal/(dashboard)/ai-coach/ai-coach-dashboard-client.tsx | 328 | Trekk ut sub-komponenter og hooks til egne filer |
| components/portal/trackman/upload-form.tsx | 327 | Vurder å splitte i mindre moduler/sub-komponenter |
| lib/portal/coaching-signals/compute.ts | 326 | Trekk ut typer og helpers til separate filer |
| lib/portal/round/shot-actions.ts | 325 | Trekk ut typer og helpers til separate filer |
| components/portal/playerhq/row-two.tsx | 323 | Vurder å splitte i mindre moduler/sub-komponenter |
| components/portal/ui/upgrade-modal.tsx | 321 | Vurder å splitte i mindre moduler/sub-komponenter |
| components/portal/playerhq/row-one.tsx | 320 | Vurder å splitte i mindre moduler/sub-komponenter |
| components/portal/mission-control/forecast-display.tsx | 320 | Vurder å splitte i mindre moduler/sub-komponenter |
| app/portal/(dashboard)/dagbok/[sessionId]/page.tsx | 318 | Vurder å splitte i mindre moduler/sub-komponenter |
| app/portal/(dashboard)/runde/[id]/oppsummering/page.tsx | 313 | Vurder å splitte i mindre moduler/sub-komponenter |
| components/portal/trackman/club-waveform-impl.tsx | 312 | Vurder å splitte i mindre moduler/sub-komponenter |
| lib/portal/training/pdf-export.tsx | 308 | Vurder å splitte i mindre moduler/sub-komponenter |
| app/portal/(dashboard)/treningsplan/training-plan-viewer.tsx | 308 | Vurder å splitte i mindre moduler/sub-komponenter |
| app/portal/(dashboard)/meldinger/meldinger-chat-client.tsx | 305 | Trekk ut sub-komponenter og hooks til egne filer |
| app/portal/(dashboard)/bookinger/actions.ts | 305 | Splitt per domene (CRUD pr. modell i egne filer) |
| lib/portal/training/ak-taxonomy.ts | 301 | Trekk ut typer og helpers til separate filer |
