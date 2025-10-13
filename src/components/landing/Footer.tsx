import { Code } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Code className="w-5 h-5 text-primary" />
          <span className="font-bold">CodeGen AI</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2025 CodeGen AI. Built with Lovable Cloud.
        </p>
      </div>
    </footer>
  );
};