-- TripWise AI Database Schema
-- Based on PRD v3 Technical Specification

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  marketing_consent BOOLEAN DEFAULT FALSE,
  privacy_accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_email ON customers(email);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id),
  destination TEXT,
  departure_date DATE,
  return_date DATE,
  flexible_dates BOOLEAN DEFAULT FALSE,
  travelers_adults INTEGER DEFAULT 1,
  travelers_children INTEGER DEFAULT 0,
  children_ages INTEGER[] DEFAULT '{}',
  budget TEXT,
  budget_level TEXT,
  trip_type TEXT DEFAULT 'unknown' CHECK (trip_type IN ('family', 'couple', 'friends', 'solo', 'unknown')),
  travel_month TEXT,
  status TEXT NOT NULL DEFAULT 'new_lead' CHECK (status IN (
    'new_lead', 'questionnaire_sent', 'questionnaire_completed',
    'ai_researching', 'ai_draft_ready', 'human_review', 'needs_ai_fix',
    'approved', 'proposal_sent', 'customer_selected_option',
    'meeting_scheduled', 'sales_call_needed', 'closed_won', 'closed_lost'
  )),
  assigned_rep TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trips_customer_id ON trips(customer_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_created_at ON trips(created_at DESC);

-- Questionnaires table
CREATE TABLE IF NOT EXISTS questionnaires (
  id UUID PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES trips(id),
  answers_json JSONB NOT NULL DEFAULT '{}',
  submitted_at TIMESTAMPTZ,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_questionnaires_trip_id ON questionnaires(trip_id);

-- AI Runs table
CREATE TABLE IF NOT EXISTS ai_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id),
  agent_name TEXT NOT NULL,
  input_hash TEXT,
  output_json JSONB DEFAULT '{}',
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  cost NUMERIC(10, 6),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

CREATE INDEX idx_ai_runs_trip_id ON ai_runs(trip_id);
CREATE INDEX idx_ai_runs_agent_name ON ai_runs(agent_name);
CREATE INDEX idx_ai_runs_status ON ai_runs(status);

-- Sources table
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id),
  source_name TEXT NOT NULL,
  url TEXT NOT NULL,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confidence TEXT DEFAULT 'medium' CHECK (confidence IN ('high', 'medium', 'low')),
  used_in_proposal BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_sources_trip_id ON sources(trip_id);

-- Proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id),
  version INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'sent', 'selected')),
  options JSONB DEFAULT '[]',
  itinerary JSONB DEFAULT '[]',
  attractions JSONB DEFAULT '[]',
  checklist JSONB DEFAULT '[]',
  qa_warnings JSONB DEFAULT '[]',
  customer_profile_summary TEXT,
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  public_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_proposals_trip_id ON proposals(trip_id);
CREATE INDEX idx_proposals_status ON proposals(status);

-- CRM Events table
CREATE TABLE IF NOT EXISTS crm_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_crm_events_entity_id ON crm_events(entity_id);

-- Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('system', 'user', 'ai', 'automation')),
  actor_id TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  before JSONB,
  after JSONB,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- Meeting Slots table
CREATE TABLE IF NOT EXISTS meeting_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id),
  proposed_slots JSONB DEFAULT '[]',
  selected_slot TIMESTAMPTZ,
  calendar_event_id TEXT,
  zoom_url TEXT,
  status TEXT DEFAULT 'proposed' CHECK (status IN ('proposed', 'selected', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_meeting_slots_trip_id ON meeting_slots(trip_id);

-- Miro Sync Logs table
CREATE TABLE IF NOT EXISTS miro_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL,
  board_id TEXT,
  item_id TEXT,
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed')),
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for MVP (restrict in production)
CREATE POLICY "Allow all for customers" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for trips" ON trips FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for questionnaires" ON questionnaires FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for proposals" ON proposals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for audit_logs" ON audit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for ai_runs" ON ai_runs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for sources" ON sources FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for crm_events" ON crm_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for meeting_slots" ON meeting_slots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for miro_sync_logs" ON miro_sync_logs FOR ALL USING (true) WITH CHECK (true);
