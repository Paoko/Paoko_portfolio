import { useState } from 'react'
import GalleryPortfolio from './GalleryPortfolio'
import AboutMe from './AboutMe'
import Nav from './Nav'

function App() {
  const [view, setView] = useState('gallery')

  return (
    <>
      <Nav active={view} onNavigate={setView} hoverEffect={view === 'gallery'} />
      {view === 'gallery' && <GalleryPortfolio />}
      {view === 'about' && <AboutMe />}
      {view === 'shop' && (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#fff',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontWeight: 300,
          textTransform: 'uppercase',
          letterSpacing: '2px',
        }}>
          Próximamente
        </div>
      )}
    </>
  )
}

export default App
