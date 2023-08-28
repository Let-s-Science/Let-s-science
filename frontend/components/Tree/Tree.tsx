import NewTree from "./New";
import SmallTree from "./Small";
import MediumSmallTree from "./MediumSmall";
import MediumLargeTree from "./MediumLarge";
import LargeTree from "./Large";

interface TreeProps {
  level: number;
}

export default function Tree({ level }: TreeProps) {
  if (level === 0) {
    return <NewTree />;
  } else if (level === 1) {
    return <SmallTree />;
  } else if (level === 2) {
    return <MediumSmallTree />;
  } else if (level === 3) {
    return <MediumLargeTree />;
  } else {
    return <LargeTree />;
  }
}
