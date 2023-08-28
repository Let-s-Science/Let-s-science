"use client";
import { ContextModalProps } from "@mantine/modals";
import { Challenge, addChallengeProgress } from "../../client";
import { Button, Group, Text, Title } from "@mantine/core";
import { IconTargetArrow, IconTrash } from "@tabler/icons-react";

export default function EditChallengeModal({
  context,
  id,
  innerProps: { challenge, newChallenge, lastProgress },
}: ContextModalProps<{
  challenge: Challenge;
  newChallenge?: boolean;
  lastProgress?: string | Date;
}>) {
  const addProgress = () => {
    if (newChallenge) {
      const newChallenges = JSON.parse(
        localStorage.getItem("new_challenges") ?? "[]"
      );
      localStorage.setItem(
        "new_challenges",
        JSON.stringify(
          newChallenges.filter((ch: Challenge) => ch.id !== challenge.id)
        )
      );
    }
    addChallengeProgress(challenge.id);
    context.closeModal(id);
  };

  const disabled =
    newChallenge || lastProgress === undefined
      ? false
      : (new Date().getTime() - new Date(lastProgress).getTime()) /
          (1000 * 60 * 60) <
        24;

  return (
    <>
      <Title ta="center">{challenge.name}</Title>
      <Text mt="md" mx="md">
        {challenge.description}
      </Text>
      <Group mt="md" justify="center">
        <Button color="red" leftSection={<IconTrash />}>
          Löschen
        </Button>
        <Button
          disabled={!disabled}
          onClick={addProgress}
          leftSection={<IconTargetArrow />}
        >
          Fertig!
        </Button>
      </Group>
    </>
  );
}
