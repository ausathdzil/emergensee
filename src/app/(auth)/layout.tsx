export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen flex-1 flex flex-col items-center justify-center">
      {children}
    </main>
  );
}
