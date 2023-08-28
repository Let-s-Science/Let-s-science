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
  Avatar,
  Stack,
} from "@mantine/core";
import Link from "next/link";
import { register } from "../../client";
import { useState } from "react";
import { setUserCookie } from "../actions";
import dynamic from "next/dynamic";
import { IconRefresh } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import UserAvatar from "../../components/Avatar/UserAvatar";

const PasswordStrengthBar = dynamic(
  () => import("../../components/PasswordStrength/PasswordStrength")
);

export default function Page() {
  const [name, setName] = useState("");
  const [display_name, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [avatar_hash, setAvatarHash] = useState(name);

  const [randomId] = useState(Math.round(Math.random() * 1000));

  const [conflict, setConflict] = useState(false);

  const router = useRouter();

  const submit = () => {
    register({ name, display_name, password, avatar_hash })
      .then((resp) => {
        setUserCookie(resp?.access_token);
        router.push("/app");
      })
      .catch((err) => {
        if ("reason" in err && err.reason === "Conflict") {
          setConflict(true);
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
        <Stack align="center">
          <UserAvatar radius={"xl"} size={150} avatarHash={avatar_hash} />
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
          value={display_name}
          description={"Der Name kann geändert werden"}
          onChange={(e) => {
            setDisplayName(e.target.value);
            const cleaned = e.target.value.toLowerCase().replaceAll(" ", "-");
            setName(`${cleaned}-${randomId.toString()}`);
          }}
          label={"Name"}
          placeholder="Max Mustermann"
          mt="md"
          required
        />
        <TextInput
          value={name}
          error={conflict ? "Dieser Benutzername existiert schon" : undefined}
          description={"Der Benutzername kann nicht geändert werden"}
          onChange={(e) => setName(e.target.value)}
          label="Benutzername"
          placeholder="max-mustermann-314"
          mt="md"
          required
        />
        <PasswordInput
          value={password}
          description={"Wähle ein langes und seltenes Passwort."}
          onChange={(e) => setPassword(e.target.value)}
          label="Passwort"
          placeholder="Dein Passwort"
          required
          mt="md"
          mb="sm"
        />
        <PasswordStrengthBar password={password} />
        <Button onClick={submit} fullWidth mt="md">
          Anmelden
        </Button>
      </Paper>
    </Container>
  );
}
