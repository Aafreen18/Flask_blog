import './App.css'; 
import Register from "./components/Register";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./components/Home"; 
import Login from './components/Login'; 
import Profile from './components/Profile';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'; 
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';  

function App() {   
  return (     
    <Router>       
      <div className="App">         
      <Routes>           
        <Route path="/" element={<Register />} />           
        <Route path="/home" element={<Home />} />           
        <Route path="/login" element={<Login />} /> 
        <Route path="/profile" element={<Profile />} />        
      </Routes>       
      </div>     
    </Router>   
  );
}  
export default App; 