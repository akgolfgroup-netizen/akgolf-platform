/**
 * AK Golf Design System v3.1 — Pattern Library
 *
 * Se /tmp/ak-golf-design/AK Golf Portal.html for designkilde.
 * Se docs/design-system-v3.1.md for dokumentasjon.
 */

// Data-patterns (P-01 ... P-06)
export { SGRing } from "./sg-ring";
export { MonoLabel } from "./mono-label";
export { NightSurface, useIsNightSurface } from "./night-surface";
export { AKPyramide } from "./ak-pyramide";
export type { PyramideLevel } from "./ak-pyramide";
export { AIAttribution } from "./ai-attribution";
export type { AttributionSource, AttributionSourceType } from "./ai-attribution";
export { VerticalTimeline } from "./vertical-timeline";
export type { TimelineItem, TimelineDotColor } from "./vertical-timeline";

// Course Hero-primitiver (P-07 ... P-13)
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
