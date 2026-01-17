import { IndianRupee, GraduationCap, Calculator, PiggyBank, FileText, Bell, AlertTriangle } from "lucide-react";
import TaxCalculator from "@/components/tax/TaxCalculator";
import TaxSavingInfo from "@/components/tax/TaxSavingInfo";
import FilingGuidance from "@/components/tax/FilingGuidance";
import DeadlineReminders from "@/components/tax/DeadlineReminders";

/**
 * IncomeTaxAndGST - Main module page for Income Tax & GST educational content
 */
const IncomeTaxAndGST = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative bg-slate-900 py-12 lg:py-16">
        <div className="container relative z-10">
          <div className="max-w-2xl">
            {/* Educational Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/8 border border-white/10 mb-5">
              <GraduationCap className="h-3.5 w-3.5 text-white/60" />
              <span className="text-xs text-white/60 font-medium tracking-wide uppercase">
                Educational Module • FY 2025-26 | AY 2026-27
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Income Tax & GST
            </h1>

            {/* Single supporting line (kept subtle) */}
            <p className="mt-2 text-sm text-white/45 leading-relaxed max-w-xl">
              Built to help first-time earners understand tax without fear or jargon.
            </p>
          </div>
        </div>
      </header>

      {/* Quick Navigation */}
      <nav className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="container py-3">
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
      </nav>

      {/* Main Content */}
      <main>
        {/* Section 1: Tax Calculator */}
        <section id="calculator" className="py-12 lg:py-20">
          <div className="container grid lg:grid-cols-[1fr_1.8fr] gap-8 lg:gap-12">
            <div>
              <SectionHeader
                icon={Calculator}
                title="Income Tax Calculator"
                subtitle="New Tax Regime (FY 2025-26 | AY 2026-27)"
                accentColor="primary"
              />
            </div>
            <TaxCalculator />
          </div>
        </section>

        {/* Section 2: Tax Saving Options */}
        <section id="saving" className="py-12 lg:py-20 bg-muted/40 border-y border-border">
          <div className="container grid lg:grid-cols-[1fr_1.8fr] gap-8 lg:gap-12">
            <div>
              <SectionHeader
                icon={PiggyBank}
                title="Tax Saving Options"
                subtitle="Legal ways to reduce liability"
                accentColor="accent"
              />
            </div>
            <TaxSavingInfo />
          </div>
        </section>

        {/* Section 3: Filing Guidance */}
        <section id="filing" className="py-12 lg:py-20">
          <div className="container grid lg:grid-cols-[1fr_1.8fr] gap-8 lg:gap-12">
            <div>
              <SectionHeader
                icon={FileText}
                title="ITR & GST Filing Guide"
                subtitle="Step-by-step process"
                accentColor="primary"
              />
            </div>
            <FilingGuidance />
          </div>
        </section>

        {/* Section 4: Deadline Reminders */}
        <section
          id="deadlines"
          className="py-12 lg:py-20 bg-amber-50/50 dark:bg-amber-950/10 border-y border-amber-200/50 dark:border-amber-900/30"
        >
          <div className="container grid lg:grid-cols-[1fr_1.8fr] gap-8 lg:gap-12">
            <div>
              <SectionHeader
                icon={Bell}
                title="Tax Deadline Tracker"
                subtitle="Critical filing dates"
                accentColor="warning"
              />
              <div className="mt-4 flex gap-2.5 p-3 bg-amber-100 dark:bg-amber-950/50 border-l-2 border-amber-500">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  Tax penalties usually happen due to missed dates, not high income.
                </p>
              </div>
            </div>
            <DeadlineReminders />
          </div>
        </section>

        {/* Why this module exists */}
        <section className="py-12 bg-muted/30 border-t border-border">
          <div className="container max-w-2xl">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Why this module exists
            </h3>
            <p className="text-sm text-muted-foreground">
              This module bridges the gap between taxation rules and real-world application
              for first-time earners and freelancers.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-10">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10">
              <IndianRupee className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="font-semibold text-sm">FinLit Platform</span>
              <span className="block text-xs text-muted-foreground">
                Financial Literacy for Indian Youth
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Educational project only. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  accentColor: "primary" | "accent" | "warning";
}

const SectionHeader = ({ icon: Icon, title, subtitle, accentColor }: SectionHeaderProps) => {
  const colors = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    warning: "bg-amber-100 dark:bg-amber-900/30 text-amber-600",
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`p-2 ${colors[accentColor]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default IncomeTaxAndGST;
