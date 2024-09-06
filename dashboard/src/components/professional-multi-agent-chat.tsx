"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronRight,
  MessageSquare,
  Plus,
  Store,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { Agent } from "@/app/dashboard/page";

type Chat = {
  id: string;
  name: string;
  agents: Agent[];
  messages: { role: "user" | "agent"; content: string; agentId?: string }[];
};

const tools = ["test", "Test", "Test"];

type AgentProp = {
  agents: Agent[];
}

export function MultiAgentChat(props: AgentProp) {
  console.log(props.agents[0].name);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [input, setInput] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([]);
  const [activeTab, setActiveTab] = useState<"chats" | "marketplace">("chats");

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

  const handleSendMessage = () => {
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

      // Simulate agent responses (replace with actual API calls in a real application)
      setTimeout(() => {
        const agentResponses = selectedChat.agents.map((agent) => ({
          role: "agent" as const,
          content: `${agent.name} response to: ${input}`,
          agentId: agent.address,
        }));
        const updatedChatWithResponses = {
          ...updatedChat,
          messages: [...updatedChat.messages, ...agentResponses],
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
      }, 1000);
    }
  };

  const handleConnectWallet = () => {
    // Implement wallet connection logic here
    setIsWalletConnected(true);
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
            <Wallet className="mr-2 h-4 w-4" />
            {isWalletConnected ? "Wallet Connected" : "Connect Wallet"}
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
                        {/* <img src={agent.avatar} alt={agent.name} className="w-12 h-12 rounded-full" /> */}
                        <div>
                          <CardTitle>{agent.name}</CardTitle>
                          <CardDescription>{agent.des}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {/* <p className="text-sm text-gray-500">Creator: {agent.creator}</p> */}
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
