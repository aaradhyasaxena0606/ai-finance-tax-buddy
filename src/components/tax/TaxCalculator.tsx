import { useState } from "react";
import { Calculator, IndianRupee, User, Briefcase, Info, Gift, AlertTriangle, HelpCircle, TrendingDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * New Tax Regime — FY 2025–26 (Assessment Year 2026–27)
 * 
 * This calculator uses ONLY the New Tax Regime as it is the default regime
 * from AY 2026 onwards. The Old Regime has been removed to simplify
 * the prototype and make it easier to explain during viva.
 * 
 * CORRECT Slab Structure for New Regime (FY 2025–26 | AY 2026–27):
 * ₹0 - ₹4,00,000         → 0% (No tax)
 * ₹4,00,001 - ₹8,00,000  → 5%
 * ₹8,00,001 - ₹12,00,000 → 10%
 * ₹12,00,001 - ₹16,00,000 → 15%
 * ₹16,00,001 - ₹20,00,000 → 20%
 * ₹20,00,001 - ₹24,00,000 → 25%
 * Above ₹24,00,000        → 30%
 * 
 * SECTION 87A REBATE (CRITICAL):
 * If taxable income ≤ ₹12,00,000 → Rebate up to ₹60,000
 * This can make entire tax liability ZERO for lower incomes.
 */
const NEW_REGIME_SLABS = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400000, max: 800000, rate: 5 },
  { min: 800000, max: 1200000, rate: 10 },
  { min: 1200000, max: 1600000, rate: 15 },
  { min: 1600000, max: 2000000, rate: 20 },
  { min: 2000000, max: 2400000, rate: 25 },
  { min: 2400000, max: Infinity, rate: 30 },
];

/**
 * STANDARD DEDUCTION
 * 
 * Under the New Tax Regime, ONLY salaried individuals are eligible
 * for the ₹50,000 standard deduction. 
 * 
 * Freelancer / Business income does NOT get standard deduction.
 * They can deduct actual business expenses or use presumptive taxation (44ADA).
 * 
 * No other deductions (80C, 80D, etc.) are allowed under New Regime.
 */
const STANDARD_DEDUCTION = 50000;

// Health & Education Cess rate (4% on total tax)
const CESS_RATE = 0.04;

// Section 87A Rebate - Maximum rebate of ₹60,000 if taxable income ≤ ₹12,00,000
const SECTION_87A_LIMIT = 1200000;
const SECTION_87A_MAX_REBATE = 60000;

// Section 44ADA - Presumptive Taxation limit (₹75 lakh)
const PRESUMPTIVE_TURNOVER_LIMIT = 7500000;
const PRESUMPTIVE_INCOME_RATE = 0.50; // 50% of turnover is deemed taxable income

interface TaxResult {
  grossIncome: number;
  standardDeduction: number;
  businessExpenses: number;
  taxableIncome: number;
  taxBeforeRebate: number;
  rebateApplied: number;
  taxAfterRebate: number;
  cess: number;
  totalTax: number;
  rebateEligible: boolean;
  calculationMethod: "normal" | "presumptive" | null;
}

/**
 * Calculates tax using progressive slab-based computation
 * Each slab's tax is calculated separately and summed up
 * 
 * @param taxableIncome - Income after all applicable deductions
 * @returns Tax amount before rebate and cess
 */
const calculateTaxFromSlabs = (taxableIncome: number): number => {
  let remainingIncome = taxableIncome;
  let tax = 0;

  for (const slab of NEW_REGIME_SLABS) {
    if (remainingIncome <= 0) break;
    
    const taxableInSlab = Math.min(remainingIncome, slab.max - slab.min);
    tax += taxableInSlab * (slab.rate / 100);
    remainingIncome -= taxableInSlab;
  }

  return tax;
};

/**
 * Formats number as Indian Rupee currency
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats number in Indian style (lakhs, crores)
 */
const formatIndianNumber = (num: number): string => {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    return `${(num / 100000).toFixed(2)} L`;
  }
  return num.toLocaleString('en-IN');
};

const TaxCalculator = () => {
  // Form state - only income type, no regime selection needed
  const [incomeType, setIncomeType] = useState<"salaried" | "freelancerBusiness">("salaried");
  
  // Calculation method for Freelancer / Business
  const [calculationMethod, setCalculationMethod] = useState<"normal" | "presumptive">("normal");
  
  // Salaried input - only annual salary (no 80C/80D in New Regime)
  const [annualSalary, setAnnualSalary] = useState<string>("");
  
  // Freelancer / Business inputs
  const [grossReceipts, setGrossReceipts] = useState<string>("");
  const [businessExpenses, setBusinessExpenses] = useState<string>("");
  
  // Result state
  const [result, setResult] = useState<TaxResult | null>(null);

  /**
   * Main calculation function for New Tax Regime (FY 2025–26 | AY 2026–27)
   */
  const calculateTax = () => {
    let grossIncome = 0;
    let standardDeduction = 0;
    let expenses = 0;
    let taxableIncome = 0;
    let methodUsed: "normal" | "presumptive" | null = null;

    if (incomeType === "salaried") {
      grossIncome = parseFloat(annualSalary) || 0;
      // Only salaried individuals get the ₹50,000 standard deduction
      standardDeduction = STANDARD_DEDUCTION;
      taxableIncome = Math.max(0, grossIncome - standardDeduction);
    } else {
      // Freelancer / Business: NO standard deduction
      grossIncome = parseFloat(grossReceipts) || 0;
      
      if (calculationMethod === "presumptive") {
        // Section 44ADA - 50% of gross receipts is taxable income
        taxableIncome = grossIncome * PRESUMPTIVE_INCOME_RATE;
        methodUsed = "presumptive";
      } else {
        // Normal Method - Actual business expenses deducted
        expenses = parseFloat(businessExpenses) || 0;
        taxableIncome = Math.max(0, grossIncome - expenses);
        methodUsed = "normal";
      }
    }
    
    // Calculate tax using New Regime slabs
    const taxBeforeRebate = calculateTaxFromSlabs(taxableIncome);
    
    // Apply Section 87A Rebate (if eligible)
    const rebateEligible = taxableIncome <= SECTION_87A_LIMIT;
    let rebateApplied = 0;
    let taxAfterRebate = taxBeforeRebate;
    
    if (rebateEligible && taxBeforeRebate > 0) {
      // Rebate is the lesser of calculated tax or ₹60,000
      rebateApplied = Math.min(taxBeforeRebate, SECTION_87A_MAX_REBATE);
      taxAfterRebate = taxBeforeRebate - rebateApplied;
    }
    
    // Add 4% Health & Education Cess (ONLY if tax after rebate > 0)
    const cess = taxAfterRebate > 0 ? taxAfterRebate * CESS_RATE : 0;
    const totalTax = taxAfterRebate + cess;

    setResult({
      grossIncome,
      standardDeduction,
      businessExpenses: expenses,
      taxableIncome,
      taxBeforeRebate,
      rebateApplied,
      taxAfterRebate,
      cess,
      totalTax,
      rebateEligible,
      calculationMethod: methodUsed,
    });
  };

  const resetForm = () => {
    setAnnualSalary("");
    setGrossReceipts("");
    setBusinessExpenses("");
    setResult(null);
  };

  const grossReceiptsValue = parseFloat(grossReceipts) || 0;
  const isPresumptiveEligible = grossReceiptsValue <= PRESUMPTIVE_TURNOVER_LIMIT;

  return (
     <div className="animate-fade-in">
      {/* Section Introduction */}
      <div className="mb-8">
      </div>
      {/* Two-Column Layout: Guidance (left) + Calculator (right) */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column - Context & Guidance (35%) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Regime Notice Card */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-1">New Tax Regime</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This is the default regime from FY 2025-26(AY 2026-27). Lower rates, but no 80C/80D deductions. 
                  Only salaried individuals get a ₹50,000 standard deduction.
                </p>
              </div>
            </div>
          </div>

          {/* Tax Slabs Reference */}
          <div className="p-5 rounded-xl border border-border bg-card">
            <h3 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-accent" />
              Tax Slabs (FY 2025–26 | AY 2026–27)
            </h3>
            <div className="space-y-2">
              {[
                { range: "₹0 – 4L", rate: "0%" },
                { range: "₹4L – 8L", rate: "5%" },
                { range: "₹8L – 12L", rate: "10%" },
                { range: "₹12L – 16L", rate: "15%" },
                { range: "₹16L – 20L", rate: "20%" },
                { range: "₹20L – 24L", rate: "25%" },
                { range: "Above ₹24L", rate: "30%" },
              ].map((slab, idx) => (
                <div key={idx} className="flex justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
                  <span className="text-muted-foreground">{slab.range}</span>
                  <span className="font-medium text-foreground tabular-nums">{slab.rate}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 87A Info */}
          <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
            <div className="flex items-start gap-3">
              <Gift className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-emerald-900 dark:text-emerald-300 mb-1">Section 87A Rebate</h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                  If your taxable income is ₹12 lakh or less, you may pay <strong>zero tax</strong> due to a rebate of up to ₹60,000.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Calculator (65%) */}
        <div className="lg:col-span-8">
          <div className="p-6 lg:p-8 rounded-2xl bg-card border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Calculate Your Tax</h2>
                <p className="text-sm text-muted-foreground">For Assessment Year 2026-27</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Income Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">What type of income do you earn?</Label>
                <RadioGroup
                  value={incomeType}
                  onValueChange={(v) => {
                    setIncomeType(v as "salaried" | "freelancerBusiness");
                    resetForm();
                  }}
                  className="grid grid-cols-2 gap-3"
                >
                  <Label
                    htmlFor="salaried"
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      incomeType === "salaried"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <RadioGroupItem value="salaried" id="salaried" />
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <span className="font-medium text-sm">Salaried</span>
                      <p className="text-xs text-muted-foreground">Fixed salary income</p>
                    </div>
                  </Label>
                  <Label
                    htmlFor="freelancerBusiness"
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      incomeType === "freelancerBusiness"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <RadioGroupItem value="freelancerBusiness" id="freelancerBusiness" />
                    <Briefcase className="h-5 w-5 text-accent" />
                    <div>
                      <span className="font-medium text-sm">Freelancer / Business</span>
                      <p className="text-xs text-muted-foreground">Self-employed</p>
                    </div>
                  </Label>
                </RadioGroup>
              </div>

              {/* Income Inputs based on type */}
              {incomeType === "salaried" ? (
                <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/30">
                  <div className="space-y-2">
                    <Label htmlFor="salary" className="text-sm font-medium">Annual Salary</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="salary"
                        type="number"
                        placeholder="e.g., 800000"
                        value={annualSalary}
                        onChange={(e) => setAnnualSalary(e.target.value)}
                        className="pl-9 h-12 text-lg"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <HelpCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      Include all income earned during the financial year (April–March).
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/30">
                  <div className="space-y-2">
                    <Label htmlFor="receipts" className="text-sm font-medium">Annual Gross Receipts / Turnover</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="receipts"
                        type="number"
                        placeholder="e.g., 1200000"
                        value={grossReceipts}
                        onChange={(e) => setGrossReceipts(e.target.value)}
                        className="pl-9 h-12 text-lg"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <HelpCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      Total payments received for services/goods before expenses.
                    </p>
                  </div>

                  {/* Calculation Method Selection */}
                  <div className="space-y-3 pt-2">
                    <Label className="text-sm font-medium">How should we calculate taxable income?</Label>
                    <RadioGroup
                      value={calculationMethod}
                      onValueChange={(v) => setCalculationMethod(v as "normal" | "presumptive")}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="normal"
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          calculationMethod === "normal"
                            ? "border-primary bg-white dark:bg-slate-800"
                            : "border-border/50 hover:border-primary/40"
                        }`}
                      >
                        <RadioGroupItem value="normal" id="normal" className="mt-0.5" />
                        <div>
                          <span className="font-medium text-sm">Actual Expenses</span>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Deduct real business costs (laptop, rent, software, travel).
                          </p>
                        </div>
                      </Label>
                      <Label
                        htmlFor="presumptive"
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          calculationMethod === "presumptive"
                            ? "border-primary bg-white dark:bg-slate-800"
                            : "border-border/50 hover:border-primary/40"
                        } ${!isPresumptiveEligible && grossReceiptsValue > 0 ? "opacity-50" : ""}`}
                      >
                        <RadioGroupItem 
                          value="presumptive" 
                          id="presumptive" 
                          className="mt-0.5"
                          disabled={!isPresumptiveEligible && grossReceiptsValue > 0}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">Section 44ADA</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-medium">SIMPLER</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Assume 50% of receipts is taxable. No expense tracking needed.
                          </p>
                          {!isPresumptiveEligible && grossReceiptsValue > 0 && (
                            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Turnover exceeds ₹75 lakh limit
                            </p>
                          )}
                        </div>
                      </Label>
                    </RadioGroup>
                  </div>

                  {/* Business Expenses - only show for Normal Method */}
                  {calculationMethod === "normal" && (
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="expenses" className="text-sm font-medium">Business Expenses</Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="expenses"
                          type="number"
                          placeholder="Deductible business costs"
                          value={businessExpenses}
                          onChange={(e) => setBusinessExpenses(e.target.value)}
                          className="pl-9 h-12 text-lg"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <HelpCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        Laptop, internet, rent, software, travel, courses — only work-related.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <Button onClick={calculateTax} size="lg" className="w-full h-12 text-base font-semibold">
                <Calculator className="mr-2 h-5 w-5" />
                Calculate My Tax
              </Button>
            </div>

            {/* Result Section */}
            {result && (
              <div className="mt-8 pt-8 border-t border-border">
                {/* Narrative Summary - Story-style explanation */}
                <div className="mb-6 p-5 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-foreground mb-3">Your Tax Story</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      You {incomeType === "salaried" ? "earned" : "received"} <strong className="text-foreground">{formatCurrency(result.grossIncome)}</strong> this year
                      {incomeType === "salaried" && " as salary"}.
                    </p>
                    
                    {incomeType === "salaried" && (
                      <p>
                        After the standard deduction of ₹50,000, your taxable income becomes <strong className="text-foreground">{formatCurrency(result.taxableIncome)}</strong>.
                      </p>
                    )}
                    
                    {incomeType === "freelancerBusiness" && result.calculationMethod === "presumptive" && (
                      <p>
                        Under Section 44ADA, only 50% is taxable — that's <strong className="text-foreground">{formatCurrency(result.taxableIncome)}</strong>.
                      </p>
                    )}
                    
                    {incomeType === "freelancerBusiness" && result.calculationMethod === "normal" && (
                      <p>
                        After deducting ₹{formatIndianNumber(result.businessExpenses)} in expenses, your taxable income is <strong className="text-foreground">{formatCurrency(result.taxableIncome)}</strong>.
                      </p>
                    )}
                    
                    {result.rebateEligible && result.totalTax === 0 && (
                      <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                        Since your taxable income is under ₹12 lakh, Section 87A rebate wipes out your entire tax liability.
                      </p>
                    )}
                    
                    {result.totalTax > 0 && (
                      <p>
                        Your final tax payable is <strong className="text-primary text-base">{formatCurrency(result.totalTax)}</strong> (including 4% cess).
                      </p>
                    )}
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Detailed Breakdown</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                      <span className="text-sm text-muted-foreground">Gross Income</span>
                      <span className="font-semibold tabular-nums">{formatCurrency(result.grossIncome)}</span>
                    </div>
                    
                    {incomeType === "salaried" && (
                      <div className="flex justify-between py-2.5 px-3">
                        <span className="text-sm text-muted-foreground">Standard Deduction</span>
                        <span className="font-medium text-emerald-600 tabular-nums">− {formatCurrency(result.standardDeduction)}</span>
                      </div>
                    )}
                    
                    {incomeType === "freelancerBusiness" && result.calculationMethod === "normal" && result.businessExpenses > 0 && (
                      <div className="flex justify-between py-2.5 px-3">
                        <span className="text-sm text-muted-foreground">Business Expenses</span>
                        <span className="font-medium text-emerald-600 tabular-nums">− {formatCurrency(result.businessExpenses)}</span>
                      </div>
                    )}

                    {incomeType === "freelancerBusiness" && result.calculationMethod === "presumptive" && (
                      <div className="flex justify-between py-2.5 px-3">
                        <div className="text-sm text-muted-foreground">
                          <span>Deemed Income (44ADA)</span>
                          <span className="block text-xs">50% of turnover</span>
                        </div>
                        <span className="font-medium tabular-nums">{formatCurrency(result.taxableIncome)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between py-2.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <div>
                        <span className="text-sm font-medium text-foreground">Taxable Income</span>
                        <span className="block text-xs text-muted-foreground">Income on which tax slabs are applied</span>
                      </div>
                      <span className="font-bold tabular-nums">{formatCurrency(result.taxableIncome)}</span>
                    </div>
                    
                    <div className="flex justify-between py-2.5 px-3">
                      <span className="text-sm text-muted-foreground">Tax (before rebate)</span>
                      <span className="font-medium tabular-nums">{formatCurrency(result.taxBeforeRebate)}</span>
                    </div>
                    
                    {result.rebateEligible && result.rebateApplied > 0 && (
                      <div className="flex justify-between py-2.5 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                        <span className="text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                          <Gift className="h-4 w-4" />
                          Section 87A Rebate
                        </span>
                        <span className="font-medium text-emerald-600 tabular-nums">− {formatCurrency(result.rebateApplied)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between py-2.5 px-3">
                      <span className="text-sm text-muted-foreground">Tax (after rebate)</span>
                      <span className="font-medium tabular-nums">{formatCurrency(result.taxAfterRebate)}</span>
                    </div>
                    
                    <div className="flex justify-between py-2.5 px-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Health & Education Cess</span>
                        <span className="block text-xs text-muted-foreground">4% of tax after rebate</span>
                      </div>
                      <span className="font-medium tabular-nums">{formatCurrency(result.cess)}</span>
                    </div>
                    
                    <div className={`flex justify-between py-4 px-4 rounded-xl ${
                      result.totalTax === 0 
                        ? "bg-emerald-100 dark:bg-emerald-900/40" 
                        : "bg-primary/10"
                    }`}>
                      <div>
                        <span className="font-bold text-lg">Total Tax Payable</span>
                        <span className="block text-xs text-muted-foreground">Final amount after all calculations</span>
                      </div>
                      <span className={`font-bold text-2xl tabular-nums ${
                        result.totalTax === 0 
                          ? "text-emerald-700 dark:text-emerald-400" 
                          : "text-primary"
                      }`}>
                        {formatCurrency(result.totalTax)}
                      </span>
                    </div>
                    
                    {/* Net Income (After Tax) */}
                    <div className="flex justify-between py-4 px-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
                      <div>
                        <span className="font-bold text-lg text-blue-900 dark:text-blue-300">Net Income (After Tax)</span>
                        <span className="block text-xs text-blue-700 dark:text-blue-400">Income you retain after paying tax</span>
                      </div>
                      <span className="font-bold text-2xl tabular-nums text-blue-700 dark:text-blue-300">
                        {formatCurrency(result.grossIncome - result.totalTax)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Section 87A Explanation - shown when rebate makes tax zero */}
                {result.rebateEligible && result.totalTax === 0 && result.taxBeforeRebate > 0 && (
                  <div className="flex items-start gap-3 p-4 mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                    <Gift className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold text-emerald-800 dark:text-emerald-300">You owe no tax this year. 🎉</p>
                      <p className="text-emerald-700 dark:text-emerald-400 mt-1 leading-relaxed">
                        Under the New Tax Regime, Section 87A provides a rebate of up to ₹60,000 for taxpayers 
                        with taxable income up to ₹12,00,000. Since your calculated tax of {formatCurrency(result.taxBeforeRebate)} is 
                        within this limit, your entire tax liability has been eliminated.
                      </p>
                    </div>
                  </div>
                )}

                {/* Advance Tax Guidance - only for Freelancer / Business */}
                {incomeType === "freelancerBusiness" && result.totalTax > 10000 && (
                  <div className="flex items-start gap-3 p-4 mt-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold text-amber-800 dark:text-amber-300">Advance Tax Required</p>
                      <p className="text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">
                        Since your tax exceeds ₹10,000 and you don't have TDS, you must pay advance tax quarterly:
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="text-xs p-2 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                          <strong>15%</strong> by June 15
                        </div>
                        <div className="text-xs p-2 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                          <strong>45%</strong> by Sept 15
                        </div>
                        <div className="text-xs p-2 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                          <strong>75%</strong> by Dec 15
                        </div>
                        <div className="text-xs p-2 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                          <strong>100%</strong> by Mar 15
                        </div>
                      </div>
                      <p className="text-amber-700 dark:text-amber-400 mt-2 text-xs">
                        Missing payments attracts interest under Sections 234B and 234C.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {!result && (
              <div className="mt-8 pt-8 border-t border-border">
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                    <Calculator className="h-7 w-7 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Enter your income details above<br />to see your complete tax breakdown
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;
