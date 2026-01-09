import { useState } from "react";
import { AlertTriangle, Clock, Calendar, ArrowRight, Briefcase, User } from "lucide-react";

/**
 * Dynamic deadline calculation utilities
 */
const getNextDate = (month: number, day: number): Date => {
  const now = new Date();
  const currentYear = now.getFullYear();
  let targetDate = new Date(currentYear, month - 1, day);
  
  // If the date has passed this year, use next year
  if (targetDate < now) {
    targetDate = new Date(currentYear + 1, month - 1, day);
  }
  
  return targetDate;
};

const getNextMonthlyDate = (dayOfMonth: number): Date => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  let targetDate = new Date(currentYear, currentMonth, dayOfMonth);
  
  // If the date has passed this month, use next month
  if (targetDate <= now) {
    targetDate = new Date(currentYear, currentMonth + 1, dayOfMonth);
  }
  
  return targetDate;
};

const getDaysRemaining = (targetDate: Date): number => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getUrgencyFromDays = (days: number): "overdue" | "urgent" | "soon" | "upcoming" => {
  if (days < 0) return "overdue";
  if (days <= 3) return "urgent";
  if (days <= 15) return "soon";
  return "upcoming";
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/**
 * Get urgency styling based on deadline urgency level
 */
const getUrgencyConfig = (urgency: string) => {
  switch (urgency) {
    case "overdue":
      return {
        borderColor: "border-l-red-700",
        bgColor: "bg-red-100 dark:bg-red-950/50",
        iconBg: "bg-red-200 dark:bg-red-900/50",
        iconColor: "text-red-700 dark:text-red-400",
        badgeBg: "bg-red-700 text-white",
        badgeText: "OVERDUE",
        dateColor: "text-red-800 dark:text-red-400",
      };
    case "urgent":
      return {
        borderColor: "border-l-red-600",
        bgColor: "bg-red-50 dark:bg-red-950/30",
        iconBg: "bg-red-100 dark:bg-red-900/50",
        iconColor: "text-red-600 dark:text-red-400",
        badgeBg: "bg-red-600 text-white",
        badgeText: "DUE SOON",
        dateColor: "text-red-700 dark:text-red-400",
      };
    case "soon":
      return {
        borderColor: "border-l-amber-500",
        bgColor: "bg-amber-50 dark:bg-amber-950/30",
        iconBg: "bg-amber-100 dark:bg-amber-900/50",
        iconColor: "text-amber-600 dark:text-amber-400",
        badgeBg: "bg-amber-500 text-white",
        badgeText: "SOON",
        dateColor: "text-amber-700 dark:text-amber-400",
      };
    default:
      return {
        borderColor: "border-l-slate-300 dark:border-l-slate-600",
        bgColor: "bg-slate-50 dark:bg-slate-900/50",
        iconBg: "bg-slate-100 dark:bg-slate-800",
        iconColor: "text-slate-500 dark:text-slate-400",
        badgeBg: "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
        badgeText: "UPCOMING",
        dateColor: "text-slate-600 dark:text-slate-400",
      };
  }
};

/**
 * Advance Tax installment data
 */
const ADVANCE_TAX_INSTALLMENTS = [
  { month: 6, day: 15, percentage: "15%", label: "First Installment" },
  { month: 9, day: 15, percentage: "45%", label: "Second Installment (cumulative)" },
  { month: 12, day: 15, percentage: "75%", label: "Third Installment (cumulative)" },
  { month: 3, day: 15, percentage: "100%", label: "Final Installment" },
];

const DeadlineReminders = () => {
  const [activeTab, setActiveTab] = useState<"salaried" | "freelancer">("salaried");

  // Calculate dynamic dates
  const itrDate = getNextDate(7, 31); // July 31
  const itrDaysRemaining = getDaysRemaining(itrDate);
  const itrUrgency = getUrgencyFromDays(itrDaysRemaining);

  const gstr1Date = getNextMonthlyDate(11);
  const gstr1Days = getDaysRemaining(gstr1Date);
  const gstr1Urgency = getUrgencyFromDays(gstr1Days);

  const gstr3bDate = getNextMonthlyDate(20);
  const gstr3bDays = getDaysRemaining(gstr3bDate);
  const gstr3bUrgency = getUrgencyFromDays(gstr3bDays);

  // Find next advance tax installment
  const now = new Date();
  const getAdvanceTaxDeadlines = () => {
    return ADVANCE_TAX_INSTALLMENTS.map((inst) => {
      const date = getNextDate(inst.month, inst.day);
      const days = getDaysRemaining(date);
      return {
        ...inst,
        date,
        daysRemaining: days,
        urgency: getUrgencyFromDays(days),
      };
    }).sort((a, b) => a.daysRemaining - b.daysRemaining);
  };

  const advanceTaxDeadlines = getAdvanceTaxDeadlines();
  const nextAdvanceTax = advanceTaxDeadlines.find((d) => d.daysRemaining >= 0) || advanceTaxDeadlines[0];

  const renderDaysText = (days: number) => {
    if (days < 0) {
      return <span className="text-red-600 dark:text-red-400 font-medium">{Math.abs(days)} days overdue</span>;
    }
    if (days === 0) {
      return <span className="text-red-600 dark:text-red-400 font-medium">Due today</span>;
    }
    if (days === 1) {
      return <span className="text-amber-600 dark:text-amber-400 font-medium">1 day remaining</span>;
    }
    return <span className="font-medium">{days} days remaining</span>;
  };

  return (
    <div className="animate-fade-in">
      {/* Section Introduction */}
      <div className="mb-6">
        <p className="text-muted-foreground leading-relaxed max-w-2xl text-sm">
          Deadlines differ based on your income type. Select the relevant tab to see what applies to you.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Select your income type</p>
        <div className="flex gap-1 border-b border-border">
          <button
            onClick={() => setActiveTab("salaried")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "salaried"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="h-4 w-4" />
            Salaried
          </button>
          <button
            onClick={() => setActiveTab("freelancer")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "freelancer"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            Freelancer / Business
          </button>
        </div>
      </div>

      {/* Salaried Tab Content */}
      {activeTab === "salaried" && (
        <div className="space-y-6">
          {/* ITR Deadline Card */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Income Tax Return (ITR)
              </h3>

              <div className={`p-5 rounded-lg border-l-4 ${getUrgencyConfig(itrUrgency).borderColor} ${getUrgencyConfig(itrUrgency).bgColor}`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getUrgencyConfig(itrUrgency).badgeBg}`}>
                    {getUrgencyConfig(itrUrgency).badgeText}
                  </span>
                </div>

                <h4 className="font-semibold text-foreground mb-1">ITR Filing Deadline</h4>
                <p className="text-xs text-muted-foreground mb-4">For individuals not requiring audit</p>

                <div className={`flex items-center gap-2 ${getUrgencyConfig(itrUrgency).dateColor} mb-2`}>
                  <Calendar className="h-5 w-5" />
                  <span className="font-bold text-xl tabular-nums">{formatDate(itrDate)}</span>
                </div>

                <p className="text-xs mt-2">{renderDaysText(itrDaysRemaining)}</p>
              </div>
            </div>

            {/* Penalty Info */}
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                Late Filing Penalties
              </h3>

              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 h-fit">
                <ul className="text-xs text-red-700 dark:text-red-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span><strong>₹5,000</strong> if filed after July 31 but before Dec 31</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span><strong>₹10,000</strong> if filed after December 31</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Interest @ <strong>1% per month</strong> on unpaid tax</span>
                  </li>
                  <li className="flex items-start gap-2 pt-2 border-t border-red-200 dark:border-red-800/50">
                    <span className="text-red-800 dark:text-red-300">Reduced penalty of ₹1,000 for income below ₹5 lakh</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4 italic">
            As a salaried individual, you typically don't need to pay advance tax if TDS is deducted correctly by your employer.
          </p>
        </div>
      )}

      {/* Freelancer / Business Tab Content */}
      {activeTab === "freelancer" && (
        <div className="space-y-8">
          {/* ITR Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Income Tax Return (ITR)
            </h3>

            <div className={`p-5 rounded-lg border-l-4 ${getUrgencyConfig(itrUrgency).borderColor} ${getUrgencyConfig(itrUrgency).bgColor} max-w-md`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getUrgencyConfig(itrUrgency).badgeBg}`}>
                  {getUrgencyConfig(itrUrgency).badgeText}
                </span>
              </div>

              <h4 className="font-semibold text-foreground mb-1">ITR Filing Deadline</h4>
              <p className="text-xs text-muted-foreground mb-4">If not audited</p>

              <div className={`flex items-center gap-2 ${getUrgencyConfig(itrUrgency).dateColor} mb-2`}>
                <Calendar className="h-5 w-5" />
                <span className="font-bold text-xl tabular-nums">{formatDate(itrDate)}</span>
              </div>

              <p className="text-xs mt-2">{renderDaysText(itrDaysRemaining)}</p>
            </div>
          </div>

          {/* Advance Tax Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Advance Tax Installments
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Applicable only if your total tax payable exceeds <strong>₹10,000</strong> in a financial year.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {advanceTaxDeadlines.map((inst, idx) => {
                const isNext = inst === nextAdvanceTax;
                const config = isNext ? getUrgencyConfig(inst.urgency) : getUrgencyConfig("upcoming");

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-l-4 ${config.borderColor} ${config.bgColor} ${
                      isNext ? "ring-2 ring-primary/20" : ""
                    }`}
                  >
                    {isNext && (
                      <span className="text-[9px] font-bold uppercase text-primary mb-2 block">Next Due</span>
                    )}
                    <p className="text-xs text-muted-foreground mb-1">{inst.label}</p>
                    <p className={`font-bold text-lg tabular-nums ${config.dateColor}`}>
                      {formatDate(inst.date)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{inst.percentage} of total tax</p>
                    {isNext && <p className="text-xs mt-2">{renderDaysText(inst.daysRemaining)}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* GST Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-600" />
              GST Returns (If Registered)
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Monthly filing deadlines for GST-registered businesses.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
              {/* GSTR-1 */}
              <div className={`p-4 rounded-lg border-l-4 ${getUrgencyConfig(gstr1Urgency).borderColor} ${getUrgencyConfig(gstr1Urgency).bgColor}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">GSTR-1</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getUrgencyConfig(gstr1Urgency).badgeBg}`}>
                    {getUrgencyConfig(gstr1Urgency).badgeText}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Outward supplies return</p>
                <p className={`font-bold text-lg tabular-nums ${getUrgencyConfig(gstr1Urgency).dateColor}`}>
                  {formatDate(gstr1Date)}
                </p>
                <p className="text-xs mt-2">{renderDaysText(gstr1Days)}</p>
              </div>

              {/* GSTR-3B */}
              <div className={`p-4 rounded-lg border-l-4 ${getUrgencyConfig(gstr3bUrgency).borderColor} ${getUrgencyConfig(gstr3bUrgency).bgColor}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">GSTR-3B</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getUrgencyConfig(gstr3bUrgency).badgeBg}`}>
                    {getUrgencyConfig(gstr3bUrgency).badgeText}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Summary return with tax payment</p>
                <p className={`font-bold text-lg tabular-nums ${getUrgencyConfig(gstr3bUrgency).dateColor}`}>
                  {formatDate(gstr3bDate)}
                </p>
                <p className="text-xs mt-2">{renderDaysText(gstr3bDays)}</p>
              </div>
            </div>
          </div>

          {/* Penalty Info */}
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 max-w-xl">
            <h4 className="font-semibold text-red-800 dark:text-red-300 text-sm mb-2 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              Late Filing Penalties
            </h4>
            <ul className="text-xs text-red-700 dark:text-red-400 space-y-1.5">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>ITR: ₹5,000–₹10,000 + 1% monthly interest</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>Advance Tax: Interest under 234B and 234C</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>GST: ₹50–₹200 per day (depending on return type)</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Disclaimer:</strong> Deadlines depend on income type and registration status. Not all deadlines apply to every user. 
          Always verify from official portals — <a href="https://incometax.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary underline">incometax.gov.in</a> and <a href="https://gst.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary underline">gst.gov.in</a>.
        </p>
      </div>
    </div>
  );
};

export default DeadlineReminders;
