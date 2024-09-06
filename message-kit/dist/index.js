import { getRedisClient } from "./lib/redis.js";
import { run } from "@xmtp/message-kit";
import { startCron } from "./lib/cron.js";
// const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
// const privateKey = "YOUR_PRIVATE_KEY";
// const wallet = new ethers.Wallet(privateKey, provider);
// const contractAddress = "YOUR_CONTRACT_ADDRESS";
// const contractABI: readonly any[] = [
//   // Your contract ABI here
// ];
// const contract = new ethers.Contract(contractAddress, contractABI, wallet);
// List of valid tools
const validTools = ["web_search", "codeinterpreter", "image_gen"];
// Tracks conversation steps
const inMemoryCacheStep = new Map();
// List of words to stop or unsubscribe
const stopWords = ["stop", "unsubscribe", "cancel", "list"];
const redisClient = await getRedisClient();
let clientInitialized = false;
run(async (context) => {
    const { client, message: { content: { content: text }, typeId, sender, }, } = context;
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
        await context.reply("You are now unsubscribed. You will no longer receive updates. Type 'start' to begin again.");
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
            message = "Excellent! Now, what's the main topic or domain you want your AI agent to focus on? Options: [1] General Knowledge, [2] Finance, [3] Healthcare, [4] Technology, [5] Other (please specify)";
            inMemoryCacheStep.set(sender.address, 3);
            break;
        case 3:
            userResponse = text;
            await redisClient.hSet(sender.address, "topic", userResponse);
            message = "Great! Now, what tools would you like your AI agent to have access to? Choose from: web_search, codeinterpreter, image_gen. You can select multiple by separating them with commas.";
            inMemoryCacheStep.set(sender.address, 4);
            break;
        case 4:
            userResponse = text.toLowerCase().split(',').map((tool) => tool.trim());
            const validUserTools = userResponse.filter((tool) => validTools.includes(tool));
            if (validUserTools.length === 0) {
                message = "No valid tools selected. Please choose from: web_search, codeinterpreter, image_gen.";
            }
            else {
                await redisClient.hSet(sender.address, "tools", validUserTools.join(','));
                message = "Thank you! Now, what's the primary goal or task you want your AI agent to accomplish?";
                inMemoryCacheStep.set(sender.address, 5);
            }
            break;
        case 5:
            userResponse = text;
            await redisClient.hSet(sender.address, "goal", userResponse);
            message = "Understood. Lastly, please provide a system-level prompt for your AI agent. This will guide its behavior and responses.";
            inMemoryCacheStep.set(sender.address, 6);
            break;
        case 6:
            userResponse = text;
            await redisClient.hSet(sender.address, "system_prompt", userResponse);
            // Compile all user responses
            const compiledResponses = await redisClient.hGetAll(sender.address);
            // Store compiled responses
            await redisClient.set(`${sender.address}_compiled`, JSON.stringify(compiledResponses));
            // Call smart contract
            // try {
            //   const tx = await contract.configureAIAgent(
            //     sender.address,
            //     compiledResponses.name,
            //     compiledResponses.description,
            //     compiledResponses.topic,
            //     compiledResponses.tools,
            //     compiledResponses.goal,
            //     compiledResponses.system_prompt
            //   );
            //   await tx.wait();
            //   console.log("Smart contract called successfully");
            // } catch (error) {
            //   console.error("Error calling smart contract:", error);
            // }
            message = "Thank you for providing all the information! Your AI agent configuration is complete and has been sent to the blockchain. Here's a summary of your choices:\n\n" +
                `Name: ${compiledResponses.name}\n` +
                `Description: ${compiledResponses.description}\n` +
                `Topic: ${compiledResponses.topic}\n` +
                `Tools: ${compiledResponses.tools}\n` +
                `Goal: ${compiledResponses.goal}\n` +
                `System Prompt: ${compiledResponses.system_prompt}\n` +
                `Creator Address: ${sender.address}\n\n` +
                "Type 'reset' if you want to start over, or 'stop' to end the conversation.";
            inMemoryCacheStep.set(sender.address, 7);
            break;
        case 7:
            if (lowerContent === 'reset') {
                inMemoryCacheStep.set(sender.address, 0);
                await redisClient.del(sender.address);
                await redisClient.del(`${sender.address}_compiled`);
                message = "Configuration reset. Let's start over. What's the name you want to give your AI agent?";
            }
            else {
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
//# sourceMappingURL=index.js.map