import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { registerJobSeeker } from "../../services/api";
import { useAuthStore } from "../../store/useAuthStore";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import PinInput from "../../components/ui/PinInput";
import StepIndicator from "../../components/ui/StepIndicator";
import { toast } from "../../components/ui/Toast";

const STEPS = ["Personal Info", "Skills & Preferences", "Set PIN"];
const SKILLS_SUGGESTIONS = [
  "sorting",
  "customer service",
  "carrying",
  "cooking",
  "cleaning",
  "driving",
  "tailoring",
  "welding",
  "painting",
  "plumbing",
  "carpentry",
  "data entry",
  "sales",
  "accounting",
  "teaching",
  "farming",
  "fishing",
  "security",
];
const CATEGORIES = [
  "food",
  "clothing",
  "electronics",
  "artisan",
  "transport",
  "agriculture",
  "other",
];
const LANGUAGES = ["english", "pidgin", "yoruba", "igbo", "hausa", "other"];
const EXPERIENCE = [
  { value: "none", label: "No experience" },
  { value: "beginner", label: "Beginner (0-1 yr)" },
  { value: "intermediate", label: "Intermediate (1-3 yrs)" },
  { value: "experienced", label: "Experienced (3+ yrs)" },
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

export default function RegisterSeeker() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((s) => s.setSession);
  const phoneFromLogin = (location.state as any)?.phone ?? "";

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState(phoneFromLogin);
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [bvn, setBvn] = useState("");
  const [address, setAddress] = useState("");

  // Step 2
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [preferredCategories, setPreferredCategories] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState("none");
  const [languages, setLanguages] = useState<string[]>(["english"]);
  const [marketLocation, setMarketLocation] = useState("");
  const [state, setState] = useState("");

  // Step 3
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const addSkill = (sk: string) => {
    const trimmed = sk.trim().toLowerCase();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput("");
  };

  const removeSkill = (sk: string) =>
    setSkills((prev) => prev.filter((s) => s !== sk));

  const toggleCategory = (cat: string) =>
    setPreferredCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );

  const toggleLanguage = (lang: string) =>
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );

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
      if (skills.length === 0) e.skills = "Add at least one skill";
      if (!marketLocation) e.marketLocation = "Market location is required";
      if (!state) e.state = "Select your state";
      if (languages.length === 0) e.languages = "Select at least one language";
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
      const res = await registerJobSeeker({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        dob,
        gender,
        bvn: bvn.trim(),
        address: address.trim(),
        state,
        skills,
        preferredCategories,
        experienceLevel,
        languages,
        marketLocation: marketLocation.trim(),
        pin,
      });

      const seeker = res.data.data;
      setSession({
        id: seeker._id,
        phone: seeker.phone,
        role: "seeker",
        name: `${seeker.firstName} ${seeker.lastName}`,
      });

      toast.success("Account created! Welcome to KasuwaConnect.");
      navigate("/seeker", { replace: true });
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
        <button
          onClick={() =>
            step > 0 ? setStep((s) => s - 1) : navigate("/login")
          }
          className="flex items-center gap-2 text-text-sub hover:text-primary text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark">
            Create Job Seeker Account
          </h1>
          <p className="text-text-sub text-sm mt-1">
            Get AI-matched to the best gigs for your skills
          </p>
        </div>

        <div className="mb-8">
          <StepIndicator steps={STEPS} currentStep={step} />
        </div>

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
                  placeholder="Emeka"
                  error={errors.firstName}
                />
                <Input
                  label="Last name *"
                  value={lastName}
                  onChange={setLastName}
                  placeholder="Eze"
                  error={errors.lastName}
                />
              </div>
              <Input
                label="Phone number *"
                value={phone}
                onChange={setPhone}
                placeholder="08055551234"
                type="tel"
                error={errors.phone}
              />
              <Input
                label="Email (optional)"
                value={email}
                onChange={setEmail}
                placeholder="emeka@email.com"
                type="email"
              />
              <Input
                label="Date of birth * (DD/MM/YYYY)"
                value={dob}
                onChange={setDob}
                placeholder="01/01/1998"
                error={errors.dob}
              />
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
                error={errors.bvn}
              />
              <Input
                label="Home address *"
                value={address}
                onChange={setAddress}
                placeholder="12 Market Road, Onitsha"
                error={errors.address}
              />
              <Button fullWidth onClick={handleNext}>
                Continue
              </Button>
            </div>
          )}

          {/* ── Step 2: Skills & Preferences ── */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-semibold text-dark text-lg">
                Skills & Preferences
              </h2>

              {/* Skills input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-sub uppercase tracking-wide">
                  Your skills * (add at least one)
                </label>
                <div className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill(skillInput);
                      }
                    }}
                    placeholder="Type a skill and press Enter"
                    className="flex-1 h-12 border border-border rounded-card px-4 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <Button
                    variant="secondary"
                    onClick={() => addSkill(skillInput)}
                  >
                    Add
                  </Button>
                </div>

                {/* Skill suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {SKILLS_SUGGESTIONS.filter((s) => !skills.includes(s))
                    .slice(0, 8)
                    .map((sk) => (
                      <button
                        key={sk}
                        onClick={() => addSkill(sk)}
                        className="text-xs border border-border text-text-sub px-2.5 py-1 rounded-full hover:border-primary hover:text-primary transition-all"
                      >
                        + {sk}
                      </button>
                    ))}
                </div>

                {/* Added skills */}
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {skills.map((sk) => (
                      <span
                        key={sk}
                        className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary font-medium px-3 py-1.5 rounded-full"
                      >
                        {sk}
                        <button
                          onClick={() => removeSkill(sk)}
                          className="hover:text-primary-dark font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.skills && (
                  <p className="text-xs text-error">{errors.skills}</p>
                )}
              </div>

              {/* Preferred categories */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-text-sub uppercase tracking-wide">
                  Preferred job categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`
                        text-xs font-semibold px-3 py-1.5 rounded-full border transition-all
                        ${
                          preferredCategories.includes(cat)
                            ? "bg-primary text-white border-primary"
                            : "border-border text-text-sub hover:border-primary hover:text-primary"
                        }
                      `}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience level */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-text-sub uppercase tracking-wide">
                  Experience level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {EXPERIENCE.map((exp) => (
                    <button
                      key={exp.value}
                      onClick={() => setExperienceLevel(exp.value)}
                      className={`
                        px-4 py-3 rounded-card border-2 text-sm font-medium
                        text-left transition-all duration-200
                        ${
                          experienceLevel === exp.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-text-sub hover:border-primary/40"
                        }
                      `}
                    >
                      {exp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-text-sub uppercase tracking-wide">
                  Languages you speak *
                </label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      className={`
                        text-xs font-semibold px-3 py-1.5 rounded-full border transition-all
                        ${
                          languages.includes(lang)
                            ? "bg-dark text-white border-dark"
                            : "border-border text-text-sub hover:border-dark hover:text-dark"
                        }
                      `}
                    >
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </button>
                  ))}
                </div>
                {errors.languages && (
                  <p className="text-xs text-error">{errors.languages}</p>
                )}
              </div>

              <Input
                label="Preferred market / area *"
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
                    focus:outline-none focus:border-primary
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
                  You'll use this 4-digit PIN to log in
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

              <div className="bg-dark/5 border border-dark/10 rounded-xl p-4">
                <p className="text-xs font-semibold text-dark mb-1">
                  What happens next
                </p>
                <p className="text-xs text-text-sub leading-relaxed">
                  After registration, you'll be matched to jobs using AI. A
                  Squad virtual account is created so employers can pay your
                  wages directly.
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
