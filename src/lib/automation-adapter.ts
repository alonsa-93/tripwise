type EventType =
  | 'lead.created'
  | 'questionnaire.sent'
  | 'questionnaire.completed'
  | 'ai.draft.ready'
  | 'proposal.approved'
  | 'customer.option.selected'
  | 'meeting.slot.selected'
  | 'status.changed'
  | 'agent.failed';

interface AutomationEvent {
  event_type: EventType;
  payload: Record<string, unknown>;
  timestamp: string;
}

export async function emitEvent(eventType: EventType, payload: Record<string, unknown>): Promise<void> {
  const event: AutomationEvent = {
    event_type: eventType,
    payload,
    timestamp: new Date().toISOString(),
  };

  const webhookUrl = process.env.AUTOMATION_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log('[AutomationAdapter] No webhook URL configured, logging event:', event);
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      console.error('[AutomationAdapter] Webhook failed:', response.status);
    }
  } catch (error) {
    console.error('[AutomationAdapter] Failed to emit event:', error);
  }
}
