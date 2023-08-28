import { Center, Grid, GridCol, Space } from "@mantine/core";
import "../../components/Tree/Tree.css";
import TreeStats from "../../components/Tree/TreeStats";
import SettingsCard from "../../components/SettingsCard/SettingsCard";
import DailyTasksCard from "../../components/DailyTasksCard/DailyTasksCard";
import ChallengeGrid from "../../components/ChallengeGrid/ChallengeGrid";

export default function Page() {
  return (
    <>
      <Grid>
        <GridCol span={3}>
          <SettingsCard />
        </GridCol>
        <GridCol span={9}>
          <DailyTasksCard />
        </GridCol>
      </Grid>
      <Space h="sm" />
      <Center>
        <TreeStats />
      </Center>
      <Space h="sm" />

      <ChallengeGrid />
    </>
  );
}
