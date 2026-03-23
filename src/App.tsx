import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import AddReviewPage from './pages/AddReviewPage'
import HallOfFamePage from './pages/HallOfFamePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/add" element={<AddReviewPage />} />
        <Route path="/hall-of-fame" element={<HallOfFamePage />} />
      </Routes>
    </BrowserRouter>
  )
}
