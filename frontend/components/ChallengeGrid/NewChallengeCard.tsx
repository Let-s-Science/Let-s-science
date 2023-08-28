"use client";
import { ActionIcon, Card, Group, Text } from "@mantine/core";
import { Challenge } from "../../client";
import { IconPlus } from "@tabler/icons-react";

interface NewChallengeCardProps {
  challenge: Challenge;
  onActivate(): any;
}

export default function NewChallengeCard({
  challenge,
  onActivate,
}: NewChallengeCardProps) {
  const onSubmit = () => {
    const newChallenges: Challenge[] = JSON.parse(
      localStorage.getItem("new_challenges") ?? "[]"
    );
    localStorage.setItem(
      "new_challenges",
      JSON.stringify([...newChallenges, challenge])
    );
    onActivate();
  };

  return (
    <Card withBorder padding={"md"} mt="sm" radius="sm">
      <Group justify="space-between">
        <Text fz="lg" fw={500}>
          {challenge.name}
        </Text>
        <ActionIcon onClick={onSubmit} radius="xl">
          <IconPlus />
        </ActionIcon>
      </Group>
      <Text fz="sm" c="dimmed" mt={5} lineClamp={3}>
        {challenge.description}
      </Text>
    </Card>
  );
}
