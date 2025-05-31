import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { EditProfileForm } from './edit-profile-form';

export default async function Pengaturan() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  const user = session.user as User;

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border p-4">
        <h1 className="text-center text-xl font-semibold">Pengaturan</h1>
      </header>
      <main className="flex-1 flex flex-col items-center gap-8 p-8">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="size-24">
            <AvatarImage src={user.image as string} />
            <AvatarFallback className="text-2xl">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xl font-semibold">{user.name}</span>
        </div>
        <EditProfileForm user={user} />
      </main>
    </div>
  );
}
