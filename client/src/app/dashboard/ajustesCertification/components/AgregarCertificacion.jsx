"use client";
import React, { useState, useEffect, useRef  } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  displayFailedMessage,
  displaySuccessMessage,
} from "../../../components/Toastify";

import getLocalStorage from "@/app/Func/localStorage";
import { getCompanyId } from "@/app/Func/sessionStorage";

import { 
    axiosPostCertificationGallery,
    axiosGetCertificationCount,
} from "@/app/Func/axios";

export default function AgregarCertificacion() {
    const [user, setUser] = useState(null);
    const [isEdited, setIsEdited] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [loading, setLoading] = useState(false);
    const [certificationFile, setCertificationFile] = useState(null);
    const [certificationDescription, setCertificationDescription] = useState("");
    const [certificationError, setCertificationError] = useState("");
    const [fileCount, setFileCount] = useState(0);

    useEffect(() => {
        const userData = getLocalStorage();
        if (userData) {
          setUser(userData);
        }
      }, []);

      const companyId = getCompanyId();

    //Obtener el numero de certificaciones existentes al montar el componente
    useEffect(() => {
        const fetchCertificationCount = async () => {
            try {
                const count = await axiosGetCertificationCount(companyId);
                setFileCount(count);
            } catch (error) {
                console.error("Error al obtener el número de certificaciones/homologaciones: ", error);
            }
        };
    
        fetchCertificationCount();
    }, [companyId]);

    const handleCertificationUpload = async (e) => {
        e.preventDefault();

    if (!certificationFile) {
        setCertificationError("debes seleccionar un archivo.");
        return;
    }
     if(!certificationDescription) {
        setCertificationError("Debes proporcionar una descripcion.");
        return;
    }

    setLoading(true);
    setCertificationError("");

    try {
        await axiosPostCertificationGallery(certificationDescription, companyId, [certificationFile]);
        displaySuccessMessage("Archivo cargado con éxito");

      // Actualizar el contador de imágenes
      setFileCount(prevCount => prevCount + 1);

      //Resetear los campos
      setCertificationFile(null);
      setCertificationDescription("");
      setIsEdited(true);

    } catch (error) {
        console.error("Error al cargar certificaciones/homologaciones: ", error);
      setCertificationError("Error al cargar certificaciones/homologaciones");
      displayFailedMessage("Error al cargar certificaciones/homologaciones");
    } finally {
        setLoading(false);
    }
};

const handleCancelUpload = () => {
    setCertificationFile(null);
    setCertificationDescription("");
    setCertificationError("");
};
return (
    <div className="p-5 m-2">
      <div>
        <div className="mb-3">
          <label
            htmlFor="certificateFile"
            className="block font-bold mb-2 bg-[#fcfcfc] p-2 border-l-4 border-primary-500"
          >
            Certificación/Homologación
          </label>
          <input
            type="file"
            id="certificateFile"
            accept="image/*,application/pdf"
            onChange={(e) => setCertificationFile(e.target.files[0])}
            className="w-full border rounded px-2 py-1"
            disabled={fileCount >= 4}
          />
          <label
            htmlFor="certificationDescription"
            className="block font-bold mb-2 bg-[#fcfcfc] p-2 border-l-4 border-primary-500 mt-2"
          >
            Descripción de la Certificación/Homologación
          </label>
          <input
            type="text"
            id="certificationDescription"
            value={certificationDescription}
            onChange={(e) => setCertificationDescription(e.target.value)}
            className="w-full border rounded px-2 py-1"
            disabled={fileCount >= 4}
          />
          {certificationError && (
            <p className="text-red-500 text-sm">{certificationError}</p>
          )}
        </div>

        {loading ? (
          <h3>Cargando Certificación/Homologación...</h3>
        ) : (
          <>
          {certificationFile && (
              <div className="border shadow-lg p-4 mb-4">
                  <div className="flex justify-center mb-4">
                      {certificationFile && certificationFile.type.startsWith('image/') && (
                          <img
                              src={URL.createObjectURL(certificationFile)}
                              style={{ width: "300px" }}
                              alt="Archivo de certificación/homologación"
                          />
                      )}
                      {certificationFile && certificationFile.type === 'application/pdf' && (
                          <embed
                              src={URL.createObjectURL(certificationFile)}
                              type="application/pdf"
                              style={{ width: "300px", height: "400px" }}
                          />
                      )}
                  </div>
                  <div className="text-center">
                      <p>{certificationDescription}</p>
                  </div>
              </div>
          )}
      </>
        )}

        {fileCount >= 4 && (
          <p className="text-red-500 text-[16px] font-bold mb-3">
            Has alcanzado el límite de 4 archivos en Certificaciones/Homologaciones.
          </p>
        )}

        <div className="p-4 flex justify-center">
          <button
            onClick={handleCertificationUpload}
            className="px-4 py-2 text-white bg-[#191654] rounded hover:bg-secondary-600 transition duration-300"
            disabled={fileCount >= 4}
          >
            Cargar archivo
          </button>
          {certificationFile && (
            <button
              onClick={handleCancelUpload}
              className="ml-4 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition duration-300"
            >
              Cancelar Carga
            </button>
          )}
        </div>
      </div>

      {submitError && (
        <div className="flex justify-center text-danger mt-2 mb-2">
          {submitError}
        </div>
      )}
      <ToastContainer style={{ marginTop: "100px" }} />
    </div>
  );
}