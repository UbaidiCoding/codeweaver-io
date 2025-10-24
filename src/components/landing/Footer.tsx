import { Code, Github, Mail, Linkedin, Facebook, Instagram, Globe, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const socialLinks = [
    { icon: Globe, href: "https://devsamiubaidi.netlify.app", label: "Website" },
    { icon: Github, href: "https://github.com/UbaidiCoding", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/in/samiullah-ubaid-998361269", label: "LinkedIn" },
    { icon: Facebook, href: "https://web.facebook.com/sami.samejo.75", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com/sami_ubaidi", label: "Instagram" },
    { icon: Globe, href: "https://writersamiubaidi.blogspot.com", label: "Blog" },
    { icon: Phone, href: "https://wa.me/c/923420372799", label: "WhatsApp" },
    { icon: Globe, href: "https://fiverr.com/s/R70Ve0l", label: "Fiverr" },
  ];

  return (
    <footer className="relative border-t border-border bg-gradient-to-b from-background to-card/50 overflow-hidden">
      <div className="absolute -top-40 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">CodeWeaver</span>
            </Link>
            <p className="text-sm text-muted-foreground">AI-powered coding assistant for developers</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
              <li><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Built By</h3>
            <div className="glass-card p-4 rounded-lg">
              <p className="font-semibold text-sm gradient-text">UBAIDI IT COMMUNITY</p>
              <p className="text-xs text-muted-foreground mt-1">Admin Ubaidi</p>
              <p className="text-xs text-muted-foreground">Full Stack Developer</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" 
                   className="glass hover:glass-card p-2 rounded-lg transition-all hover:scale-105" title={link.label}>
                  <link.icon className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} <span className="gradient-text font-semibold">CodeWeaver</span> by UBAIDI IT COMMUNITY</p>
        </div>
      </div>
    </footer>
  );
};
