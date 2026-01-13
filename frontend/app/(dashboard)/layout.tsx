'use client';

import { AuthProvider, ProtectedRoute } from '@/components/providers/auth-provider';
import { TasksProvider } from '@/hooks/use-tasks';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CommandPaletteProvider } from '@/components/features/command-palette';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <TasksProvider>
          <CommandPaletteProvider>
            <div className="min-h-screen bg-background flex flex-col">
              <Header variant="app" />
              <main id="main-content" className="pt-16 flex-1" role="main">
                {children}
              </main>
              <Footer variant="app" />
            </div>
          </CommandPaletteProvider>
        </TasksProvider>
      </ProtectedRoute>
    </AuthProvider>
  );
}
