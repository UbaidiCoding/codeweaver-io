import { Code, Github, Mail, Linkedin, Facebook, Instagram } from "lucide-react";

export const Footer = () => {
  const socialLinks = [
    { icon: Github, href: "https://github.com/UbaidiCoding", label: "GitHub" },
    { icon: Mail, href: "mailto:devsamiubaidi@gmail.com", label: "Email" },
    { icon: Linkedin, href: "https://pk.linkedin.com/in/devsamiubaidi", label: "LinkedIn" },
    { icon: Facebook, href: "https://web.facebook.com/sami.samejo.75/", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com/sami_ubaidi", label: "Instagram" },
  ];

  return (
    <footer className="border-t border-border py-12 px-4 bg-card/30">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-primary" />
              <span className="font-bold">CodeGen AI</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              AI-powered code generation platform
            </p>
            <p className="text-xs text-muted-foreground">
              Built by Samiullah Samejo
            </p>
            <p className="text-xs text-muted-foreground">
              Certified Full Stack Developer
            </p>
            <p className="text-xs text-muted-foreground">
              Sukkur, Pakistan
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://writersamiubaidi.blogspot.com/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="https://pinterest.com/samiubaidi" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  Pinterest
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-foreground transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 CodeGen AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};