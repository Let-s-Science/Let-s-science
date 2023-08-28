import {
  ActionIcon,
  AppShellFooter,
  Button,
  Center,
  Group,
  ThemeIcon,
} from "@mantine/core";
import {
  IconHome,
  IconListNumbers,
  IconQuestionMark,
} from "@tabler/icons-react";
import Link from "next/link";

interface FooterIconProps {
  icon: React.ReactNode;
  page: string;
  name: string;
}

const FooterIcon = ({ icon, page, name }: FooterIconProps) => {
  return (
    <Center>
      <ActionIcon color="gray" component={Link} href={page} variant="outline">
        {icon}
      </ActionIcon>
    </Center>
  );
};

const links = [
  {
    icon: <IconListNumbers />,
    page: "/app/ranking",
    name: "Rangliste",
  },
  {
    icon: <IconHome />,
    page: "/app",
    name: "Startseite",
  },
  {
    icon: <IconQuestionMark />,
    page: "/app/quiz",
    name: "Quiz",
  },
];

export default function Footer() {
  return (
    <AppShellFooter p="md">
      <Group w="100%" grow px="md">
        {links.map((link) => (
          <FooterIcon {...link} key={link.page} />
        ))}
      </Group>
    </AppShellFooter>
  );
}
