import { SignOutButton } from '@/components/sign-out-button';
import { Separator } from '@/components/ui/separator';

export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="flex items-center gap-2 h-5">
        <span className="text-2xl font-bold">403</span>
        <Separator className="bg-foreground" orientation="vertical" />
        <span className="text-2xl font-bold">Akses Ditolak</span>
      </div>
      <p className="text-destructive">
        Anda tidak memiliki akses ke halaman ini.
      </p>
      <SignOutButton variant="destructive" />
    </div>
  );
}
