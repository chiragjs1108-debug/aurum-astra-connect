import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Catalogue from './pages/Catalogue.jsx'
import SpaRituals from './pages/SpaRituals.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalogue" element={<Catalogue />} />
      <Route path="/spa" element={<SpaRituals />} />
    </Routes>
  )
}

export default App
