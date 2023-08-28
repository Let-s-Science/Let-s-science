import { redirect } from "next/navigation";
import getUser from "../../hooks/user";

interface AuthLayerProps {
  children: React.ReactNode;
}

export default function AuthLayer({ children }: AuthLayerProps) {
  const user = getUser();
  if (user === undefined) {
    redirect("/login");
  }
  return children;
}
