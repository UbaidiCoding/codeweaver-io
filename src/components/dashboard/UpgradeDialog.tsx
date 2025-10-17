import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Zap, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: string;
  currentCredits: number;
}

export const UpgradeDialog = ({
  open,
  onOpenChange,
  currentPlan,
  currentCredits,
}: UpgradeDialogProps) => {
  const [creditAmount, setCreditAmount] = useState("10");
  const { toast } = useToast();

  const handleUpgradeToPro = () => {
    toast({
      title: "Coming Soon!",
      description: "Pro subscription will be available soon. Stay tuned!",
    });
  };

  const handleBuyCredits = () => {
    const credits = parseInt(creditAmount);
    if (isNaN(credits) || credits < 10) {
      toast({
        title: "Invalid Amount",
        description: "Minimum purchase is 10 credits ($1)",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Coming Soon!",
      description: `Credit purchase of ${credits} credits will be available soon!`,
    });
  };

  const calculatePrice = () => {
    const credits = parseInt(creditAmount) || 0;
    return (credits / 10).toFixed(2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upgrade Your Account</DialogTitle>
          <DialogDescription>
            Choose the plan that works best for you
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="pro" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pro">Pro Plan</TabsTrigger>
            <TabsTrigger value="credits">Buy Credits</TabsTrigger>
          </TabsList>

          <TabsContent value="pro" className="space-y-4">
            <Card className="p-6 border-primary shadow-lg shadow-primary/20">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="text-2xl font-bold">Pro Plan</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Unlimited power for serious developers
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">$29</div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {[
                  "Unlimited monthly credits",
                  "Advanced AI models (GPT-4, Claude)",
                  "Priority generation queue",
                  "Custom prompt templates",
                  "Affiliate program access",
                  "Priority email support",
                  "API access",
                  "Early access to new features",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {currentPlan === "pro" ? (
                <Button className="w-full" variant="outline" disabled>
                  <Check className="w-4 h-4 mr-2" />
                  Current Plan
                </Button>
              ) : (
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleUpgradeToPro}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="credits" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-secondary" />
                <h3 className="text-xl font-bold">Custom Credits</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Pay as you go. Credits never expire. Perfect for occasional use.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Number of Credits
                  </label>
                  <Input
                    type="number"
                    min="10"
                    step="10"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                    placeholder="Minimum 10 credits"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    $1 = 10 credits (minimum purchase)
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Credits:</span>
                    <span className="font-semibold">
                      {parseInt(creditAmount) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Current Balance:</span>
                    <span className="font-semibold">{currentCredits}</span>
                  </div>
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Price:</span>
                      <span className="text-2xl font-bold text-primary">
                        ${calculatePrice()}
                      </span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-secondary" />
                    Lifetime validity - never expires
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-secondary" />
                    Instant credit top-up
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-secondary" />
                    No monthly commitment
                  </li>
                </ul>

                <Button
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  onClick={handleBuyCredits}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Buy {parseInt(creditAmount) || 0} Credits for ${calculatePrice()}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center text-xs text-muted-foreground pt-4 border-t">
          Secure payment powered by Stripe • Cancel anytime
        </div>
      </DialogContent>
    </Dialog>
  );
};
