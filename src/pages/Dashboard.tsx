import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Code, Download, LogOut, Sparkles, Copy, Check, Crown, Plus } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { UpgradeDialog } from "@/components/dashboard/UpgradeDialog";

interface Profile {
  plan: string;
  credits: number;
  full_name: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      fetchProfile(user.id);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("plan, credits, full_name")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }
    setProfile(data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    if (profile && profile.credits <= 0 && profile.plan === "free") {
      toast({
        title: "Out of credits",
        description: "Upgrade to Pro for unlimited credits",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-code", {
        body: { prompt },
      });

      if (error) throw error;

      setGeneratedCode(data.code);
      
      if (profile) {
        setProfile({ ...profile, credits: profile.credits - 1 });
      }

      toast({
        title: "Success!",
        description: "Code generated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  const handleDownloadZip = async () => {
    if (!generatedCode) return;
    
    try {
      const { data, error } = await supabase.functions.invoke("generate-zip", {
        body: { code: generatedCode, filename: "generated-code" },
      });

      if (error) throw error;

      // Create blob and download
      const blob = new Blob([atob(data.zipBase64)], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "generated-code.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Downloaded!",
        description: "ZIP file downloaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to download ZIP",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">CodeGen AI</span>
          </div>
          
          <div className="flex items-center gap-3">
            {profile?.plan !== "pro" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUpgradeDialogOpen(true)}
                className="border-primary/50 hover:bg-primary/10"
              >
                <Crown className="w-4 h-4 mr-2 text-primary" />
                Upgrade
              </Button>
            )}
            <div className="text-right px-3 py-2 bg-muted/50 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-0.5">
                {profile?.plan === "pro" ? "Pro Plan" : "Free Plan"}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold">
                  {profile?.plan === "pro" 
                    ? "∞ Unlimited" 
                    : `${profile?.credits || 0} credits`}
                </p>
                {profile?.plan !== "pro" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() => setUpgradeDialogOpen(true)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Generate Code with <span className="gradient-text">AI</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Describe what you want to build and let AI create it for you
            </p>
          </div>

          {/* Prompt Input */}
          <Card className="p-4 sm:p-6 border-border/50 bg-card/50 backdrop-blur">
            <label className="block text-sm font-medium mb-3">What would you like to build?</label>
            <Textarea
              placeholder="E.g., Create a responsive React todo list with drag-and-drop, dark mode toggle, and local storage..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-32 mb-4 bg-background/50 border-border/50 focus:border-primary resize-none"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {loading ? "Generating..." : "Generate Code"}
              </Button>
              {profile?.plan !== "pro" && profile && profile.credits <= 0 && (
                <Button
                  onClick={() => setUpgradeDialogOpen(true)}
                  variant="outline"
                  className="border-primary/50"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Get Credits
                </Button>
              )}
            </div>
          </Card>

          {/* Generated Code */}
          {generatedCode && (
            <Card className="p-4 sm:p-6 border-border/50 bg-card/50 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Generated Code</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 sm:mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 sm:mr-2" />
                    )}
                    <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadZip}
                  >
                    <Download className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">ZIP</span>
                  </Button>
                </div>
              </div>
              <pre className="bg-background/80 border border-border/50 p-4 rounded-lg overflow-x-auto max-h-96 text-xs sm:text-sm">
                <code>{generatedCode}</code>
              </pre>
            </Card>
          )}
        </div>
      </main>

      <UpgradeDialog
        open={upgradeDialogOpen}
        onOpenChange={setUpgradeDialogOpen}
        currentPlan={profile?.plan || "free"}
        currentCredits={profile?.credits || 0}
      />
    </div>
  );
};

export default Dashboard;