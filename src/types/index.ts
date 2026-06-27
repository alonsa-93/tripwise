export type TripStatus =
  | 'new_lead'
  | 'questionnaire_sent'
  | 'questionnaire_completed'
  | 'ai_researching'
  | 'ai_draft_ready'
  | 'human_review'
  | 'needs_ai_fix'
  | 'approved'
  | 'proposal_sent'
  | 'customer_selected_option'
  | 'meeting_scheduled'
  | 'sales_call_needed'
  | 'closed_won'
  | 'closed_lost';

export type TripType = 'family' | 'couple' | 'friends' | 'solo' | 'unknown';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  marketing_consent: boolean;
  privacy_accepted_at: string;
  created_at: string;
}

export interface Trip {
  id: string;
  customer_id: string;
  destination: string | null;
  departure_date: string | null;
  return_date: string | null;
  flexible_dates: boolean;
  travelers_adults: number;
  travelers_children: number;
  children_ages: number[];
  budget: string | null;
  budget_level: string | null;
  trip_type: TripType;
  status: TripStatus;
  assigned_rep: string | null;
  created_at: string;
  updated_at: string;
  customer?: Customer;
}

export interface Questionnaire {
  id: string;
  trip_id: string;
  answers_json: QuestionnaireAnswers;
  submitted_at: string | null;
  version: number;
}

export interface QuestionnaireAnswers {
  destination?: string;
  departure_date?: string;
  return_date?: string;
  flexible_dates?: boolean;
  preferred_airport?: string;
  adults?: number;
  children?: number;
  children_ages?: number[];
  has_infant?: boolean;
  needs_stroller?: boolean;
  needs_accessibility?: boolean;
  budget_total?: string;
  hotel_level?: string;
  hotel_preference?: string;
  travel_style?: string[];
  dietary_kosher?: boolean;
  limited_walking?: boolean;
  public_transport?: boolean;
  rental_car?: boolean;
  needs_pool?: boolean;
  city_center?: boolean;
  special_preferences?: string;
  meeting_slots?: string[];
  meeting_preference?: 'zoom' | 'phone';
  meeting_note?: string;
  most_important?: string;
}

export interface AIRun {
  id: string;
  trip_id: string;
  agent_name: string;
  input_hash: string;
  output_json: Record<string, unknown>;
  status: 'running' | 'completed' | 'failed';
  cost: number | null;
  started_at: string;
  ended_at: string | null;
}

export interface Source {
  id: string;
  trip_id: string;
  source_name: string;
  url: string;
  checked_at: string;
  confidence: ConfidenceLevel;
  used_in_proposal: boolean;
}

export interface ProposalOption {
  option_id: string;
  title: string;
  description: string;
  estimated_price: {
    amount: number;
    currency: string;
    checked_at: string;
  };
  pros: string[];
  cons: string[];
  fit_score: number;
  flights: {
    outbound: string;
    return: string;
    price_note: string;
    source_url: string;
  };
  hotel: {
    name: string;
    area: string;
    pros: string[];
    cons: string[];
    price_note: string;
    source_url: string;
  };
}

export interface ItineraryDay {
  day: number;
  title: string;
  items: {
    time: string;
    activity: string;
    location?: string;
    note?: string;
  }[];
}

export interface Attraction {
  name: string;
  why_relevant: string;
  source_url: string;
  confidence: ConfidenceLevel;
  suitable_for_children: boolean | null;
  estimated_cost?: string;
}

export interface ChecklistItem {
  task: string;
  due_date: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Proposal {
  id: string;
  trip_id: string;
  version: number;
  status: 'draft' | 'approved' | 'sent' | 'selected';
  options: ProposalOption[];
  itinerary: ItineraryDay[];
  attractions: Attraction[];
  checklist: ChecklistItem[];
  qa_warnings: string[];
  customer_profile_summary: string;
  approved_by: string | null;
  approved_at: string | null;
  public_url: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_type: 'system' | 'user' | 'ai' | 'automation';
  actor_id: string;
  action: string;
  entity: string;
  entity_id: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  timestamp: string;
}

export interface MeetingSlot {
  id: string;
  trip_id: string;
  proposed_slots: string[];
  selected_slot: string | null;
  calendar_event_id: string | null;
  zoom_url: string | null;
  status: 'proposed' | 'selected' | 'confirmed' | 'cancelled';
}

export interface LeadFormData {
  name: string;
  phone: string;
  email: string;
  destination: string;
  travel_month: string;
  travelers: number;
  trip_type: TripType;
  budget: string;
  contact_consent: boolean;
  marketing_consent: boolean;
}
