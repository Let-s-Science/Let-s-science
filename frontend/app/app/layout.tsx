import React from "react";
import AuthLayer from "../../components/AuthLayer/AuthLayer";
import { AppShell, AppShellMain } from "@mantine/core";
import Footer from "../../components/AppShell/Footer";

export default function RootLayout({ children }: { children: any }) {
  return (
    <AuthLayer>
      <AppShell padding={"sm"} footer={{ height: 60 }}>
        <AppShellMain>{children}</AppShellMain>
        <Footer />
      </AppShell>
    </AuthLayer>
  );
}
