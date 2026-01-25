import React from 'react';
import Header from './components/Header/Header';
import QRCodeGenerator from './components/QRCodeGenerator/QRCodeGenerator';
import Footer from './components/Footer/Footer';
import './index.css';

function App() {
  return (
    <div className="App">
      <Header />
      <QRCodeGenerator />
      <Footer />
    </div>
  );
}

export default App;