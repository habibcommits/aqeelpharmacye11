import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Mail, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useClientAuth } from "@/lib/client-auth-context";
import { apiRequest } from "@/lib/queryClient";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useClientAuth();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");

  const sendOtpMutation = useMutation({
    mutationFn: async (emailToSend: string) => {
      const response = await apiRequest("POST", "/api/auth/send-otp", { email: emailToSend });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setStep("otp");
        toast({
          title: "Code Sent",
          description: "Check your email for the verification code.",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Send Code",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (otpCode: string) => {
      const response = await apiRequest("POST", "/api/auth/verify-otp", { email, otp: otpCode });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.client) {
        login(data.client);
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        setLocation("/account");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid or expired code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    
    if (!email || !email.includes("@")) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    sendOtpMutation.mutate(email);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter the 6-digit code");
      return;
    }
    
    verifyOtpMutation.mutate(otp);
  };

  const handleBack = () => {
    setStep("email");
    setOtp("");
    setOtpError("");
  };

  const handleResend = () => {
    sendOtpMutation.mutate(email);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl" data-testid="text-login-title">
            {step === "email" ? "Sign In" : "Verify Email"}
          </CardTitle>
          <CardDescription data-testid="text-login-description">
            {step === "email"
              ? "Enter your email to receive a verification code"
              : `We sent a code to ${email}`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    data-testid="input-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {emailError && (
                  <p className="text-sm font-medium text-destructive">{emailError}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={sendOtpMutation.isPending}
                data-testid="button-send-otp"
              >
                {sendOtpMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  className="text-center text-lg tracking-widest"
                  data-testid="input-otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  autoFocus
                />
                {otpError && (
                  <p className="text-sm font-medium text-destructive">{otpError}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={verifyOtpMutation.isPending}
                data-testid="button-verify-otp"
              >
                {verifyOtpMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Sign In"
                )}
              </Button>

              <div className="flex flex-col gap-2 text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResend}
                  disabled={sendOtpMutation.isPending}
                  data-testid="button-resend-otp"
                >
                  {sendOtpMutation.isPending ? "Sending..." : "Resend Code"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  data-testid="button-back"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Use different email
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
