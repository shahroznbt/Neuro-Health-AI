
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

export interface ScanRecord {
  id: string;
  name: string;
  date: string;
  status: 'Complete' | 'Pending' | 'Analyzing';
  imageUrl: string;
  findings?: string;
}

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  time: string;
  date: string;
  imageUrl: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'med' | 'appointment' | 'insight' | 'urgent';
  time: string;
  priority?: 'high' | 'normal';
  read: boolean;
}

export interface PatientState {
  notifications: NotificationItem[];
  scans: ScanRecord[];
  medications: Medication[];
  appointments: Appointment[];
}
