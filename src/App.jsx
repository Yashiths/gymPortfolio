import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Pricing from './components/Pricing';
import TransformationForm from './components/TransformationForm';
import Transformations from './components/Transformations';
import Footer from './components/Footer';

// Import Dashboard Layer
import { GymProvider } from './context/GymContext';
import { useGym } from './context/useGym';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Overview from './components/dashboard/Overview';
import Customers from './components/dashboard/Customers';
import Settings from './components/dashboard/Settings';
import PageEditor from './components/dashboard/PageEditor';

function AppContent() {
  const { currentView, adminSubView, landingData } = useGym();
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');

  // Universal loading check to hold rendering until Firebase resolves sync state
  if (!landingData) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">Loading Gym Portal...</p>
        </div>
      </div>
    );
  }

  const handleSelectPackage = (goal, packageTitle) => {
    setSelectedGoal(goal);
    setSelectedPackage(packageTitle);
  };

  if (currentView === 'admin') {
    return (
      <DashboardLayout>
        {adminSubView === 'overview' && <Overview />}
        {adminSubView === 'customers' && <Customers />}
        {adminSubView === 'editor' && <PageEditor />}
        {adminSubView === 'settings' && <Settings />}
      </DashboardLayout>
    );
  }

  return (
    <div className="bg-[#090d16] min-h-screen text-gray-100 selection:bg-brand-orange selection:text-white antialiased overflow-x-hidden">
      {/* Navigation */}
      <Navbar />

      {/* Main Content Layout */}
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Philosophy / About Section */}
        <About />

        {/* Client Success Stories */}
        <Transformations />

        {/* Training Programs / Pricing Section */}
        <Pricing onSelectPackage={handleSelectPackage} />

        {/* Interactive Transformation Contact Form */}
        <TransformationForm 
          selectedGoal={selectedGoal} 
          selectedPackage={selectedPackage} 
        />
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <GymProvider>
      <AppContent />
    </GymProvider>
  );
}