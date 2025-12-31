import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PasteProvider } from "./Context/PasteContext";
import Header from "./Components/Header/Header";
import HomePage from "./Pages/Home/HomePage";
import PasteView from "./Pages/Pastes/PasteView";
import "./App.css";

function App() {
  return (
    <PasteProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/p/:id" element={<PasteView />} />
        </Routes>
      </BrowserRouter>
    </PasteProvider>
  );
}

export default App;
