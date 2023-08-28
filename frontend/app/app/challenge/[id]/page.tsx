"use client";
import { useEffect, useState } from "react";
import { Challenge, getChallenge } from "../../../../client";
import { Title, Text } from "@mantine/core";

export default function Page({ params }: { params: { id: number } }) {
  const [challenge, setChallenge] = useState<undefined | Challenge>(undefined);

  useEffect(() => {
    getChallenge(params.id).then((resp) => setChallenge(resp));
  }, [params]);

  if (challenge === undefined) {
    return <></>;
  }

  return (
    <>
      <Title ta="center">{challenge.name}</Title>
      <Text mt="md" mx="md">
        {challenge.description}
      </Text>
    </>
  );
}
