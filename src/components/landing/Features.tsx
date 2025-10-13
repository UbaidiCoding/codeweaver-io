import { Code, Zap, Gift, FileCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Code,
    title: "AI Code Generation",
    description: "Generate production-ready code from natural language prompts using advanced AI models.",
  },
  {
    icon: Zap,
    title: "Instant ZIP Downloads",
    description: "Package your generated code into downloadable ZIP files with proper structure.",
  },
  {
    icon: Gift,
    title: "Affiliate Program",
    description: "Earn commissions by referring users. Get 10% of all referred user purchases.",
  },
  {
    icon: FileCheck,
    title: "PDF Receipts",
    description: "Professional PDF receipts for all transactions and affiliate payouts.",
  },
];

export const Features = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features for
            <span className="gradient-text"> Developers</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to generate, download, and monetize AI-generated code
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};