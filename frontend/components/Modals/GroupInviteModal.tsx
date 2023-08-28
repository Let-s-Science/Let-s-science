"use client";
import { Button, Flex, Text, Title } from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";
import { QRCodeCanvas } from "qrcode.react";

export default function GroupInviteModal({
  context,
  id,
  innerProps,
}: ContextModalProps<{ join_phrase: string }>) {
  const onSubmit = () => {
    context.closeModal(id);
  };

  return (
    <Flex direction="column" align="center">
      <Title ta="center">Fast fertig!</Title>
      <Text mt="sm" mb="md">
        Um andere Nutzer in deine Gruppe einzuladen, musst du nur noch diesen
        QR-Code verteilen.
      </Text>

      <QRCodeCanvas includeMargin value={innerProps.join_phrase} />

      <Text fw={500} mt="xs" fz={"lg"}>
        {innerProps.join_phrase}
      </Text>

      <Button onClick={onSubmit} mt="xl">
        Fertig!
      </Button>
    </Flex>
  );
}
