/**
 * Full editorial copy for each service. Drives /services/[slug].
 * Written for executive decision-makers: concrete, outcome-led, no filler.
 */
export interface ServiceContent {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  hero: string;
  lead: string;
  problem: { heading: string; body: string; points: string[] };
  approach: { heading: string; intro: string; steps: { title: string; body: string }[] };
  deliverables: string[];
  outcomes: { value: string; label: string }[];
  faq: { q: string; a: string }[];
}

export const serviceContent: Record<string, ServiceContent> = {
  "erp-implementation": {
    slug: "erp-implementation",
    title: "ERP Implementation",
    metaTitle: "ERP Implementation Consulting for Mid-Sized Business",
    metaDescription:
      "Vendor-neutral ERP implementation that launches on time and reconciles on day one. Selection, configuration, migration and cutover, run by senior consultants.",
    eyebrow: "ERP Implementation",
    hero: "An ERP that launches on time and reconciles on day one.",
    lead: "Only about one in four ERP implementations is considered a success. The difference is rarely the software — it's the data, the process design, and whether anyone owns the outcome. We do.",
    problem: {
      heading: "Why most implementations slip, overspend, or quietly underdeliver",
      body: "The contract is signed, the platform is chosen, and then reality arrives: legacy data nobody trusts, processes that only live in three people's heads, and a system integrator paid to configure software, not to make your business run better.",
      points: [
        "Scope is defined by the software's capabilities, not your operating model.",
        "Data migration is treated as an IT task at the end, not a workstream from day one.",
        "No single owner is accountable for the go-live date and the numbers behind it.",
        "Change management is an afterthought, so adoption — and ROI — never lands.",
      ],
    },
    approach: {
      heading: "How we run an implementation",
      intro: "We stay accountable from selection through hypercare. You get senior people in the room, a fixed cutover date we defend, and a data workstream that runs in parallel from week one.",
      steps: [
        { title: "Operating-model mapping", body: "We document how your business actually runs — orders, inventory, finance, fulfilment — before we look at any screen. The system fits the model, not the reverse." },
        { title: "Vendor-neutral selection", body: "If you haven't chosen a platform, we run a structured selection. We take no reseller commissions, so the recommendation is yours, not a vendor's." },
        { title: "Parallel data workstream", body: "Profiling, cleansing and mapping start immediately, with reconciled dry runs long before cutover weekend." },
        { title: "Configuration & integration", body: "We configure to the operating model and connect the surrounding stack so there is no re-keying on launch." },
        { title: "Cutover & hypercare", body: "A rehearsed cutover, a reconciliation pack that proves the numbers tie out, and senior support through the first close." },
      ],
    },
    deliverables: [
      "Operating-model and process blueprint",
      "Vendor-neutral selection scorecard (if needed)",
      "Reconciled data migration with audit trail",
      "Configured, integrated, tested system",
      "Cutover runbook and rehearsal",
      "Hypercare through first month-end close",
    ],
    outcomes: [
      { value: "On time", label: "Defended go-live dates, not slipped ones" },
      { value: "Day 1", label: "Reconciled ledgers at cutover" },
      { value: "< 30 days", label: "To first clean month-end close" },
    ],
    faq: [
      { q: "We've already chosen our ERP. Can you still help?", a: "Yes — most clients come to us with a platform already selected or live. We run the implementation (or rescue one in trouble) regardless of vendor." },
      { q: "Do you resell ERP software?", a: "No. We take no licence commissions or reseller fees. Our only incentive is your implementation succeeding, which is why our advice on platform fit is genuinely neutral." },
      { q: "How do you charge?", a: "Fixed-scope phases with clearly defined deliverables and exit criteria, not open-ended time-and-materials. You know what each phase costs and what 'done' means before it starts." },
    ],
  },

  "erp-optimization": {
    slug: "erp-optimization",
    title: "ERP Optimization",
    metaTitle: "ERP Optimization & Health Check Consulting",
    metaDescription:
      "Reclaim the value of the ERP you already own. We audit configuration, process and adoption, then close the gaps costing you hours and accuracy every week.",
    eyebrow: "ERP Optimization",
    hero: "Reclaim the value of the system you already own.",
    lead: "Most ERPs run at a fraction of their capability. Before you consider replacing yours — an 18-month, seven-figure decision — find out what it could do if it were configured and adopted properly.",
    problem: {
      heading: "The system isn't the problem. The way it was set up is.",
      body: "Replacing an ERP is the most expensive way to fix problems that configuration, integration and training could solve in a quarter. We help you tell the difference.",
      points: [
        "Manual workarounds and spreadsheets shadow the system everywhere.",
        "Reports take days to assemble and still get questioned.",
        "Modules you paid for are switched off or unused.",
        "Two teams enter the same data twice because nothing is integrated.",
      ],
    },
    approach: {
      heading: "How we optimise",
      intro: "A structured health check across configuration, data, process and adoption — then a prioritised roadmap ranked by effort versus impact.",
      steps: [
        { title: "Health check", body: "We assess configuration, data quality, integrations, reporting and user adoption against how your business needs to run." },
        { title: "Quantify the gap", body: "Every finding is tied to hours, error rates, or cash so you can prioritise on ROI, not opinion." },
        { title: "Quick wins first", body: "We sequence the roadmap so the cheapest, highest-impact fixes land in the first weeks." },
        { title: "Build & enable", body: "We implement the changes and train the teams so the improvements stick after we leave." },
      ],
    },
    deliverables: [
      "ERP health-check report with severity ratings",
      "Quantified gap analysis (hours, accuracy, cash)",
      "Prioritised optimisation roadmap",
      "Reconfiguration and integration work",
      "Role-based enablement and documentation",
    ],
    outcomes: [
      { value: "Weeks", label: "To first measurable improvement" },
      { value: "Fewer", label: "Spreadsheets shadowing the system" },
      { value: "Avoid", label: "A premature seven-figure replacement" },
    ],
    faq: [
      { q: "How do we know if we should optimise or replace?", a: "That's exactly what the health check answers. We give you an honest, vendor-neutral read — and we'll tell you when replacement genuinely is the right call." },
      { q: "Which ERP platforms do you work with?", a: "The major mid-market platforms — NetSuite, Microsoft Dynamics 365 Business Central, SAP Business One, Sage, Epicor and others — plus the integrations and data layers around them." },
      { q: "How long is a health check?", a: "Typically two to four weeks depending on complexity, ending with a board-ready findings and roadmap session." },
    ],
  },

  "data-strategy": {
    slug: "data-strategy",
    title: "Data Strategy & Architecture",
    metaTitle: "Data Strategy & Architecture Consulting",
    metaDescription:
      "A data blueprint your systems can actually be built on. We design the data model, ownership and flow across your stack so every report and integration starts from one trusted source.",
    eyebrow: "Data Strategy & Architecture",
    hero: "A blueprint your systems can actually be built on.",
    lead: "Every integration, report and AI ambition rests on your data architecture. When it's improvised, everything downstream inherits the cracks. We design it deliberately.",
    problem: {
      heading: "The cost of an architecture that grew by accident",
      body: "Most mid-sized companies never designed their data architecture — it accreted one system at a time. The result is conflicting definitions, duplicate records, and reports nobody fully believes.",
      points: [
        "The same customer or product exists differently in three systems.",
        "'Revenue' means something different in finance, sales and ops.",
        "Every new integration is a bespoke, brittle one-off.",
        "AI and analytics projects stall on data that isn't fit to use.",
      ],
    },
    approach: {
      heading: "How we build the blueprint",
      intro: "We design a target-state architecture — domains, master data, ownership and flow — and a pragmatic path to it from where you are today.",
      steps: [
        { title: "Current-state map", body: "We map your systems, data flows and where the same entity is defined in conflicting ways." },
        { title: "Target architecture", body: "We design the domains, system-of-record decisions, and the master-data model the business will run on." },
        { title: "Governance model", body: "Clear ownership and definitions so the architecture stays coherent as you grow." },
        { title: "Pragmatic roadmap", body: "A sequenced path from today's reality to target state, prioritised by business value." },
      ],
    },
    deliverables: [
      "Current-state data and systems map",
      "Target-state architecture and data model",
      "System-of-record and ownership matrix",
      "Canonical metric and entity definitions",
      "Sequenced implementation roadmap",
    ],
    outcomes: [
      { value: "One", label: "Trusted source per entity" },
      { value: "Reusable", label: "Integration patterns, not one-offs" },
      { value: "Ready", label: "Foundation for BI and AI" },
    ],
    faq: [
      { q: "Is this just a document we file away?", a: "No. The blueprint is built to be executed — and we stay on to deliver it through our migration, governance and integration work if you want us to." },
      { q: "Do we need a data warehouse or lakehouse?", a: "Sometimes. We recommend the simplest architecture that meets your needs and avoid platforms you'll never fully use." },
      { q: "How does this support AI plans?", a: "AI is only as good as the data beneath it. A clean, governed architecture is the prerequisite that most AI initiatives skip — and then fail on." },
    ],
  },

  "data-governance": {
    slug: "data-governance",
    title: "Data Quality & Governance",
    metaTitle: "Data Quality & Governance Consulting",
    metaDescription:
      "Make clean data the default, not a project. Ownership, validation and stewardship that keep master data accurate — because 75% of ERP failures trace back to data nobody owned.",
    eyebrow: "Data Quality & Governance",
    hero: "Make clean data the default, not a one-off project.",
    lead: "More than three-quarters of ERP failures trace back to data nobody owned. Governance is the unglamorous discipline that quietly decides whether everything else works.",
    problem: {
      heading: "Why data quality decays the moment a clean-up ends",
      body: "Teams run a heroic data clean-up before go-live, then watch quality rot within months because nothing changed about how data gets created and maintained. Governance fixes the system, not just the symptom.",
      points: [
        "No one owns master data, so errors have no home to be fixed in.",
        "There are no validation rules at the point of entry.",
        "Definitions live in tribal knowledge, not documentation.",
        "Quality is measured by complaints, not by metrics.",
      ],
    },
    approach: {
      heading: "How we make quality stick",
      intro: "Lightweight governance designed for mid-sized teams — enough structure to keep data clean, not so much that it becomes bureaucracy nobody follows.",
      steps: [
        { title: "Data profiling", body: "We measure the real state of your master data — completeness, duplication, accuracy — and baseline it." },
        { title: "Ownership & stewardship", body: "We assign clear data owners and stewards with defined, realistic responsibilities." },
        { title: "Rules at the source", body: "Validation and standards applied where data is created, so errors are prevented, not chased." },
        { title: "Measured & monitored", body: "Data-quality dashboards and a cadence that keeps standards visible and improving." },
      ],
    },
    deliverables: [
      "Data-quality baseline and scorecard",
      "Master-data ownership and stewardship model",
      "Validation rules and entry standards",
      "Lightweight governance policies and cadence",
      "Data-quality monitoring dashboard",
    ],
    outcomes: [
      { value: "Owned", label: "Every critical data domain has an owner" },
      { value: "Prevented", label: "Errors caught at entry, not in reports" },
      { value: "Durable", label: "Quality that holds after we leave" },
    ],
    faq: [
      { q: "Isn't formal governance overkill for our size?", a: "Enterprise governance frameworks are — which is why we right-size it. The goal is the lightest structure that keeps your data trustworthy without slowing the business." },
      { q: "Where should we start?", a: "With the data that hurts most when it's wrong — usually customer, product, supplier and item master data. We baseline it first, then expand." },
      { q: "Can you fix data we already have?", a: "Yes. Remediation of existing data is part of the work; governance then keeps it clean going forward." },
    ],
  },

  "data-migration": {
    slug: "data-migration",
    title: "Data Migration",
    metaTitle: "ERP Data Migration Consulting & Services",
    metaDescription:
      "Move decades of data without losing a record. Profiling, cleansing, mapping and reconciled dry runs make cutover weekend boring — exactly what you want.",
    eyebrow: "Data Migration",
    hero: "Move decades of data without losing a record.",
    lead: "Around half of organisations struggle with data migration, and poor migration is behind the majority of failed go-lives. We make cutover weekend boring — which is the highest compliment a migration can earn.",
    problem: {
      heading: "Why migrations turn cutover weekend into a crisis",
      body: "Migration is treated as a last-minute IT job: export, import, hope. Then the trial balance doesn't tie out at 2am on go-live Sunday and there's no time left to fix it.",
      points: [
        "Legacy data is dirtier than anyone admitted up front.",
        "Mapping decisions are made under time pressure, undocumented.",
        "There is no reconciliation to prove the data arrived intact.",
        "No rehearsal, so cutover is the first time the full run is attempted.",
      ],
    },
    approach: {
      heading: "How we migrate",
      intro: "A disciplined, reconciled, fully auditable migration with dry runs that de-risk cutover long before the date arrives.",
      steps: [
        { title: "Profile", body: "We measure source-data quality and surface every problem early, while there's still time to act on it." },
        { title: "Cleanse & map", body: "We remediate data and document every mapping and transformation decision so it's traceable, not improvised." },
        { title: "Dry runs", body: "We rehearse the full migration repeatedly, timing it and reconciling outputs until cutover is predictable." },
        { title: "Reconcile", body: "A reconciliation pack proves record counts and balances tie out — the evidence finance and auditors need." },
      ],
    },
    deliverables: [
      "Source-data profiling report",
      "Documented mapping and transformation rules",
      "Cleansing and remediation",
      "Repeatable, timed dry-run process",
      "Reconciliation pack proving data integrity",
      "Cutover runbook",
    ],
    outcomes: [
      { value: "Tied out", label: "Balances reconciled at cutover" },
      { value: "Rehearsed", label: "No surprises on go-live weekend" },
      { value: "Auditable", label: "Every record traceable to source" },
    ],
    faq: [
      { q: "How early should migration start?", a: "On day one of the programme. Migration done well runs in parallel throughout — treating it as an end-phase task is the single most common cause of failed go-lives." },
      { q: "Can you migrate from a legacy or in-house system?", a: "Yes. We routinely migrate from ageing ERPs, bespoke databases, and spreadsheets where 'the system' was really tribal knowledge." },
      { q: "How do you prove nothing was lost?", a: "Reconciliation. We deliver a pack that ties record counts and financial balances from source to target — auditable evidence, not assurances." },
    ],
  },

  "system-integration": {
    slug: "system-integration",
    title: "System Integration",
    metaTitle: "ERP System Integration Consulting",
    metaDescription:
      "One connected stack instead of ten silos. We integrate ERP, CRM, e-commerce, WMS and finance with resilient, monitored connections — no re-keying, no spreadsheet reconciliation.",
    eyebrow: "System Integration",
    hero: "One connected stack, not ten silos.",
    lead: "Disconnected systems tax your business every day — in re-keyed data, reconciliation by spreadsheet, and decisions made on numbers that don't match. We connect them properly.",
    problem: {
      heading: "The hidden cost of systems that don't talk",
      body: "Each silo seemed reasonable on its own. Together they create a tax: the same order entered three times, stock levels that disagree, and a finance team that reconciles instead of analyses.",
      points: [
        "Staff re-key the same data across systems daily.",
        "Stock, orders and customer records disagree between systems.",
        "Brittle point-to-point links break silently and without alerts.",
        "No one can see an order's true status end to end.",
      ],
    },
    approach: {
      heading: "How we integrate",
      intro: "Resilient, monitored integrations built on clear data contracts — designed to be maintained, not to become the next thing that breaks.",
      steps: [
        { title: "Integration map", body: "We map every system, the data that should flow between them, and the system of record for each entity." },
        { title: "Contracts & patterns", body: "We define clear data contracts and reusable patterns instead of brittle one-off links." },
        { title: "Build & monitor", body: "We build the integrations with error handling, retries and alerting so failures are visible immediately." },
        { title: "Handover", body: "Documentation and monitoring your team can actually operate after we leave." },
      ],
    },
    deliverables: [
      "Integration architecture and data-flow map",
      "Defined data contracts per interface",
      "Built, tested integrations with error handling",
      "Monitoring and alerting",
      "Operational documentation and handover",
    ],
    outcomes: [
      { value: "Zero", label: "Re-keying between connected systems" },
      { value: "Live", label: "End-to-end order and stock visibility" },
      { value: "Monitored", label: "Failures alerted, not discovered later" },
    ],
    faq: [
      { q: "Do you use an integration platform (iPaaS)?", a: "Where it fits. We're platform-neutral — we'll use your existing tools, a fit-for-purpose iPaaS, or native connectors, choosing the option that's cheapest to run long-term." },
      { q: "Can you fix integrations that keep breaking?", a: "Yes. Stabilising fragile point-to-point integrations is a common starting point before we move you to durable, monitored patterns." },
      { q: "Will this work with our e-commerce and WMS?", a: "Almost certainly. We integrate the full operational stack — ERP, CRM, e-commerce, WMS, EDI and finance — around a clear system-of-record model." },
    ],
  },

  "business-intelligence": {
    slug: "business-intelligence",
    title: "Business Intelligence",
    metaTitle: "Business Intelligence & Reporting Consulting",
    metaDescription:
      "Reporting leaders trust enough to act on. Governed metrics, clear definitions and dashboards built on reconciled data — so the boardroom number matches the floor.",
    eyebrow: "Business Intelligence & Reporting",
    hero: "Reporting leaders trust enough to act on.",
    lead: "Dashboards are easy. Dashboards the whole leadership team believes are not. The difference is governed metrics built on data that has been migrated, reconciled and owned.",
    problem: {
      heading: "Why the meeting argues about the numbers instead of the decision",
      body: "When two reports disagree, trust evaporates and decisions stall. The fix isn't a prettier dashboard — it's agreed definitions on a foundation of clean, governed data.",
      points: [
        "Two reports of the same metric show different numbers.",
        "Reports take days of manual assembly to produce.",
        "Definitions aren't agreed, so every figure is debatable.",
        "Dashboards sit on data nobody trusts underneath.",
      ],
    },
    approach: {
      heading: "How we build trustworthy BI",
      intro: "We start with definitions and data quality, then build governed, automated reporting on top — so the number is the same wherever you look.",
      steps: [
        { title: "Agree the metrics", body: "We facilitate clear, documented definitions for the metrics that run the business." },
        { title: "Trustworthy foundation", body: "We ensure the underlying data is reconciled and governed before it reaches a chart." },
        { title: "Model & automate", body: "We build the data model and automate the pipeline so reports refresh without manual effort." },
        { title: "Dashboards that get used", body: "Role-based dashboards designed around the decisions each leader actually makes." },
      ],
    },
    deliverables: [
      "Agreed metric definitions and catalogue",
      "Governed reporting data model",
      "Automated data pipeline",
      "Role-based dashboards",
      "Enablement so the business is self-serve",
    ],
    outcomes: [
      { value: "One", label: "Number, agreed across the business" },
      { value: "Minutes", label: "To a report that took days" },
      { value: "Trusted", label: "Reporting leaders act on" },
    ],
    faq: [
      { q: "Which BI tool do you use?", a: "Whichever you already own or is the best fit — Power BI, Tableau, Looker, or your ERP's native analytics. The tool matters far less than the definitions and data beneath it." },
      { q: "Can you build BI before our data is clean?", a: "We can, but we won't pretend it'll be trusted. We're candid about what needs fixing underneath first — that honesty is the point." },
      { q: "How do you stop dashboard sprawl?", a: "A governed metric catalogue and clear ownership, so new reports extend a trusted foundation instead of multiplying conflicting versions of the truth." },
    ],
  },
};

export const serviceSlugs = Object.keys(serviceContent);
