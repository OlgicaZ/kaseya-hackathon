
import HomePage from "./pages/HomePage/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <section className="ab-real">
      <BrowserRouter>

        <Routes>
          <Route path="/" element={<HomePage />} />
         
        </Routes>
      </BrowserRouter>
    </section>
  );
}

export default App;
