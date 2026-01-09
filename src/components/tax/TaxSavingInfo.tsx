import { useState } from "react";
import { PiggyBank, Heart, GraduationCap, Shield, Info, ArrowRight, TrendingDown, BadgePercent, Receipt, Building2, FileCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Tax saving options data for Indian taxpayers
 * Contains information about major deduction sections under Income Tax Act
 * 
 * NOTE: These deductions are primarily relevant for the Old Tax Regime.
 * The New Regime (default from AY 2024-25) does not allow most of these.
 */
const TAX_SAVING_OPTIONS = [
  {
    id: "80c",
    icon: PiggyBank,
    title: "Section 80C Deductions",
    limit: "₹1,50,000",
    description: "The most popular tax-saving section for investments and expenses",
    items: [
      { name: "Public Provident Fund (PPF)", detail: "15-year lock-in, tax-free returns" },
      { name: "Equity Linked Savings Scheme (ELSS)", detail: "3-year lock-in, market-linked returns" },
      { name: "Life Insurance Premium (LIC)", detail: "Premium payments up to 10% of sum assured" },
      { name: "5-Year Fixed Deposits", detail: "Bank/Post Office tax-saver FDs" },
      { name: "Employee Provident Fund (EPF)", detail: "12% of basic salary contribution" },
      { name: "Children's Tuition Fees", detail: "Up to 2 children, school/college fees" },
      { name: "Home Loan Principal Repayment", detail: "EMI principal component" },
    ],
  },
  {
    id: "80ccd",
    icon: Shield,
    title: "NPS - Section 80CCD(1B)",
    limit: "₹50,000",
    description: "Additional deduction for National Pension System contributions",
    items: [
      { name: "National Pension System (NPS)", detail: "Extra ₹50,000 over and above 80C limit" },
      { name: "Atal Pension Yojana", detail: "Government pension scheme for unorganized sector" },
    ],
    note: "This is an additional deduction over the ₹1.5L limit of Section 80C. Total 80C + 80CCD(1B) can be ₹2L.",
  },
  {
    id: "80d",
    icon: Heart,
    title: "Health Insurance - Section 80D",
    limit: "₹25,000",
    description: "Deductions for health insurance premiums",
    items: [
      { name: "Self & Family Premium", detail: "Up to ₹25,000 for self, spouse, and children" },
      { name: "Parents Premium", detail: "Additional ₹25,000 (₹50,000 if senior citizen)" },
      { name: "Preventive Health Check-up", detail: "Up to ₹5,000 within overall limit" },
    ],
    note: "Senior citizens (60+) can claim up to ₹50,000. Maximum deduction can be ₹1,00,000 if all family members are senior citizens.",
  },
  {
    id: "80e",
    icon: GraduationCap,
    title: "Education Loan Interest - Section 80E",
    limit: "No Upper Limit",
    description: "Deduction for interest paid on education loans",
    items: [
      { name: "Higher Education Loan Interest", detail: "For self, spouse, children, or student under legal guardianship" },
      { name: "Duration", detail: "Available for 8 years from start of repayment or until interest is fully paid" },
    ],
    note: "Only interest component is deductible, not the principal. Loan must be from approved financial institution.",
  },
];

const NEW_REGIME_BENEFITS = [
  {
    id: "lower-slabs",
    icon: TrendingDown,
    title: "Lower Tax Slabs",
    value: "Automatic benefit",
    description: "The New Tax Regime offers reduced tax rates across income slabs, allowing taxpayers to save tax without making specific investments.",
  },
  {
    id: "87a-rebate",
    icon: BadgePercent,
    title: "Rebate under Section 87A",
    value: "Up to ₹60,000",
    description: "If taxable income is up to ₹12,00,000, the entire income tax liability is eliminated under the New Tax Regime.",
  },
  {
    id: "standard-deduction",
    icon: Receipt,
    title: "Standard Deduction",
    value: "₹50,000",
    badge: "Salaried only",
    description: "Salaried individuals can claim a flat standard deduction of ₹50,000 even under the New Tax Regime.",
  },
  {
    id: "employer-nps",
    icon: Building2,
    title: "Employer NPS Contribution (80CCD(2))",
    value: "Up to 10% of Basic Salary",
    description: "Employer contributions to the National Pension System are allowed as a deduction under the New Tax Regime. Employee contributions are not eligible.",
  },
  {
    id: "minimal-docs",
    icon: FileCheck,
    title: "Minimal Documentation",
    value: "No investment proofs",
    description: "The New Tax Regime does not require submission of investment proofs, making tax filing simpler and faster.",
  },
];

const TaxSavingInfo = () => {
  const [activeTab, setActiveTab] = useState<"old" | "new">("old");

  return (
    <div className="animate-fade-in">
      {/* Tab Navigation */}
      <div className="flex border-b border-border mb-8">
        <button
          onClick={() => setActiveTab("old")}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "old"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Old Regime
        </button>
        <button
          onClick={() => setActiveTab("new")}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "new"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          New Regime
        </button>
      </div>

      {/* Old Regime Tab Content */}
      {activeTab === "old" && (
        <div>
          {/* Important Notice for Old Regime */}
          <div className="mb-8 p-5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-amber-800 dark:text-amber-300 mb-1">
                  Old Tax Regime Deductions
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                  These deductions are available only if you opt for the Old Tax Regime. 
                  Understanding them helps you compare regimes and plan your investments wisely.
                </p>
              </div>
            </div>
          </div>

          {/* Two-Column Layout */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column - Summary (35%) */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
                Maximum Savings Potential
              </h3>
              
              <div className="space-y-3">
                {[
                  { section: "80C", amount: "₹1,50,000", desc: "Investments & Expenses" },
                  { section: "80CCD(1B)", amount: "₹50,000", desc: "NPS Contribution" },
                  { section: "80D", amount: "₹25,000+", desc: "Health Insurance" },
                  { section: "80E", amount: "No Limit", desc: "Education Loan Interest" },
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-border"
                  >
                    <div>
                      <span className="text-xs text-muted-foreground">Section</span>
                      <p className="font-semibold text-sm text-foreground">{item.section}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-primary tabular-nums">{item.amount}</p>
                      <span className="text-xs text-muted-foreground">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Potential */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mt-6">
                <p className="text-xs text-muted-foreground mb-1">Total Potential Deduction</p>
                <p className="text-2xl font-bold text-primary">₹2,25,000+</p>
                <p className="text-xs text-muted-foreground mt-1">Under Old Tax Regime</p>
              </div>
            </div>

            {/* Right Column - Detailed Accordion (65%) */}
            <div className="lg:col-span-8">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
                Detailed Breakdown
              </h3>
              
              <Accordion type="single" collapsible className="space-y-3">
                {TAX_SAVING_OPTIONS.map((option) => (
                  <AccordionItem
                    key={option.id}
                    value={option.id}
                    className="rounded-xl border border-border bg-card px-0 overflow-hidden"
                  >
                    <AccordionTrigger className="hover:no-underline px-5 py-4">
                      <div className="flex items-center gap-4 text-left">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <option.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-sm text-foreground">{option.title}</h3>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 font-medium">
                              {option.limit}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5 pt-0">
                      <div className="space-y-2 ml-12">
                        {option.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50"
                          >
                            <ArrowRight className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-sm text-foreground">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.detail}</p>
                            </div>
                          </div>
                        ))}
                        {option.note && (
                          <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">Pro tip:</span> {option.note}
                            </p>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      )}

      {/* New Regime Tab Content */}
      {activeTab === "new" && (
        <div>
          {/* Section Heading */}
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Tax Benefits under the New Tax Regime
          </h3>

          {/* Introductory Text */}
          <div className="mb-8 p-5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                  The New Tax Regime is designed to simplify taxation by offering lower tax rates and reducing the need for investment-based deductions.
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed mt-2">
                  Tax benefits are provided directly through rebates, allowances, and simplified compliance.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {NEW_REGIME_BENEFITS.map((benefit) => (
              <div
                key={benefit.id}
                className="p-5 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-primary/10 flex-shrink-0">
                    <benefit.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-semibold text-sm text-foreground">{benefit.title}</h4>
                      {benefit.badge && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 font-medium">
                          {benefit.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-lg font-bold text-primary mb-2">{benefit.value}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxSavingInfo;
