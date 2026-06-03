import { createContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import {
  doc, getDoc, setDoc, updateDoc, collection,
  onSnapshot, query, orderBy, addDoc, deleteDoc
} from 'firebase/firestore';

export const GymContext = createContext();

export function GymProvider({ children }) {
  // Navigation States
  const [currentView, setCurrentView] = useState('landing');
  const [adminSubView, setAdminSubView] = useState('overview');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Data States
  const [landingData, setLandingData] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [transformations, setTransformations] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [authSettings, setAuthSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default CMS configuration to seed Firestore if empty
  const defaultLandingData = {
    hero: {
      welcomeBadge: "Welcome to Elite Force",
      headline: "Build Your Ultimate Performance",
      subtitle: "Custom programming, evidence-based nutrition, and elite coaching engineered for your specific physiological goals.",
      ctaPrimary: "Start Training",
      ctaSecondary: "View Packages",
      successRate: "98%",
      yearsExp: "5+",
      supportHours: "24/7",
      imageUrl: ""
    },
    contact: {
      email: "coach@eliteforce.com",
      activeHours: "06:00 AM - 10:00 PM EST",
      whatsappLink: "https://wa.me/your-number",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
      twitter: "https://twitter.com"
    },
    about: {
      meetBadge: "Meet Your Coach",
      title: "Designed for Supremacy. Built on Science.",
      bioParagraph1: "Coach Roman Vance is a certified elite performance coach with over a decade of experience transforming bodies and minds. His philosophy is rooted in evidence-based practices, combining cutting-edge exercise physiology with personalized nutritional strategies. He believes in building sustainable habits that lead to lifelong results, not just quick fixes.",
      bioParagraph2: "Having worked with a diverse clientele, from competitive athletes to busy professionals, Roman understands that each individual's journey is unique. He is committed to providing a supportive yet challenging environment, empowering his clients to push past their perceived limits and achieve their full potential.",
      signatureName: "Roman Vance",
      signatureTitle: "Founder & Head Coach",
      signatureAccent: "EliteForce",
      credentialsTitle: "Certifications & Expertise",
      credentialsText: "Roman holds multiple advanced certifications and specializes in biomechanics, strength & conditioning, and advanced nutritional coaching.",
      credentials: [
        "ISSA Certified Elite Trainer",
        "NASM Certified Personal Trainer",
        "Precision Nutrition Level 1 Coach",
        "Advanced Biomechanics Specialist"
      ],
      pillars: [
        {
          title: "Precision Strength",
          description: "Optimized training protocols for maximum strength gains and muscle hypertrophy, focusing on proper form and progressive overload."
        },
        {
          title: "Hypertrophy Mechanics",
          description: "Targeted strategies to stimulate muscle growth through advanced training techniques and periodization."
        },
        {
          title: "Lifestyle Sustainability",
          description: "Integrating fitness into your daily life with flexible nutrition plans and habit coaching for long-term success."
        }
      ]
    },
    pricing: {
      title: "Training Programs",
      subtitle: "Choose Your Path to Greatness",
      description: "Select the program that aligns with your ambitions. Each package is meticulously crafted to deliver unparalleled results.",
      packages: [
        {
          name: "Starter Build",
          tagline: "Foundational strength & conditioning.",
          price: 149,
          period: "month",
          features: ["Custom Training Plan", "Basic Nutrition Guidance", "Weekly Check-ins", "Access to Community Forum"]
        },
        {
          name: "Lean Shred",
          tagline: "Accelerated fat loss & muscle definition.",
          price: 249,
          period: "month",
          features: ["Advanced Training Plan", "Personalized Meal Plan", "Bi-Weekly Progress Calls", "24/7 WhatsApp Support"]
        },
        {
          name: "Elite Lifestyle Protocol",
          tagline: "Comprehensive transformation & peak performance.",
          price: 399,
          period: "month",
          features: ["Elite Custom Training", "Macro-Flexible Dieting", "Weekly 1-on-1 Coaching", "Advanced Supplementation Guide"]
        }
      ]
    }
  };

  // 1. Initial Data Load & Firebase Realtime Sync
  useEffect(() => {
    const fetchBaseSettings = async () => {
      try {
        const authRef = doc(db, 'system', 'auth_settings');
        const landingRef = doc(db, 'system', 'landing_data');

        // Sync Auth Settings
        const authSnap = await getDoc(authRef);
        if (authSnap.exists()) {
          setAuthSettings(authSnap.data());
        } else {
          const defaultAuth = { master_key: '1234', trainer_email: '', trainer_password: '', is_setup_completed: false };
          await setDoc(authRef, defaultAuth);
          setAuthSettings(defaultAuth);
        }

        // Sync Landing Settings with safe fallbacks
        const landingSnap = await getDoc(landingRef);
        if (landingSnap.exists()) {
          const dbData = landingSnap.data();
          // Merge DB data with defaults to ensure new fields like pillars/credentials exist
          setLandingData({
            hero: { ...defaultLandingData.hero, ...dbData.hero },
            contact: { ...defaultLandingData.contact, ...dbData.contact }, // Merge contact data
            about: { ...defaultLandingData.about, ...dbData.about }, // Keep existing merge for about
            pricing: { ...defaultLandingData.pricing, ...dbData.pricing }
          });
        } else {
          await setDoc(landingRef, defaultLandingData);
          setLandingData(defaultLandingData);
        }
      } catch (err) {
        console.error("Initialization Error: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBaseSettings();

    // B. Sync Customers Collection
    const qCustomers = query(collection(db, 'customers'), orderBy('joinDate', 'desc'));
    const unsubCustomers = onSnapshot(qCustomers, (snapshot) => {
      const custData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(custData);
      const rev = custData.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
      setTotalRevenue(rev);
    }, (error) => console.log(error));

    // C. Sync Bookings Collection
    const qBookings = query(collection(db, 'bookings'), orderBy('date', 'desc'));
    const unsubBookings = onSnapshot(qBookings, (snapshot) => {
      setPendingBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.log(error));

    return () => { unsubCustomers(); unsubBookings(); };
  }, []);

  // 2. Auth Logic
  const setupTrainerCredentials = async (email, password) => {
    try {
      const docRef = doc(db, 'system', 'auth_settings');
      const updated = { trainer_email: email, trainer_password: password, is_setup_completed: true, master_key: "" };
      await updateDoc(docRef, updated);
      setAuthSettings(updated);
    } catch (error) {
      throw error;
    }
  };

  const renewSessions = async (customerId, sessionsToAdd, amountPaid) => {
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return;

    const today = new Date().toISOString().split('T')[0];
    const newRem = (cust.sessionsRemaining || 0) + sessionsToAdd;
    const newTotal = (cust.totalSessions || 0) + sessionsToAdd;
    const newPaid = (cust.paidAmount || 0) + amountPaid;

    const newHistory = [
      { date: today, type: 'renewed', info: `Package renewed: +${sessionsToAdd} sessions added for $${amountPaid}.` },
      ...cust.history
    ];

    await updateDoc(doc(db, 'customers', customerId), {
      sessionsRemaining: newRem,
      totalSessions: newTotal,
      paidAmount: newPaid,
      status: 'Active',
      history: newHistory
    });
  };

  const updateTrainerKey = async (newKey) => {
    const docRef = doc(db, 'system', 'auth_settings');
    await updateDoc(docRef, { master_key: newKey });
    setAuthSettings(prev => ({ ...prev, master_key: newKey }));
  };

  // 3. Actions (Direct Firestore Integration)
  const changeView = (view, subView = 'overview') => {
    setCurrentView(view);
    if (view === 'admin') setAdminSubView(subView);
  };

  const logSession = async (customerId) => {
    const cust = customers.find(c => c.id === customerId);
    if (!cust || cust.sessionsRemaining <= 0) return;

    const today = new Date().toISOString().split('T')[0];
    const newUsed = cust.sessionsUsed + 1;
    const newRem = cust.sessionsRemaining - 1;
    const isExpiring = newRem === 0;

    const newHistory = [
      { date: today, type: 'session_logged', info: `Session #${newUsed} completed.` },
      ...cust.history
    ];

    if (isExpiring) {
      newHistory.unshift({ date: today, type: 'status_changed', info: 'Account deactivated (Depleted).' });
    }

    await updateDoc(doc(db, 'customers', customerId), {
      sessionsUsed: newUsed,
      sessionsRemaining: newRem,
      status: isExpiring ? 'Inactive' : cust.status,
      history: newHistory
    });
  };

  const addCustomer = async (customerData) => {
    const today = new Date().toISOString().split('T')[0];
    const baseCostMap = { 'Starter Build': 149, 'Lean Shred': 249, 'Elite Lifestyle Protocol': 399 };
    const cost = baseCostMap[customerData.packageName] || 199;

    const newCust = {
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone || '',
      packageName: customerData.packageName,
      status: 'Active',
      totalSessions: parseInt(customerData.totalSessions),
      sessionsUsed: 0,
      sessionsRemaining: parseInt(customerData.totalSessions),
      joinDate: today,
      paidAmount: cost,
      history: [{ date: today, type: 'status_changed', info: 'Account initialized.' }]
    };

    await addDoc(collection(db, 'customers'), newCust);
  };

  const addBooking = async (bookingData) => {
    const today = new Date().toISOString().split('T')[0];
    await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      date: today,
      status: 'Pending'
    });
  };

  const acceptBooking = async (bookingId, sessionsCount = 12) => {
    const booking = pendingBookings.find(b => b.id === bookingId);
    if (!booking) return;

    await addCustomer({ ...booking, totalSessions: sessionsCount });
    await deleteDoc(doc(db, 'bookings', bookingId));
  };

  const declineBooking = async (bookingId) => {
    await deleteDoc(doc(db, 'bookings', bookingId));
  };

  const addTransformation = async (transData) => {
    await addDoc(collection(db, 'transformations'), {
      ...transData,
      createdAt: new Date()
    });
  };

  const deleteTransformation = async (id) => {
    await deleteDoc(doc(db, 'transformations', id));
  };

  const updateLandingData = async (newData) => {
    await setDoc(doc(db, 'system', 'landing_data'), newData);
    setLandingData(newData);
  };

  const weeklyAttendance = [
    { day: 'Mon', count: 18 }, { day: 'Tue', count: 24 }, { day: 'Wed', count: 15 },
    { day: 'Thu', count: 29 }, { day: 'Fri', count: 22 }, { day: 'Sat', count: 32 }, { day: 'Sun', count: 8 }
  ];

  return (
    <GymContext.Provider value={{
      currentView, adminSubView, landingData, customers, pendingBookings, transformations,
      totalRevenue, weeklyAttendance, isAdminAuthenticated, authSettings, loading,
      trainerKey: authSettings?.master_key,
      setIsAdminAuthenticated, changeView, logSession, addCustomer,
      addBooking, acceptBooking, declineBooking, updateLandingData, setupTrainerCredentials,
      renewSessions, updateTrainerKey, addTransformation, deleteTransformation
    }}>
      {children}
    </GymContext.Provider>
  );
}