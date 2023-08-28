import { Group, Paper, Title } from "@mantine/core";
import { IconListCheck } from "@tabler/icons-react";
import styles from "./DailyTasksCard.module.css";

export default function DailyTasksCard() {
  return (
    <Paper p="sm" withBorder className={styles.settingsCard}>
      <Group>
        <IconListCheck size={"1.5rem"} />
        <Title order={5}>Tägliche Aufgaben</Title>
      </Group>
    </Paper>
  );
}
