import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import { AgentDialog } from "./AgentDialog"

const filters = [
  { id: "nature", label: "Nature" },
  { id: "technology", label: "Technology" },
  { id: "food", label: "Food" },
  { id: "travel", label: "Travel" },
  { id: "finance", label: "Finance" },
  { id: "research", label: "Research" },
]

const cardData = [
  {
    id: 1,
    title: "Mountain Vista",
    description: "A breathtaking view of snow-capped mountains.",
    image: "/placeholder.svg?height=200&width=300",
    category: "nature",
  },
  {
    id: 2,
    title: "Tech Innovation",
    description: "The latest gadget revolutionizing the tech industry.",
    image: "/placeholder.svg?height=200&width=300",
    category: "technology",
  },
  {
    id: 3,
    title: "Gourmet Delight",
    description: "A mouthwatering dish from a top chef.",
    image: "/placeholder.svg?height=200&width=300",
    category: "food",
  },
  {
    id: 4,
    title: "Urban Explorer",
    description: "Discovering hidden gems in the city.",
    image: "/placeholder.svg?height=200&width=300",
    category: "travel",
  },
  {
    id: 5,
    title: "Stock Market Insights",
    description: "Navigate the complexities of the stock market with our AI agent.",
    image: "/placeholder.svg?height=200&width=300",
    category: "finance",
  },
  {
    id: 6,
    title: "Research Assistant",
    description: "Accelerate your research with our AI-powered assistant.",
    image: "/placeholder.svg?height=200&width=300",
    category: "research",
  },
]

export default function Dashboard() {
  const [selectedFilters, setSelectedFilters] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleFilterChange = (filterId) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    )
  }

  const filteredCards = selectedFilters.length > 0
    ? cardData.filter((card) => selectedFilters.includes(card.category))
    : cardData

  const handleUseAgent = (card) => {
    setSelectedCard(card)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedCard(null)
  }

  const handleSubmit = (formData) => {
    const formValues = Object.fromEntries(formData.entries())
    console.log('Form submitted:', formValues)
    toast({
      title: "Agent Activated",
      description: `You've activated the agent for ${selectedCard?.title}`,
    })
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-full md:w-64 p-4 border-r">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {filters.map((filter) => (
            <div key={filter.id} className="flex items-center space-x-2 mb-2">
              <Checkbox
                id={filter.id}
                checked={selectedFilters.includes(filter.id)}
                onCheckedChange={() => handleFilterChange(filter.id)}
              />
              <label
                htmlFor={filter.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {filter.label}
              </label>
            </div>
          ))}
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map((card) => (
            <Card key={card.id} className="flex flex-col">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{card.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleUseAgent(card)}
                >
                  Use Agent
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <AgentDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        selectedCard={selectedCard}
        onSubmit={handleSubmit}
      />
    </div>
  )
}