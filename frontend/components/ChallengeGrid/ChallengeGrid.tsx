"use client";

import { useEffect, useState } from "react";
import { Challenge, listPersonalChallenges } from "../../client";
import { Button, Group, Title } from "@mantine/core";
import { parseChallenges } from "../../helper/challenges";
import ChallengeCard from "./ChallengeCard";
import { IconPlus } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useInterval } from "@mantine/hooks";

export default function ChallengeGrid() {
  const [myChallenges, setMyChallenges] = useState<Challenge[]>([]);
  const [newChallenges, setNewChallenges] = useState<Challenge[]>([]);
  //
  // TODO: Use proper data managament libraries like zustand
  const interval = useInterval(() => checkForNewChallenges(), 1000);

  const checkForNewChallenges = () => {
    setNewChallenges(
      JSON.parse(localStorage.getItem("new_challenges") ?? "[]")
    );
  };

  const updateChallengeGrid = () => {
    checkForNewChallenges();
    listPersonalChallenges().then((resp) => setMyChallenges(resp));
  };

  useEffect(() => {
    updateChallengeGrid();
    interval.start();
    return interval.stop();
  }, []);

  const parsedChallenges = parseChallenges(myChallenges);
  const newParsedChallenges = parseChallenges(newChallenges);

  const openChallengeListModal = () => {
    console.log(parsedChallenges);
    const skipList: number[] = parsedChallenges
      .filter((ch) => ch.currProgress > 0)
      .map((ch) => ch.challenge.id)
      .concat(newChallenges.map((ch) => ch.id));
    modals.openContextModal({
      modal: "listChallenges",
      title: "Wähle eine neue Aufgabe",
      innerProps: {
        skipList,
      },
    });
  };

  return (
    <>
      <Group justify="space-between">
        <Title order={4}>Meine Challenges</Title>
        <Button
          onClick={openChallengeListModal}
          variant="white"
          leftSection={<IconPlus />}
        >
          Neu
        </Button>
      </Group>
      {newParsedChallenges.map((stats) => (
        <ChallengeCard
          newChallenge
          key={stats.challenge.id}
          challengeStats={stats}
        />
      ))}
      {parsedChallenges
        .filter((stat) => stat.currProgress > 0)
        .map((stat) => (
          <ChallengeCard key={stat.challenge.id} challengeStats={stat} />
        ))}
    </>
  );
}
