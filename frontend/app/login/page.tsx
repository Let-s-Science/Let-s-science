"use client";
import {
  Anchor,
  Container,
  Title,
  Text,
  Paper,
  TextInput,
  Button,
  PasswordInput,
} from "@mantine/core";
import Link from "next/link";
import { login } from "../../client";
import { useState } from "react";
import { setUserCookie } from "../actions";
import { useRouter } from "next/navigation";

export default function Page() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const submit = () => {
    login({ name, password }).then((resp) => {
      if (resp !== undefined) {
        setUserCookie(resp?.access_token);
        router.push("/app");
      }
    });
  };

  return (
    <Container size={420} my={40}>
      <Title
        ta="center"
        fw={900}
        ff={"Greycliff CF, var(--mantine-font-family)"}
      >
        Willkommen!
      </Title>
      <Text c="dimmed" size={"sm"} ta="center" mt={5}>
        Du hast noch keinen Account?{" "}
        <Anchor component={Link} size="sm" href={"/register"}>
          Account erstellen
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius={"md"}>
        <TextInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Benutzername"
          placeholder="Max Mustermann"
          required
        />
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Passwort"
          placeholder="Dein Passwort"
          required
          mt="md"
        />
        <Anchor mt="md" component="button" size="sm">
          Passwort vergessen?
        </Anchor>
        <Button onClick={submit} fullWidth mt="md">
          Anmelden
        </Button>
      </Paper>
    </Container>
  );
}
