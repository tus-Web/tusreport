'use client';

// This file is no longer needed with Clerk
// ClerkProvider is already handling authentication in layout.tsx
// Keeping this as a passthrough component for compatibility

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}