import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Catalogue from './pages/Catalogue.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalogue" element={<Catalogue />} />
    </Routes>
  )
}

export default App
