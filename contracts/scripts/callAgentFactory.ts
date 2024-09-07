import { Contract, ethers, Wallet } from "ethers";
import { abi as agentFactoryAbi } from "../artifacts/contracts/AgentFactory.sol/AgentFactory.json";

require("dotenv").config();

async function main() {
  const rpcUrl = process.env.RPC_URL;
  if (!rpcUrl) throw Error("Missing RPC_URL in .env");
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) throw Error("Missing PRIVATE_KEY in .env");
  const factoryAddress = process.env.AGENT_FACTORY_ADDRESS;
  if (!factoryAddress) throw Error("Missing AGENT_FACTORY_ADDRESS in .env");

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(privateKey, provider);
  const factoryContract = new Contract(factoryAddress, agentFactoryAbi, wallet);

  const initialOracleAddress = "0x68EC9556830AD097D661Df2557FBCeC166a0A075";
  const creatorAddress = wallet.address;

  type Agent = {
    name: string;
    des: string;
    systemPrompt: string;
  };

  const agents: Agent[] = [
    {
      name: "Market Data Analyst",
      des: "Specializes in the financial markets, collecting and analyzing real-time market data.",
      systemPrompt:
        "You are a Market Data Analyst specializing in the financial markets. Your goal is to collect and analyze real-time market data, including stocks, bonds, commodities, and crypto assets. You will provide insights on market trends, news, and financial reports to assist in making informed trading decisions.",
    },
    {
      name: "Risk Management Specialist",
      des: "Focuses on evaluating and mitigating risks in a hedge fund's portfolio.",
      systemPrompt:
        "You are a Risk Management Specialist focused on evaluating and mitigating risks in a hedge fund's portfolio. You will analyze risk factors such as market volatility, liquidity risks, and potential losses, and generate reports to guide portfolio adjustments.",
    },
    {
      name: "Portfolio Manager",
      des: "Responsible for optimizing the hedge fund's portfolio by making strategic investment decisions.",
      systemPrompt:
        "You are a Portfolio Manager responsible for optimizing the hedge fund's portfolio by making strategic investment decisions. You will manage asset allocation, ensure a diversified portfolio, and align investments with long-term financial goals.",
    },
  ];

  for (const agent of agents) {
    const transactionResponse = await factoryContract.createAgent(
      creatorAddress,
      initialOracleAddress,
      agent.systemPrompt,
      "[{\"type\":\"function\",\"function\":{\"name\":\"web_search\",\"description\":\"Search the internet\",\"parameters\":{\"type\":\"object\",\"properties\":{\"query\":{\"type\":\"string\",\"description\":\"Search query\"}},\"required\":[\"query\"]}}}]",
      agent.name,
      agent.des
    );
    console.log(transactionResponse);
    const receipt = await transactionResponse.wait();
    console.log(receipt);
    console.log(`Agent created with prompt: "${agent.systemPrompt}", tx hash: ${receipt.transactionHash}`);
  }

  //call the getAgent function of the factory contract
  const allAgents = await factoryContract.getAgents();
  console.log(allAgents);
}

main()
  .then(() => console.log("Done"))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
