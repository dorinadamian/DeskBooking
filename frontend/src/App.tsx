import { Route, Routes } from 'react-router-dom'
import Landing  from './pages/Landing'
import Layout from './pages/Layout'
import Homepage from './components/Homepage'
import "./css/index.css";
import BookDesk from './components/BookDesk';
import Bookings from './components/Bookings';
import ChooseDesk from './components/ChooseDesk';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path='/today' element={<Homepage/>}/>
        <Route path='/bookdesk' element={<BookDesk/>}/>
        <Route path='/booking' element={<Bookings/>}/>
        <Route path='/search' element={<ChooseDesk/>}/>
      </Routes>
    </Layout>
  )
}

export default App
