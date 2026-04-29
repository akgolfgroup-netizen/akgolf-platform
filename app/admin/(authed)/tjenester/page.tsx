import { listServiceTypes } from "./actions";
import { TjenesterClient } from "./tjenester-client";

export const dynamic = "force-dynamic";

export default async function TjenesterPage() {
  const services = await listServiceTypes();
  return <TjenesterClient initialServices={services} />;
}
