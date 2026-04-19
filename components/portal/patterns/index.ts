/**
 * AK Golf Design System — Patterns.
 *
 * Heritage Grid er gullstandard for visuell design (design-ref/stitch/heritage/).
 * Patterns her er gjenbrukbare byggeklosser — nye komponenter bør foretrekke
 * Heritage-klasser direkte fra code.html, men kan bruke disse patterns for
 * SGRing, AKPyramide, BentoCard osv. der det matcher.
 */

export { SGRing } from "./sg-ring";
export { MonoLabel } from "./mono-label";
export { NightSurface, useIsNightSurface } from "./night-surface";
export { AKPyramide } from "./ak-pyramide";
export type { PyramideLevel } from "./ak-pyramide";
export { AIAttribution } from "./ai-attribution";
export type { AttributionSource, AttributionSourceType } from "./ai-attribution";
export { VerticalTimeline } from "./vertical-timeline";
export type { TimelineItem, TimelineDotColor } from "./vertical-timeline";
export { CourseHero } from "./course-hero";
export { GlassPanel, GlassPanelRow } from "./glass-panel";
export { GlassButton } from "./glass-button";
export {
  SlimIconRail,
  SlimIconRailLogo,
  SlimIconRailAvatar,
} from "./slim-icon-rail";
export type { SlimIconRailItem } from "./slim-icon-rail";
export { HeroLabel, HeroLabelSeparator } from "./hero-label";
export {
  FloatingTopbar,
  FloatingCrumbs,
  FloatingSegmented,
} from "./floating-topbar";
export { BentoCard, BentoGrid, BentoEyebrow } from "./bento-card";
