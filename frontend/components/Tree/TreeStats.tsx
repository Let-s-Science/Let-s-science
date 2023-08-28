"use client";
import { Center, Container, RingProgress } from "@mantine/core";
import Tree from "./Tree";
import { useEffect, useLayoutEffect, useState } from "react";

export default function TreeStats() {
  const [innerWidth, setInnerWidth] = useState<undefined | number>(undefined);

  useEffect(() => {
    setInnerWidth(window.innerWidth);
  }, [setInnerWidth]);

  useLayoutEffect(() => {
    const updateInnerWidth = () => {
      setInnerWidth(window.innerWidth);
    };

    window.addEventListener("resize", updateInnerWidth);
    updateInnerWidth();
    return () => window.removeEventListener("resize", updateInnerWidth);
  }, []);

  if (innerWidth === undefined) {
    return <></>;
  }

  return (
    <RingProgress
      sections={[{ value: 40, color: "blue" }]}
      size={innerWidth * 0.7}
      label={
        <Container mt={10} maw={innerWidth * 0.46}>
          <Tree level={4} />
        </Container>
      }
    />
  );
}
