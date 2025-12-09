import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Mail, ArrowRight, Loader2, ArrowLeft, User, Phone, MapPin } from "lucide-react";
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
  const [step, setStep] = useState<"email" | "otp" | "profile">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [clientId, setClientId] = useState<string | null>(null);
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

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
        setClientId(data.client.id);
        
        if (data.isNewUser) {
          setStep("profile");
          toast({
            title: "Email Verified",
            description: "Please complete your profile to continue.",
          });
        } else {
          login(data.client);
          toast({
            title: "Welcome Back!",
            description: "Great to see you again.",
          });
          setLocation("/");
        }
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

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: { name: string; phone: string; address: string; city: string; postalCode: string }) => {
      const response = await apiRequest("PATCH", `/api/client/${clientId}`, profileData);
      return response.json();
    },
    onSuccess: (data) => {
      login(data);
      toast({
        title: "Welcome to Aqeel Pharmacy!",
        description: "Your account has been created successfully.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Save Profile",
        description: error.message || "Please try again.",
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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    
    if (!name.trim()) {
      errors.name = "Name is required";
    }
    if (!phone.trim()) {
      errors.phone = "Phone number is required";
    }
    if (!address.trim()) {
      errors.address = "Address is required";
    }
    if (!city.trim()) {
      errors.city = "City is required";
    }
    
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }
    
    setProfileErrors({});
    updateProfileMutation.mutate({ name, phone, address, city, postalCode });
  };

  const handleBack = () => {
    if (step === "otp") {
      setStep("email");
      setOtp("");
      setOtpError("");
    } else if (step === "profile") {
      setStep("otp");
    }
  };

  const handleResend = () => {
    sendOtpMutation.mutate(email);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl" data-testid="text-login-title">
            {step === "email" ? "Sign In" : step === "otp" ? "Verify Email" : "Complete Your Profile"}
          </CardTitle>
          <CardDescription data-testid="text-login-description">
            {step === "email"
              ? "Enter your email to receive a verification code"
              : step === "otp"
              ? `We sent a code to ${email}`
              : "Tell us a bit about yourself"}
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
          ) : step === "otp" ? (
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
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    className="pl-10"
                    data-testid="input-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                  />
                </div>
                {profileErrors.name && (
                  <p className="text-sm font-medium text-destructive">{profileErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="03XX XXXXXXX"
                    className="pl-10"
                    data-testid="input-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                {profileErrors.phone && (
                  <p className="text-sm font-medium text-destructive">{profileErrors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    id="address"
                    type="text"
                    placeholder="Street address"
                    className="pl-10"
                    data-testid="input-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                {profileErrors.address && (
                  <p className="text-sm font-medium text-destructive">{profileErrors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="City"
                    data-testid="input-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  {profileErrors.city && (
                    <p className="text-sm font-medium text-destructive">{profileErrors.city}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    type="text"
                    placeholder="Optional"
                    data-testid="input-postal-code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={updateProfileMutation.isPending}
                data-testid="button-save-profile"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
