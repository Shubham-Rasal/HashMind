import { getRedisClient } from "./lib/redis.js";
import { run } from "@xmtp/message-kit";
import { startCron } from "./lib/cron.js";
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
        /* If the input is not text do nothing */
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
            message = "Welcome to the AI Agent Configuration Bot! Let's get started. What's the main topic or domain you want your AI agent to focus on? Options: [1] General Knowledge, [2] Finance, [3] Healthcare, [4] Technology, [5] Other (please specify)";
            inMemoryCacheStep.set(sender.address, 1);
            break;
        case 1:
            userResponse = text;
            await redisClient.hSet(sender.address, "topic", userResponse);
            message = "Great! Now, what specific tools or APIs would you like your AI agent to have access to? Options: [1] Web Search, [2] Data Analysis, [3] Image Generation, [4] Natural Language Processing, [5] Other (please specify)";
            inMemoryCacheStep.set(sender.address, 2);
            break;
        case 2:
            userResponse = text;
            await redisClient.hSet(sender.address, "tools", userResponse);
            message = "Excellent choice! Are there any specific websites, databases, or resources you want your AI agent to reference? Options: [1] Wikipedia, [2] Academic Journals, [3] Government Databases, [4] Social Media, [5] Other (please provide links or names)";
            inMemoryCacheStep.set(sender.address, 3);
            break;
        case 3:
            userResponse = text;
            await redisClient.hSet(sender.address, "resources", userResponse);
            message = "Thank you! Now, what's the primary goal or task you want your AI agent to accomplish? Options: [1] Answer Questions, [2] Analyze Data, [3] Generate Content, [4] Assist with Decision Making, [5] Other (please specify)";
            inMemoryCacheStep.set(sender.address, 4);
            break;
        case 4:
            userResponse = text;
            await redisClient.hSet(sender.address, "goal", userResponse);
            message = "Understood. Lastly, are there any specific constraints or ethical guidelines you want your AI agent to follow? Options: [1] Protect User Privacy, [2] Avoid Biased Language, [3] Fact-Check Information, [4] Respect Intellectual Property, [5] Other (please specify)";
            inMemoryCacheStep.set(sender.address, 5);
            break;
        case 5:
            userResponse = text;
            await redisClient.hSet(sender.address, "constraints", userResponse);
            // Compile all user responses
            const compiledResponses = await redisClient.hGetAll(sender.address);
            // Store compiled responses (This is where you'd send to the smart contract)
            await redisClient.set(`${sender.address}_compiled`, JSON.stringify(compiledResponses));
            message = "Thank you for providing all the information! Your AI agent configuration is complete. Here's a summary of your choices:\n\n" +
                `Topic: ${compiledResponses.topic}\n` +
                `Tools: ${compiledResponses.tools}\n` +
                `Resources: ${compiledResponses.resources}\n` +
                `Goal: ${compiledResponses.goal}\n` +
                `Constraints: ${compiledResponses.constraints}\n\n` +
                "Type 'reset' if you want to start over, or 'stop' to end the conversation.";
            inMemoryCacheStep.set(sender.address, 6);
            break;
        case 6:
            if (lowerContent === 'reset') {
                inMemoryCacheStep.set(sender.address, 0);
                await redisClient.del(sender.address);
                await redisClient.del(`${sender.address}_compiled`);
                message = "Configuration reset. Let's start over. What's the main topic or domain you want your AI agent to focus on? Options: [1] General Knowledge, [2] Finance, [3] Healthcare, [4] Technology, [5] Other (please specify)";
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