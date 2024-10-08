"use server";

import { Contract, ethers, Wallet } from "ethers";
import { abi as agentFactoryAbi } from "@/abis/AgentFactory.sol/AgentFactory.json";
import { abi as agentAbi } from "@/abis/Agent.sol/Agent.json";
export async function getAgents() {
  const rpcUrl = process.env.RPC_URL;
  if (!rpcUrl) throw Error("Missing RPC_URL in .env");
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) throw Error("Missing PRIVATE_KEY in .env");
  const factoryAddress = process.env.AGENT_FACTORY_ADDRESS;
  if (!factoryAddress) throw Error("Missing AGENT_FACTORY_ADDRESS in .env");

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(privateKey, provider);
  const factoryContract = new Contract(factoryAddress, agentFactoryAbi, wallet);
  console.log(factoryContract);
  const allAgents = await factoryContract.getAgents();

  const agents = allAgents.map(async (agentAddress: string) => {
    const agentContract = new Contract(agentAddress, agentAbi, wallet);
    //get the agent details in the form of a promise
    const prompt = await agentContract.prompt();
    const name = await agentContract.name();
    const des = await agentContract.description();
    const creator = await factoryContract.getCreator(agentAddress);
    return {
      address: agentAddress,
      prompt: prompt,
      name: name,
      des: des,
      creator,
    };
  });

  //resolve the promise
  const agentsResolved = await Promise.all(agents);
  return agentsResolved;
}
