import { redirect } from "next/navigation";

/**
 * /portal/treningsplan/uke -> /portal/treningsplan/uke/0 (denne uken).
 *
 * Faktisk visning ligger i [offset]/page.tsx der offset er et tall
 * (0 = denne uken, 1 = neste uken, osv).
 */
export default function TreningsplanUkeIndex() {
  redirect("/portal/treningsplan/uke/0");
}
