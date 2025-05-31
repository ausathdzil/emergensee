'use client';

import { authClient } from '@/lib/auth-client';
import { IconLoader, IconLogout } from '@tabler/icons-react';
import { VariantProps } from 'class-variance-authority';
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
      {isLoading ? (
        <IconLoader className="animate-spin size-4" />
      ) : (
        <IconLogout />
      )}
      Keluar
    </Button>
  );
}
