import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { registerTrader } from "../../services/api";
import { useAuthStore } from "../../store/useAuthStore";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import PinInput from "../../components/ui/PinInput";
import StepIndicator from "../../components/ui/StepIndicator";
import { toast } from "../../components/ui/Toast";

const STEPS = ["Personal Info", "Trade Details", "Set PIN"];

const CATEGORIES = [
  { value: "food", label: "🍲 Food" },
  { value: "clothing", label: "👗 Clothing" },
  { value: "electronics", label: "📱 Electronics" },
  { value: "artisan", label: "🔨 Artisan" },
  { value: "transport", label: "🚗 Transport" },
  { value: "agriculture", label: "🌾 Agriculture" },
  { value: "other", label: "📦 Other" },
];

const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export default function RegisterTrader() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((s) => s.setSession);
  const phoneFromLogin = (location.state as any)?.phone ?? "";

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1 — personal info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState(phoneFromLogin);
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [bvn, setBvn] = useState("");
  const [address, setAddress] = useState("");

  // Step 2 — trade info
  const [tradeCategory, setTradeCategory] = useState("");
  const [tradeDescription, setTradeDescription] = useState("");
  const [marketLocation, setMarketLocation] = useState("");
  const [state, setState] = useState("");

  // Step 3 — PIN
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {};

    if (s === 0) {
      if (!firstName.trim()) e.firstName = "First name is required";
      if (!lastName.trim()) e.lastName = "Last name is required";
      if (!phone.trim()) e.phone = "Phone number is required";
      if (!dob.trim()) e.dob = "Date of birth is required";
      if (!gender) e.gender = "Select your gender";
      if (!bvn.trim() || bvn.length < 11) e.bvn = "Enter a valid 11-digit BVN";
      if (!address.trim()) e.address = "Address is required";
    }

    if (s === 1) {
      if (!tradeCategory) e.tradeCategory = "Select a category";
      if (!marketLocation.trim())
        e.marketLocation = "Market location is required";
      if (!state) e.state = "Select your state";
    }

    if (s === 2) {
      if (pin.length < 4) e.pin = "PIN must be 4 digits";
      if (pin !== confirmPin) e.confirmPin = "PINs do not match";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    setLoading(true);
    try {
      const res = await registerTrader({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        dob,
        gender,
        bvn: bvn.trim(),
        address: address.trim(),
        tradeCategory,
        tradeDescription: tradeDescription.trim() || undefined,
        marketLocation: marketLocation.trim(),
        state,
        pin,
      });

      const trader = res.data.data;
      setSession({
        id: trader._id,
        phone: trader.phone,
        role: "trader",
        name: `${trader.firstName} ${trader.lastName}`,
      });

      toast.success("Account created successfully!");
      navigate("/trader", { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Back button */}
        <button
          onClick={() =>
            step > 0 ? setStep((s) => s - 1) : navigate("/login")
          }
          className="flex items-center gap-2 text-text-sub hover:text-primary text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark">
            Create Trader Account
          </h1>
          <p className="text-text-sub text-sm mt-1">
            Join KasuwaConnect and get your Squad virtual account
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator steps={STEPS} currentStep={step} />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
          {/* ── Step 1: Personal Info ── */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-semibold text-dark text-lg">
                Personal Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First name *"
                  value={firstName}
                  onChange={setFirstName}
                  placeholder="Amaka"
                  error={errors.firstName}
                />
                <Input
                  label="Last name *"
                  value={lastName}
                  onChange={setLastName}
                  placeholder="Okonkwo"
                  error={errors.lastName}
                />
              </div>
              <Input
                label="Phone number *"
                value={phone}
                onChange={setPhone}
                placeholder="08012345678"
                type="tel"
                error={errors.phone}
              />
              <Input
                label="Email (optional)"
                value={email}
                onChange={setEmail}
                placeholder="amaka@email.com"
                type="email"
              />
              <Input
                label="Date of birth * (DD/MM/YYYY)"
                value={dob}
                onChange={setDob}
                placeholder="01/01/1990"
                error={errors.dob}
              />

              {/* Gender */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-sub uppercase tracking-wide">
                  Gender *
                </label>
                <div className="flex gap-3">
                  {[
                    { label: "Male", value: "1" },
                    { label: "Female", value: "2" },
                  ].map((g) => (
                    <button
                      key={g.value}
                      onClick={() => setGender(g.value)}
                      className={`
                        flex-1 h-11 rounded-card border-2 text-sm font-semibold
                        transition-all duration-200
                        ${
                          gender === g.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-text-sub hover:border-primary/40"
                        }
                      `}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-xs text-error">{errors.gender}</p>
                )}
              </div>

              <Input
                label="BVN * (11 digits)"
                value={bvn}
                onChange={setBvn}
                placeholder="22190239861"
                type="number"
                error={errors.bvn}
              />
              <Input
                label="Home address *"
                value={address}
                onChange={setAddress}
                placeholder="12 Market Road, Lagos"
                error={errors.address}
              />
              <Button fullWidth onClick={handleNext}>
                Continue
              </Button>
            </div>
          )}

          {/* ── Step 2: Trade Details ── */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-semibold text-dark text-lg">
                Trade Information
              </h2>

              {/* Category grid */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-sub uppercase tracking-wide">
                  Trade category *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setTradeCategory(cat.value)}
                      className={`
                        px-4 py-3 rounded-card border-2 text-sm font-medium
                        text-left transition-all duration-200
                        ${
                          tradeCategory === cat.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-text-sub hover:border-primary/40"
                        }
                      `}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                {errors.tradeCategory && (
                  <p className="text-xs text-error">{errors.tradeCategory}</p>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-sub uppercase tracking-wide">
                  What do you sell? (optional)
                </label>
                <textarea
                  value={tradeDescription}
                  onChange={(e) => setTradeDescription(e.target.value)}
                  placeholder="e.g. Ankara fabric and ready-to-wear clothing"
                  rows={2}
                  className="border border-border rounded-card px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              <Input
                label="Market / trade location *"
                value={marketLocation}
                onChange={setMarketLocation}
                placeholder="e.g. Onitsha Main Market"
                error={errors.marketLocation}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-sub uppercase tracking-wide">
                  State *
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={`
                    h-12 border rounded-card px-4 text-sm text-text-main bg-white
                    focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                    ${errors.state ? "border-error" : "border-border"}
                  `}
                >
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-xs text-error">{errors.state}</p>
                )}
              </div>

              <Button fullWidth onClick={handleNext}>
                Continue
              </Button>
            </div>
          )}

          {/* ── Step 3: Set PIN ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-semibold text-dark text-lg">
                  Create Your PIN
                </h2>
                <p className="text-text-sub text-sm mt-1">
                  You'll use this 4-digit PIN every time you log in
                </p>
              </div>

              <PinInput
                label="Choose a PIN"
                value={pin}
                onChange={setPin}
                error={errors.pin}
              />

              <PinInput
                label="Confirm PIN"
                value={confirmPin}
                onChange={setConfirmPin}
                error={errors.confirmPin}
              />

              {/* Squad info callout */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-primary mb-1">
                  What happens next
                </p>
                <p className="text-xs text-text-sub leading-relaxed">
                  After registration, a Squad virtual account will be created
                  for you instantly. This becomes your financial identity on
                  KasuwaConnect.
                </p>
              </div>

              <Button fullWidth loading={loading} onClick={handleSubmit}>
                Create Account
              </Button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-primary font-semibold hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
