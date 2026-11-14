# **Go Source Placement Services VISA SERVICES CRM** 

## **Product Requirements Document** 

AI-first Visa Operations & Client Management Platform 

Version 1.0  |  13 November 2026 

Target stack: React + Vite + Tailwind CSS | Node.js | MySQL Prepared from: Uncomplete_PRD.txt (YBT Management Software PRD v2.0) and public competitor research 

Confidential product planning document  •  Version 1.0  •  13 November 2026 

**VISA SERVICES CRM  |  PRODUCT REQUIREMENTS** 

### **Document control** 

|**Item**|**Value**|
|---|---|
|Product name (working)|Visa Services CRM (final brand name to be selected)|
|Document status|Proposed baseline for product discovery and development|
|Version|1.0|
|Primary users|Visa consultancy / visa services business owner, consultants,<br>operations staff, finance staff, applicants and referral partners|
|Initial deployment assumption|One visa-services business, architected so multi-branch and multi-<br>tenant support can be added safely|
|Primary objective|Manage the complete lead-to-case-to-outcome lifecycle, with AI<br>assistance under human control|
|Technology constraints|React, Tailwind CSS, Vite, Node.js and MySQL preferred; avoid paid<br>services where practical|



**Important scope note:** This PRD defines software for a visa-services provider/consultancy. It does not make the CRM a government visa portal, immigration authority, law firm, or provider of regulated legal advice. Country-specific requirements must be sourced, dated, reviewed and approved by qualified staff. 

### **1. Executive summary** 

The product is an AI-first CRM and operations platform for visa service providers. It centralizes enquiries, prospective clients, applicants, family/group applications, visa cases, documents, country and visa-type checklists, appointments, tasks, communications, fees, invoices, payments, partner referrals, reporting and operational knowledge. 

The product should not be a generic CRM with a visa label. Its core data model and workflows must understand that one client may have multiple applicants, one applicant may have multiple applications over time, each application belongs to a destination country and visa category, and each application has its own evidence, deadlines, status history, decision and financial records. 

AI is a product-wide assistant, not merely a chat screen. It can extract data from documents, summarize cases, compare evidence with configured checklists, draft communications, find operational risks, answer questions from authorized CRM data, and prepare proposed changes. AI must not make final eligibility decisions, guarantee outcomes, submit applications, or mutate records without the required human approval. 

### **1.1 Product vision** 

Become the most useful and trustworthy operating system for visa-service businesses: every client, applicant, case, document, deadline, payment and conversation is connected, and AI reduces repetitive administrative work while staff retain control. 

### **1.2 Product goals** 

- Create a single source of truth for leads, clients, applicants, cases, documents, communications and finances. 

- Reduce time spent chasing documents, re-entering passport data, writing routine messages and checking case status. 

- Prevent missed deadlines through case-aware tasking, reminders, escalation and workload views. 

- Make visa workflows configurable by destination country, visa category, service type and business process. 

- Provide applicants with a secure portal to submit documents, answer questions, see permitted status updates and view invoices. 

- Provide management with accurate operational, sales, financial and outcome analytics. 

Confidential product planning document  •  Version 1.0  •  13 November 2026 

##### **VISA SERVICES CRM  |  PRODUCT REQUIREMENTS** 

- Use AI to assist with document understanding, readiness checks, case summaries, communications and management insights. 

- Keep all AI actions permission-controlled, reviewable, traceable and reversible where possible. 

- Start with a practical zero-license-cost development stack and make paid integrations optional. 

### **1.3 Success measures (initial targets to validate)** 

|**Metric**|**Proposed target / measurement**|
|---|---|
|Lead response time|Median time from enquiry to first human/automated response; target<br>under 10 minutes during configured business hours|
|Document completeness|Percentage of active cases with all currently required checklist items<br>approved|
|Deadline reliability|Percentage of critical deadlines completed before due date; target<br>above 98%|
|Case admin effort|Baseline and reduction in staff time spent on routine case<br>administration|
|Data re-entry|Share of applicant fields populated from verified extraction rather<br>than manual retyping|
|Client visibility|Share of active cases with current client-visible status and next action|
|AI quality|Extraction field accuracy, false-positive rate, human override rate and<br>acceptance rate measured separately|
|Security|Zero cross-tenant or cross-role data exposure in security tests; all<br>sensitive reads and writes audited|



### **2. Research and competitive benchmark** 

The following is a feature benchmark from public product pages, not a claim that the proposed CRM already has these capabilities. Public pages can change; validate features and pricing directly before procurement. 

|**Product**|**Publicly described strengths**|**Product lesson**|
|---|---|---|
|VisaCRM|Visa agency workflows, applicant/case<br>management, dynamic intake, document<br>collection and review, deadline reminders,<br>multi-channel communication, payments,<br>partner portal and analytics.|Build around a visa case lifecycle; connect<br>documents, payments, communications and<br>status-triggered automation.|
|EzyMigrate|Immigration adviser case management,<br>document management, configurable<br>country workflows, tasks, AI-assisted<br>document reading, case summaries, drafting<br>and lead automation.|Prioritize AI document intelligence, case<br>summaries, missing-item follow-up and<br>explicit human review.|
|Agentcis|Lead capture, CRM, partner relationship<br>management, application tracking,<br>document checklists, visa expiry reminders,<br>task management, campaigns and reporting.|Treat partners/referrers and post-visa expiry<br>follow-up as first-class workflows.|
|Docketwise|Multilingual intake questionnaires, client<br>portal, case tasks, case tracking, invoicing,<br>secure messaging, lead management and AI<br>document/writing assistance.|Make intake forms reusable, multilingual and<br>connected to case data; give clients a portal.|
|INSZoom|Customizable country/petition workflows,<br>document tracking, e-consent, audit logs,<br>client engagement and automated data<br>entry/expiry alerts.|Add audit-ready workflow history, consent<br>records, configurable checklists and date<br>extraction.|



Confidential product planning document  •  Version 1.0  •  13 November 2026 

##### **VISA SERVICES CRM  |  PRODUCT REQUIREMENTS** 

Research references: VisaCRM (https://visacrm.co/ and https://visacrm.co/platform/); EzyMigrate (https://ezymigrate.com/); Agentcis (https://agentcis.com/features/crm); Docketwise (https://www.docketwise.com/features/); Mitratech INSZoom (https://mitratech.com/products/inszoom/featuresbenefits/). 

### **2.1 Differentiation strategy** 

- AI that operates across the entire lifecycle: intake → document collection → extraction → validation → readiness review → submission preparation → outcome → expiry/renewal follow-up. 

- An explainable readiness workspace showing each checklist requirement, evidence source, missing/unclear state, confidence and reviewer decision. 

- Case intelligence that detects inconsistencies across documents and form answers without presenting an AI guess as fact. 

- An AI operations manager that answers business questions from permission-filtered, authoritative database queries. 

- Configurable country/visa knowledge with source URL, effective date, last verified date, reviewer, version and change history. 

- Privacy-first AI routing: local OCR and deterministic rules by default; external LLM calls only when explicitly enabled and approved. 

### **3. Users, roles and permissions** 

|**Role**|**Primary responsibilities**|**Access model**|
|---|---|---|
|Owner / Super Admin|Business configuration, users, access policy,<br>finance oversight, AI policy, integrations,<br>backups and approvals.|Full business scope; sensitive actions require<br>re-authentication and audit logging.|
|Branch / Operations Manager|Manage team workload, case allocation,<br>escalations, quality and branch performance.|Scoped to assigned branches; no Owner<br>security or billing-control privileges unless<br>granted.|
|f|Own leads and cases, collect evidence,|Assigned cases and permitted client fields;|
|Visa Consultant / Case Officer|communicate with clients, update case<br>progress and prepare submissions.|cannot approve own restricted actions if<br>separation is required.|
|Document Reviewer|Review extracted data and uploaded<br>evidence, request corrections,<br>approve/reject checklist items.|Document and case access only; no<br>unnecessary financial or user-management<br>access.|
|Sales / Intake Agent|Capture enquiries, qualify leads, schedule<br>consultations, prepare quotations and<br>convert leads.|Lead and client intake access; sensitive<br>case/document access restricted.|
|Finance Officer|Invoices, receipts, refunds, expenses,<br>commissions and financial reports.|Financial module access; immigration<br>documents restricted by default.|
|Applicant / Client|Complete intake, upload documents, answer<br>requests, see permitted case status, pay<br>invoices and download receipts.|Own profile and explicitly linked<br>applicant/case records only.|
|Partner / Referrer (Phase 2)|Submit referred leads/applications, track<br>permitted status and commissions.|Only records referred by that partner; no<br>access to internal notes or sensitive<br>documents.|



### **3.1 Permission model** 

Implement role-based access control (RBAC) plus record-level scope rules. Permissions must be enforced in backend middleware and service methods, not merely by hiding buttons. 

Confidential product planning document  •  Version 1.0  •  13 November 2026 

##### **VISA SERVICES CRM  |  PRODUCT REQUIREMENTS** 

- Permission actions: view, create, edit, archive, restore, export, assign, review, approve, issue, refund, configure, manage users and access AI. 

- Scope dimensions: business, branch, team, assigned owner, case assignment, applicant relationship and partner referral ownership. 

- Sensitive permissions: passport/document view, download/export, financial details, AI processing of personal data, bulk export, restore, deletion and policy changes. 

- Every sensitive action records actor, timestamp, target, action, reason, before/after summary, source IP/device metadata where legally appropriate, and correlation ID. 

- Owner approval is required for AI-proposed writes in the initial release. Optional manager approval policies may be added later, but may not weaken Owner-controlled safeguards. 

- Users must not approve their own high-risk action where a separation-of-duties policy is configured. 

### **4. Core domain model and terminology** 

|**Entity**|**Meaning and rules**|
|---|---|
|Lead|A person or organization that has enquired but has not necessarily<br>purchased a service.|
|Client|The commercial relationship/account. May represent an individual,<br>family, company, education agent or travel partner.|
|Applicant|A person whose visa is being sought. One client can have multiple<br>applicants; an applicant can have multiple cases over time.|
|Case / Application|A specific service engagement for one applicant, destination country,<br>visa category and application purpose. Family/group cases may link<br>multiple applicants to a group file.|
|Visa service|A sellable service package such as consultation, tourist visa<br>assistance, student visa assistance or document review.|
|Checklist template|Versioned set of required/conditional evidence and information items<br>for a country + visa category + applicant profile.|
|Document|An uploaded file plus metadata, extracted fields, review status,<br>version and access controls.|
|Task / deadline|An action assigned to a staff member or client, optionally linked to a<br>case, document, appointment or invoice.|
|Case event|Immutable timeline event recording a status change, request, upload,<br>review, appointment, submission or decision.|
|Knowledge article|A sourced, reviewed and dated internal reference about visa<br>processes, requirements, policies or operational guidance.|
|Financial transaction|Invoice, payment, refund, expense, fee component, commission or<br>adjustment; not a full double-entry accounting ledger in MVP.|



**Critical modeling rule:** Do not model a visa application as just a lead/deal status. Separate client, applicant and case so repeat applicants and family applications can be represented correctly. 

### **5. Product scope and release strategy** 

|**Release**|**Scope**|
|---|---|
|MVP / Release 1|Authentication, Owner/Manager/Staff roles, leads, clients, applicants,<br>cases, configurable workflows, document checklist/upload/review,<br>tasks/deadlines, basic communication templates,<br>quotations/invoices/payments, dashboard, audit log, backup/export,<br>AI assistant with read-only business queries and human-reviewed<br>document extraction.|
|Release 1.5|Applicant portal, automated email notifications, workflow builder<br>(limited trigger/action set),AI case summaries,readiness reports,AI|



Confidential product planning document  •  Version 1.0  •  13 November 2026 

**VISA SERVICES CRM  |  PRODUCT REQUIREMENTS** 

||draft messages, multilingual intake, advanced reports, CSV import<br>with preview.|
|---|---|
||Partner portal, commission management, WhatsApp/SMS|
|Release 2|integrations, multi-branch operations, advanced automation,<br>knowledge-base RAG, AI risk indicators, appointment/calendar<br>integrations, document comparison and duplicate detection.|
||Multi-tenant SaaS hardening, configurable white-label portal, public|
|Release 3|i<br>API/webhooks, advanced BI, self-hosted LLM option, advanced AI|
||agents and approved third-party integrations.|



### **5.1 Explicitly out of scope for MVP** 

- Direct submission to embassy, consulate, immigration authority or government systems. 

- Guaranteeing visa approval, predicting an official decision as fact, or providing unlicensed legal advice. 

- Automated scraping of government portals or bypassing CAPTCHA, MFA or access restrictions. 

- Full accounting/general ledger, payroll, inventory, banking synchronization or automatic tax filing. 

- Automatic AI approval/rejection of documents or cases without a human reviewer. 

- Unrestricted AI SQL generation, autonomous deletion, or direct database access by an AI model. 

- Paid WhatsApp/SMS gateways, paid e-signature, paid OCR APIs or payment gateway fees as mandatory dependencies. 

### **6. Functional requirements** 

#### **6.1 Authentication, onboarding and business setup** 

- FR-AUTH-01: Provide secure login, logout, password reset and session expiry. 

- FR-AUTH-02: Hash passwords with Argon2id or bcrypt using secure parameters; never store plaintext passwords. 

- FR-AUTH-03: Regenerate session/token identifiers on login and privilege changes; use secure, HttpOnly, SameSite cookies. 

- FR-AUTH-04: Support Owner-created staff accounts, activation/deactivation, password reset and optional MFA. 

- FR-AUTH-05: First-run setup creates the Owner, business profile, default roles, currency, timezone, date format and initial workflow. 

- FR-AUTH-06: Do not ship production with public default credentials. Demo data must be clearly isolated and removable. 

#### **6.2 Lead and enquiry management** 

- FR-LEAD-01: Capture leads manually, through public web forms, CSV import and later channel integrations. 

- FR-LEAD-02: Store source, campaign, destination country, visa category, travel/arrival date, purpose, budget/quoted service, preferred language, contact method and consent. 

- FR-LEAD-03: Provide configurable stages such as New, Contacted, Qualified, Consultation Booked, Proposal Sent, Won, Lost and Nurture. 

- FR-LEAD-04: Support list, Kanban and calendar views, filters, saved views, assignment and activity timeline. 

- FR-LEAD-05: Detect likely duplicates by normalized email/phone and allow safe merge with audit history. 

- FR-LEAD-06: Track response SLA, days in queue, next follow-up and lost reason. 

- FR-LEAD-07: Convert a qualified lead into a client and applicant/case without duplicating records. 

#### **6.3 Client, family and applicant management** 

- FR-CLIENT-01: Support individual, family/group, corporate and partner clients. 

- FR-CLIENT-02: Store contact details, preferred language, consent records, communication preferences, address, tags and internal notes. 

- FR-CLIENT-03: Keep client and applicant as distinct records; support one client with multiple applicants. 

Confidential product planning document  •  Version 1.0  •  13 November 2026 

##### **VISA SERVICES CRM  |  PRODUCT REQUIREMENTS** 

- FR-CLIENT-04: Applicant profile may contain legal name, aliases, date/place of birth, nationality, passport details, passport issue/expiry dates and other configurable fields. 

- FR-CLIENT-05: Sensitive fields must be masked by default and separately permissioned. 

- FR-CLIENT-06: Show applicant's case history, document history, communications, appointments, invoices and tasks in one profile. 

- FR-CLIENT-07: Store consent purpose, date/time, method, notice version and withdrawal status. 

#### **6.4 Visa services, countries and workflow configuration** 

- FR-WF-01: Admin can define destination countries, visa categories, service types, application purposes and optional subtypes. 

- FR-WF-02: Admin can create workflow templates per country + visa category + service, with ordered stages, required tasks, checklist templates, SLA targets and notification rules. 

- FR-WF-03: Example stages: Enquiry, Consultation, Client Onboarding, Documents Requested, Documents Received, Under Review, Corrections Required, Ready for Submission, Submitted, Awaiting Decision, Approved, Refused, Withdrawn, Closed. 

- FR-WF-04: Stage names, transitions, required fields, permissions and client-visible labels must be configurable. 

- FR-WF-05: A transition may require checklist completion, payment condition, reviewer sign-off or mandatory reason. 

- FR-WF-06: Keep internal status separate from client-visible status; staff can provide a safe explanation without exposing internal risk notes. 

- FR-WF-07: Record all stage changes as immutable case events with actor, time, reason and source. 

- FR-WF-08: Support reopening a closed case through a controlled action. 

#### **6.5 Case / application management** 

- FR-CASE-01: Create a case from a lead/client/applicant and select destination country, visa type, purpose, service package, assigned consultant and branch. 

- FR-CASE-02: Generate a unique human-readable case reference. 

- FR-CASE-03: Record target travel date, intended arrival/departure, appointment date, planned submission date, actual submission date and decision date where applicable. 

- FR-CASE-04: Provide case overview with stage, progress, outstanding documents, overdue tasks, next deadline, owner, financial status and latest communication. 

- FR-CASE-05: Support related family/group cases and a primary contact without merging individual applicant records. 

- FR-CASE-06: Provide timeline of all important events and a case handover summary. 

- FR-CASE-07: Record outcome and refusal details using structured categories plus restricted narrative; distinguish client-reported reasons from official decision reasons. 

- FR-CASE-08: Track passport handover/return where relevant, with custody event, staff member, date/time and receipt. 

#### **6.6 Country knowledge and visa requirement library** 

- FR-KNOW-01: Store country, visa type, requirement item, applicability conditions, source URL/document, source owner, effective date, last verified date, next review date and version. 

- FR-KNOW-02: Requirements can be mandatory, conditional, optional or not applicable. 

- FR-KNOW-03: Admin/reviewer can publish, supersede or archive a requirement version; preserve historical version used by each case. 

- FR-KNOW-04: Show a clear warning when a requirement is overdue for review or has no verified source. 

- FR-KNOW-05: Support internal notes and country-specific operational guidance separately from official-source facts. 

- FR-KNOW-06: Do not auto-update legal requirements from arbitrary web pages. Any imported change must enter a human review queue. 

- FR-KNOW-07: Knowledge articles must display source, jurisdiction, date checked, reviewer and disclaimer. 

#### **6.7 Document management and checklist** 

- FR-DOC-01: Generate case checklist from the selected versioned workflow/requirement template and applicantspecific conditions. 

Confidential product planning document  •  Version 1.0  •  13 November 2026 

##### **VISA SERVICES CRM  |  PRODUCT REQUIREMENTS** 

- FR-DOC-02: Each checklist item includes title, explanation, acceptable formats, required/optional status, expiry rule, deadline, responsible party and review state. 

- FR-DOC-03: Support secure uploads of PDF, JPG, JPEG and PNG initially; enforce configurable size limits, MIME verification and malware scanning where available. 

- FR-DOC-04: Store documents outside the public web root or in private object storage; use authorization-checked download endpoints and short-lived signed URLs when supported. 

- FR-DOC-05: Document states: Not Requested, Requested, Uploaded, Under Review, Approved, Rejected, Replacement Requested, Expired and Superseded. 

- FR-DOC-06: Rejected documents require a reason and client-friendly correction instruction. 

- FR-DOC-07: Preserve document versions; never silently replace a previously reviewed file. 

- FR-DOC-08: Record who uploaded, viewed, downloaded, reviewed, approved, rejected or exported a sensitive document. 

- FR-DOC-09: Allow staff to request additional documents with question, due date, reminder and client portal link. 

- FR-DOC-10: Detect duplicates by cryptographic file hash within authorized business scope. 

#### **6.8 AI document intelligence** 

- FR-AI-DOC-01: Extract candidate fields from supported documents (e.g., passport number, name, dates, issuing country, document type) and return structured JSON with field-level confidence and source page/region where possible. 

- FR-AI-DOC-02: Never write extracted values into the canonical applicant profile without human confirmation in MVP. 

- FR-AI-DOC-03: Compare extracted fields with existing profile and flag possible mismatch; show both values and source evidence. 

- FR-AI-DOC-04: Detect technical issues such as unreadable/blurred pages, missing pages, unsupported format and low image quality where supported. 

- FR-AI-DOC-05: Evaluate document against configured checklist rules (presence, date validity, file type, completeness) and label results as deterministic checks or AI observations. 

- FR-AI-DOC-06: Provide an AI review panel with extracted data, confidence, warnings, missing information, source document and reviewer decision. 

- FR-AI-DOC-07: AI must not claim that a document is authentic, legally sufficient or accepted by an embassy unless verified by an authorized source/process. 

- FR-AI-DOC-08: Log model/provider, model version, prompt version, processing time, result, human correction and whether external processing occurred. 

#### **6.9 AI visa readiness assessment** 

- FR-READY-01: Generate a readiness report against the case's selected, versioned checklist. 

- FR-READY-02: Show each requirement as Satisfied, Missing, Needs Review, Not Applicable or Unknown. 

- FR-READY-03: For every AI observation, show evidence reference, explanation, confidence and limitation. 

- FR-READY-04: Separate deterministic validation (e.g., expiry date before planned travel) from probabilistic AI observation (e.g., possible inconsistency). 

- FR-READY-05: Show a readiness score only if its calculation is transparent, configurable and not presented as probability of visa approval. 

- FR-READY-06: Staff can override a result with reason; all overrides are audited. 

- FR-READY-07: Readiness assessment must state checklist version and last verified date. 

#### **6.10 Tasks, deadlines, appointments and reminders** 

- FR-TASK-01: Create tasks linked to lead, client, applicant, case, document, invoice or appointment. 

- FR-TASK-02: Assign owner, due date/time, priority, status, recurrence (where appropriate), instructions and completion evidence. 

- FR-TASK-03: Support internal tasks and client tasks separately. 

- FR-TASK-04: Provide overdue, due today, upcoming, unassigned and blocked queues. 

- FR-TASK-05: Create tasks automatically from workflow transitions and document requests. 

Confidential product planning document  •  Version 1.0  •  13 November 2026 

##### **VISA SERVICES CRM  |  PRODUCT REQUIREMENTS** 

- FR-TASK-06: Support appointment type, location/meeting link, attendees, reminders, outcome and reschedule history. 

- FR-TASK-07: Escalate overdue critical deadlines to configured manager/Owner. 

- FR-TASK-08: Store timezone-aware timestamps and display in the user's configured timezone. 

#### **6.11 Communication and client portal** 

- FR-COMM-01: Provide reusable email/message templates with merge fields and language variants. 

- FR-COMM-02: Record inbound/outbound communications as a case/client timeline event when manually logged or integrated. 

- FR-COMM-03: MVP may use manual copy/send and configured SMTP; external email delivery is not assumed free or guaranteed. 

- FR-COMM-04: Support notification preferences and consent/opt-out; do not send marketing messages without appropriate consent. 

- FR-PORTAL-01: Client can securely sign in or use expiring invitation links with additional verification. 

- FR-PORTAL-02: Client sees only their own linked applicants/cases, client-visible status, requested documents, tasks, appointments, invoices and messages. 

- FR-PORTAL-03: Client can complete dynamic intake forms, upload requested files and answer follow-up questions. 

- FR-PORTAL-04: Client can view receipts and download documents explicitly shared with them. 

- FR-PORTAL-05: Portal must not expose internal notes, risk assessments, staff-only messages, other family members' sensitive details without consent, or unrestricted file paths. 

#### **6.12 Quotations, invoices, payments and expenses** 

- FR-FIN-01: Configure services, service fees, consultation fees, government/third-party fee pass-throughs, discounts, taxes and currencies. 

- FR-FIN-02: Generate quotation linked to lead/client/case; support validity date, line items, terms and PDF/print. 

- FR-FIN-03: Generate invoice with unique number, issue date, due date, currency, line items, discounts, taxes, paid amount and balance. 

- FR-FIN-04: Support payment plans, deposits, partial payments, multiple payments, refunds and controlled reversals. 

- FR-FIN-05: Separate agency service revenue from government/third-party pass-through fees and expenses. 

- FR-FIN-06: Store payment method and reference; do not store card PAN/CVV. Payment gateway integration is optional and incurs provider fees. 

- FR-FIN-07: Expenses can be linked to case/client and categorized. 

- FR-FIN-08: Financial mutations must use database transactions, idempotency protection and immutable adjustment/reversal history. 

- FR-FIN-09: Preserve invoice snapshots; later edits to business profile or service catalog must not rewrite issued invoices. 

- FR-FIN-10: Reports must distinguish billed revenue, cash collected, receivables, refunds, pass-through funds and expenses. 

#### **6.13 Partner and referral management (Phase 2)** 

- FR-PARTNER-01: Store partner organization, contacts, agreement, referral source, fee/commission rules and status. 

- FR-PARTNER-02: Attribute leads and cases to a partner; support fixed or percentage commission with effective dates. 

- FR-PARTNER-03: Provide restricted partner portal to create referrals and view only their submitted cases' permitted status. 

- FR-PARTNER-04: Calculate commission only from configured eligible amounts and confirmed payment state. 

- FR-PARTNER-05: Record disputes, adjustments, payout status and supporting audit trail. 

#### **6.14 Dashboard, reporting and analytics** 

- FR-AN-01: Dashboard filters: today, yesterday, 7 days, 30 days, month, quarter, year and custom range; comparisons to previous period. 

- FR-AN-02: Operational KPIs: new leads, lead response time, active cases, cases by stage, documents awaiting review, missing documents, overdue tasks, upcoming appointments, cases at risk and cases awaiting decision. 

Confidential product planning document  •  Version 1.0  •  13 November 2026 

##### **VISA SERVICES CRM  |  PRODUCT REQUIREMENTS** 

- FR-AN-03: Sales KPIs: leads by source, consultation conversion, won/lost rate, pipeline value, average service value and consultant conversion. 

- FR-AN-04: Visa KPIs: applications by destination/visa type, approval/refusal/withdrawal counts, decision turnaround, document rejection rate and checklist completion. 

- FR-AN-05: Finance KPIs: invoiced, collected, outstanding, overdue, refunds, expenses, partner commissions and net cash movement. 

- FR-AN-06: Provide drill-down from each KPI/chart to the authorized supporting records. 

- FR-AN-07: Never calculate visa approval rates without defining denominator, date range, outcome categories and excluded pending cases. 

- FR-AN-08: Avoid misleading comparisons across different visa types/countries without contextual warnings and minimum sample sizes. 

- FR-AN-09: Exports respect permissions and are audited. 

#### **6.15 AI Digital Operations Manager** 

- FR-AI-01: Provide chat interface with conversation history, new conversation, stop, retry, suggested prompts and provider status. 

- FR-AI-02: Support natural-language questions over authorized CRM data: pending cases, deadlines, revenue, lead conversion, consultant workload, missing documents and client history. 

- FR-AI-03: Numeric answers must come from predefined backend reporting/query tools, never from model guesswork or chat memory. 

- FR-AI-04: AI tool definitions must have fixed names, JSON schemas, validation, bounded result limits, permissions and audit rules. 

- FR-AI-05: AI may create structured drafts for lead/client/case/task/invoice/message changes; no write executes without the required approval. 

- FR-AI-06: Every proposal displays action, target record, before/after values, requester, reason, expiry and affected scope. 

- FR-AI-07: On approval, backend rechecks permissions, record version, current values and proposal expiry before executing a transaction. 

- FR-AI-08: AI cannot run arbitrary SQL, call arbitrary internal functions, change its own permissions or override Owner policy. 

- FR-AI-09: AI context must be tenant/business scoped and user permission filtered before prompt construction. 

- FR-AI-10: Conversation memory is optional, inspectable, clearable and never treated as authorization. 

- 

   - FR-AI-11: AI must disclose uncertainty and ask a clarification when ambiguity changes the operational result. 

- FR-AI-12: Prompt injection in uploaded documents, client notes and emails must be treated as untrusted content. 

#### **6.16 AI communication and case drafting** 

- FR-AI-COMM-01: Draft polite, context-aware client messages in selected language and tone using approved case facts. 

- FR-AI-COMM-02: Draft missing-document requests with exact checklist item, due date and instructions. 

- FR-AI-COMM-03: Draft case summaries, handover notes, appointment reminders and follow-up messages. 

- FR-AI-COMM-04: Draft cover letters and explanations only from verified case facts; mark placeholders and unsupported claims. 

- FR-AI-COMM-05: Staff must review before external send; automated sending is limited to pre-approved deterministic templates and configured rules. 

#### **6.17 Settings, audit, backup and help** 

- FR-SET-01: Business profile, branding, branches, working hours, holidays, timezone, currency, numbering, languages and date formats. 

- FR-SET-02: Role/permission configuration, AI policy, retention, notification and workflow settings. 

- FR-AUD-01: Searchable immutable audit trail for sensitive reads, writes, exports, approvals and configuration changes. 

- FR-BACK-01: Owner can create database and file backups, view backup history and restore after explicit confirmation. 

Confidential product planning document  •  Version 1.0  •  13 November 2026 

##### **VISA SERVICES CRM  |  PRODUCT REQUIREMENTS** 

- FR-BACK-02: Backup must be encrypted, access-controlled and tested; exclude secrets and external provider credentials. 

- FR-BACK-03: Restore must verify schema compatibility, checksum and business identity before replacing data. 

- FR-HELP-01: Provide setup wizard, searchable user guide, contextual help, glossary and troubleshooting. 

### **7. AI architecture and safety model** 

#### **7.1 AI capability tiers** 

|**Tier**|**Capability**|**Execution policy**|
|---|---|---|
|Tier 0: deterministic|Date checks, required field checks, duplicate<br>hashes, workflow rules and totals.|Run in backend; no LLM required.|
|Tier 1: local extraction|OCR and document parsing with local tools;<br>candidate fields returned for review.|Prefer local processing; human confirms<br>extracted personal data.|
|Tier 2: AI assistance|Summaries, translation, draft messages,<br>semantic search and risk observations.|Send minimum necessary context to<br>configured model; disclose provider and<br>review output.|
|Tier 3: AI proposals|Create/update tasks, draft case edits, bulk<br>proposals and workflow suggestions.|Prepare proposal only; approval + server-side<br>revalidation required.|
|Prohibited autonomous actions|Visa eligibility decisions, guaranteed<br>outcome claims, government submission,<br>silent financial changes, permission changes<br>and arbitrary SQL.|Never autonomous; certain activities are<br>prohibited entirely or require separate legally<br>reviewed integration.|



#### **7.2 AI tool examples** 

|**Tool**|**Purpose**|**Permission / behavior**|
|---|---|---|
|search_leads|Find leads by filters|Lead view permission; bounded results|
|get_case_summary|Retrieve authorized case facts|Case view permission; sensitive fields filtered|
|get_missing_documents|Return outstanding checklist items|Case/document permission|
|get_deadline_risks|Find overdue/upcoming case deadlines|Case/task permission|
|get_financial_summary|Calculate collected/billed/outstanding<br>values|Financial reporting permission|
|get_consultant_workload|Summarize assignments and pending work|Manager reporting permission|
|prepare_task|Prepare task creation|Returns proposal; no direct write|
|prepare_client_message|Draft message|No external send by default|
|prepare_case_update|Prepare case update|Owner approval in initial release|
|prepare_invoice_draft|Prepare invoice draft|Finance permission + approval policy|
|generate_chart_data|Return validated chart series|Uses reporting service, not model-generated<br>numbers|



### **7.3 AI data handling** 

- Do not send entire client databases to a model. Retrieve only the smallest relevant records and fields. 

- Never send passwords, session tokens, API keys, payment card data or unrelated personal data. 

- Passport scans, bank statements, medical evidence and other highly sensitive files require explicit policy, consent/legal basis and approved processing location. 

- Do not use free external AI tiers for sensitive client documents until the provider's current data-use, retention, regional processing and contractual terms are reviewed. 

Confidential product planning document  •  Version 1.0  •  13 November 2026 

##### **VISA SERVICES CRM  |  PRODUCT REQUIREMENTS** 

- Store provider secrets only on the backend in environment variables or encrypted secret storage. 

- Log provider, model, purpose, data categories sent, user consent/policy state, timestamp and result metadata. 

- Provide AI disable switch, per-role and per-module access, retention controls and deletion workflows. 

### **7.4 Prompt injection and output validation** 

- Treat every uploaded file, email, client note, web page and extracted text as untrusted data, never as instructions. 

- System policy and authorization must be enforced in application code, not entrusted to prompt text. 

- Use strict JSON schemas for tool arguments and validate all values server-side. 

- Escape rendered AI output; sanitize HTML/Markdown and block unsafe links or script-like content. 

- Limit tokens, execution time, tool calls, result counts and file sizes. 

- Use human review for high-impact outputs; record corrections and quality metrics. 

### **8. Technology architecture** 

The requested stack is appropriate and should be retained. No paid framework or proprietary database is required. 

|**Layer**|**Recommended technology**|**Reason / notes**|
|---|---|---|
|Frontend|React + Vite + Tailwind CSS|Fast SPA development; component-based UI;<br>static build can be served by Node or a static<br>host.|
|Backend|Node.js + Express (or Fastify) + TypeScript|REST API, middleware, background jobs and<br>AI adapters; TypeScript improves<br>maintainability.|
|Database|MySQL 8.x / compatible maintained release|Relational data, transactions, foreign keys<br>and structured reporting.|
|ORM / migrations|Prisma or Drizzle; alternatively mysql2 with<br>SQL migrations|Choose one. Use migrations and explicit<br>transactions; do not mix uncontrolled<br>schema changes.|
|Authentication|Secure server-side sessions or short-lived<br>access tokens with refresh rotation|Prefer HttpOnly secure cookies for browser<br>app; CSRF protection required for cookie-<br>authenticated mutations.|
|Validation|Zod or equivalent schema validation|Validate request bodies, query parameters<br>and AI tool inputs.|
|File storage|Private local filesystem for local MVP; private<br>S3-compatible storage later|Never place private visa documents in public<br>static assets.|
|OCR|Tesseract OCR locally; PDF text extraction<br>with maintained libraries|No per-page API fee; quality depends on<br>scans and language.|
|AI local runtime|Ollama or another locally hosted model<br>runtime (optional)|Avoid per-token API charges; requires<br>capable hardware and may be slower/less<br>accurate.|
|Charts|Recharts or Chart.js|Use server-calculated values and accessible<br>labels.|
|PDF|Puppeteer/Playwright or a maintained PDF<br>library|Generate invoices and case reports from<br>trusted server templates.|
|Background jobs|Database-backed job table initially; BullMQ +<br>Redis only if/when needed|Avoid adding Redis as a required paid<br>dependency in MVP.|
|Testing|Vitest, React Testing Library, Supertest,<br>Playwright|Unit, API, UI and end-to-end coverage.|
|Deployment|Docker Compose for local/self-hosted<br>deployment|Repeatable setup; production needs secured<br>server, backups and monitoring.|



Confidential product planning document  •  Version 1.0  •  13 November 2026 

**VISA SERVICES CRM  |  PRODUCT REQUIREMENTS** 

#### **8.1 High-level architecture** 

Browser (React/Vite) → HTTPS reverse proxy → Node API → authentication/authorization middleware → domain services → MySQL. File uploads flow through authenticated API validation into private storage. AI requests flow through an AI gateway that applies data minimization and permissions, then calls local OCR/model runtime or an explicitly configured external provider. Background workers process OCR, notifications, exports and scheduled reminders. 

#### **8.2 Backend module boundaries** 

- Identity & Access: authentication, sessions, users, roles, permissions, branches. 

- CRM: leads, clients, applicants, partners, activity timeline. 

- Visa Operations: countries, visa types, service catalog, workflow templates, cases, status events. 

- Documents: uploads, metadata, versions, OCR jobs, checklist reviews and secure downloads. 

- Work Management: tasks, deadlines, appointments, notifications and automation rules. 

- Finance: quotations, invoices, payments, refunds, expenses and commissions. 

- AI Gateway: provider adapters, prompt versions, tool registry, memory, proposals and usage logs. 

- Analytics: reporting queries, aggregates, exports and dashboard widgets. 

- Platform: settings, audit logs, backups, help and system health. 

#### **8.3 Suggested repository structure** 

project-root/
├── backend/              # Node.js + TypeScript API, Prisma schema and seeds
├── frontend/             # React + Vite + Tailwind web app
├── docker-compose.yml
├── .env.example
├── README.md
└── Visa_Services_CRM_PRD_v1.md

README.md 

#### **8.4 API design principles** 

- Use versioned REST endpoints such as /api/v1/cases and /api/v1/documents. 

- Return consistent error envelopes with machine-readable codes and correlation IDs. 

- Use pagination, filtering, sorting and bounded limits for list endpoints. 

- Use idempotency keys for payments, invoice issue, imports and other duplicate-sensitive operations. 

- Use optimistic concurrency/version fields for approvals and updates. 

- Never trust business_id, role, owner_id or permission claims sent by the browser; derive and verify them server-side. 

- Separate client-visible DTOs from internal database models. 

### **9. Initial data model (logical entities)** 

|**Table / entity**|**Key fields / relationships**|
|---|---|
|businesses|id, name, timezone, default_currency, settings_json, created_at|
|branches|id, business_id, name, address, status|
|users|id, business_id, email, password_hash, status, branch_id,<br>last_login_at|



Confidential product planning document  •  Version 1.0  •  13 November 2026 

**VISA SERVICES CRM  |  PRODUCT REQUIREMENTS** 

|roles / permissions / user_roles|role definitions and granular permission mappings|
|---|---|
|leads|id, business_id, contact fields, source, stage, country_id,<br>visa_type_id, assigned_to, next_follow_up_at|
|clients|id, business_id, client_type, name, contact, preferred_language,<br>consent_status|
|applicants|id, business_id, client_id, legal_name, DOB, nationality, passport<br>metadata (sensitive/encrypted where appropriate)|
|cases|id, business_id, applicant_id, client_id, country_id, visa_type_id,<br>workflow_version_id, stage, assigned_to, travel dates, reference|
|case_applicants|case_id, applicant_id, relationship, is_primary|
|workflow_templates / stages / transitions|versioned country/service-specific workflow configuration|
|requirement_templates / checklist_items|versioned requirements, applicability rules, source metadata and<br>review dates|
|case_checklist_items|case_id, template_item_id, status, due_at, reviewer_id,<br>decision_reason|
|documents / document_versions|case_id, applicant_id, storage_key, mime_type, size, hash, version,<br>review_state, sensitivity|
|document_extractions|document_version_id, model/provider, extracted_json,<br>confidence_json, status, reviewer corrections|
|tasks / appointments|case/client links, assignee, due_at, status, timezone, reminders|
|case_events / activities|immutable timeline and status-change records|
|communications / templates|channel, direction, recipient, template, body reference, delivery state,<br>consent context|
|services / quotations / invoices / invoice_items|service catalog, prices, tax, currency, snapshots and totals|
|payments / refunds / expenses|amount, currency, method, reference, status, case/invoice links|
|partners / referrals / commissions|partner profile, referred lead/case, commission rules and payout<br>state|
|knowledge_articles / sources|country, visa type, source URL, effective date, verified date, version,<br>reviewer|
|ai_conversations / ai_messages / ai_usage_logs|user, scope, model, prompt version, retention and provider metadata|
|ai_action_proposals / approvals|structured action, target, before/after, requester, approver, expiry,<br>state|
|audit_logs / notifications / automation_rules / jobs|security history, alerts, triggers, actions and worker state|



**Data protection:** Passport numbers, dates of birth, bank statements and uploaded evidence are sensitive personal data. Design encryption at rest, key management, masking, strict access checks, retention schedules and secure deletion before production use. Do not rely on application-level obscurity. 

### **10. Primary user journeys** 

#### **10.1 New enquiry to paid client** 

1. A lead arrives from a form, phone call or manual entry. 

2. System checks for likely duplicates and captures consent/source. 

3. Intake agent qualifies destination, visa type, travel date and service need. 

4. Consultation is scheduled; reminders are created. 

5. Consultant prepares a quotation and service terms. 

6. Client accepts and makes configured deposit/payment. 

7. Lead converts to client + applicant + case; no duplicate person is created. 

8. Workflow template creates stages, tasks and document checklist. 

Confidential product planning document  •  Version 1.0  •  13 November 2026 

**VISA SERVICES CRM  |  PRODUCT REQUIREMENTS** 

#### **10.2 Document collection to readiness review** 

9. Case officer sends checklist and portal invitation. 

10. Client uploads requested documents; system validates file type/size and records version. 

11. OCR/extraction job proposes candidate fields and confidence. 

12. Reviewer compares extracted fields with applicant profile and source document. 

13. Deterministic checks evaluate dates, missing fields and configured rules. 

14. AI produces clearly labeled observations and potential inconsistencies. 

15. Reviewer approves/rejects checklist items and requests corrections where needed. 

16. Readiness report records checklist version, unresolved items and reviewer sign-off. 

#### **10.3 Submission and outcome** 

17. Authorized staff marks case Ready for Submission after internal checks. 

18. Staff records submission date/reference and uploads permitted proof. 

19. Case moves to Awaiting Decision; follow-up reminders are scheduled. 

20. Decision is recorded as Approved, Refused, Withdrawn or Other with evidence and reason categories. 

21. Client receives approved communication; finance and case closure steps are triggered. 

22. Where relevant, passport return, visa validity and expiry reminders are scheduled. 

#### **10.4 AI asks for an operational report** 

23. Manager asks: 'Which active cases have deadlines in the next seven days and missing documents?' 

24. AI classifies this as a read request and calls the authorized deadline and checklist tools. 

25. Backend applies role/branch scope and returns bounded records. 

26. AI summarizes actual results and can show a filtered case list/chart. 

27. No data mutation occurs; report period and filters are visible. 

#### **10.5 AI proposes a change** 

28. Staff asks AI to change a case assignment or draft a message. 

29. AI creates a structured proposal, not a direct write. 

30. UI shows exact target, current value, proposed value, reason and affected records. 

31. Authorized approver reviews and approves/rejects. 

32. Backend rechecks current version, permission, target scope and expiry. 

33. Transaction executes; audit event and timeline entry are written. 

### **11. UX and navigation** 

Recommended desktop sidebar navigation: 

- Dashboard 

- Leads & Enquiries 

- Clients 

- Applicants 

- Visa Cases 

- Document Center 

- Tasks & Calendar 

- Communications 

- Services & Pricing 

- Quotations & Invoices 

- Payments & Expenses 

- Partners (Phase 2) 

- Reports & Analytics 

- AI Assistant 

Confidential product planning document  •  Version 1.0  •  13 November 2026 

**VISA SERVICES CRM  |  PRODUCT REQUIREMENTS** 

- Approvals 

- Users & Roles 

- Country & Visa Knowledge 

- Automation Rules 

- Settings & Audit Logs 

Design principles: responsive desktop/tablet/mobile; compact data-dense tables with saved filters; clear stage/status labels; strong empty states; accessible contrast and keyboard navigation; no critical action represented only by color; confirmation for destructive actions; visible internal/client-visible distinction; consistent loading/error states. 

### **11.1 Essential screens** 

- Executive dashboard with operational and financial tabs. 

- Lead list, lead detail and lead Kanban. 

- Client profile with linked applicants and cases. 

- Applicant profile with identity details and document history. 

- Case workspace with overview, timeline, checklist, documents, tasks, communication, finance and AI review tabs. 

- Document review workspace with preview, extracted fields, confidence, mismatch flags and reviewer controls. 

- Workflow and checklist template editor. 

- Country/visa knowledge library with source verification. 

- AI assistant with citations to CRM records/knowledge articles and action proposal cards. 

- Approvals inbox with exact before/after change. 

- Client portal and dynamic intake form. 

- Settings for business, roles, AI, storage, retention, templates and backups. 

### **12. Non-functional requirements** 

|**Area**|**Requirement**|
|---|---|
|Security|OWASP-aligned secure coding; TLS in production; secure cookies;<br>CSRF/XSS/SQL injection defenses; rate limiting; least privilege;<br>secrets outside source control.|
|Privacy|Data minimization, purpose limitation, consent records, retention<br>policy, export/delete workflows and jurisdiction-specific legal review.|
|Availability|Define an initial target (e.g. 99.5% monthly) only after hosting and<br>support model is selected; free-tier hosting cannot guarantee this.|
|Performance|Typical list/detail API response under 500 ms at expected MVP load<br>excluding AI/OCR; paginate large lists; index common filters.|
|Scalability|Business/branch scoping in all relevant tables and queries;<br>background jobs for OCR, notifications and exports.|
|Accessibility|Aim for WCAG 2.2 AA on critical workflows; keyboard navigation and<br>accessible form errors.|
|Reliability|Database transactions for financial and approval actions; retries with<br>idempotency for background jobs.|
|Observability|Structured logs, error tracking, health endpoint, job failure queue and<br>audit log; never log secrets or raw sensitive document contents.|
|Backup|Automated database and file backup; encrypted offsite copy;<br>documented recovery point and recovery time objectives; routine<br>restore tests.|
|Maintainability|TypeScript, linting, formatting, modular services, code review,<br>migrations, automated tests and API documentation.|
||Timezone-aware data; configurable currency, number/date format|
|Localization|and UI language; support English initially and architecture for<br>Urdu/Arabic and other languages.|



Confidential product planning document  •  Version 1.0  •  13 November 2026 

**VISA SERVICES CRM  |  PRODUCT REQUIREMENTS** 

Configurable retention for documents, AI messages and audit events, subject to legal obligations and litigation/hold requirements. 

Retention 

### **12.1 Security baseline** 

- Use parameterized SQL/ORM safely and validate all input. 

- Use password hashing (Argon2id/bcrypt), MFA option, session rotation and login throttling. 

- Enforce authorization in every API route and service; test direct-object-reference attacks. 

- Protect upload endpoints against path traversal, polyglot files, MIME spoofing, malware and oversized payloads. 

- Keep storage private; generate access only after authorization checks. 

- Encrypt backups and sensitive fields; manage keys separately from database backups. 

- Maintain dependency updates, vulnerability scanning and secure configuration. 

- Audit sensitive reads, exports, downloads, approvals, permission changes and financial operations. 

- Create a documented incident response and breach notification process before handling live client data. 

### **13. Acceptance criteria** 

|**ID**|**Release acceptance test**|
|---|---|
|AC-01|Owner can create users and assign granular permissions;<br>unauthorized API calls are rejected even if UI controls are<br>manipulated.|
|AC-02|A client can have multiple applicants and each applicant can have<br>multiple historical cases without duplicated identity records.|
|AC-03|A case receives the correct versioned workflow and checklist for its<br>country, visa type and service.|
|AC-04|Every document upload is private, validated, versioned and<br>associated with the correct applicant/case.|
|AC-05|Document reviewer can approve/reject with reason; rejection creates<br>a client correction request.|
|AC-06|AI extraction shows candidate values and confidence but does not<br>silently update the canonical profile.|
|AC-07|Readiness report identifies missing, approved, uncertain and not-<br>applicable checklist items and cites the checklist version.|
|AC-08|Critical deadline reminders and escalation tasks are generated once,<br>with duplicate-job protection.|
|AC-09|Client portal user cannot access another client's records or internal<br>notes by changing IDs/URLs.|
|AC-10|Invoice/payment totals reconcile for partial payments, refunds and<br>reversals; issued invoice snapshots remain unchanged.|
|AC-11|Dashboard figures reconcile with underlying authorized SQL records<br>and display date range/metric definitions.|
|AC-12|AI numeric reports use backend tools; AI cannot execute arbitrary SQL<br>or read unauthorized records.|
|AC-13|Every AI write request creates a proposal; only valid approval can<br>execute, after server-side revalidation.|
|AC-14|Audit log captures sensitive reads/writes, downloads, exports,<br>approvals and permission changes.|
|AC-15|Backup and restore test successfully restores database and private<br>files to a clean environment.|
|AC-16|Demo records can be removed without deleting real records or<br>system configuration.|
|AC-17|Responsive UI supports agreed desktop/tablet/mobile breakpoints|



Confidential product planning document  •  Version 1.0  •  13 November 2026 

**VISA SERVICES CRM  |  PRODUCT REQUIREMENTS** 

|AC-18|
|---|



and keyboard-accessible critical flows. Production deployment has HTTPS, private storage, secrets management, backups, monitoring and documented recovery. 

### **14. Delivery roadmap** 

|**Phase**|**Suggested work sequence**|**Exit condition**|
|---|---|---|
|0. Discovery & design|Confirm target visa markets, visa categories,<br>business processes, roles, privacy<br>jurisdiction, currencies, workflows and data<br>retention. Produce wireframes and data<br>dictionary.|Owner signs off scope, workflows, fields, and<br>compliance assumptions.|
|1. Foundation|Repo, Docker Compose, React shell, Node<br>API, MySQL migrations, auth, RBAC, audit,<br>settings, business/branch model.|Secure login, role checks and seed/demo<br>environment pass tests.|
|2. CRM & cases|Leads, clients, applicants, country/visa<br>catalog, case lifecycle, workflow templates,<br>timelines.|Lead-to-case journey works end to end.|
|3. Documents & work|Checklist, secure upload, versions, review<br>states, tasks, deadlines, appointments,<br>reminders.|Document collection and review journey<br>passes acceptance tests.|
|4. Finance & reporting|Services, quotations, invoices, payments,<br>expenses, dashboards and exports.|Financial calculations reconcile; reporting<br>matches database.|
|5. AI foundation|AI gateway, provider configuration, local<br>OCR, extraction review, read-only tools, case<br>summaries and safe prompts.|AI access is scoped, logged and testable; no<br>autonomous writes.|
|6. Client portal & automation|Portal, dynamic intake, notification<br>templates, trigger/action rules and<br>multilingual forms.|Clients can securely complete assigned<br>tasks and upload files.|
|7. Hardening & launch|Security testing, restore drill, load testing,<br>privacy review, documentation, staff training<br>and pilot.|Production checklist signed off; pilot<br>feedback addressed.|
|8. Expansion|Partner portal, multi-tenant SaaS,<br>WhatsApp/SMS, external integrations and<br>advanced AI agents.|Each integration has cost, consent, reliability<br>and security review.|



### **15. Zero-cost / low-cost technology and deployment decision** 

The requested application stack itself does not require paid licenses. React, Vite, Tailwind CSS, Node.js, MySQL Community Edition, TypeScript and the suggested open-source libraries can be used without license fees. The important distinction is that free software does not mean free public hosting, domain registration, reliable backups, messaging, payment processing or production AI. 

### **15.1 Recommended zero-license stack** 

|**Need**|**Zero-license option**|**Caveat**|
|---|---|---|
|Frontend|React + Vite + Tailwind CSS|No framework license fee.|
|Backend|Node.js + Express/Fastify + TypeScript|No framework license fee; you operate the<br>server.|
|Database|MySQL Community Edition|No license fee; you must manage security,<br>backups and upgrades.|



Confidential product planning document  •  Version 1.0  •  13 November 2026 

**VISA SERVICES CRM  |  PRODUCT REQUIREMENTS** 

|OCR|Tesseract OCR + local PDF text extraction|Free software; scan quality and language<br>packs affect results.|
|---|---|---|
|AI inference|Ollama with an appropriate open model on<br>your own computer/server|No per-token API bill, but requires hardware,<br>electricity, setup and ongoing maintenance.|
|Document storage|Encrypted private disk on your own server|Disk, redundancy and offsite backup are not<br>free at scale.|
|PDF generation|Open-source browser/PDF tooling|No per-document SaaS fee; hosting<br>resources still required.|
|Charts|Recharts or Chart.js|No license fee.|
|Deployment|Docker Compose on a computer you control|Public access, uptime, electricity, network<br>and security remain your responsibility.|



### **15.2 Costs that may arise** 

|**Cost item**|**Can it be $0?**|**Practical note**|
|---|---|---|
|Custom domain|Usually no|Can start on localhost or a provider<br>subdomain; a professional domain generally<br>has an annual fee.|
|Public hosting/server|Sometimes temporarily|Free tiers change, may sleep, cap<br>CPU/RAM/storage/bandwidth, and are not a<br>reliable home for sensitive visa documents.|
|Database hosting|Yes if self-hosted|Managed database plans may be paid or<br>limited; self-hosted MySQL requires backup<br>and security work.|
|AI API|Yes for limited development/testing|Free quotas are limited and may have data-<br>use terms; do not assume a free tier is<br>suitable for passport/bank documents.|
|Local AI hardware|No incremental API charge if existing<br>hardware is used|Electricity, GPU/RAM and maintenance are<br>real costs; large models may be impractical<br>on a basic PC.|
|Email delivery|May be free at low volume or via existing<br>mailbox|Reliable transactional sending, domain<br>reputation and volume may require paid<br>service.|
|WhatsApp/SMS|Generally not reliably free|Business messaging providers and Meta<br>conversation/template rules can incur<br>charges.|
|Payment gateway|No setup fee may be available, but<br>transaction fees apply|Never assume card processing is free.|
|||Offsite storage and redundant disks can cost|
|Backups|Local copy can be $0|money; a single disk is not a safe backup<br>strategy.|
|SSL|Often $0|Let's Encrypt can provide free certificates;<br>domain and hosting still need to exist.|



### **15.3 AI recommendation and privacy warning** 

Google's Gemini API publishes a free tier for selected models, with limited access and rate limits. Its pricing documentation states that free-tier content may be used to improve products, whereas paid-tier content is not used for that purpose under the stated terms. These terms and eligible models can change. Do not upload real passports, bank statements, medical records or other sensitive client evidence to a free external AI tier without legal/privacy review, appropriate notice/consent and a provider arrangement suitable for the data. 

Confidential product planning document  •  Version 1.0  •  13 November 2026 

##### **VISA SERVICES CRM  |  PRODUCT REQUIREMENTS** 

Recommended order: (1) build deterministic business rules first; (2) use local Tesseract OCR for document text; (3) optionally run local AI through Ollama for non-critical summaries; (4) add an external AI provider only as an opt-in adapter after reviewing privacy, quotas and costs. Keep AI provider selection configurable so the stack never depends on one paid API. 

Official pricing reference: https://ai.google.dev/gemini-api/docs/pricing and rate limits: https://ai.google.dev/gemini-api/docs/rate-limits. 

### **15.4 Deployment recommendation** 

For development and a private pilot, run the full stack locally with Docker Compose and a private MySQL volume. For production with real applicant documents, use a secured VPS or on-premises server with HTTPS, firewall, private storage, automated encrypted offsite backups, monitoring and a tested restore process. If the budget is strictly zero, keep the application local/private until a secure hosting and backup budget exists. Do not treat a free serverless tier or public demo host as a secure production document vault. 

### **15.5 Final stack decision** 

**Recommendation:** Keep React + Vite + Tailwind CSS + Node.js + MySQL. Do not switch to PHP or another stack solely to save licensing costs. The existing stack is viable and all core components can be built with open-source tools. Spend effort on a modular architecture and avoid paid APIs as mandatory dependencies. 

### **16. Risks, assumptions and open decisions** 

|**Risk / decision**|**Why it matters**|**Required action**|
|---|---|---|
|Target market and countries are not<br>confirmed|Visa requirements, fields, workflows, privacy<br>laws and currencies vary by jurisdiction.|Select the first 2–3 destination countries and<br>top visa categories before building templates.|
|Legal/privacy obligations|Passport, financial and family data are high<br>sensitivity.|Get jurisdiction-specific legal/privacy review;<br>define retention, consent and access policy.|
|AI hallucinations|Incorrect immigration guidance can harm<br>clients.|Ground AI in reviewed sources; cite<br>source/version; require staff review; avoid<br>outcome promises.|
|Free hosting constraints|Sleep/limits/storage loss can disrupt service<br>and expose data.|Use local pilot first; production requires<br>reliable secured infrastructure and backup.|
|External messaging costs|WhatsApp/SMS/email may incur usage and<br>provider charges.|Make integrations optional and show per-<br>channel operational status.|
|OCR quality|Poor scans, scripts and stamps reduce<br>extraction accuracy.|Track confidence, require manual review and<br>benchmark on representative sample<br>documents.|
|Scope expansion|Public website, marketing automation,<br>partner portal and full SaaS can overwhelm<br>MVP.|Deliver the core case/document/workflow<br>lifecycle before expansion.|
|||Decide single-business vs SaaS early; include|
|Multi-tenant complexity|Cross-business data leakage is a severe risk.|business_id scoping and tests from day one if<br>SaaS is planned.|



### **16.1 Questions to resolve before implementation** 

- Which countries and visa categories will the first release support? 

- Is the first customer one visa agency, or will multiple unrelated agencies subscribe to the same SaaS platform? 

- Will clients use an external-facing portal in MVP or only staff use the CRM initially? 

Confidential product planning document  •  Version 1.0  •  13 November 2026 

##### **VISA SERVICES CRM  |  PRODUCT REQUIREMENTS** 

- Which languages are required at launch (English, Urdu, Arabic or others)? 

- Which currency/currencies and tax/invoicing rules apply to the business? 

- Which channels are essential initially: email, phone logging, WhatsApp, SMS or web chat? 

- Will the business process student visas, tourist visas, work visas, visit visas, business visas, immigration/residency, or all? 

- Are there existing spreadsheets or systems to import? 

- Where may sensitive client documents be stored and processed? 

- What hardware/server is already available for local hosting and local AI? 

### **17. Glossary** 

|**Term**|**Definition**|
|---|---|
|Applicant|Person whose visa application is being managed.|
|Case|A specific visa service/application engagement for an applicant.|
|Checklist|Versioned list of information and evidence items required by the<br>configured workflow.|
|Readiness assessment|Internal completeness and consistency review; not a prediction or<br>guarantee of government approval.|
|Pass-through fee|Money collected for a third party/government and not the agency's<br>service revenue.|
|Human-in-the-loop|A qualified staff member reviews AI output before it is accepted or<br>acted upon.|
|RBAC|Role-based access control.|
|RAG|Retrieval-augmented generation: AI answers using retrieved,<br>permission-filtered knowledge sources.|
|Idempotency|Protection against duplicate execution when the same request is<br>retried.|
|Tenant / business scope|Boundary ensuring records from one business cannot be accessed by<br>another.|



### **18. Source notes** 

Primary source document: Uncomplete_PRD.txt, titled “YBT Management Software — Ultra-Detailed Product Requirements Document, Version 2.0.” The new PRD preserves its permission-controlled AI assistant, Owner approval for AI writes, realdata analytics, modular services, secure storage, backup/restore, demo mode, customizable settings and auditability, while replacing generic customer/sales assumptions with visa-specific entities and workflows. 

External product research used for competitive benchmarking: 

- VisaCRM: https://visacrm.co/ ; platform: https://visacrm.co/platform/ ; document management: https://visacrm.co/platform/document-management/ 

- EzyMigrate: https://ezymigrate.com/ 

- Agentcis: https://agentcis.com/features/crm 

- Docketwise: https://www.docketwise.com/features/ 

- Mitratech INSZoom: https://mitratech.com/products/inszoom/features-benefits/ 

- Google Gemini API pricing: https://ai.google.dev/gemini-api/docs/pricing ; rate limits: https://ai.google.dev/geminiapi/docs/rate-limits 

This PRD is a product and engineering baseline, not legal advice, immigration advice, a security certification or a guarantee that a particular provider's current free tier is suitable for production. 

Confidential product planning document  •  Version 1.0  •  13 November 2026 

