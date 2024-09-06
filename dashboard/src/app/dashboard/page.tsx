import React from "react";
import { getAgents } from "../actions/agent-factory";
import { Contract } from "ethers";

interface Agent {
  address: string;
  prompt: string;
  name: string;
  des: string;
}

// const openaiFormatTools = JSON.stringify(formattedTools);

// console.log(openaiFormatTools);

export default async function Page() {
  const agents = (await getAgents()) as Agent[];
  console.log(agents);
  return (
    <div>
      <h1>Agents</h1>
      <ul>
        {agents.map((agent) => (
          <li key={agent.address}>
            <h2>{agent.name}</h2>
            <p>{agent.des}</p>
            <p>{agent.prompt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
