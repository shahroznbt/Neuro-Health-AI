
import React, { createContext, useContext, useState, useEffect } from 'react';
import { NotificationItem, ScanRecord, Medication, Appointment, PatientState } from '../types';
import { ASSETS } from '../constants';
import { AuthService, User } from '../services/authService';

interface HealthContextType extends PatientState {
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addScanRecord: (scan: ScanRecord) => void;
  logMedication: (id: string) => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'read' | 'time'>) => void;
  user: User | null;
  userName: string;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  biometricLogin: () => Promise<boolean>;
  checkBiometric: () => Promise<boolean>;
  registerBiometric: () => Promise<boolean>;
  logout: () => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(AuthService.getCurrentUser());
  const [userName, setUserName] = useState<string>(user ? user.name : 'Guest');

  useEffect(() => {
    if (user) {
      setUserName(user.name);
    }
  }, [user]);

  const login = async (email: string, pass: string) => {
    const loggedInUser = await AuthService.login(email, pass);
    setUser(loggedInUser);
    AuthService.setCurrentUser(loggedInUser);
  };

  const signup = async (name: string, email: string, pass: string) => {
    await AuthService.signup(name, email, pass);
    // Do not auto-login after signup as per request
  };

  const googleLogin = async () => {
    const googleUser = await AuthService.googleLogin();
    setUser(googleUser);
    AuthService.setCurrentUser(googleUser);
  };

  const checkBiometric = async () => {
    return await AuthService.checkBiometricAvailability();
  };

  const registerBiometric = async () => {
    if (!user) return false;
    return await AuthService.registerBiometric(user.id);
  };

  const biometricLogin = async () => {
    const bioUser = await AuthService.verifyBiometric();
    if (bioUser) {
      setUser(bioUser);
      AuthService.setCurrentUser(bioUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setUserName('Guest');
  };

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Missed Dose: Levodopa',
      description: 'Scheduled for 8:00 AM. Please log your dose as soon as possible.',
      type: 'urgent',
      time: '2h ago',
      priority: 'high',
      read: false,
    },
    {
      id: '2',
      title: 'MRI Analysis Ready',
      description: 'Your brain scan from Oct 20 has been processed by Neuro AI.',
      type: 'insight',
      time: '5h ago',
      read: false,
    }
  ]);

  const [scans, setScans] = useState<ScanRecord[]>([
    {
      id: 's1',
      name: 'Axial_T1_Brain_Current',
      date: 'Oct 20, 2023',
      status: 'Complete',
      imageUrl: ASSETS.MRI_THUMBNAIL,
      findings: 'Normal intracranial findings. No evidence of acute intracranial hemorrhage or territorial infarct.'
    }
  ]);

  const [medications, setMedications] = useState<Medication[]>([
    { id: 'm1', name: 'Levodopa', dosage: '50mg', time: '8:00 AM', taken: false },
    { id: 'm2', name: 'Keppra', dosage: '150mg', time: '2:00 PM', taken: false },
    { id: 'm3', name: 'Multivitamin', dosage: '1ct', time: '9:00 PM', taken: false }
  ]);

  const [appointments] = useState<Appointment[]>([
    { id: 'a1', doctor: 'Dr. Emily Chen', specialty: 'Neurologist', date: 'Oct 25', time: '10:00 AM', imageUrl: ASSETS.DR_CHEN }
  ]);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addScanRecord = (scan: ScanRecord) => {
    setScans(prev => [scan, ...prev]);
  };

  const logMedication = (id: string) => {
    setMedications(prev => prev.map(m => m.id === id ? { ...m, taken: true } : m));
    // If it was an urgent notification for this med, mark it read
    const medName = medications.find(m => m.id === id)?.name;
    if (medName) {
      setNotifications(prev => prev.map(n =>
        (n.type === 'urgent' && n.title.includes(medName)) ? { ...n, read: true } : n
      ));
    }
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'read' | 'time'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: Date.now().toString(),
      read: false,
      time: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <HealthContext.Provider value={{
      notifications, scans, medications, appointments, userName, user, isAuthenticated: !!user,
      login, signup, googleLogin, logout, biometricLogin, checkBiometric, registerBiometric,
      markNotificationRead, markAllNotificationsRead, addScanRecord, logMedication, addNotification, setUserName
    }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) throw new Error('useHealth must be used within HealthProvider');
  return context;
};
