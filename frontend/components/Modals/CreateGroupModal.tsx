"use client";
import {
  Avatar,
  Button,
  Flex,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";
import { useState } from "react";
import { createGroup } from "../../client";
import { IconRefresh } from "@tabler/icons-react";
import GroupAvatar from "../Avatar/GroupAvatar";

export default function CreateGroupModal({ context, id }: ContextModalProps) {
  const [name, setJoinCode] = useState("");
  const [avatarHash, setAvatarHash] = useState(crypto.randomUUID());

  const onSubmit = () => {
    createGroup({ name, avatar_hash: avatarHash }).then((resp) => {
      context.closeModal(id);
      context.openContextModal("groupInvite", {
        withCloseButton: false,
        innerProps: {
          join_phrase: resp.join_phrase,
        },
      });
    });
  };

  return (
    <Flex direction="column" align="center">
      <Title ta="center">Gruppe erstellen</Title>
      <Text mt="sm" mb="md">
        {/* TODO: Besserer Text */}
        Als Gruppenmitglied werden deine erzielten Punkte mit den anderen
        Spielern zusammengerechnet.
      </Text>
      <Stack align="center">
        <GroupAvatar radius={"xl"} size={150} avatarHash={avatarHash} />
        <Button
          variant="outline"
          size="xs"
          radius={"xl"}
          onClick={() => setAvatarHash(crypto.randomUUID())}
        >
          <IconRefresh size="1rem" />
        </Button>
      </Stack>
      <TextInput
        w={"80%"}
        label="Name"
        required
        value={name}
        onChange={(e) => setJoinCode(e.target.value)}
      />
      <Button onClick={onSubmit} mt="xl">
        Fertig!
      </Button>
    </Flex>
  );
}
