import { Avatar, AvatarProps } from "@mantine/core";

const getAvatarSrc = (seed: string): string => {
  return `https://api.dicebear.com/6.x/notionists/svg?backgroundType=gradientLinear&gestureProbability=0&backgroundColor=b6e3f4,c0aede,ffdfbf,ffd5dc,d1d4f9&seed=${seed}`;
};

type UserAvatarProps = { avatarHash: string } & Omit<AvatarProps, "src">;

export default function UserAvatar(props: UserAvatarProps) {
  let { avatarHash, ...p } = props;
  return (
    <Avatar radius="xl" size={150} src={getAvatarSrc(avatarHash)} {...p} />
  );
}
