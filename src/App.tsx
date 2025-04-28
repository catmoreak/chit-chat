import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import  Navbar  from "./components/Navbar";
import Home from "./pages/Home"; // added import
// import About from "./pages/About"; // added import

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> 
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </Router>
  );
}

export default App;


