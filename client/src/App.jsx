import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './Containers/Menu'
import Dashboard from './Containers/Dashboard'
import Filters from './Components/Filters'
import './App.css'
import Footer from './Components/Footer';

function App() {
  return (
    <Router>
      <div className='flex vh-100 w-100 std-bg-color'>
        <Menu/>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/filter" element={<Filters/>} />
        </Routes>
      </div>
        <Footer/>
    </Router>
  )
}

export default App
