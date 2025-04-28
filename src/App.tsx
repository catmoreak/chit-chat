import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import  Navbar  from "./components/Navbar";
import Home from "./pages/Home"; // added import

import About from "./pages/About";
import Contact from "./pages/Contact";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;


