import { redirect } from "next/navigation";

// Legacy redirect: /dashboard?case=N now lives at /cases/N. Without a case
// param, the dashboard collapses back to the landing/queue at /.
export default async function DashboardRedirect({
  searchParams,
}: {
  searchParams: Promise<{ case?: string }>;
}) {
  const { case: caseParam } = await searchParams;
  if (caseParam !== undefined && caseParam !== "") {
    redirect(`/cases/${encodeURIComponent(caseParam)}`);
  }
  redirect("/");
}
