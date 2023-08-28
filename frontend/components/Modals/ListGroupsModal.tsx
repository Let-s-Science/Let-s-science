"use client";
import {
  Button,
  Flex,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";
import { useEffect, useState } from "react";
import { type Group as GroupType, listGroups } from "../../client";
import styles from "./ListGroupsModal.module.css";
import GroupAvatar from "../Avatar/GroupAvatar";
import {
  IconDoorExit,
  IconDotsVertical,
  IconUserShare,
} from "@tabler/icons-react";

export default function ListGroupsModal({
  context,
  id,
  innerProps,
}: ContextModalProps) {
  const [groups, setGroups] = useState<GroupType[]>([]);

  useEffect(() => {
    listGroups().then((resp) => setGroups(resp));
  }, []);

  const onSubmit = () => {
    context.closeModal(id);
  };

  const openGroupInviteModal = (join_phrase: string) => {
    context.openContextModal("groupInvite", {
      withCloseButton: false,
      innerProps: {
        join_phrase,
      },
    });
  };

  return (
    <Flex direction="column" align="center">
      <Title ta="center">Meine Gruppen</Title>
      <Text mt="sm" mb="md">
        Hier kannst du deine Gruppen verwalten.
      </Text>
      <Stack w={"100%"} align="stretch">
        {groups.map((group) => (
          <Paper p="md" className={styles.groupCard} key={group.id} withBorder>
            <Group justify="space-between">
              <Group>
                <GroupAvatar size={"md"} avatarHash={group.avatar_hash} />
                <Title order={4}>{group.name}</Title>
              </Group>
              <Menu>
                <MenuTarget>
                  <IconDotsVertical />
                </MenuTarget>
                <MenuDropdown>
                  <MenuItem
                    onClick={() => openGroupInviteModal(group.join_phrase)}
                    leftSection={
                      <IconUserShare
                        style={{ width: rem(16), height: rem(16) }}
                      />
                    }
                  >
                    Einladungscode
                  </MenuItem>
                  <MenuItem
                    color="red"
                    leftSection={
                      <IconDoorExit
                        style={{ width: rem(16), height: rem(16) }}
                      />
                    }
                  >
                    Verlassen (TODO)
                  </MenuItem>
                </MenuDropdown>
              </Menu>
            </Group>
          </Paper>
        ))}
      </Stack>
      <Button onClick={onSubmit} mt="xl">
        Fertig!
      </Button>
    </Flex>
  );
}
