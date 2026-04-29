import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { EventsProvider } from './context/EventsContext'
import { AppLayout } from './components/layout/AppLayout'
import { Home } from './pages/Home'
import { EventDetail } from './pages/EventDetail'
import { CreateEvent } from './pages/CreateEvent'
import { Profile } from './pages/Profile'
import { CommunityDetail } from './pages/CommunityDetail'
import { PublicPreview } from './pages/PublicPreview'

export default function App() {
  return (
    <ThemeProvider>
      <EventsProvider>
        <BrowserRouter>
          <Routes>
            {/* Public route — no layout chrome */}
            <Route path="/events/:id/preview" element={<PublicPreview />} />

            {/* App routes with sidebar / bottom nav */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/events/new" element={<CreateEvent />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/communities/:id" element={<CommunityDetail />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </EventsProvider>
    </ThemeProvider>
  )
}
