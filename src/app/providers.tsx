"use client";

import { ReactNode } from "react";
import { LocaleProvider } from "@/lib/i18n";
import { StudySessionProvider } from "@/lib/study-session";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <StudySessionProvider>{children}</StudySessionProvider>
    </LocaleProvider>
  );
}
