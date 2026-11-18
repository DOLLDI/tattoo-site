import { useCallback, useEffect, useRef, useState } from 'react';
import { ArtistsSection } from './components/ArtistsSection';
import { BookingSection } from './components/BookingSection';
import { CinematicPresentation } from './components/CinematicPresentation';
import { ContactsSection } from './components/ContactsSection';
import { Navbar } from './components/Navbar';
import { PortfolioSection } from './components/PortfolioSection';
import { StudioSection } from './components/StudioSection';
import {
  createUnifiedScrollEngine,
  type ScrollEngineInstance,
} from './engine/scrollEngine';

export default function App() {
  const scrollEngineRef = useRef<ScrollEngineInstance | null>(null);
  const [isPastHero, setIsPastHero] = useState(false);

  const [selectedArtistFilter, setSelectedArtistFilter] = useState<string | null>(
    null,
  );
  const [bookingStyle, setBookingStyle] = useState('');
  const [bookingArtist, setBookingArtist] = useState('');

  useEffect(() => {
    const engine = createUnifiedScrollEngine();
    scrollEngineRef.current = engine;

    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      requestAnimationFrame(() => {
        engine.scrollToElement('studio', -64);
      });
    }

    return () => {
      engine.destroy();
      scrollEngineRef.current = null;
    };
  }, []);

  const handleNavigate = useCallback((sectionId: string) => {
    if (sectionId === 'presentation') {
      scrollEngineRef.current?.scrollToY(0);
      return;
    }
    scrollEngineRef.current?.scrollToElement(sectionId, -64);
  }, []);

  const handleBookWithArtist = useCallback(
    (artistName: string, style: string) => {
      setBookingArtist(artistName);
      setBookingStyle(style);
      handleNavigate('booking');
    },
    [handleNavigate],
  );

  const handleSelectArtistPortfolio = useCallback(
    (artistId: string) => {
      setSelectedArtistFilter(artistId);
      handleNavigate('portfolio');
    },
    [handleNavigate],
  );

  return (
    <div className="min-h-screen bg-[#050506] text-[#F4F4F6]">
      <Navbar onNavigate={handleNavigate} isPastHero={isPastHero} />

      <main>
        <CinematicPresentation
          onBookSession={() => handleNavigate('booking')}
          onExplorePortfolio={() => handleNavigate('portfolio')}
          onSkipToStudio={() => handleNavigate('studio')}
          onScrollToY={(y) => scrollEngineRef.current?.scrollToY(y)}
          onPastHeroChange={setIsPastHero}
        />

        <StudioSection onBookSession={() => handleNavigate('booking')} />

        <ArtistsSection
          onSelectArtistPortfolio={handleSelectArtistPortfolio}
          onBookWithArtist={handleBookWithArtist}
        />

        <PortfolioSection
          activeArtistFilter={selectedArtistFilter}
          onClearArtistFilter={() => setSelectedArtistFilter(null)}
          onBookSimilar={(style, artistName) =>
            handleBookWithArtist(artistName, style)
          }
        />

        <BookingSection
          preselectedStyle={bookingStyle}
          preselectedArtist={bookingArtist}
        />
      </main>

      <ContactsSection onNavigate={handleNavigate} />
    </div>
  );
}
