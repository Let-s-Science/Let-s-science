"use client";
import { Button, Flex, Text, TextInput, Title } from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";
import Html5QrcodePlugin from "../QR/QRCodeScanner";
import { useState } from "react";
import { joinGroup } from "../../client";

export default function JoinGroupModal({
  context,
  id,
  innerProps,
}: ContextModalProps) {
  const [joinPhrase, setJoinCode] = useState("");

  const onSubmit = () => {
    joinGroup({ join_phrase: joinPhrase }).then(() => context.closeModal(id));
  };

  return (
    <Flex direction="column" align="center">
      <Title ta="center">Gruppe beitreten</Title>
      <Text mt="sm" mb="md">
        Um einer Gruppe beizutreten, benötigst du entweder einen validen QR-Code
        oder einen Beitrittscode.
      </Text>
      <Html5QrcodePlugin
        fps={10}
        qrbox={250}
        qrCodeSuccessCallback={(res) => setJoinCode(res)}
      />
      <TextInput
        mt="md"
        w={"80%"}
        label="Gruppencode"
        value={joinPhrase}
        onChange={(e) => setJoinCode(e.target.value)}
      />
      <Button onClick={onSubmit} mt="xl">
        Fertig!
      </Button>
    </Flex>
  );
}
