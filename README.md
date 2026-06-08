````markdown
# Cliengo Demo Monorepo

This repository is a demo application inspired by [Cliengo](https://www.cliengo.com/), a customer communication platform focused on WhatsApp, web chat, Instagram, Messenger, AI chatbots, lead qualification, campaigns, and an omnichannel inbox for sales and support teams.

> This is a demo repository and is not affiliated with or endorsed by Cliengo.

## What Cliengo does

Cliengo helps businesses automate sales, support, and customer service conversations across WhatsApp, website chat, Instagram, and Facebook Messenger. Its platform emphasizes 24/7 AI chatbots, lead capture and qualification, WhatsApp campaigns, routing conversations to the right team, CRM-style lead management, and conversation insights.

## Repository structure

```text
.
├── analytics-service/      # Reporting, funnel metrics, campaign performance, conversation insights
├── chatbot-engine/         # Bot flows, AI responses, lead qualification, routing logic
├── conversation-hub/       # Omnichannel inbox and conversation orchestration
├── crm-sync-api/           # Lead/customer sync with CRM systems and downstream sales tools
└── whatsapp-connector/     # WhatsApp Business messaging, webhooks, and delivery events
````

## Proposed architecture

The system is organized around a conversational commerce workflow:

1. A visitor or customer sends a message through WhatsApp, web chat, Instagram, or Messenger.
2. `conversation-hub` normalizes the conversation and stores message state.
3. `chatbot-engine` answers common questions, qualifies leads, and escalates high-intent conversations.
4. `crm-sync-api` sends qualified leads and customer updates to a CRM.
5. `analytics-service` tracks conversion rates, campaign performance, agent handoff, and chatbot effectiveness.

## Suggested local development flow

Each service should be runnable independently and should expose a small health endpoint for orchestration and monitoring.

```bash
cd chatbot-engine
npm install
npm run dev
```

Recommended environment variables:

```bash
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
CRM_API_KEY=
DATABASE_URL=
OPENAI_API_KEY=
```

## Demo scenarios

Useful demo flows to implement:

* Capture a new website visitor as a lead.
* Qualify a WhatsApp lead by asking intent, budget, and timeline.
* Route support requests to a live agent when the bot cannot answer.
* Sync qualified leads to a CRM.
* Show analytics for conversations, response time, handoff rate, and conversion.

## Observability ideas

Because this repository is useful for production-monitoring demos, each service should emit structured logs with:

* `request_id`
* `conversation_id`
* `lead_id`
* `channel`
* `service`
* `event_type`
* `error_code`

These fields make it easier to trace failures across the chatbot, inbox, CRM sync, WhatsApp connector, and analytics services.

## References

* Cliengo official site: [https://www.cliengo.com/](https://www.cliengo.com/)
* WordPress Cliengo plugin description: [https://wordpress.org/plugins/cliengo/](https://wordpress.org/plugins/cliengo/)
* Zenvia overview of Cliengo: [https://www.zenvia.com/en/blog/cliengo-chatbot-plans-and-whatsapp-integration/](https://www.zenvia.com/en/blog/cliengo-chatbot-plans-and-whatsapp-integration/)

```
```
