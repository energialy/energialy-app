"use client";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Nav from "../components/Nav";
import MisCertificaciones from "./components/MisCertificaciones";
import AgregarCertificacion from "./components/AgregarCertificacion";

const optionsNav = [
  "Mis Certificaciones/Homologaciones",
  "Agregar Certificaciones/Homologaciones",
];

function pageProfileCertificationGallery() {
  const [selectedOption, setSelectedOption] = useState(0);

  const handleOptions = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="w-full h-100 bg-white flex ml-4 shadow">
      <div className="w-1/4">
        <Nav options={optionsNav} onClick={handleOptions} />
      </div>
      <div className="flex-1">
        {selectedOption === 0 && <MisCertificaciones />}
        {selectedOption === 1 && <AgregarCertificacion />}    
      </div>
    </div>
  );
}

export default pageProfileCertificationGallery;