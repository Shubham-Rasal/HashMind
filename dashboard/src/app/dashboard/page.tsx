// "use client"
import React, { Suspense } from "react";
import { getAgents } from "../actions/agent-factory";
import { Contract } from "ethers";
import { MultiAgentChat } from "@/components/professional-multi-agent-chat";

export interface Agent {
  address: string;
  prompt: string;
  name: string;
  des: string;
  creator: string;
}

// const openaiFormatTools = JSON.stringify(formattedTools);

// console.log(openaiFormatTools);

export default async function Page() {
  const agents = (await getAgents()) as Agent[];
  console.log(agents);

  if (agents.length == 0) return <div>Loading...</div>;

  return (
    <div>
      <ul>
        <Suspense fallback={"loading agents"}>
          <MultiAgentChat agents={agents} />
        </Suspense>
      </ul>
    </div>
  );
}
