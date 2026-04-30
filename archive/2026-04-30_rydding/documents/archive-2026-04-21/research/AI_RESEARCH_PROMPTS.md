# AI Research Prompts
## Komplette Prompts for Manus, Perplexity og Grok

**Dato:** April 2026  
**Formål:** Research på data-bruk, AI-coaching, og golf-plattformer

---

## PROMPT 1: MANUS (Deep Research Agent)

### Primær Prompt

```
I am building a comprehensive golf performance platform called AK Golf that combines:
1. Training planning with personalized drills
2. Statistical analysis (Strokes Gained, dispersion tracking)
3. Strategic caddy functionality (statistical approach to course management)
4. Mental game tracking
5. AI-powered coaching that automatically generates training content

CONTEXT:
- Target market: Nordic countries initially (Norway, Sweden, Denmark, Finland)
- User base: Serious amateurs (HCP 0-25), junior players, elite amateurs
- Unique differentiator: Combining statistical strategy with mental tracking and real coaching integration
- Data sources: TrackMan integration, user-reported rounds, weather APIs, on-course GPS

RESEARCH QUESTIONS:

1. DATA COLLECTION & PRIVACY
- What specific golf performance data should we collect to build the most valuable AI coaching system?
- How do competitors like Arccos, 18Birdies, Golfshot collect and use player data?
- What are GDPR implications for collecting and analyzing golf performance data in EU/Norway?
- How can we structure data collection to maximize AI training value while maintaining user privacy?
- What is the optimal balance between automatic tracking (sensors) vs manual input for data quality?

2. AI COACHING ARCHITECTURE
- What ML/AI models are most effective for sports performance prediction?
- How can we build a system that automatically generates personalized training plans based on:
  * Player statistics (Strokes Gained by category)
  * Historical performance trends
  * Mental game patterns
  * Physical limitations/test results
  * Available practice time
- What are best practices for AI-generated training content in sports?
- How do we ensure AI recommendations are evidence-based and safe?
- What is the technical architecture for real-time coaching feedback during rounds?

3. DATA ANALYSIS & INSIGHTS
- What correlations should we analyze in golf data? (e.g., sleep vs score, practice frequency vs improvement)
- How can we use time-series analysis to predict player performance?
- What clustering algorithms help identify player types/archetypes?
- How do we detect meaningful patterns vs noise in golf performance data?
- What predictive models work best for golf score prediction?

4. COMMERCIAL DATA VALUE
- How can aggregated, anonymized golf data be monetized?
- What insights are golf equipment manufacturers (Titleist, Callaway, TaylorMade) willing to pay for?
- What data would be valuable to golf courses, federations, or betting companies?
- How do we structure data licensing agreements?
- What is the market value of golf performance data?

5. COMPETITIVE ANALYSIS
- Deep analysis of: Arccos, 18Birdies, DECADE Golf, Golfshot, Hole19
- What data do they collect?
- How do they use AI/ML?
- What are their weaknesses we can exploit?
- What features are missing in the market?

6. USER ENGAGEMENT THROUGH DATA
- How can we use data to increase user retention?
- What gamification elements work best for golf apps?
- How do we present complex statistical insights in understandable ways?
- What notification strategies increase engagement without being annoying?

7. TECHNICAL IMPLEMENTATION
- Best database structure for golf performance data (time-series vs relational)
- How to handle high-frequency TrackMan data (1000+ shots per session)
- Real-time vs batch processing for different data types
- Edge computing for on-course calculations

8. AI PERSONALIZATION
- How granular should AI personalization be?
- How do we handle cold-start problem (new users with no data)?
- What player segmentation strategies work best?
- How do we balance AI recommendations with coach oversight?

DELIVERABLE:
Provide a comprehensive research report with:
- Specific recommendations for data collection strategy
- Technical architecture suggestions
- Competitive insights
- Commercial opportunities
- Risk assessments
- Implementation priorities

Format: Structured report with actionable insights, specific examples, and citations where possible.
```

### Follow-up Prompts for Manus

```
FOLLOW-UP 1: Technical Deep Dive
Based on your initial research, provide detailed technical specifications for:
1. Database schema optimized for golf analytics
2. ML pipeline architecture for training plan generation
3. Real-time recommendation engine for on-course decisions
4. Data processing workflow from TrackMan to insights

Include specific technology recommendations (PostgreSQL vs ClickHouse, Python vs Node.js for ML, etc.)

---

FOLLOW-UP 2: Business Model Analysis
Analyze these specific business model questions:
1. What is the optimal pricing strategy for AI-generated coaching vs human coaching?
2. How do we position against free competitors (Arccos free, 18Birdies free)?
3. What is the lifetime value of a user who actively uses AI coaching vs basic tracking?
4. How do we structure B2B sales to golf academies?
5. What is the path to a 50M NOK exit valuation?

Include financial modeling with specific assumptions.

---

FOLLOW-UP 3: Regulatory & Legal
Deep dive on:
1. GDPR compliance for sports performance data
2. Liability issues with AI-generated training recommendations
3. Data ownership and portability requirements
4. International expansion (US, Asia) - data transfer requirements
5. Insurance requirements for AI coaching platform

Include specific legal requirements for Norway/EU operations.
```

---

## PROMPT 2: PERPLEXITY (Fact-Checking & Current Trends)

### Primær Prompt

```
Research current state-of-the-art in golf technology and AI coaching as of 2024-2026:

1. CURRENT MARKET LANDSCAPE
- What are the latest features launched by Arccos, 18Birdies, Golfshot in 2024-2025?
- What new golf AI/ML companies have emerged recently?
- What are the latest trends in golf performance technology?
- How has the market evolved since 2020?

2. AI & MACHINE LEARNING IN GOLF
- What ML models are golf companies currently using?
- What are recent research papers on golf performance prediction?
- What AI coaching technologies exist in other sports that could apply to golf?
- What is the state of computer vision for golf swing analysis?

3. DATA PRIVACY & REGULATIONS
- What are recent GDPR fines or cases related to sports/health data?
- How are other sports apps handling data privacy in EU?
- What are Norway's specific requirements for health/performance data?
- What is the status of the EU AI Act for sports coaching applications?

4. GOLF EQUIPMENT INDUSTRY
- What data partnerships exist between golf apps and equipment manufacturers?
- How are companies like TrackMan, Foresight, FlightScope using data?
- What is the market size for golf performance data?
- Recent M&A activity in golf technology space?

5. WEARABLES & SENSORS
- What is the latest in golf wearables (Garmin, Apple Watch, Whoop)?
- What sensors can integrate with golf apps?
- What is the accuracy comparison between different tracking technologies?
- Cost-benefit analysis of different sensor options?

6. MENTAL GAME RESEARCH
- What is the latest research on mental game in golf?
- What psychological interventions show measurable improvement?
- How is performance psychology being digitized?
- What apps exist for mental training in golf?

7. JUNIOR & AMATEUR DEVELOPMENT
- What technology are golf academies using for player development?
- What are best practices for junior player tracking?
- How do college/programs in US use data for recruitment?

8. BETTING & FANTASY
- How is golf performance data used in betting/fantasy sports?
- What data do betting companies purchase?
- What predictive models exist for golf betting?

FORMAT: Provide factual, current information with sources. Focus on 2024-2026 developments. Include specific company names, product names, and statistics where available.
```

### Follow-up Prompts for Perplexity

```
FOLLOW-UP 1: Technology Stack
What is the current best practice tech stack for:
- Real-time sports analytics apps
- Time-series databases for shot tracking
- ML pipelines for personalized coaching
- Mobile apps with offline capability

Compare specific technologies and their golf industry usage.

---

FOLLOW-UP 2: Norwegian & Nordic Market
Specific research on:
- Norwegian golf market size and demographics
- Nordic golf federation technology initiatives
- Norwegian golf app usage statistics
- Competition in Nordic market
- Cultural differences in golf between Norway, Sweden, Denmark, Finland

---

FOLLOW-UP 3: DECADE Golf & Strategic Coaching
Deep research on:
- DECADE Golf system (Scott Fawcett) - features, pricing, user base
- What intellectual property exists around statistical golf strategy?
- What other strategic coaching systems exist?
- How is "Strokes Gained" being used beyond PGA Tour?
- What patents exist in golf strategy/coaching space?
```

---

## PROMPT 3: GROK (Technical Innovation & Edge Cases)

### Primær Prompt

```
I am developing an AI-powered golf coaching platform. Help me explore technical innovations and edge cases:

1. ADVANCED AI APPLICATIONS
- How could Large Language Models (LLMs) be used for golf coaching?
- What would a GPT-4 powered golf coach look like?
- How can we use computer vision for:
  * Swing analysis from phone video
  * Shot tracking without hardware
  * Lie assessment from photos
- What reinforcement learning approaches could optimize training plans?
- How could we use generative AI for:
  * Creating personalized drills
  * Generating course strategy explanations
  * Creating mental visualization content

2. EDGE CASES & FAILURE MODES
- What happens when AI gives bad advice? How do we detect and prevent?
- How do we handle conflicting data (TrackMan says one thing, user reports another)?
- What if player's data shows they're overtraining?
- How do we handle equipment changes (new clubs) in AI models?
- What if weather makes all historical data irrelevant?
- How do we detect and handle injuries from data patterns?

3. SCALING CHALLENGES
- What technical challenges arise at:
  * 1,000 users
  * 10,000 users
  * 100,000 users
  * 1,000,000 users
- How do we maintain AI model quality with diverse player types?
- What happens when we have more data than we can process?
- How do we handle real-time processing for in-round coaching?

4. DATA QUALITY ISSUES
- How do we detect and handle:
  * Cheating/false data entry
  * GPS inaccuracies
  * Sensor malfunctions
  * User misunderstanding of metrics
- What confidence metrics should we show users?
- How do we handle missing data (incomplete rounds, skipped holes)?

5. INNOVATIVE FEATURES
Brainstorm innovative features like:
- Predictive injury warning based on swing changes
- Automatic detection of equipment issues
- Social features that actually improve performance
- Integration with smart home/sleep trackers
- Weather-based schedule optimization
- Automatic video highlight generation
- AI caddie that learns course management from user behavior

6. ETHICAL CONSIDERATIONS
- What are ethical boundaries for AI coaching?
- How much should AI push players vs. support their decisions?
- What responsibility do we have for player health/safety?
- How do we prevent addiction to optimization?
- What about data bias (mostly male, mostly affluent users)?

7. FUTURE TECHNOLOGIES
- How might these technologies impact golf coaching:
  * Apple Vision Pro / VR
  * Neural interfaces
  * Advanced biometrics
  * Quantum computing for optimization
  * Blockchain for tournament verification
- What is 5-10 year roadmap for golf technology?

8. INTEGRATION POSSIBILITIES
- What APIs and integrations should we prioritize?
- How do we integrate with:
  * Fitness apps (Strava, MyFitnessPal)
  * Smartwatches (Apple Watch, Garmin)
  * Smart home (sleep tracking, Oura)
  * Calendar apps
  * Weather services
  * Golf booking systems
  * Equipment retailers

FORMAT: Provide creative, forward-thinking analysis. Challenge assumptions. Identify risks and opportunities. Be specific about technical implementation where possible.
```

### Follow-up Prompts for Grok

```
FOLLOW-UP 1: Competitive Moat
How do we build a defensible competitive advantage that:
- Cannot be easily copied by Arccos/18Birdies
- Gets stronger over time
- Justifies premium pricing
- Makes us attractive acquisition target

Consider: network effects, data moats, proprietary algorithms, partnerships, community.

---

FOLLOW-UP 2: Technical Architecture Decisions
Help me decide:
1. Build vs buy for ML infrastructure
2. Cloud provider selection (AWS vs GCP vs Azure) for golf-specific needs
3. Mobile architecture (native vs React Native vs Flutter)
4. Database strategy (SQL vs NoSQL vs hybrid)
5. Real-time vs batch processing priorities

Analyze trade-offs for each decision relevant to our use case.

---

FOLLOW-UP 3: Exit Strategy Technical Preparation
What technical preparations maximize acquisition value:
1. How do we structure code for due diligence?
2. What documentation standards impress acquirers?
3. How do we demonstrate data value to buyers?
4. What IP protection strategies should we implement?
5. How do we show technical scalability?
6. What red flags do acquirers look for in code/architecture?

Target acquirers: TrackMan, Garmin, Acushnet (Titleist), investment firms.
```

---

## BONUS: PROMPT 4 (For alle tre) - Data Commercialization

```
SPECIFIC RESEARCH: Monetizing Golf Performance Data

I have a golf platform collecting:
- 10,000+ rounds with shot-by-shot data
- TrackMan launch monitor data
- Mental game scores
- Training session logs
- Equipment used
- Course conditions
- Weather data
- User demographics (handicap, age, location)

RESEARCH:

1. DIRECT DATA SALES
- What is the market rate for golf performance datasets?
- Who buys this data (equipment manufacturers, betting companies, researchers)?
- What format/structure do buyers want?
- What are standard licensing terms?
- Case studies of sports data sales

2. INSIGHTS & ANALYTICS SERVICES
- What B2B analytics services can we offer?
- How do we package insights for:
  * Golf courses (design optimization)
  * Equipment manufacturers (product development)
  * Betting companies (odds setting)
  * Golf federations (player development)

3. AGGREGATED RESEARCH
- What research papers could we publish with our data?
- How does this increase company value?
- What are ethical considerations?

4. DATA COOPERATIVES
- Should we join/form data sharing consortiums?
- What are pros/cons?
- How do other sports handle this?

5. PRIVACY-COMPLIANT MONETIZATION
- How do we monetize while maintaining GDPR compliance?
- What anonymization techniques are sufficient?
- What user consent do we need?

6. VALUATION
- How do data assets affect company valuation?
- What multiples apply to data-rich sports tech companies?
- Case studies: How did Arccos, TrackMan value their data?

Provide specific dollar amounts, contract structures, and negotiation strategies where possible.
```

---

## RESEARCH ORGANIZATION

### How to Use These Prompts

```
WEEK 1:
Day 1-2: Send all primary prompts to respective AIs
Day 3-4: Review responses, identify gaps
Day 5: Send follow-up prompts based on initial responses

WEEK 2:
Day 1-3: Synthesize all research into unified document
Day 4: Identify conflicts/contradictions between sources
Day 5: Send clarification prompts

WEEK 3:
Day 1-2: Final synthesis
Day 3: Create action items and priorities
Day 4: Validate with domain experts (if available)
Day 5: Finalize research document
```

### Synthesis Template

```markdown
# Research Synthesis

## 1. Executive Summary
[Key findings across all sources]

## 2. Data Collection Strategy
[Consensus recommendations]

## 3. Technical Architecture
[Specific technology choices with justification]

## 4. Competitive Positioning
[Where we win vs competitors]

## 5. Commercial Opportunities
[Prioritized revenue streams]

## 6. Risk Assessment
[Technical, legal, market risks]

## 7. Implementation Roadmap
[Prioritized action items with timeline]

## 8. Open Questions
[What we still need to research]
```

---

## ADDITIONAL QUESTIONS TO RESEARCH

### Questions I Recommend Adding

```
CATEGORY: User Psychology
- Why do golfers quit using tracking apps after 3 months?
- What motivates behavior change in amateur golfers?
- How do we create "aha moments" that drive retention?
- What is the optimal frequency of app engagement?

CATEGORY: Coaching Science
- What is the evidence base for different practice methodologies?
- How much improvement can technology realistically deliver?
- What is the coach-to-player ratio in successful academies?
- How do we measure "coaching effectiveness"?

CATEGORY: Nordic Specifics
- What makes Nordic golfers different from US golfers?
- How does shorter season affect training patterns?
- What is the competitive landscape in Nordic golf apps?
- How do we handle language localization (Norwegian, Swedish, Danish, Finnish)?

CATEGORY: Business Development
- What is the optimal launch sequence (features, markets)?
- How do we build viral loops in golf?
- What partnerships are essential for success?
- How do we price discriminate without alienating users?

CATEGORY: Future-Proofing
- What if Apple/Google build golf features into OS?
- What if golf declines in popularity?
- How do we future-proof our data architecture?
- What is our plan if main competitor acquires us?
```

---

## DOCUMENT REFERENCES

Reference these docs/research/ files in AI prompts:
- KOMPLETT_PRIS_OG_TEKNISK_STRUKTUR.md
- DECADE_JURIDISK_ANALYSE.md
- DATA_FLYWHEEL_OG_AI_AGENT_STRATEGI.md
- SPILL_MODUS_KOMPLETT_SPEC.md
- MARKEDSANALYSE_OG_PRISSTRATEGI.md

This ensures AI has full context of what we've already researched.
