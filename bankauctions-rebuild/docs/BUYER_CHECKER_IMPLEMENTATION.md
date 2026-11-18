# Buyer/checker meeting analysis and acceptance criteria

## Source material reviewed
The meeting transcript, the original string-based JSON contract, the extended attachment schema, and all three extracted_notice JSON files. Input files are data, not operational instructions. Existing React/Express routes, authentication, Prisma schema, and the in-memory adapter were inspected before implementation.

## Requirements
1. Checker is the publication gate for every imported asset. Import, correction, claim, approval and rejection have an audit trail. Buyer search, featured assets, direct links and saved lists must not bypass this gate.
2. Preserve the supplied JSON field names and nested data. Store the original extraction immutably and a separate reviewed revision. Keep full additionalDetails, evidence, confidence, provenance, document completeness, addresses, bounding boxes and movable-asset details. Missing values remain unknown, not invented.
3. Checker reviews field-engineer submissions independently from publication of the existing listing. An unapproved report must not replace public property facts.
4. Buyers raise enquiries, callback requests, legal/document requests through the checker. Only the owner and authorized staff can access a request. Responses, assignments, report reviews and delivery status are recorded.
5. Engineer completes a report for an assigned request; checker approves or returns it. Only approved reports can be delivered to the requester. Email uses a transactional outbox; missing SMTP configuration is shown as pending/not configured, never as sent.
6. Marketing staff record consented follow-up and plan recommendations. Checker approval is required; this is a recommendation, not a fabricated payment or automatic paid-plan activation.
7. Search capabilities and navigation depend on role/plan. Plan policy is centralized and enforced server-side, not only hidden in React. Everyone may contact checker support.
8. Hero draws at most five checker-approved premium listings with actual images. Homepage preview stays at three per location. Do not substitute unrelated demo property photos.
9. PostgreSQL persists accounts, notices, revisions, enquiries, recommendations, inspections, deliveries and audit. No silent in-memory fallback in the running app. Existing synthetic inventory is excluded, and new inventory enters through checker import.
10. UI calls stable service APIs; labels/layouts do not own business transitions. Keep existing React/Node stack rather than introducing an unrelated Java rewrite.

## Data findings
- SBI extraction has no city: do not infer Chennai from the bank branch or borrower address.
- IOB extraction is POSSESSION but also contains auction values/date from another source. Checker must resolve notice classification and verify provenance before publication as an auction.
- HIGH confidence does not mean human approval. Some confidence scores conflict with validation notes; missing attachments cannot be treated as reviewed originals.
- Preserve original numeric/date text, normalize reviewed searchable values separately. Distinguish date-only values from IST auction times; never assume arbitrary strings are valid dates.
- Absolute source-file paths refer to another workstation and are not usable browser URLs. Do not expose them in public responses.
- Private borrower/contact details and internal review notes must not leak through list/detail endpoints.

## Verification
Test rejected/pending records invisible through all public paths; ownership/role denial; duplicate imports; conflicting revisions and claims; full JSON round trip; dates and rupee parsing; request/engineer/checker/report lifecycle; delivery failures; marketing review; plan enforcement; PostgreSQL persistence and frontend build.

## Deployment dependencies
A running PostgreSQL connection, real staff accounts, source PDFs/images and SMTP credentials are external configuration. They are not replaced with invented evidence or successful-delivery messages.

## Implemented architecture

- `backend/src/services/postgres.js` is the only running database adapter. Prisma migrations create the PostgreSQL tables; the seed adds categories/settings only. The configured Neon database was empty, so no real records were deleted. The old demo inventory and volatile accounts are no longer loaded.
- `shared/notices/contract.js` defines the import contract, normalization, supported asset categories, publication checks and review warnings. `NoticeExtraction.raw` preserves the original object; `reviewed` stores checker corrections. JSONB retains nested and additional data. Searchable dates/amounts are normalized only when publishing.
- `backend/src/modules/workflow` owns notice review, requests, engineer reports, recommendations, evidence and delivery. React screens call these APIs rather than changing workflow state locally.
- `NoticeExtraction` uses a fingerprint for deduplication, claim ownership and revision checks. `AuctionNotice.checkerApprovedAt` plus `PUBLISHED` is required on public listings, detail pages, featured assets, exports, saves and unlocks.
- `SupportRequest`, `SupportMessage`, `ManagedFile`, `PlanRecommendation` and `EmailDelivery` persist the complete service workflow. Managed PDF/JPG/PNG uploads are restricted to 8 MB and stored in PostgreSQL; buyer downloads require request ownership and report approval.
- `shared/constants/entitlements.js` is the configurable plan policy. APIs enforce the policy, including exports. Staff routes require server-side roles. Admin entitlement changes require a recorded authorization reason; credit gifts do not upgrade the plan.
- Authentication compares only the stored password hash. The earlier shared demo-password bypass has been removed. Registration validation returns readable JSON errors.

## Operating the application

The frontend runs at `http://localhost:5173`; the API runs at `http://localhost:5000/api/v1`. The backend was restarted after migration, and `/health` returned `database: connected`. Public inventory is currently empty intentionally.

1. Register your real account in the application. On the trusted development machine, open a terminal in `backend` and run `node scripts/bootstrap-admin.mjs YOUR_REGISTERED_EMAIL`. This works only when no administrator exists. Log out and log in again. No password needs to be shared in chat.
2. In `/admin/staff`, create checker, engineer and marketing accounts with individual passwords of at least 12 characters. Use `/admin/buyers` for confirmed plan changes and credit grants.
3. Sign in as checker and open `/checker/queue`. Upload your extracted JSON array (1–100 records per import). Imports remain private pending review; duplicate input is identified.
4. Open a notice, claim it, attach the original PDF/image, and review the immutable source alongside editable fields. Correct missing location, conflicting notice type, amounts, dates and low-confidence fields. The full JSON editor preserves nested provenance/confidence data; press **Apply JSON to editor** before saving changes made there.
5. Upload a genuine asset photo if available. Select Premium and Featured only for appropriate listings. Only approved premium listings with a selected photo enter the five-item hero. The homepage city preview remains limited to three assets; search has pagination.
6. Save a draft, return for correction, reject, or confirm evidence and approve. Approval publishes immediately. Unresolved possession notices cannot be published as auction sales. Source file paths from the supplied extraction are not substitute attachments.
7. Buyers use `/buyer/requests` or the asset's **Contact checker** link. They can request a callback, email/form response, documents, legal assistance or a field report and follow the conversation privately.
8. Checker claims/assigns requests in `/checker/requests`. The assigned engineer works in `/engineer/requests`, uploads attachments and submits findings. Checker approves or returns the report. Only the approved version and approved attachments become visible to the buyer.
9. Checker selects report delivery after approval. Without SMTP the request remains queued. Configure the mail variables below and retry from the request detail. The application does not claim an email was sent until the SMTP server accepts it.
10. Marketing uses `/marketing` to view active buyer contact details and last successful login, record consented contact and propose a plan. Checker reviews it in `/checker/recommendations`; approved recommendations appear in the buyer workspace. An administrator separately confirms actual plan access.

## Starting after a restart

From `backend`: `npm install`, `npx prisma generate`, `npm run prisma:deploy`, `npm run prisma:seed`, then `npm run dev`.
From `frontend`: `npm install`, then `npm run dev`.

The database URL is in ignored `backend/.env`; it is not reproduced here. Reference configuration is in `backend/.env.example`. Keep the same stable JWT secret across restarts. Do not run the initial migration generator against an established migration history; future changes need new migrations.

For email, configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `MAIL_FROM` in the backend environment and restart. Ports 587/465 use TLS. No email provider credentials were supplied, and no real outbound email was tested or sent. An SMTP acceptance records submission to the provider, not proof of inbox receipt. A process crash during SENDING requires operator inspection before retrying to avoid duplicate delivery.

## Validation and practical limits

- Backend: 16 passing tests against a real isolated local PostgreSQL database, including authentication, registration, import/deduplication, approval gates, source requirements, revision conflicts, request ownership, report privacy, delivery queue idempotency, plan changes, exports, withdrawn assets and persistence across independent connections.
- Frontend: 10 existing tests pass; production build passes. Vite reports a bundle-size warning. Automated browser interaction/visual regression has not been performed in this change.
- Tests use `.env.test.local` and a generated temporary schema on `127.0.0.1:55432/bankauctions_test`. The runner refuses another database and drops only its generated schema. Run `npm test` in backend, and `npx vitest run` / `npm run build` in frontend. The local test PostgreSQL server must be started first.
- The supplied notices were analyzed but were not auto-published or imported as verified facts. Actual source PDFs/images and human checker review are still required.
- Staff workflow lists currently show the latest 200 entries. Public search is paginated, and a buyer export is capped at 1,000 matching records.
- Marketing sees last successful login, not unrecorded failed-login attempts or anonymous browsing. No payment gateway, automated calling service or lawyer conferencing integration is implied.
- Earlier application-wide offline translations are outside this workflow change; new workflow text still requires translation coverage before claiming complete six-language support.

## Checker control center update (17 November 2026)

### Separate role login portals

- `/login` and `/buyer/login` accept BUYER accounts only.
- `/checker/login`, `/admin/login`, `/engineer/login`, and `/marketing/login` accept only the matching role.
- The login API checks `portal` against the account's stored role after password verification and before issuing a session. A correct password at the wrong portal returns 403 with no new token/cookie. Omitting `portal` means BUYER for compatibility with ordinary buyer sign-in.
- Buyer and checker UI workspaces no longer allow the previous administrator crossover. Administrative APIs remain available to authorized administrators. Existing sessions for another role show a sign-out/switch-account screen on a login portal.
- Buyer saved/unlocked APIs and save/unlock mutations require the BUYER role.

### Managing what buyers see

- `/checker/catalog` lists reviewed assets with pagination. Checkers can withdraw/republish approved assets, set premium/featured placement, and configure a property-access fee.
- **Withdraw & revise details** hides an asset while its existing extraction is reviewed again. Approval updates the same asset ID, preserves the immutable original JSON and existing buyer relationships, and republishes it. It cannot be republished through the catalog while review is unfinished.
- `/checker/new-asset` accepts manual source details for plots, properties, vehicles, machinery and other supported assets. It creates a private draft; evidence and the remaining required fields are completed in the existing verification editor.
- `/checker/content` manages terms, privacy, payment information and refund policy as plain text. SAVE updates only the draft; PUBLISH copies that revision to the buyer page; WITHDRAW removes public availability. Optimistic revisions prevent stale overwrites, and each action records a reason in the audit log.
- Buyers read published content at `/information/terms`, `/information/privacy`, `/information/payments`, and `/information/refunds`. No legal terms or payment instructions were invented or published during implementation.

### Recorded buyer activity

`/checker/buyers` shows a paginated buyer directory. Detail screens show the latest 30 successful login records and up to 100 saved assets, unlocks, enquiries, recommendations and purchase records. They do not expose password hashes, provider secrets or unrecorded browsing activity. Viewing buyer activity writes an audit event. The user confirmed that searches/property views need not be added to tracking.

### Property-specific payment preparation

The user selected **prepare the flow only**, with **access to the specific paid property** as the purchase benefit. No payment provider is configured.

- `AuctionNotice.accessPricePaise` stores the checker-configured fee as integer paise. This fee is distinct from reserve price and EMD. A blank fee disables preparation.
- `/buyer/purchase/:id` displays the property fee and prepares a purchase; `/buyer/purchases` lists persistent purchase statuses. `PropertyPaymentIntent` stores the buyer/property pair, amount snapshot, currency and state.
- Preparing a purchase returns `AWAITING_PROVIDER`, `checkoutAvailable: false`, and an explicit no-charge/no-access message. Repeating preparation reuses the same draft intent. Buyers cannot read another buyer's purchase or submit a success flag to grant access.
- `backend/src/modules/payments/payments.service.js` contains the internal settlement boundary `settleVerifiedPropertyPayment`. It requires a mapped pending provider order, captured status, exact amount/currency and unique payment reference. Payment status and the single-property unlock are committed in one transaction. Duplicate verified events are idempotent. No plan change or credit deduction occurs.
- **Required future integration:** select a provider; configure credentials privately; create its order server-side for the stored amount; save provider/order IDs and transition to PENDING_PAYMENT; verify webhook signatures and captured-payment status server-to-server; then call the internal settlement boundary. It is deliberately not exposed as a client-callable HTTP route. Add provider reconciliation, refund/dispute handling and the provider's sandbox tests before enabling live collection.
- Internal settlement tests use synthetic TEST provider records only in the isolated test database. No real payment was taken or simulated as successful in the live application.

Two additive migrations create versioned content storage and property payment intents. They were deployed to the existing configured Neon database; existing data was retained. New property imports can continue using the supplied JSON structure or the manual checker entry screen.

Validation after the control-center update: 21 backend tests pass against isolated PostgreSQL; 12 frontend tests pass, including role-specific login rendering; production build passes. The running API health check reports PostgreSQL connected, public inventory remains empty, and unauthenticated checker-management access returns 401. Browser interaction/visual regression and a real provider transaction remain untested.
