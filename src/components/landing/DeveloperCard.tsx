import { Card } from "@/components/ui/card";
import { Github, Mail, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DeveloperCard = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Built by
            <span className="gradient-text"> Developers</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            For developers, by developers
          </p>
        </div>

        <Card className="p-8 md:p-12 bg-card border-border hover:border-primary/50 transition-all">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Developer Image */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0 flex items-center justify-center text-4xl font-bold">
              AU
            </div>

            {/* Developer Info */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Admin Ubaidi</h3>
              <p className="text-primary mb-1">Full Stack Developer & AI Enthusiast</p>
              <p className="text-muted-foreground mb-4">
                Building the future of AI-powered development tools
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Projects</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Lines of Code</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-primary">5+</div>
                  <div className="text-sm text-muted-foreground">Years Exp</div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3 justify-center md:justify-start">
                <Button variant="outline" size="icon" asChild>
                  <a href="https://github.com/UbaidiCoding" target="_blank" rel="noopener noreferrer">
                    <Github className="w-5 h-5" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href="mailto:devsamiubaidi@gmail.com">
                    <Mail className="w-5 h-5" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href="https://writersamiubaidi.blogspot.com/" target="_blank" rel="noopener noreferrer">
                    <Globe className="w-5 h-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};