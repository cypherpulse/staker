import { Header } from '../components/Header';
import { StatsHero } from '../components/StatsHero';
import { StakingSection } from '../components/StakingSection';
import { AdminSection } from '../components/AdminSection';
import { InfoSection } from '../components/InfoSection';
import { EventsLog } from '../components/EventsLog';
import { Footer } from '../components/Footer';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24">
        <StatsHero />
        <StakingSection />
        <AdminSection />
        <EventsLog />
        <InfoSection />
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
