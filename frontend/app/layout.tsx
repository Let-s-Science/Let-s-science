import "@mantine/core/styles.css";
import React from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import JoinGroupModal from "../components/Modals/JoinGroupModal";
import CreateGroupModal from "../components/Modals/CreateGroupModal";
import GroupInviteModal from "../components/Modals/GroupInviteModal";
import ListGroupsModal from "../components/Modals/ListGroupsModal";
import ChallengeListModal from "../components/Modals/ChallengeListModal";
import EditChallengeModal from "../components/Modals/EditChallengeModal";

export const metadata = {
  title: "Mantine Next.js template",
  description: "I am using Mantine with Next.js!",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
      </head>
      <body>
        <MantineProvider>
          <ModalsProvider
            modals={{
              joinGroup: JoinGroupModal,
              createGroup: CreateGroupModal,
              groupInvite: GroupInviteModal,
              listGroups: ListGroupsModal,
              listChallenges: ChallengeListModal,
              editChallenge: EditChallengeModal,
            }}
          >
            {children}
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
