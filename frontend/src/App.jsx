import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta temporal de inicio para comprobar que el login funcionó */}
        <Route path="/" element={
          <div style={{textAlign: 'center', marginTop: '50px'}}>
            <h1>Bienvenido a Sushi App</h1>
            <p>Si ves esto y tienes un token en el LocalStorage, ¡tu login fue un éxito!</p>
          </div>
        } />
        
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;