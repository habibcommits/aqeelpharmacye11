import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { useClientAuth } from "@/lib/client-auth-context";
import { apiRequest } from "@/lib/queryClient";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "Please enter the 6-digit code"),
});

type EmailFormData = z.infer<typeof emailSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useClientAuth();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const sendOtpMutation = useMutation({
    mutationFn: async (data: EmailFormData) => {
      const response = await apiRequest("POST", "/api/auth/send-otp", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setEmail(emailForm.getValues("email"));
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
    mutationFn: async (data: OtpFormData) => {
      const response = await apiRequest("POST", "/api/auth/verify-otp", { email, otp: data.otp });
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

  const handleSendOtp = (data: EmailFormData) => {
    sendOtpMutation.mutate(data);
  };

  const handleVerifyOtp = (data: OtpFormData) => {
    verifyOtpMutation.mutate(data);
  };

  const handleBack = () => {
    setStep("email");
    otpForm.reset();
  };

  const handleResend = () => {
    sendOtpMutation.mutate({ email });
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
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(handleSendOtp)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="your@email.com"
                            className="pl-10"
                            data-testid="input-email"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
            </Form>
          ) : (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-6">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                      <FormLabel className="sr-only">Verification Code</FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={field.onChange}
                          data-testid="input-otp"
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
