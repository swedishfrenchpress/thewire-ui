import { redirect } from "next/navigation";

export default async function CasesRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard?case=${id}`);
}
