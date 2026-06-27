type EventType =
  | 'lead.created'
  | 'questionnaire.sent'
  | 'questionnaire.completed'
  | 'ai.agent.start'
  | 'ai.draft.ready'
  | 'proposal.approved'
  | 'customer.option.selected'
  | 'meeting.slot.selected'
  | 'status.changed'
  | 'agent.failed';

const N8N_BASE = 'https://alonsab.app.n8n.cloud/webhook';

const WEBHOOK_MAP: Partial<Record<EventType, string>> = {
  'lead.created': `${N8N_BASE}/tripwise/lead-created`,
  'questionnaire.completed': `${N8N_BASE}/tripwise/questionnaire-completed`,
  'ai.agent.start': `${N8N_BASE}/tripwise/ai-agent`,
  'ai.draft.ready': `${N8N_BASE}/tripwise/ai-draft-ready`,
  'proposal.approved': `${N8N_BASE}/tripwise/proposal-approved`,
  'customer.option.selected': `${N8N_BASE}/tripwise/customer-option-selected`,
  'meeting.slot.selected': `${N8N_BASE}/tripwise/meeting-scheduled`,
};

export async function emitEvent(eventType: EventType, payload: Record<string, unknown>): Promise<void> {
  const webhookUrl = WEBHOOK_MAP[eventType];
  if (!webhookUrl) {
    console.log('[AutomationAdapter] No webhook mapped for event:', eventType, payload);
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('[AutomationAdapter] Webhook failed:', eventType, response.status);
    }
  } catch (error) {
    console.error('[AutomationAdapter] Failed to emit event:', eventType, error);
  }
}
