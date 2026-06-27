export const BRAND = {
  name: 'TripWise AI',
  colors: {
    deepBlue: '#102A43',
    turquoise: '#21C7B7',
    orange: '#FFB347',
    lightGray: '#F5F7FA',
    white: '#FFFFFF',
    text: '#1F2937',
  },
  fonts: {
    hebrew: 'Heebo, Assistant, Arial Hebrew, sans-serif',
    english: 'Inter, Manrope, sans-serif',
  },
};

export const STATUS_LABELS: Record<string, string> = {
  new_lead: 'ליד חדש',
  questionnaire_sent: 'שאלון נשלח',
  questionnaire_completed: 'שאלון הושלם',
  ai_researching: 'AI חוקר',
  ai_draft_ready: 'טיוטת AI מוכנה',
  human_review: 'בבדיקה אנושית',
  needs_ai_fix: 'דורש תיקון AI',
  approved: 'מאושר',
  proposal_sent: 'הצעה נשלחה',
  customer_selected_option: 'לקוח בחר חלופה',
  meeting_scheduled: 'פגישה נקבעה',
  sales_call_needed: 'נדרשת שיחת מכירה',
  closed_won: 'נסגר בהצלחה',
  closed_lost: 'נסגר ללא הצלחה',
};

export const STATUS_COLORS: Record<string, string> = {
  new_lead: 'bg-blue-100 text-blue-800',
  questionnaire_sent: 'bg-yellow-100 text-yellow-800',
  questionnaire_completed: 'bg-green-100 text-green-800',
  ai_researching: 'bg-purple-100 text-purple-800',
  ai_draft_ready: 'bg-indigo-100 text-indigo-800',
  human_review: 'bg-orange-100 text-orange-800',
  needs_ai_fix: 'bg-red-100 text-red-800',
  approved: 'bg-green-100 text-green-800',
  proposal_sent: 'bg-teal-100 text-teal-800',
  customer_selected_option: 'bg-cyan-100 text-cyan-800',
  meeting_scheduled: 'bg-emerald-100 text-emerald-800',
  sales_call_needed: 'bg-amber-100 text-amber-800',
  closed_won: 'bg-green-200 text-green-900',
  closed_lost: 'bg-gray-200 text-gray-800',
};

export const TRIP_TYPE_LABELS: Record<string, string> = {
  family: 'משפחה',
  couple: 'זוג',
  friends: 'חברים',
  solo: 'יחיד',
  unknown: 'לא יודע/ת',
};

export const QUESTIONNAIRE_STEPS = [
  { id: 1, title: 'פרטי הטיול', icon: 'Plane' },
  { id: 2, title: 'מי נוסע?', icon: 'Users' },
  { id: 3, title: 'תקציב ונוחות', icon: 'Wallet' },
  { id: 4, title: 'סגנון טיול', icon: 'Compass' },
  { id: 5, title: 'העדפות מיוחדות', icon: 'Settings' },
  { id: 6, title: 'זמינות לפגישה', icon: 'Calendar' },
  { id: 7, title: 'מה הכי חשוב?', icon: 'Heart' },
];
