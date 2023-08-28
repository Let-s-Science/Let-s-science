import { Progress } from "@mantine/core";
import zxcvbn from "zxcvbn";

interface PasswordStrengthBarProps {
  password: string;
}

export default function PasswordStrengthBar({
  password,
}: PasswordStrengthBarProps) {
  return <Progress color="red" value={(zxcvbn(password).score / 4) * 100} />;
}
