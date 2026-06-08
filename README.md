````markdown
# Cliengo

Cliengo is an AI-powered customer communication platform for sales, support, and customer service teams. It centralizes WhatsApp, website chat, Instagram, and Facebook Messenger conversations into one omnichannel inbox, automates responses with business-trained AI assistants, qualifies leads, routes conversations to the right team, and gives teams actionable reporting on every interaction.

The platform is designed for companies that need to respond instantly, capture more qualified leads, reduce manual support work, and convert conversations into revenue.

## Core capabilities

- **AI chatbot for WhatsApp and web chat**: automated 24/7 responses trained on company knowledge, FAQs, products, services, and operating rules.
- **Omnichannel inbox**: one workspace for WhatsApp, website chat, Instagram, Facebook Messenger, and handoff to human agents.
- **Dynamic conversation flows**: no-code workflows for lead qualification, appointment scheduling, routing, escalation, and follow-up.
- **WhatsApp campaigns**: bulk and segmented outbound messaging with automated bot follow-up.
- **Lead qualification**: capture contact details, intent, budget, urgency, and business-specific qualification fields.
- **CRM sync**: push contacts, leads, conversation history, tags, and lifecycle status into external CRM systems.
- **Conversation analytics**: track volume, conversion rate, campaign performance, response time, handoff rate, and bot effectiveness.
- **AI copilot insights**: analyze conversations to identify objections, missed opportunities, common questions, and optimization opportunities.

## Repository structure

```text
.
├── analytics-service/      # Metrics, dashboards, funnel reporting, and conversation insights
├── chatbot-engine/         # AI assistant runtime, flows, lead qualification, and escalation logic
├── conversation-hub/       # Omnichannel inbox, message state, routing, and agent handoff
├── crm-sync-api/           # CRM integrations, lead/contact sync, and lifecycle updates
└── whatsapp-connector/     # WhatsApp Business API webhooks, outbound messages, and delivery events
````

## Architecture

Cliengo is built as a set of independent services connected through event-driven messaging and shared conversation state.

```text
Customer channels
  ├─ WhatsApp Business
  ├─ Website chat
  ├─ Instagram
  └─ Facebook Messenger
        │
        ▼
whatsapp-connector / channel adapters
        │
        ▼
conversation-hub ───────────────► agent inbox
        │                              │
        ▼                              ▼
chatbot-engine ───────────────► escalation + handoff
        │
        ├──────────────► crm-sync-api
        │
        └──────────────► analytics-service
```

### Message lifecycle

1. A customer starts or continues a conversation through WhatsApp, website chat, Instagram, or Messenger.
2. The channel connector validates the webhook payload, normalizes the message, and publishes a message event.
3. `conversation-hub` stores the conversation, customer profile, channel metadata, and current assignment state.
4. `chatbot-engine` decides whether to answer with AI, continue a configured flow, qualify the lead, ask a follow-up question, or escalate to a human agent.
5. `crm-sync-api` syncs qualified leads, customer attributes, tags, and conversation summaries to the connected CRM.
6. `analytics-service` aggregates conversation, campaign, lead, and handoff events for reporting.

## Services

### `whatsapp-connector`

Handles WhatsApp Business API integration.

Responsibilities:

* Receive and verify WhatsApp webhook callbacks.
* Normalize inbound messages, media events, delivery receipts, and read receipts.
* Send outbound text, template, media, and interactive messages.
* Enforce provider retry and idempotency behavior.
* Publish channel events to the rest of the platform.

### `conversation-hub`

Owns the canonical conversation model and omnichannel inbox state.

Responsibilities:

* Store conversations, participants, messages, tags, and assignments.
* Maintain customer identity across channels.
* Route conversations to bots, teams, or specific agents.
* Track open, pending, resolved, and archived conversation states.
* Provide APIs for the agent inbox.

### `chatbot-engine`

Runs AI assistants and configured conversation flows.

Responsibilities:

* Execute qualification flows and support automations.
* Generate AI responses from approved business knowledge.
* Detect intent, language, urgency, and escalation conditions.
* Ask follow-up questions for missing lead fields.
* Hand off conversations to human agents when required.

### `crm-sync-api`

Synchronizes commercial data with external CRMs and internal business systems.

Responsibilities:

* Create and update contacts, companies, leads, and deals.
* Sync conversation transcripts and summaries.
* Map Cliengo fields to CRM-specific schemas.
* Retry failed syncs safely.
* Track source, campaign, channel, and attribution metadata.

### `analytics-service`

Provides operational and revenue reporting.

Responsibilities:

* Aggregate conversation and lead events.
* Calculate bot resolution rate, handoff rate, response time, conversion rate, and campaign performance.
* Surface common objections, missed questions, and high-intent conversations.
* Export metrics for dashboards and internal reporting.

## Getting started

### Prerequisites

* Node.js 20+
* Docker and Docker Compose
* PostgreSQL 15+
* Redis 7+
* WhatsApp Business API credentials
* OpenAI-compatible LLM credentials
* CRM API credentials for the target integration

### Environment variables

Create a `.env` file at the repository root:

```bash
NODE_ENV=development
PORT=3000

DATABASE_URL=postgres://cliengo:cliengo@localhost:5432/cliengo
REDIS_URL=redis://localhost:6379

JWT_SECRET=replace-me
ENCRYPTION_KEY=replace-me

OPENAI_API_KEY=replace-me
OPENAI_MODEL=gpt-4.1-mini

WHATSAPP_ACCESS_TOKEN=replace-me
WHATSAPP_PHONE_NUMBER_ID=replace-me
WHATSAPP_VERIFY_TOKEN=replace-me
WHATSAPP_APP_SECRET=replace-me

CRM_PROVIDER=hubspot
CRM_API_KEY=replace-me

LOG_LEVEL=info
```

### Run locally

```bash
docker compose up -d postgres redis
npm install
npm run dev
```

Run a single service:

```bash
cd chatbot-engine
npm install
npm run dev
```

### Health checks

Each service exposes a health endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "chatbot-engine",
  "version": "1.0.0"
}
```

## API overview

### Ingest an inbound message

```http
POST /api/messages/inbound
Content-Type: application/json
```

```json
{
  "channel": "whatsapp",
  "externalMessageId": "wamid.HBgN...",
  "conversationId": "conv_123",
  "customer": {
    "name": "Maria Gomez",
    "phone": "+5491112345678"
  },
  "text": "Hola, quiero cotizar un plan para mi empresa"
}
```

### Create a campaign

```http
POST /api/campaigns
Content-Type: application/json
```

```json
{
  "name": "June Lead Reactivation",
  "channel": "whatsapp",
  "templateName": "lead_reactivation_es",
  "segmentId": "seg_qualified_stale_leads"
}
```

### Sync a qualified lead

```http
POST /api/crm/leads
Content-Type: application/json
```

```json
{
  "conversationId": "conv_123",
  "name": "Maria Gomez",
  "phone": "+5491112345678",
  "intent": "pricing_request",
  "qualificationScore": 86,
  "source": "whatsapp_campaign"
}
```

## Observability

All services emit structured JSON logs. Every request and background job should include:

* `request_id`
* `conversation_id`
* `customer_id`
* `lead_id`
* `channel`
* `service`
* `event_type`
* `provider_message_id`
* `campaign_id`
* `error_code`

Example log:

```json
{
  "level": "info",
  "service": "chatbot-engine",
  "event_type": "lead_qualified",
  "conversation_id": "conv_123",
  "lead_id": "lead_456",
  "channel": "whatsapp",
  "qualification_score": 86
}
```

## Testing

```bash
npm test
npm run test:integration
npm run lint
```

Recommended coverage areas:

* Webhook signature validation
* Message normalization
* Flow execution
* AI response guardrails
* CRM field mapping
* Retry and idempotency behavior
* Analytics event aggregation

## Deployment

Services are containerized and can be deployed independently.

Recommended deployment checklist:

1. Configure production secrets.
2. Run database migrations.
3. Deploy channel connectors first.
4. Deploy `conversation-hub` and verify inbox APIs.
5. Deploy `chatbot-engine` with AI provider credentials.
6. Deploy `crm-sync-api` with CRM credentials.
7. Deploy `analytics-service` and validate event ingestion.
8. Configure webhook URLs in Meta/WhatsApp Business settings.
9. Send a test WhatsApp message and verify the full lifecycle.

## Security

* Validate all inbound provider webhooks.
* Encrypt channel tokens and CRM credentials at rest.
* Redact PII and access tokens from logs.
* Use per-tenant authorization for conversations, inboxes, campaigns, and CRM data.
* Apply idempotency keys to inbound and outbound message processing.
* Keep an immutable audit trail for agent actions and campaign sends.

## License

Proprietary. All rights reserved.

```
```
