'use client';

import { authClient } from '@/lib/auth-client';
import { VariantProps } from 'class-variance-authority';
import { Loader, LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, buttonVariants } from './ui/button';

export function SignOutButton({
  className,
  variant,
  size,
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  return (
    <Button
      className={className}
      variant={variant}
      size={size}
      disabled={isLoading}
      onClick={async () => {
        setIsLoading(true);
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push('/sign-in');
            },
          },
        });
        setIsLoading(false);
      }}
    >
      {isLoading ? <Loader className="animate-spin size-4" /> : <LogOutIcon />}
      Keluar
    </Button>
  );
}
