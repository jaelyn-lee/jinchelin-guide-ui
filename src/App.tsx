import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import AddReviewPage from './pages/AddReviewPage'
import HallOfFamePage from './pages/HallOfFamePage'
import { AppLayout } from './components/AppLayout'
import { useAuth } from './context/useAuth'
import LoginPage from './pages/LoginPage'

export default function App() {
  const { session, isLoading } = useAuth()

  if (isLoading) return <div className="min-h-screen bg-jin-ink" />

  return (
    <BrowserRouter>
      <Routes>
        {!session ? (
          <Route path="*" element={<LoginPage />} />
        ) : (
          <>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/add" element={<AddReviewPage />} />
              <Route path="/hall-of-fame" element={<HallOfFamePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  )
}
