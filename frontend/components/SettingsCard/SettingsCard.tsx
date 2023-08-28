"use client";
import { Button, Center, Modal, Paper, Stack } from "@mantine/core";
import {
  IconSettings,
  IconUserCog,
  IconUsersGroup,
  IconUsersPlus,
} from "@tabler/icons-react";
import styles from "./SettingsCard.module.css";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";

export default function SettingsCard() {
  const [opened, { open, close }] = useDisclosure(false);

  const openListGroupsModal = () => {
    close();
    modals.openContextModal({
      modal: "listGroups",
      innerProps: {},
      withCloseButton: false,
    });
  };

  const openJoinGroupModal = () => {
    close();
    modals.openContextModal({
      modal: "joinGroup",
      innerProps: {},
      withCloseButton: false,
    });
  };

  const openCreateGroupModal = () => {
    close();
    modals.openContextModal({
      modal: "createGroup",
      innerProps: {},
      withCloseButton: false,
    });
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Einstellungen">
        <Stack align="center">
          <Button
            color="blue"
            onClick={openListGroupsModal}
            leftSection={<IconUserCog />}
          >
            Meine Gruppen verwalten
          </Button>
          <Button
            color="green"
            onClick={openCreateGroupModal}
            leftSection={<IconUsersPlus />}
          >
            Gruppe erstellen
          </Button>
          <Button
            color="grape"
            onClick={openJoinGroupModal}
            leftSection={<IconUsersGroup />}
          >
            Gruppe beitreten
          </Button>
        </Stack>
      </Modal>
      <Paper
        p="sm"
        onClick={open}
        withBorder
        className={styles.settingsCard}
        role="button"
      >
        <Center>
          <IconSettings size={"1.5rem"} />
        </Center>
      </Paper>
    </>
  );
}
