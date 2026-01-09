import { FileText, CheckCircle2, Upload, Search, FileCheck, ShieldCheck, Store, Receipt, ArrowRight, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * ITR Filing Steps - Step-by-step guide for filing Income Tax Returns
 */
const ITR_STEPS = [
  {
    step: 1,
    icon: FileText,
    title: "Gather Your Documents",
    description: "Collect all necessary documents before you begin",
    checklist: [
      "Form 16 from employer",
      "Bank interest certificates",
      "Investment proofs (PPF, ELSS, LIC)",
      "Rent receipts (if claiming HRA)",
      "Home loan interest certificate",
      "Form 26AS (Tax Credit Statement)",
    ],
  },
  {
    step: 2,
    icon: Upload,
    title: "Access the IT Portal",
    description: "Login to the official Income Tax e-Filing portal",
    checklist: [
      "Visit incometax.gov.in",
      "Login with PAN & password",
      "Register if first-time user",
      "Link Aadhaar with PAN (mandatory)",
    ],
  },
  {
    step: 3,
    icon: Search,
    title: "Select the Right ITR Form",
    description: "Choose the form that matches your income sources",
    checklist: [
      "ITR-1: Salaried with income ≤₹50L",
      "ITR-2: Multiple income sources, capital gains",
      "ITR-3: Business/Profession income",
      "ITR-4: Presumptive taxation (small business)",
    ],
  },
  {
    step: 4,
    icon: FileCheck,
    title: "Fill Income & Deductions",
    description: "Enter your income and claim applicable deductions",
    checklist: [
      "Verify pre-filled salary details",
      "Add other income (interest, rent)",
      "Enter deductions under 80C, 80D, etc.",
      "Report capital gains if any",
      "Cross-verify with Form 26AS",
    ],
  },
  {
    step: 5,
    icon: ShieldCheck,
    title: "Submit & e-Verify",
    description: "Complete submission and verify your return",
    checklist: [
      "Review all entries carefully",
      "Pay any pending tax dues",
      "Submit the return",
      "e-Verify using Aadhaar OTP / Net Banking",
      "Download acknowledgment (ITR-V)",
    ],
  },
];

/**
 * GST Guide content for freelancers and small businesses
 */
const GST_GUIDE = {
  whoNeeds: [
    { condition: "Annual turnover exceeds ₹40 lakh (goods)", required: true },
    { condition: "Annual turnover exceeds ₹20 lakh (services)", required: true },
    { condition: "Inter-state supply of goods/services", required: true },
    { condition: "E-commerce sellers", required: true },
    { condition: "Casual taxable person", required: true },
  ],
  freelancerInfo: {
    title: "GST for Freelancers",
    points: [
      "Required if service revenue exceeds ₹20 lakh per year",
      "Threshold is ₹10 lakh for special category states",
      "Export of services qualifies for zero-rated supply",
      "Can opt for Composition Scheme if eligible",
    ],
  },
  returns: [
    {
      form: "GSTR-1",
      description: "Outward supplies (sales)",
      frequency: "11th of every month",
      details: "Report all sales invoices issued during the period",
    },
    {
      form: "GSTR-3B",
      description: "Summary return with tax payment",
      frequency: "20th of every month",
      details: "Summary of sales, purchases, and tax liability",
    },
    {
      form: "GSTR-9",
      description: "Annual return",
      frequency: "31st December",
      details: "Consolidated summary of all monthly/quarterly returns",
    },
  ],
};

const FilingGuidance = () => {
  return (
    <div className="animate-fade-in">
      <Tabs defaultValue="itr" className="space-y-8">
        <TabsList className="grid w-full max-w-md grid-cols-2 h-11 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <TabsTrigger 
            value="itr" 
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-sm rounded-lg text-sm font-medium"
          >
            <FileCheck className="mr-2 h-4 w-4" />
            ITR Filing
          </TabsTrigger>
          <TabsTrigger 
            value="gst" 
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-sm rounded-lg text-sm font-medium"
          >
            <Store className="mr-2 h-4 w-4" />
            GST Basics
          </TabsTrigger>
        </TabsList>

        {/* ITR Filing Tab */}
        <TabsContent value="itr" className="space-y-8">
          {/* Two-Column Layout */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column - Quick Reference (35%) */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
                Quick Reference
              </h3>
              
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">Official Portal</p>
                  <a 
                    href="https://incometax.gov.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-semibold text-primary flex items-center gap-1 hover:underline"
                  >
                    incometax.gov.in
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border">
                  <p className="text-xs text-muted-foreground mb-2">Which ITR Form?</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Salaried (≤₹50L)</span>
                      <span className="font-medium">ITR-1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capital Gains</span>
                      <span className="font-medium">ITR-2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Freelancer/Business</span>
                      <span className="font-medium">ITR-3/4</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
                  <p className="text-xs text-muted-foreground mb-1">e-Verify Within</p>
                  <p className="font-bold text-lg text-emerald-700 dark:text-emerald-400">30 Days</p>
                  <p className="text-xs text-muted-foreground mt-1">of filing your return</p>
                </div>
              </div>
            </div>

            {/* Right Column - Step-by-Step (65%) */}
            <div className="lg:col-span-8">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
                Step-by-Step Process
              </h3>
              
              <div className="space-y-4">
                {ITR_STEPS.map((step, idx) => (
                  <div 
                    key={step.step} 
                    className="relative pl-8 pb-6 last:pb-0"
                  >
                    {/* Timeline line */}
                    {idx < ITR_STEPS.length - 1 && (
                      <div className="absolute left-3 top-8 bottom-0 w-px bg-border" />
                    )}
                    
                    {/* Step number */}
                    <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {step.step}
                    </div>
                    
                    <div className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <step.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-foreground">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-2 ml-8">
                        {step.checklist.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* GST Guide Tab */}
        <TabsContent value="gst" className="space-y-8">
          {/* Two-Column Layout */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column - Who Needs GST (40%) */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
                Who Needs GST Registration?
              </h3>
              
              <div className="space-y-2">
                {GST_GUIDE.whoNeeds.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-border">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item.condition}</span>
                  </div>
                ))}
              </div>

              {/* Freelancer-specific info */}
              <div className="mt-6 p-5 rounded-xl bg-accent/5 border border-accent/20">
                <div className="flex items-start gap-3">
                  <Receipt className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-foreground mb-2">{GST_GUIDE.freelancerInfo.title}</h4>
                    <ul className="space-y-2">
                      {GST_GUIDE.freelancerInfo.points.map((point, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <ArrowRight className="h-3 w-3 text-accent mt-0.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - GST Returns (60%) */}
            <div className="lg:col-span-7">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
                Common GST Returns
              </h3>
              
              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-border">
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide p-3">Form</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide p-3">Purpose</th>
                      <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide p-3">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GST_GUIDE.returns.map((ret, idx) => (
                      <tr 
                        key={idx}
                        className={`border-b border-border/50 last:border-0 ${
                          idx % 2 === 0 ? "bg-white dark:bg-transparent" : "bg-slate-50/50 dark:bg-slate-900/20"
                        }`}
                      >
                        <td className="p-3">
                          <span className="font-bold text-primary">{ret.form}</span>
                        </td>
                        <td className="p-3">
                          <p className="font-medium text-sm text-foreground">{ret.description}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{ret.details}</p>
                        </td>
                        <td className="p-3 text-right">
                          <span className="text-sm font-medium text-foreground">{ret.frequency}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* GST Portal link */}
              <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Official GST Portal</p>
                <a 
                  href="https://gst.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold text-primary flex items-center gap-1 hover:underline"
                >
                  gst.gov.in
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FilingGuidance;
