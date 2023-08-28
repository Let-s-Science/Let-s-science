import { redirect } from "next/navigation";
import getUser from "../hooks/user";

export default function HomePage() {
  const user = getUser();

  if (user === undefined) {
    redirect("/login");
  }

  redirect("/app");
}
