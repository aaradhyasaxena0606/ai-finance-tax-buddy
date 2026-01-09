import { IndianRupee, GraduationCap, Calculator, PiggyBank, FileText, Bell, AlertTriangle } from "lucide-react";
import TaxCalculator from "@/components/tax/TaxCalculator";
import TaxSavingInfo from "@/components/tax/TaxSavingInfo";
import FilingGuidance from "@/components/tax/FilingGuidance";
import DeadlineReminders from "@/components/tax/DeadlineReminders";

/**
 * IncomeTaxAndGST - Main module page for Income Tax & GST educational content
 * Part of the AI-integrated Financial Literacy Platform for Indian youth
 */
const IncomeTaxAndGST = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header - Institutional, not flashy */}
      <header className="relative bg-slate-900 py-12 lg:py-16">
        <div className="container relative z-10">
          <div className="max-w-2xl">
            {/* Educational Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/8 border border-white/10 mb-5">
              <GraduationCap className="h-3.5 w-3.5 text-white/60" />
              <span className="text-xs text-white/60 font-medium tracking-wide uppercase">
                Educational Module • AY 2024-25
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              Income Tax & GST
            </h1>
            <p className="text-base text-white/50 leading-relaxed mb-3">
              Understand how Indian taxation works. Calculate your liability, 
              learn about legal deductions, and know when to file.
            </p>
            <p className="text-sm text-white/40 leading-relaxed">
              Built to help first-time earners understand tax without fear or jargon.
            </p>
          </div>
        </div>
      </header>

      {/* Quick Navigation - Utilitarian tool navigation */}
      <nav className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="container">
          <div className="py-3">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium mb-2 block">
              Jump to section
            </span>
            <div className="flex gap-0.5 overflow-x-auto scrollbar-hide -mx-1">
              {[
                { label: "Calculator", href: "#calculator", icon: Calculator },
                { label: "Deductions", href: "#saving", icon: PiggyBank },
                { label: "Filing Guide", href: "#filing", icon: FileText },
                { label: "Deadlines", href: "#deadlines", icon: Bell },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors whitespace-nowrap"
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        
        {/* Section 1: Tax Calculator */}
        <section id="calculator" className="py-12 lg:py-20 bg-background">
          <div className="container">
            <div className="flex items-center gap-3 mb-8">
              <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground text-sm font-bold rounded-sm">1</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid lg:grid-cols-[1fr_1.8fr] gap-8 lg:gap-12">
              {/* Left: Context */}
              <div className="lg:pt-2">
                <SectionHeader 
                  icon={Calculator}
                  title="Income Tax Calculator"
                  subtitle="New Tax Regime (AY 2024-25)"
                  accentColor="primary"
                />
                <div className="mt-5 space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This calculator follows the New Tax Regime (AY 2024–25) and reflects current rebate rules under Section 87A.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Enter your income details to see exactly how much tax applies — or whether you qualify for zero tax.
                  </p>
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground/70 leading-relaxed">
                      <strong className="text-muted-foreground">What this does:</strong> Calculates your tax liability step-by-step, showing how slabs and rebates apply to your specific income.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Right: Calculator */}
              <div>
                <TaxCalculator />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Tax Saving Information */}
        <section id="saving" className="py-12 lg:py-20 bg-muted/40 border-y border-border">
          <div className="container">
            <div className="flex items-center gap-3 mb-8">
              <span className="flex items-center justify-center w-8 h-8 bg-accent text-accent-foreground text-sm font-bold rounded-sm">2</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid lg:grid-cols-[1fr_1.8fr] gap-8 lg:gap-12">
              {/* Left: Context */}
              <div className="lg:pt-2">
                <SectionHeader 
                  icon={PiggyBank}
                  title="Tax Saving Options"
                  subtitle="Legal ways to reduce liability"
                  accentColor="accent"
                />
                <div className="mt-5 space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Even if you don't use these now, understanding them helps you plan better for the future.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The New Tax Regime limits most deductions, but knowing your options helps you compare regimes intelligently.
                  </p>
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground/70 leading-relaxed">
                      <strong className="text-muted-foreground">Why this matters:</strong> Tax planning isn't about avoiding tax — it's about using provisions the law already offers.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Right: Component */}
              <div>
                <TaxSavingInfo />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Filing Guidance */}
        <section id="filing" className="py-12 lg:py-20 bg-background">
          <div className="container">
            <div className="flex items-center gap-3 mb-8">
              <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground text-sm font-bold rounded-sm">3</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid lg:grid-cols-[1fr_1.8fr] gap-8 lg:gap-12">
              {/* Left: Context */}
              <div className="lg:pt-2">
                <SectionHeader 
                  icon={FileText}
                  title="ITR & GST Filing Guide"
                  subtitle="Step-by-step process"
                  accentColor="primary"
                />
                <div className="mt-5 space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Filing taxes for the first time can feel overwhelming. This guide breaks down the process into clear, manageable steps.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    From gathering documents to final verification — each step explained without jargon.
                  </p>
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground/70 leading-relaxed">
                      <strong className="text-muted-foreground">First-time filers:</strong> Don't worry if this seems complex. Most people figure it out in 30–45 minutes with proper guidance.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Right: Component */}
              <div>
                <FilingGuidance />
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Deadline Reminders */}
        <section id="deadlines" className="py-12 lg:py-20 bg-amber-50/50 dark:bg-amber-950/10 border-y border-amber-200/50 dark:border-amber-900/30">
          <div className="container">
            <div className="flex items-center gap-3 mb-8">
              <span className="flex items-center justify-center w-8 h-8 bg-amber-500 text-white text-sm font-bold rounded-sm">4</span>
              <div className="h-px flex-1 bg-amber-200 dark:bg-amber-900/50" />
            </div>
            <div className="grid lg:grid-cols-[1fr_1.8fr] gap-8 lg:gap-12">
              {/* Left: Context with warning */}
              <div className="lg:pt-2">
                <SectionHeader 
                  icon={Bell}
                  title="Tax Deadline Tracker"
                  subtitle="Critical filing dates"
                  accentColor="warning"
                />
                <div className="mt-5 space-y-4">
                  {/* Warning callout */}
                  <div className="flex gap-2.5 p-3 bg-amber-100 dark:bg-amber-950/50 border-l-2 border-amber-500">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                      Tax penalties usually happen due to missed dates, not high income. Set reminders early.
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Missing deadlines causes penalties — reminders exist for a reason. Mark these dates on your calendar.
                  </p>
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground/70 leading-relaxed">
                      <strong className="text-muted-foreground">Late filing:</strong> Can result in penalties up to ₹10,000 and interest on unpaid tax at 1% per month.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Right: Component */}
              <div>
                <DeadlineReminders />
              </div>
            </div>
          </div>
        </section>

        {/* Personal Touch Section */}
        <section className="py-12 lg:py-16 bg-muted/30 border-t border-border">
          <div className="container">
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Why this module exists
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This module bridges the gap between taxation rules and their real-world application for first-time earners and freelancers.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  It emphasizes correct interpretation, usability, and decision-making under the Indian tax system.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-10">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10">
                <IndianRupee className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="font-semibold text-foreground block text-sm">FinLit Platform</span>
                <span className="text-xs text-muted-foreground">Financial Literacy for Indian Youth</span>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground max-w-md md:text-right">
              <p className="text-xs">
                Educational project only. Does not provide real tax filing services or financial advice.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

/**
 * Section Header Component - Clean, understated section titles
 */
interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  accentColor: "primary" | "accent" | "warning";
}

const SectionHeader = ({ icon: Icon, title, subtitle, accentColor }: SectionHeaderProps) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    warning: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`p-2 ${colorClasses[accentColor]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h2 className="text-lg lg:text-xl font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">{subtitle}</p>
      </div>
    </div>
  );
};

export default IncomeTaxAndGST;
