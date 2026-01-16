import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dumbbell, Loader2, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"sign_in" | "sign_up" | "forgot_password" | "update_password">("sign_in");
  const navigate = useNavigate();
  const location = useLocation(); // To check URL
  const { toast } = useToast();

  // CHECK FOR RESET LINK ON LOAD
  useEffect(() => {
    // 1. Check Supabase Event (The standard way)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setView("update_password");
      }
    });

    // 2. Check URL for ?reset=true (Your specific link)
    const params = new URLSearchParams(location.search);
    if (params.get("reset") === "true") {
      setView("update_password");
    }

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [location]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (view === "sign_in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
      } else if (view === "sign_up") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: email.split("@")[0] } },
        });
        if (error) throw error;
        toast({ title: "Success", description: "Check your email to confirm your account." });
      } else if (view === "forgot_password") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?reset=true`, // Ensures they come back to the right place
        });
        if (error) throw error;
        toast({ title: "Check your email", description: "We sent you a password reset link." });
        setView("sign_in");
      } else if (view === "update_password") {
        const { error } = await supabase.auth.updateUser({ password: password });
        if (error) throw error;
        toast({ title: "Success", description: "Password updated! You are now logged in." });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* LOGO HEADER */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-energy mb-4">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight energy-text">MUSCLE MUSE</h1>
          <p className="text-muted-foreground">Transform your training into a habit.</p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-display text-center energy-text">
              {view === "sign_in" && "Welcome Back"}
              {view === "sign_up" && "Create Account"}
              {view === "forgot_password" && "Reset Password"}
              {view === "update_password" && "Set New Password"}
            </CardTitle>
            <CardDescription className="text-center">
              {view === "sign_in" && "Enter your credentials to access your workouts"}
              {view === "sign_up" && "Start your journey today"}
              {view === "forgot_password" && "Enter your email to receive a reset link"}
              {view === "update_password" && "Enter your new password below"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {/* EMAIL FIELD (Hidden if updating password) */}
              {view !== "update_password" && (
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background/50"
                  />
                </div>
              )}

              {/* PASSWORD FIELD (Hidden if asking for reset link) */}
              {view !== "forgot_password" && (
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder={view === "update_password" ? "New Password" : "Password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background/50"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-energy text-white hover:opacity-90"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : view === "sign_in" ? (
                  "Sign In"
                ) : view === "sign_up" ? (
                  "Sign Up"
                ) : view === "forgot_password" ? (
                  "Send Reset Link"
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>

            {/* NAVIGATION LINKS */}
            <div className="mt-6 text-center text-sm space-y-2">
              {view === "sign_in" && (
                <>
                  <p className="text-muted-foreground">
                    Don't have an account?{" "}
                    <button onClick={() => setView("sign_up")} className="text-primary hover:underline font-medium">
                      Sign up
                    </button>
                  </p>
                  <button
                    onClick={() => setView("forgot_password")}
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    Forgot your password?
                  </button>
                </>
              )}

              {(view === "sign_up" || view === "forgot_password") && (
                <button
                  onClick={() => setView("sign_in")}
                  className="flex items-center justify-center w-full gap-2 text-muted-foreground hover:text-primary"
                >
                  <ArrowLeft className="w-3 h-3" /> Back to Sign In
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
