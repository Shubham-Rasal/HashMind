import { getRedisClient } from "./lib/redis.js";
import { run, HandlerContext } from "@xmtp/message-kit";
import { startCron } from "./lib/cron.js";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const privateKey = process.env.PRIVATE_KEY;

if (!privateKey) {
  throw new Error("PRIVATE_KEY env var is required");
}

const wallet = new ethers.Wallet(privateKey, provider);
const contractAddress = process.env.AGENT_FACTORY_ADDRESS;

if (!contractAddress) {
  throw new Error("AGENT_FACTORY_ADDRESS env var is required");
}

const contractABI: readonly any[] = [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "agentAddress",
            "type": "address"
          }
        ],
        "name": "AgentCreated",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "agentToCreator",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "agents",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "creatorAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "initialOracleAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "systemPrompt",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "tools",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          }
        ],
        "name": "createAgent",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getAgents",
        "outputs": [
          {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "agent",
            "type": "address"
          }
        ],
        "name": "getCreator",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
];

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// List of valid tools
const validTools = ["web_search", "codeinterpreter", "image_gen"];

// Tracks conversation steps
const inMemoryCacheStep = new Map<string, number>();

// List of words to stop or unsubscribe
const stopWords = ["stop", "unsubscribe", "cancel", "list"];

const redisClient = await getRedisClient();

let clientInitialized = false;
run(async (context: HandlerContext) => {
  const {
    client,
    message: {
      content: { content: text },
      typeId,
      sender,
    },
  } = context;
  console.log(sender);
  if (!clientInitialized) {
    startCron(redisClient, client);
    clientInitialized = true;
  }
  if (typeId !== "text") {
    return;
  }

  const lowerContent = text?.toLowerCase();

  // Handles unsubscribe and resets step
  if (stopWords.some((word) => lowerContent.includes(word))) {
    inMemoryCacheStep.set(sender.address, 0);
    await redisClient.del(sender.address);
    await context.reply(
      "You are now unsubscribed. You will no longer receive updates. Type 'start' to begin again.",
    );
    return;
  }

  const cacheStep = inMemoryCacheStep.get(sender.address) || 0;
  let message = "";
  let userResponse = "";

  switch (cacheStep) {
    case 0:
      message = "Welcome to the AI Agent Configuration Bot! Let's get started. What's the name you want to give your AI agent?";
      inMemoryCacheStep.set(sender.address, 1);
      break;
    case 1:
      userResponse = text;
      await redisClient.hSet(sender.address, "name", userResponse);
      message = "Great name! Now, please provide a brief description of your AI agent.";
      inMemoryCacheStep.set(sender.address, 2);
      break;
    case 2:
      userResponse = text;
      await redisClient.hSet(sender.address, "description", userResponse);
      message = "Excellent! Now, what's the primary topic or domain your AI agent will focus on?";
      inMemoryCacheStep.set(sender.address, 3);
      break;
    case 3:
      userResponse = text;
      await redisClient.hSet(sender.address, "topic", userResponse);
      message = "Great! Now, what tools would you like your AI agent to have access to? Choose from: web_search, codeinterpreter, image_gen. You can select multiple by separating them with commas.";
      inMemoryCacheStep.set(sender.address, 4);
      break;
    case 4:
      userResponse = text.toLowerCase().split(',').map((tool: string) => tool.trim());
      const validUserTools = (userResponse as any).filter((tool: string) => validTools.includes(tool));
      if (validUserTools.length === 0) {
        message = "No valid tools selected. Please choose from: web_search, codeinterpreter, image_gen.";
      } else {
        await redisClient.hSet(sender.address, "tools", validUserTools.join(','));
        message = "Understood. Lastly, please provide a system-level prompt for your AI agent. This will guide its behavior and responses.";
        inMemoryCacheStep.set(sender.address, 5);
      }
      break;
    case 5:
      userResponse = text;
      await redisClient.hSet(sender.address, "system_prompt", userResponse);
      
      // Compile all user responses
      const compiledResponses = await redisClient.hGetAll(sender.address);
      
      // Store compiled responses
      await redisClient.set(`${sender.address}_compiled`, JSON.stringify(compiledResponses));
      

      try {
        const tx = await contract.createAgent(
          sender.address,
          "0x68EC9556830AD097D661Df2557FBCeC166a0A075", // initialOracleAddress
          compiledResponses.system_prompt,
          "[{\"type\":\"function\",\"function\":{\"name\":\"web_search\",\"description\":\"Search the internet\",\"parameters\":{\"type\":\"object\",\"properties\":{\"query\":{\"type\":\"string\",\"description\":\"Search query\"}},\"required\":[\"query\"]}}}]", // tools
          compiledResponses.name,
          compiledResponses.description
        );
        console.log(tx);
        console.log("Smart contract called successfully");
        
        message = "Thank you for providing all the information! Your AI agent configuration is complete and has been sent to the blockchain. Here's a summary of your choices:\n\n" +
                  `Name: ${compiledResponses.name}\n` +
                  `Description: ${compiledResponses.description}\n` +
                  `Topic: ${compiledResponses.topic}\n` +
                  `Tools: ${compiledResponses.tools}\n` +
                  `System Prompt: ${compiledResponses.system_prompt}\n` +
                  `Creator Address: ${sender.address}\n\n` +
                  `Transaction Hash: ${tx.hash}\n\n`
                  "Type 'reset' if you want to start over, or 'stop' to end the conversation.";
      } catch (error) {
        console.error("Error calling smart contract:", error);
        message = "An error occurred while creating your AI agent. Please try again later.";
      }
      
      inMemoryCacheStep.set(sender.address, 6);
      break;
    case 6:
      if (lowerContent === 'reset') {
        inMemoryCacheStep.set(sender.address, 0);
        await redisClient.del(sender.address);
        await redisClient.del(`${sender.address}_compiled`);
        message = "Configuration reset. Let's start over. What's the name you want to give your AI agent?";
      } else {
        message = "Your AI agent configuration is already complete. Type 'reset' to start over or 'stop' to end the conversation.";
      }
      break;
    default:
      message = "I'm sorry, but I didn't understand that. Please type 'reset' to start over or 'stop' to end the conversation.";
      break;
  }

  // Send the message
  await context.reply(message);

});