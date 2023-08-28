"use client";
import {
  ActionIcon,
  Avatar,
  AvatarGroup,
  Card,
  Group,
  Progress,
  Text,
} from "@mantine/core";
import { ChallengeStats } from "../../helper/challenges";
import { IconPencil } from "@tabler/icons-react";
import UserAvatar from "../Avatar/UserAvatar";
import { getUser } from "../../hooks/userClient";
import Link from "next/link";
import { modals } from "@mantine/modals";

interface ChallengeCardProps {
  challengeStats: ChallengeStats;
  newChallenge?: boolean;
}

export default function ChallengeCard({
  challengeStats: { challenge: ch, currProgress, lastProgress },
  newChallenge,
}: ChallengeCardProps) {
  const user = getUser();

  const progress = newChallenge === true ? 0 : currProgress;

  const openEditChallengeModal = () => {
    modals.openContextModal({
      modal: "editChallenge",
      title: `"${ch.name}" - Bearbeiten`,
      innerProps: { challenge: ch, newChallenge, lastProgress },
    });
  };

  return (
    <Card withBorder padding={"md"} mt="sm" radius={"md"}>
      <Text fz="lg" fw={500}>
        {ch.name}
      </Text>
      <Text fz="sm" c="dimmed" mt={5} lineClamp={3}>
        {ch.description}
      </Text>

      <Text c="dimmed" fz="sm" mt="md">
        Tage erledigt:{" "}
        <Text span fw={500}>
          {`${progress}/${ch.required_amount}`}
        </Text>
      </Text>

      <Progress value={(progress / ch.required_amount) * 100} mt={5} />

      <Group justify="space-between" mt="md">
        <AvatarGroup>
          <UserAvatar size={34} avatarHash={user?.display ?? ""} />
          <Avatar>+2</Avatar>
        </AvatarGroup>
        <ActionIcon onClick={openEditChallengeModal} radius={"xl"} size="lg">
          <IconPencil />
        </ActionIcon>
      </Group>
    </Card>
  );
}
