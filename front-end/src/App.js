import "./App.css";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import Taulukko from "./pages/Tilastot";
import Joukkueet from "./pages/Joukkueet";
import Kisa from "./pages/Kisa";
import Login from "./pages/Login";
import Home from "./pages/Home";
import UserCreation from "./pages/UserCreation";
import Aika from "./pages/Aika";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header />
      </header>
      <main className="App-main">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Taulukko />} />
            <Route path="/login" element={<Login />} />
            <Route path="/käyttäjän-luoti" element={<UserCreation />} />
            <Route path="/ryhmät" element={<Joukkueet />} />
            <Route path="/kisan-luonti" element={<Kisa />} />
            <Route path="/ajan-kirjaus" element={<Aika />} />
          </Routes>
        </BrowserRouter>
      </main>
      <footer className="App-footer">
        <Footer />
      </footer>
    </div>
  );
}

export default App;
