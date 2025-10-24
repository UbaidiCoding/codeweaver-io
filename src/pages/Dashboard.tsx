import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Code, Download, LogOut, Copy, Check, Crown, Plus, 
  Play, Maximize2, Minimize2, FileCode, Terminal, Eye,
  ChevronLeft, ChevronRight
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { UpgradeDialog } from "@/components/dashboard/UpgradeDialog";
import Editor from "@monaco-editor/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [language, setLanguage] = useState("javascript");
  const [consoleOutput, setConsoleOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
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
      setUpgradeDialogOpen(true);
      return;
    }

    setLoading(true);
    setActiveTab("code");
    try {
      const { data, error } = await supabase.functions.invoke("generate-code", {
        body: { prompt },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      const code = data.code || data.generatedCode || "";
      setGeneratedCode(code);
      
      if (profile) {
        fetchProfile(user!.id);
      }

      toast({
        title: "Success",
        description: "Code generated successfully!",
      });
    } catch (error: any) {
      console.error("Error generating code:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    if (!generatedCode) {
      toast({
        title: "Error",
        description: "No code to download",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("generate-zip", {
        body: { code: generatedCode, language },
      });

      if (error) throw error;

      const blob = new Blob([Uint8Array.from(atob(data.zipData), c => c.charCodeAt(0))], {
        type: "application/zip",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `codeweaver-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Code downloaded as ZIP",
      });
    } catch (error: any) {
      console.error("Error downloading ZIP:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to download ZIP",
        variant: "destructive",
      });
    }
  };

  const handleRunCode = async () => {
    if (!generatedCode) {
      toast({
        title: "Error",
        description: "No code to run",
        variant: "destructive",
      });
      return;
    }

    if (profile && profile.credits <= 0 && profile.plan === "free") {
      toast({
        title: "Out of credits",
        description: "Running code requires credits",
        variant: "destructive",
      });
      setUpgradeDialogOpen(true);
      return;
    }

    setRunning(true);
    setActiveTab("console");
    setConsoleOutput("Running code...\n");

    try {
      const { data, error } = await supabase.functions.invoke("run-code", {
        body: { code: generatedCode, language },
      });

      if (error) throw error;

      if (data.error) {
        setConsoleOutput(`Error:\n${data.error}`);
      } else {
        setConsoleOutput(`Output:\n${data.output || "Code executed successfully"}`);
      }

      if (profile && profile.plan === "free") {
        fetchProfile(user!.id);
      }

      toast({
        title: "Success",
        description: "Code executed successfully",
      });
    } catch (error: any) {
      console.error("Error running code:", error);
      setConsoleOutput(`Error:\n${error.message || "Failed to execute code"}`);
      toast({
        title: "Error",
        description: error.message || "Failed to run code",
        variant: "destructive",
      });
    } finally {
      setRunning(false);
    }
  };

  const getLanguageLabel = () => {
    const labels: Record<string, string> = {
      javascript: "JavaScript",
      python: "Python",
      html: "HTML",
      css: "CSS",
      typescript: "TypeScript",
      react: "React (JSX)",
    };
    return labels[language] || "Code";
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Collapsible Sidebar */}
      <aside className={`glass border-r border-border transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg gradient-text">CodeWeaver</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="ml-auto"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {!sidebarCollapsed && (
          <>
            <div className="flex-1 p-4 space-y-4">
              <Card className="p-4 glass-card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold">
                    {profile?.full_name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{profile?.full_name || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  {profile?.plan === "pro" ? (
                    <div className="flex items-center gap-2 text-primary">
                      <Crown className="w-4 h-4" />
                      <span className="text-sm font-semibold">Pro Plan</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">Credits</span>
                        <span className="text-sm font-bold">{profile?.credits || 0}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-primary/50"
                        onClick={() => setUpgradeDialogOpen(true)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Credits
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground px-2">Quick Actions</p>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setPrompt("")}>
                  <FileCode className="w-4 h-4 mr-2" />
                  New File
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={handleDownloadZip}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            <div className="p-4 border-t border-border">
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        <div className="glass border-b border-border p-4 flex items-center gap-4">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="react">React (JSX)</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!generatedCode}
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadZip}
              disabled={!generatedCode}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              size="sm"
              onClick={handleRunCode}
              disabled={!generatedCode || running}
              className="bg-primary hover:bg-primary/90"
            >
              <Play className="w-4 h-4 mr-2" />
              {running ? "Running..." : "Run"}
            </Button>
          </div>
        </div>

        {/* Split View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Chat & Prompt */}
          <div className="w-1/2 border-r border-border flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="glass border-b border-border rounded-none">
                <TabsTrigger value="chat" className="gap-2">
                  <Terminal className="w-4 h-4" />
                  AI Chat
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="flex-1 flex flex-col m-0 p-6">
                <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 glow-effect">
                      <Code className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                      Welcome to <span className="gradient-text">CodeWeaver</span>
                    </h1>
                    <p className="text-muted-foreground">
                      Describe what you want to build, and I'll generate the code for you.
                    </p>
                  </div>

                  <Card className="glass-card p-6">
                    <Textarea
                      placeholder="Example: Create a React component that displays a todo list with add and delete functionality..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[200px] mb-4 bg-background/50 resize-none"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleGenerate}
                        disabled={loading || !prompt.trim()}
                        className="flex-1 bg-primary hover:bg-primary/90 glow-effect"
                      >
                        {loading ? (
                          "Generating..."
                        ) : (
                          <>
                            <Code className="w-4 h-4 mr-2" />
                            Generate Code
                          </>
                        )}
                      </Button>
                      {profile && profile.credits <= 0 && profile.plan === "free" && (
                        <Button
                          variant="outline"
                          onClick={() => setUpgradeDialogOpen(true)}
                          className="border-primary/50"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Get Credits
                        </Button>
                      )}
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Code Editor & Preview */}
          <div className="w-1/2 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="glass border-b border-border rounded-none">
                <TabsTrigger value="code" className="gap-2">
                  <FileCode className="w-4 h-4" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="console" className="gap-2">
                  <Terminal className="w-4 h-4" />
                  Console
                </TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="flex-1 m-0 overflow-hidden">
                {generatedCode ? (
                  <Editor
                    height="100%"
                    language={language}
                    value={generatedCode}
                    onChange={(value) => setGeneratedCode(value || "")}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <FileCode className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p>No code generated yet</p>
                      <p className="text-sm mt-2">Enter a prompt to get started</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="preview" className="flex-1 m-0 overflow-auto bg-white">
                {generatedCode && (language === "html" || language === "react") ? (
                  <iframe
                    srcDoc={generatedCode}
                    className="w-full h-full border-0"
                    title="preview"
                    sandbox="allow-scripts"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground bg-background">
                    <div className="text-center">
                      <Eye className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p>Preview not available</p>
                      <p className="text-sm mt-2">Only available for HTML and React code</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="console" className="flex-1 m-0 overflow-hidden">
                <div className="h-full bg-[#1e1e1e] p-4 overflow-auto">
                  <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                    {consoleOutput || "Console output will appear here..."}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>
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
