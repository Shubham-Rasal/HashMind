import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function AgentDialog({ isOpen, onClose, selectedCard, onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    onSubmit(formData)
    onClose()
  }

  const renderDialogContent = () => {
    if (!selectedCard) return null

    switch (selectedCard.category) {
      case 'finance':
        return (
          <>
            <DialogDescription>
              Please provide some information about your financial situation to help our agent assist you better.
            </DialogDescription>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="financial-condition">Financial Condition</Label>
                <Input id="financial-condition" name="financialCondition" required />
              </div>
              <div>
                <Label htmlFor="risk-appetite">Risk Appetite</Label>
                <Input id="risk-appetite" name="riskAppetite" required />
              </div>
              <div>
                <Label htmlFor="capital">Available Capital</Label>
                <Input id="capital" name="capital" type="number" required />
              </div>
              <DialogFooter>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </form>
          </>
        )
      case 'research':
        return (
          <>
            <DialogDescription>
              Please provide details about your research interests to help our agent assist you better.
            </DialogDescription>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="research-topic">Research Topic</Label>
                <Input id="research-topic" name="researchTopic" required />
              </div>
              <div>
                <Label htmlFor="research-goals">Research Goals</Label>
                <Textarea id="research-goals" name="researchGoals" required />
              </div>
              <DialogFooter>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </form>
          </>
        )
      default:
        return (
          <>
            <DialogDescription>
              Please provide some information to help our agent assist you better.
            </DialogDescription>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="user-query">What can we help you with?</Label>
                <Textarea id="user-query" name="userQuery" required />
              </div>
              <DialogFooter>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </form>
          </>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{selectedCard?.title}</DialogTitle>
        </DialogHeader>
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  )
}