import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import HomePage from './pages/HomePage';
import TeacherLogin from './pages/TeacherLogin';
import AdminLogin from './pages/AdminLogin';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <div>
        <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />}/>
          <Route path='/teacherlogin' element={<TeacherLogin />}/>
          <Route path='/adminlogin' element={<AdminLogin />}/>
          <Route path='/admin/:id' element={<AdminPage />}/>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
