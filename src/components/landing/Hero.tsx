import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card to-background" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-700" />
      
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">AI-Powered Code Generation</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          Welcome to
          <span className="gradient-text block mt-2">CodeWeaver</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in">
          AI-powered coding assistant for developers. Generate, edit, and execute code in real-time 
          with our intelligent workspace powered by advanced AI models.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
          <Link to="/auth">
            <Button size="lg" className="group bg-primary hover:bg-primary/90 glow-effect">
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10">
              Try Demo
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-20 animate-fade-in">
          <div>
            <div className="text-3xl font-bold gradient-text">10K+</div>
            <div className="text-sm text-muted-foreground mt-1">Code Generated</div>
          </div>
          <div>
            <div className="text-3xl font-bold gradient-text">5K+</div>
            <div className="text-sm text-muted-foreground mt-1">Active Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold gradient-text">99.9%</div>
            <div className="text-sm text-muted-foreground mt-1">Uptime</div>
          </div>
        </div>
      </div>
    </section>
  );
};