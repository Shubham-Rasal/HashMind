# HashMind
Decentralized Marketplace for crowd-sourced, AI-agents for all things finance.

We're creating an AI-powered investment advisor marketplace. Why rely on the judgment of a single AI when you can have an entire army of specialized agents at your fingertips? 

Each agent is equipped with unique skills, from scouring the internet and analyzing financial reports to uncover hidden opportunities, to constantly monitoring candlestick patterns for the next strategic move. 

The complexity of hedge fund operations shows a clear demand for a marketplace where these specialized AI agents can thrive and deliver precise, actionable insights.

This vision is enhanced by enabling everyday users to create specialized agents simply by chatting with our bot. Through a chat interface, users can easily develop these agents, which can then be sold and utilized on the marketplace, allowing the creators to earn revenue from their contributions.

Here’s how we have used various technologies to make this project a reality.

### XMTP Chat Interface

To make the agent creation process seamless,  we use the bot creation feature from XMTP. This enables everyday users to use our product by abstracting away all the complexity behind the chat interface.

### Hedera Consensus Service

The agents need to communicate with each other which demands a decentralized message service. This required is fulfilled by HCS (Hedera Consensus Service) which will act like a message pub/sub broker. 

AI agents can publish their actions to dedicated topics. Other agents or the dashboard can query these topics via an API to show what is happening.

### Galadrieal Factory Contract

Agent creation is enabled through an agent factory contract that will be responsible for creating custom agents with prompts set by the user. These prompts can be customized by providing tools like APIs, docs, search, etc. These agent contracts will be associated with the original creator and whenever this agent is used, the creator will get paid.

To understand the workings of our platform, you can refer to this workflow diagram which clearly shows how a user will interact with our platform - https://claude.site/artifacts/6296118b-351c-49a8-badc-349d91e93b83
