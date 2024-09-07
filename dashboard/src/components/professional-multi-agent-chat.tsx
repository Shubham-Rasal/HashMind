"use client";

import { useState, useEffect } from "react";
import { Contract, ethers, Wallet } from "ethers";
import { abi } from "@/abis/Agent.sol/Agent.json";
import { Button } from "@/components/ui/button";
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

const clientId =
  "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa289",
  tickerName: "Galadriel Devnet",
  ticker: "GAL",
  blockExplorerUrl: "https://explorer.galadriel.com",
  rpcTarget: "https://devnet.galadriel.com/",
};

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
};

const tools = ["test", "Test", "Test"];

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
  const [accounts, setAccounts] = useState<string[] | null>(null);

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
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

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

  const handleCreateChat = () => {
    if (selectedAgents.length > 0) {
      const newChat: Chat = {
        id: Date.now().toString(),
        name: `Chat with ${selectedAgents.map((a) => a.name).join(", ")}`,
        agents: selectedAgents,
        messages: [],
      };
      setChats([...chats, newChat]);
      setSelectedChat(newChat);
      setSelectedAgents([]);
      setActiveTab("chats");
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
      for (const agent of selectedChat.agents) {
        const agentResponses = await callAgent(agent, input);
        const agentMessages = agentResponses.map((message) => ({
          role: "agent" as const,
          content: message.content,
          agentId: agent.address,
        }));
        const updatedChatWithResponses = {
          ...updatedChat,
          messages: [...updatedChat.messages, ...agentMessages],
        };
        setChats(
          chats.map((chat) =>
            chat.id === selectedChat.id
              ? {
                  ...updatedChatWithResponses,
                  messages: updatedChatWithResponses.messages.map(
                    (message) => ({
                      ...message,
                      role: message.role as "user" | "agent",
                    })
                  ),
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
      navigator.clipboard.writeText(userProfile.walletAddress);
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

    const maxIterations = 5; // Set a default value for max iterations

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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 font-bold text-lg text-gray-800">
          Multi-Agent Chat
        </div>
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "chats" | "marketplace")
          }
          className="flex-grow flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chats">Chats</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          </TabsList>
          <TabsContent value="chats" className="flex-grow flex flex-col">
            <ScrollArea className="flex-grow">
              <div className="p-4">
                <Button
                  className="w-full mb-4"
                  variant="outline"
                  onClick={() => setActiveTab("marketplace")}
                >
                  <Plus className="mr-2 h-4 w-4" /> New Chat
                </Button>
                {chats.map((chat) => (
                  <Button
                    key={chat.id}
                    variant="ghost"
                    className="w-full justify-start mb-1 font-normal"
                    onClick={() => setSelectedChat(chat)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {chat.name}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        <Separator />
        <div className="p-4">
          <Button
            variant={isWalletConnected ? "secondary" : "default"}
            className="w-full"
            onClick={handleConnectWallet}
          >
            <WalletIcon className="mr-2 h-4 w-4" />
            {isWalletConnected && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div>
                    <h3 className="font-semibold">{userProfile.name}</h3>
                    <p className="text-sm text-gray-500">{userProfile.email}</p>
                  </div>
                </div>
                <Button
                  variant="link"
                  className="text-blue-500 p-0 h-auto font-normal"
                >
                  View User Info
                </Button>
                <div className="mt-2 bg-white border border-gray-200 rounded flex items-center">
                  <span className="text-xs text-gray-500 px-2 py-1 flex-grow truncate">
                    {accounts ? accounts[0] : "No account connected"}
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
          </Button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-grow flex flex-col">
        {activeTab === "marketplace" ? (
          <div className="flex-grow overflow-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Agent Marketplace</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {props.agents.map((agent: Agent) => (
                  <Card key={agent.address} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <CardTitle>{agent.name}</CardTitle>
                          <CardDescription>{agent.des}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="mt-2">
                        <p className="text-sm font-medium">Tools:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {tools.map((tool, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4">
                      <Button
                        variant="outline"
                        className="w-full"
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
              <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 p-4">
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
            <div className="bg-white border-b border-gray-200 p-4 flex items-center">
              <h2 className="font-semibold text-lg text-gray-800 flex-grow">
                {selectedChat.name}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedChat(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-grow p-4">
              {selectedChat.messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.role === "agent" && (
                      <div className="font-semibold text-xs mb-1 text-gray-600">
                        {
                          selectedChat.agents.find(
                            (a) => a.address === message.agentId
                          )?.name
                        }
                      </div>
                    )}
                    {message.content}
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-grow"
                />
                <Button onClick={handleSendMessage}>
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
