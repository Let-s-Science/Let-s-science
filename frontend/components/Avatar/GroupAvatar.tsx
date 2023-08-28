import { Avatar, AvatarProps } from "@mantine/core";

type GroupAvatarProps = { avatarHash: string } & Omit<AvatarProps, "src">;

const getAvatarSrc = (seed: string): string => {
  return `https://api.dicebear.com/6.x/icons/svg?seed=${seed}`;
};

export default function GroupAvatar(props: GroupAvatarProps) {
  return <Avatar src={getAvatarSrc(props.avatarHash)} {...props} />;
}
