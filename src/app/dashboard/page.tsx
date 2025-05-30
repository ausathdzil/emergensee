import { SignOutButton } from "@/components/sign-out-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <SignOutButton />
    </div>
  );
}
