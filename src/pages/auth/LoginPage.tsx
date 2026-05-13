import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";
import { checkPhone, loginUser } from "../../services/api";
import { useAuthStore } from "../../store/useAuthStore";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import PinInput from "../../components/ui/PinInput";

type Step = "phone" | "pin" | "new-user";

export default function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [userName, setUserName] = useState("");
  const [_userRole, setUserRole] = useState<"trader" | "seeker" | null>(null);
  const [loading, setLoading] = useState(false);
  const [phoneErr, setPhoneErr] = useState("");
  const [pinErr, setPinErr] = useState("");

  // Step 1 — check if phone exists
  const handlePhoneContinue = async () => {
    if (!phone.trim()) {
      setPhoneErr("Please enter your phone number");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setPhoneErr("Enter a valid phone number");
      return;
    }
    setPhoneErr("");
    setLoading(true);
    try {
      const res = await checkPhone(phone.trim());
      const data = res.data;
      if (data.exists) {
        setUserName(data.name);
        setUserRole(data.role);
        setStep("pin");
      } else {
        setStep("new-user");
      }
    } catch {
      setPhoneErr("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — login with PIN
  const handlePinComplete = async (enteredPin: string) => {
    if (enteredPin.length < 4) return;
    setPinErr("");
    setLoading(true);
    try {
      const res = await loginUser(phone.trim(), enteredPin);
      const data = res.data.data;
      setSession({
        id: data.id,
        phone: data.phone,
        role: data.role,
        name: data.name,
      });
      navigate(data.role === "trader" ? "/trader" : "/seeker", {
        replace: true,
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Incorrect PIN. Try again.";
      setPinErr(msg);
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4 shadow-lg">
            <Phone size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-dark">KasuwaConnect</h1>
          <p className="text-text-sub text-sm mt-1">
            The intelligent informal economy
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
          {/* ── STEP 1: Phone entry ── */}
          {step === "phone" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-dark">
                  Welcome back
                </h2>
                <p className="text-text-sub text-sm mt-1">
                  Enter your phone number to continue
                </p>
              </div>
              <Input
                label="Phone number"
                placeholder="08012345678"
                value={phone}
                onChange={setPhone}
                type="tel"
                error={phoneErr}
                prefix="+234"
              />
              <Button fullWidth loading={loading} onClick={handlePhoneContinue}>
                Continue
              </Button>
            </div>
          )}

          {/* ── STEP 2: PIN entry (returning user) ── */}
          {step === "pin" && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">
                  Welcome back
                </p>
                <h2 className="text-xl font-semibold text-dark">{userName}</h2>
                <p className="text-text-sub text-sm mt-1">
                  Enter your 4-digit PIN to continue
                </p>
              </div>
              <PinInput
                label="Your PIN"
                value={pin}
                onChange={setPin}
                onComplete={handlePinComplete}
                error={pinErr}
              />
              {loading && (
                <div className="flex items-center justify-center gap-2 text-text-sub text-sm">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </div>
              )}
              <button
                onClick={() => {
                  setStep("phone");
                  setPin("");
                  setPinErr("");
                }}
                className="text-sm text-text-sub hover:text-primary transition-colors w-full text-center"
              >
                ← Use a different number
              </button>
            </div>
          )}

          {/* ── STEP 3: New user — choose role ── */}
          {step === "new-user" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-dark">
                  Create your account
                </h2>
                <p className="text-text-sub text-sm mt-1">
                  How will you use KasuwaConnect?
                </p>
              </div>

              <div className="space-y-3">
                {/* Trader card */}
                <button
                  onClick={() =>
                    navigate("/register/trader", {
                      state: { phone },
                    })
                  }
                  className="w-full text-left p-5 border-2 border-border rounded-card hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <span className="text-xl">🏪</span>
                    </div>
                    <div>
                      <p className="font-semibold text-dark">I am a Trader</p>
                      <p className="text-text-sub text-sm mt-0.5">
                        Sell goods in markets, get a credit score, hire workers
                      </p>
                    </div>
                  </div>
                </button>

                {/* Seeker card */}
                <button
                  onClick={() =>
                    navigate("/register/seeker", {
                      state: { phone },
                    })
                  }
                  className="w-full text-left p-5 border-2 border-border rounded-card hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-dark/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-dark/20 transition-colors">
                      <span className="text-xl">💼</span>
                    </div>
                    <div>
                      <p className="font-semibold text-dark">
                        I am a Job Seeker
                      </p>
                      <p className="text-text-sub text-sm mt-0.5">
                        Find gig work matched to your skills and location
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => {
                  setStep("phone");
                  setPin("");
                }}
                className="text-sm text-text-sub hover:text-primary transition-colors w-full text-center"
              >
                ← Use a different number
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted mt-6">
          Powered by Squad · Built for the informal economy
        </p>
      </div>
    </div>
  );
}
