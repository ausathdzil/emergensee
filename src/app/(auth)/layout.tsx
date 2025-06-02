export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen flex-1 flex flex-col items-center justify-center gap-4">
      <div className="bg-primary/5 p-4 rounded-lg w-full max-w-md text-sm flex flex-col gap-2">
        <span className="font-medium">
          For demo purposes, use the following credentials:
        </span>
        <span>Email: m@example.com</span>
        <span>Password: 12345678</span>
      </div>
      {children}
    </main>
  );
}
