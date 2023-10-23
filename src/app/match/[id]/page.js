"use client";
import { matches } from "@/app/data";
import { useParams } from "next/navigation";

export default function Match() {
  const { id } = useParams();

  const matchData = matches.data.team.fixtures.items[id];

  console.log(matchData);

  return <div>hello</div>;
}
