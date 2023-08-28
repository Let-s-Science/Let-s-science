"use client";
import { ContextModalProps } from "@mantine/modals";
import { useEffect, useState } from "react";
import { Challenge, listChallenges } from "../../client";
import NewChallengeCard from "../ChallengeGrid/NewChallengeCard";
import { Accordion, Text } from "@mantine/core";

export default function ChallengeListModal({
  context,
  id,
  innerProps: { skipList },
}: ContextModalProps<{ skipList?: number[] }>) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    listChallenges().then((resp) => setChallenges(resp));
  }, []);

  const tags = new Set(challenges.flatMap((ch) => ch.tags));

  return (
    <>
      <Text mb="md">
        Hier kannst du neue Challenges zu deiner Liste hinzufügen.
      </Text>
      <Accordion>
        {[...tags].map((tag) => (
          <Accordion.Item key={tag} value={tag}>
            <Accordion.Control>{tag}</Accordion.Control>
            <Accordion.Panel>
              {challenges
                .filter(
                  (ch) =>
                    ch.tags.includes(tag) &&
                    // We allow every challenge if no skipList is defined
                    (skipList === undefined || !skipList.includes(ch.id))
                )
                .map((ch) => (
                  <NewChallengeCard
                    key={ch.id}
                    challenge={ch}
                    onActivate={() => context.closeModal(id)}
                  />
                ))}
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  );
}
