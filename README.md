# HashMind

![WhatsApp Image 2024-09-08 at 17 31 23_eff64aa5](https://github.com/user-attachments/assets/c33e16d5-7ed0-41c6-b446-6d675595d78e)

![Screenshot 2024-09-08 172436 1](https://github.com/user-attachments/assets/dc5dd013-b661-46a2-b523-bcf537ae0866)


## Table of Contents 

- [HashMind](#hashmind)
  - [Table of Contents](#table-of-contents)
  - [Project Idea](#project-idea)
  - [Our Approach](#our-approach)
  - [Architecture](#architecture)
  - [Technologies We Used](#technologies-we-used)
    - [XMTP Chat Interface](#xmtp-chat-interface)
    - [Hedera Consensus Service](#hedera-consensus-service)
    - [Galadrieal Factory Contract](#galadrieal-factory-contract)
    - [Web3Auth](#web3auth)
    - [Lit Protocol](#lit-protocol)
  - [Challenges we Faced](#challenges-we-faced)
  - [Installation and Setup Guide](#installation-and-setup-guide)
    - [Install the Next.js Frontend](#install-the-nextjs-frontend)
    - [Setup backend for lit protocol](#setup-backend-for-lit-protocol)
    - [Follow these steps to set up message kit for XMTP:](#follow-these-steps-to-set-up-message-kit-for-xmtp)
  - [Team Members](#team-members)

## Project Idea
Decentralized Marketplace for crowd-sourced, AI-agents for all things finance.

We're creating an AI-powered investment advisor marketplace. Why rely on the judgment of a single AI when you can have an entire army of specialized agents at your fingertips? 

Each agent is equipped with unique skills, from scouring the internet and analyzing financial reports to uncover hidden opportunities, to constantly monitoring candlestick patterns for the next strategic move. 

The complexity of hedge fund operations shows a clear demand for a marketplace where these specialized AI agents can thrive and deliver precise, actionable insights.

This vision is enhanced by enabling everyday users to create specialized agents simply by chatting with our bot. Through a chat interface, users can easily develop these agents, which can then be sold and utilized on the marketplace, allowing the creators to earn revenue from their contributions.
## Our Approach

## Architecture 

![Screenshot 2024-09-08 193419](https://github.com/user-attachments/assets/adf52161-9713-4bd0-9996-6e3977dab30a)



## Technologies We Used

Here’s how we have used various technologies to make this project a reality.

![Nextjs](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Expressjs](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Nodejs](https://img.shields.io/badge/node.js-%2343853D.svg?style=for-the-badge&logo=node-dot-js&logoColor=white)

### XMTP Chat Interface

To make the agent creation process seamless,  we use the bot creation feature from XMTP. This enables everyday users to use our product by abstracting away all the complexity behind the chat interface.


### Hedera Consensus Service

Hedera enables unique internal dialogue for AI agents through its distributed consensus service, allowing for rapid and reliable decision-making in decentralized environments.

### Galadrieal Factory Contract

Galadriel is a Layer 1 blockchain specifically designed for AI applications, allowing developers to build decentralized AI solutions using familiar Solidity smart contracts, effectively bridging the gap between blockchain and artificial intelligence.

Agent creation is enabled through an agent factory contract that will be responsible for creating custom agents with prompts set by the user. These prompts can be customized by providing tools like APIs, docs, search, etc. These agent contracts will be associated with the original creator and whenever this agent is used.

### Web3Auth 

Web3Auth integration provides a seamless onboarding experience, allowing users to authenticate using familiar Web2 providers while securely connecting to blockchain wallets. 

In our case, the UX helps the new user to seemlessly create a wallet and start using the platform right away.

### Lit Protocol

Lit Protocol offers decentralized encryption and access control mechanisms, ensuring robust protection for user privacy and sensitive data in blockchain-based applications, enhancing overall security and trust.

We encrypt the custom user instructions and give access only to the requried agents. This ensures that the user's data is safe and secure.

## Challenges we Faced

1. On-demand agent creation allows the system to dynamically generate and deploy agents tailored to specific user tasks or needs in real-time. These agents are designed to execute actions and respond based on user requirements.

2. Web3 authentication enables secure, decentralized transaction handling on behalf of users. This ensures that all blockchain-based actions are authenticated without compromising the user's control or ownership of their assets.

3. Privacy protection is a core feature, ensuring that users' personal details remain encrypted and inaccessible to unauthorized parties. The system is designed to handle sensitive data with strict confidentiality and security protocols.

4. Agent communication facilitates seamless interactions between autonomous agents, enabling them to collaborate, share information, and execute complex tasks in a coordinated manner. This inter-agent dialogue ensures efficient problem-solving and task management, which has been incorporated using Hedera.


## Installation and Setup Guide
To get started with Deano, follow these steps:

1. Clone the repo: `git clone https://github.com/Shubham-Rasal/HashMind.git`
2. `cd HashMind`

### Install the Next.js Frontend

1. Change directory to client by `cd dashboard`
2. Install npm packages by running `npm i`
3. setup env variable according to .env.example file
4. Start the dev server by running `npm run dev`

### Setup backend for lit protocol

1. Change directory to client by `cd backend`
2. Install npm packages by running `npm i`
3. setup .env file which will have env variable `PRIVATE_KEY`, which will be your Ethereum wallet address
4. Start the dev server by running `npm start`

### Follow these steps to set up message kit for XMTP:

1. Navigate to the project directory:
    ```sh
    cd ./message-kit
    ```

2. Install dependencies:
    ```sh
    npm install
    ```
3. Set up these variables in your app

```sh
KEY= # 0x... the private key of the app (with the 0x prefix)
REDIS_CONNECTION_STRING= # redis db connection string
MSG_LOG=true # logs the message on the console
```

4. Run the project:
    ```sh
    npm dev
    ```

## Team Members

[Shubham Rasaal](https://devfolio.co/@bluequbits)

[Ayush Kumar Singh](https://devfolio.co/@ayush4345)

[Mardav Chirag Gandhi](https://devfolio.co/@MCG)
