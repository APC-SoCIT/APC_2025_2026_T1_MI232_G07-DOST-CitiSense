import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DOSTCitiSenseLogin from "../Authentication/Login";
import SideNav from "../Components/dashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DOSTCitiSenseLogin />} />
        <Route path="/dashboard_component" element={<SideNav />} />
      </Routes>
    </Router>
  );
}
