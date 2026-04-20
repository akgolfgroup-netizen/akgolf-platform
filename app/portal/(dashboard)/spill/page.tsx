import { requirePortalUser } from "@/lib/portal/auth";
import {
  getGameSessions,
  getRecentCourses,
  getChallenges,
} from "./actions";
import SpillClient from "./spill-client";

export default async function SpillPage() {
  await requirePortalUser();

  const [sessions, courses, challenges] = await Promise.all([
    getGameSessions(),
    getRecentCourses(),
    getChallenges(),
  ]);

  return (
    <SpillClient
      initialSessions={sessions}
      initialCourses={courses}
      initialChallenges={challenges}
    />
  );
}
