"use client";

import { useState, useEffect } from "react";
import { Contract, ethers, Wallet } from "ethers";
import { abi } from "@/abis/Agent.sol/Agent.json";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RPC from "@/utils/ethersRPC";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronRight,
  Copy,
  MessageSquare,
  Plus,
  Wallet as WalletIcon,
  X,
} from "lucide-react";
import { Agent } from "@/app/dashboard/page";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import { createTopic, submitMessage } from "@/app/actions/hedera-consensus-service";
import { Client, PrivateKey } from "@hashgraph/sdk";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserProfileDialog } from "./user-profile-dialog";


import {
  createTopic,
  submitMessage,
} from "@/app/actions/hedera-consensus-service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
const clientId =
  "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa289",
  tickerName: "Galadriel Devnet",
  ticker: "GAL",
  blockExplorerUrl: "https://explorer.galadriel.com",
  rpcTarget: "https://devnet.galadriel.com/",
};
// const chainConfig = {
//   chainNamespace: CHAIN_NAMESPACES.EIP155,
//   chainId: "0x1",
//   tickerName: "Ethereum Mainnet",
//   ticker: "ETH",
//   blockExplorerUrl: "https://etherscan.io",
//   rpcTarget: "https://rpc.ankr.com/eth",
// };

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});

type Chat = {
  id: string;
  name: string;
  agents: Agent[];
  messages: { role: "user" | "agent"; content: string; agentId?: string }[];
  topicId?: string;
};

type AgentProp = {
  agents: Agent[];
};

interface Message {
  role: string;
  content: string;
}

export function MultiAgentChat(props: AgentProp) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [input, setInput] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([]);
  const [activeTab, setActiveTab] = useState<"chats" | "marketplace">("chats");
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [userProfile, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  console.log(userProfile)

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          const user = await web3auth.getUserInfo();

          setUser(user);
          setIsWalletConnected(true);
        }

        if (provider) {
          const address = await RPC.getAccounts(provider);
          setWalletAddress(address);
          const balance = await RPC.getBalance(provider);
          setBalance(balance);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userProfile && web3auth.connected) {
        try {
          const user = await web3auth.getUserInfo();
          setUser(user);
          setIsWalletConnected(true);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    };

    fetchUserProfile();
  }, [userProfile, web3auth.connected]);

  useEffect(() => {
    const savedChats = localStorage.getItem("chats");
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("chats", JSON.stringify(chats));
    }
  }, [chats]);

  // {
  //   "messages": [
  //   {
  //   "chunk_info": {
  //   "initial_transaction_id": {
  //   "account_id": "0.0.4736457",
  //   "nonce": 0,
  //   "scheduled": false,
  //   "transaction_valid_start": "1725774788.712887344"
  //   },
  //   "number": 1,
  //   "total": 1
  //   },
  //   "consensus_timestamp": "1725774803.854314000",
  //   "message": "QWdlbnQ6IDB4NWE4MzZkNTZFZTI1MTdGNDAwQzk3NmU4QTNCRTBmRjI1NmRiM2IwNiwgTWVzc2FnZTogWW91IGFyZSBhIGN1cmF0b3IgZm9yIHJlY2FwcGluZyBhbmQgc3VtbWFyaXNpbmcgdGhlIHJlc3BvbnNlcyBmcm9tIGFsbCB0aGUgYWdlbnRzIGludm9sdmVkIGluIHRoZSBjb252ZXJzYXRpb24uIFlvdSBtYWtlIAogICAgICBzaG9ydCBhbmQgZ29vZCBzdW1tYXJpZXMgb2YgdGhlIGNvbnZlcnNhdGlvbiBhbmQgcHJvdmlkZSBpdCB0byB0aGUgdXNlciBvbmx5IGlmIHRoZSB1c2VyIGFza3MgZm9yIGl0LiBETyBOT1QgcmVzcG9uZCB1bnRpbCB1c2VyIGhhcyBub3QgbWVudGlvbmVkCiAgICAgIHlvdSBpbiB0aGUgY29udmVyc2lvbi4gWW91IGFyZSB0aGUgbGFzdCBhZ2VudCB0byByZXNwb25kIGluIHRoZSBjb252ZXJzYXRpb24uLCBUaW1lc3RhbXA6IDIwMjQtMDktMDhUMDU6NTM6MTYuODgzWg==",
  //   "payer_account_id": "0.0.4736457",
  //   "running_hash": "QUWFa4UPgk99sl3rMbmyiTMHi1Sm8Azzn2jUTNo8HBt6lKdGAGQ1kD3bnmS1/I2m",
  //   "running_hash_version": 3,
  //   "sequence_number": 1,
  //   "topic_id": "0.0.4837443"
  //   },]
  // }
  type HederaMessage = {
    chunk_info: {
      initial_transaction_id: {
        account_id: string;
        nonce: number;
        scheduled: boolean;
        transaction_valid_start: string;
      };
      number: number;
      total: number;
    };
    consensus_timestamp: string;
    message: string;
    decodedMessage: string;
    payer_account_id: string;
    running_hash: string;
    running_hash_version: number;
    sequence_number: number;
    topic_id: string;
  };

  const [agentMessages, setAgentMessages] = useState<HederaMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAgentMessages = async (topicId: string) => {
    try {
      const topicExplorerUrl = `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId.toString()}/messages`;
      const response = await fetch(topicExplorerUrl);
      const data = await response.json();
      return data.messages.map((msg: any) => ({
        ...msg,
        decodedMessage: atob(msg.message),
      }));
    } catch (error) {
      console.error("Error fetching agent messages:", error);
      return [];
    }
  };

  const handleDialogOpen = async () => {
    if (selectedChat && selectedChat.topicId) {
      setIsLoading(true);
      const messages = await fetchAgentMessages(selectedChat.topicId);
      setAgentMessages(messages);
      setIsLoading(false);
    }
  };

  const handleCreateChat = async () => {
    if (selectedAgents.length > 0) {
      try {
        // Initialize Hedera client

        // Create a new topic
        const { topicId } = await createTopic();
        console.log(topicId);

        // // Create a new chat with the topic ID
        const newChat: Chat = {
          id: Date.now().toString(),
          name: `Chat with ${selectedAgents.map((a) => a.name).join(", ")}`,
          agents: selectedAgents,
          messages: [],
          topicId: topicId ? topicId.toString() : "", // Add topicId to the chat object
        };

        console.log(newChat);

        setChats([...chats, newChat]);
        setSelectedChat(newChat);
        setSelectedAgents([]);
        setActiveTab("chats");
      } catch (error) {
        console.error("Error creating chat and topic:", error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() && selectedChat) {
      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, { role: "user", content: input }],
      };
      setChats(
        chats.map((chat) =>
          chat.id === selectedChat.id
            ? {
              ...updatedChat,
              messages: updatedChat.messages.map((message) => ({
                ...message,
                role: message.role as "user" | "agent",
              })),
            }
            : chat
        )
      );
      setSelectedChat({
        ...updatedChat,
        messages: updatedChat.messages.map((message) => ({
          ...message,
          role: message.role as "user" | "agent",
        })),
      });
      setInput("");

      // Call each agent and get their responses
      let allAgentMessages: Message[] = [];

      for (const agent of selectedChat.agents) {
        // Format the chat history to provide context to the agent
        const chatHistory = selectedChat.messages
          .map((message) => {
            const agentName = selectedChat.agents.find(
              (a) => a.address === message.agentId
            )?.name;
            return `${message.role === "user" ? "User" : agentName}: ${message.content
              }`;
          })
          .join("\n");

        // Append the user's name to the input for personalized results
        const personalizedInput = `${input} - ${userProfile.name}`;

        // Call the agent with the formatted chat history and personalized input
        const agentResponses = await callAgent(
          agent,
          `${chatHistory}\nUser: ${personalizedInput}`
        );
        const agentMessages = agentResponses.slice(-1).map((message) => ({
          role: "agent" as const,
          content: message.content,
          agentId: agent.address,
        }));

        // Format and submit all remaining messages except the last one to Hedera Consensus Service
        for (let i = 0; i < agentResponses.length - 1; i++) {
          const message = agentResponses[i];
          const formattedMessage = `Agent: ${agent.address}, Message: ${message.content
            }, Timestamp: ${new Date().toISOString()}`;
          try {
            if (selectedChat.topicId) {
              const response = await submitMessage(
                selectedChat.topicId,
                formattedMessage
              );
              console.log(response);
            } else {
              console.error("Topic ID is undefined");
            }
          } catch (error) {
            console.error(
              "Error submitting message to Hedera Consensus Service:",
              error
            );
          }
        }

        allAgentMessages = [...allAgentMessages, ...agentMessages];
      }

      const updatedChatWithResponses = {
        ...updatedChat,
        messages: [...updatedChat.messages, ...allAgentMessages],
      };

      setChats(
        chats.map((chat) =>
          chat.id === selectedChat.id
            ? {
              ...updatedChatWithResponses,
              messages: updatedChatWithResponses.messages.map((message) => ({
                ...message,
                role: message.role as "user" | "agent",
              })),
            }
            : chat
        )
      );
      setSelectedChat({
        ...updatedChatWithResponses,
        messages: updatedChatWithResponses.messages.map((message) => ({
          ...message,
          role: message.role as "user" | "agent",
        })),
      });
    }
  };

  const handleConnectWallet = async () => {
    try {
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      if (web3auth.connected) {
        setIsWalletConnected(true);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleCopyWalletAddress = () => {
    if (userProfile) {
      if (walletAddress) {
        navigator.clipboard.writeText(walletAddress);
      }
      // You might want to show a toast or some feedback here
    }
  };

  const callAgent = async (agent: Agent, query: string): Promise<Message[]> => {
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
    if (!rpcUrl) throw Error("Missing NEXT_PUBLIC_RPC_URL in .env");
    const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
    if (!privateKey) throw Error("Missing NEXT_PUBLIC_PRIVATE_KEY in .env");
    const contractAddress = agent.address;
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new Wallet(privateKey, provider);
    const contract = new Contract(contractAddress, abi, wallet);
    const maxIterations = 5; 

    // Call the runAgent function
    const transactionResponse = await contract.runAgent(query, maxIterations);
    const receipt = await transactionResponse.wait();

    // Get the agent run ID from transaction receipt logs
    const agentRunID = getAgentRunId(receipt, contract);
    if (!agentRunID && agentRunID !== 0) {
      return [];
    }

    let allMessages: Message[] = [];
    let exitNextLoop = false;
    while (true) {
      const newMessages: Message[] = await getNewMessages(
        contract,
        agentRunID,
        allMessages.length
      );
      if (newMessages) {
        allMessages = [...allMessages, ...newMessages];
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (exitNextLoop) {
        break;
      }
      if (await contract.isRunFinished(agentRunID)) {
        exitNextLoop = true;
      }
    }
    return allMessages;
  };

  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const address = await RPC.getAccounts(provider);
    console.log("address", address);
    setWalletAddress(address);
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const balance = await RPC.getBalance(provider);
    setBalance(balance);
  };

  useEffect(() => {
    if (provider) {
      getAccounts();
      getBalance();
    }
  }, [provider]);

  const getAgentRunId = (
    receipt: ethers.TransactionReceipt,
    contract: ethers.Contract
  ) => {
    let agentRunID;
    for (const log of receipt.logs) {
      try {
        const parsedLog = contract.interface.parseLog(log);
        if (parsedLog && parsedLog.name === "AgentRunCreated") {
          agentRunID = ethers.toNumber(parsedLog.args[1]);
        }
      } catch (error) {
        console.log("Could not parse log:", log);
      }
    }
    return agentRunID;
  };

  const getNewMessages = async (
    contract: ethers.Contract,
    agentRunID: number,
    currentMessagesCount: number
  ): Promise<Message[]> => {
    const messages = await contract.getMessageHistory(agentRunID);

    const newMessages: Message[] = [];
    messages.forEach((message: any, i: number) => {
      if (i >= currentMessagesCount) {
        newMessages.push({
          role: message.role,
          content: message.content[0].value,
        });
      }
    });
    return newMessages;
  };

  return (
    <div className="grid grid-cols-12 h-screen bg-green-700/10">
      {/* Sidebar */}
      <div className="col-span-3 bg-slate-100 shadow-lg flex flex-col h-screen overflow-hidden sticky top-0">
        <div className="p-6 font-bold text-xl text-gray-900 border-b border-gray-200">
          Multi-Agent Chat
        </div>
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "chats" | "marketplace")
          }
          className="flex-grow flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2 rounded">
            <TabsTrigger value="chats">Chats</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          </TabsList>
          <TabsContent value="chats" className="flex flex-col overflow-hidden">
            <div className="p-4 flex flex-col">
              <Button
                className="w-full border-none mb-4 rounded bg-green-700 text-white hover:bg-green-700/90 hover:text-white"
                variant="outline"
                onClick={() => setActiveTab("marketplace")}
              >
                <Plus className="mr-2 h-4 w-4" /> New Chat
              </Button>
              <div className="overflow-y-auto flex flex-col gap-2 scrollbar-hide">
                {chats.map((chat) => (
                  <Button
                    key={chat.id}
                    variant="ghost"
                    className="justify-start mb-1 font-normal border border-green-700 rounded-lg p-2 w-full"
                    onClick={() => setSelectedChat(chat)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate overflow-hidden">
                      {chat.name}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <Separator />
        <div className="p-4">
          {!isWalletConnected && (
            <Button
              variant="default"
              className="w-full"
              onClick={handleConnectWallet}
            >
              <WalletIcon className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          )}
          {isWalletConnected && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-4 mb-4">
                <div>
                  <Avatar>
                    <AvatarImage src={`${userProfile.profileImage}`} />
                    <AvatarFallback>{userProfile.name.toUpperCase().slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold">{userProfile ? userProfile.name : "User"}</h3>
                  <p className="text-sm text-gray-500">{userProfile ? userProfile.email : "Email"}</p>
                  <UserProfileDialog
                    triggerButton={(
                      <Button className="mt-2 bg-black text-white hover:text-black">Edit Profile</Button>
                    )}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2 justify-between w-full">
                  <h3 className="font-semibold">Balance:</h3>
                  <h4 className="text-sm text-gray-500 font-medium text-center flex items-center">
                    {balance} GAL
                  </h4>
                </div>
              </div>
              <div className="mt-2 bg-white border border-gray-200 rounded flex items-center">
                <span className="text-xs text-gray-500 px-2 py-1 flex-grow truncate">
                  {walletAddress
                    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(
                      -4
                    )}`
                    : ""}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyWalletAddress}
                  className="h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Area */}
      <div className="col-span-9 flex flex-col overflow-y-auto">
        {activeTab === "marketplace" ? (
          <div className="flex-grow overflow-auto h-screen">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Agent Marketplace</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {props.agents.map((agent: Agent) => (
                  <Card
                    key={agent.address}
                    className="overflow-hidden shadow-md rounded-md bg-white"
                  >
                    <CardHeader className="p-4">
                      <div className="flex space-y-2 items-center space-x-4">
                        <div className="flex flex-col gap-2">
                          <CardTitle>{agent.name}</CardTitle>
                          <CardDescription>{agent.des}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="mt-2">
                        <div className="flex flex-wrap mt-1 items-center justify-between">
                          <p className="text-sm font-medium">Creator:</p>
                          <span className="text-sm text-gray-500">
                            {agent.creator.slice(0, 8)}...
                            {agent.creator.slice(-4)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              navigator.clipboard.writeText(agent.creator)
                            }
                            className="h-8 w-8"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4">
                      <Button
                        variant="outline"
                        className="w-full rounded"
                        color="primary"
                        onClick={() =>
                          setSelectedAgents((prev) =>
                            prev.some((a) => a.address === agent.address)
                              ? prev.filter((a) => a.address !== agent.address)
                              : [...prev, agent]
                          )
                        }
                      >
                        {selectedAgents.some((a) => a.address === agent.address)
                          ? "Remove from Chat"
                          : "Add to Chat"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
            {selectedAgents.length > 0 && (
              <div className="fixed bottom-0 left-72 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {selectedAgents.length} agent
                    {selectedAgents.length !== 1 ? "s" : ""} selected
                  </div>
                  <Button onClick={handleCreateChat}>Create Chat</Button>
                </div>
              </div>
            )}
          </div>
        ) : selectedChat ? (
          <>
            <div className="bg-white border-b border-gray-200 p-4 flex items-center shadow-sm sticky top-0 z-10">
              <h2 className="font-semibold text-lg text-gray-800 flex-grow">
                {selectedChat.name}
              </h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                  onClick={handleDialogOpen}
                  variant="outline">View Agent Dialog</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] bg-white rounded">
                  <DialogHeader>
                    <DialogTitle>Agent Internal Dialog</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className=" h-[400px] w-full rounded-md border p-4">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-lg text-gray-500">
                          Loading agent dialog...
                        </p>
                      </div>
                    ) : (
                      agentMessages.map((msg, index) => (
                        <div
                          key={index}
                          className="mb-6 flex items-start space-x-4"
                        >
                          <div className="flex-1 space-y-1">
                            <p className="text-sm text-gray-500">
                              <strong>Agent:</strong>{" "}
                              {msg.chunk_info.initial_transaction_id.account_id}
                            </p>
                            <p className="text-sm text-gray-500">
                              <strong>Message:</strong> {msg.decodedMessage}
                            </p>
                            <p className="text-sm text-gray-500">
                              <strong>Timestamp:</strong>{" "}
                              {new Date(
                                parseFloat(msg.consensus_timestamp) * 1000
                              ).toISOString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </ScrollArea>
                </DialogContent>
              </Dialog>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedChat(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-grow p-4 h-full">
              {selectedChat.messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"
                    }`}
                >
                  <div
                    className={`inline-block p-3 rounded-xl ${message.role === "user"
                      ? "bg-green-700 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }`}
                  >
                    {message.role === "agent" && (
                      <div className="font-semibold text-sm mb-1 text-green-700">
                        {
                          selectedChat.agents.find(
                            (a) => a.address === message.agentId
                          )?.name
                        }
                      </div>
                    )}
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="p-4 bg-white border-t bottom-0 sticky border-gray-200 shadow-sm">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-grow"
                />
                <Button onClick={handleSendMessage} className="bg-green-700/30 text-black hover:bg-green-700 hover:text-white">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500">
            Select a chat or create a new one to start
          </div>
        )}
      </div>
    </div>
  );
}
