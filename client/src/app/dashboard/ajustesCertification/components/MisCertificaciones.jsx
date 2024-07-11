"use client"
import React, { useState, useEffect} from "react";
import "react-toastify/dist/ReactToastify.css";

import getLocalStorage from "@/app/Func/localStorage";
import { getCompanyId } from "@/app/Func/sessionStorage";

import FilesCardContainer from './FilesCardContainer';
import ModalImage from '@/app/components/Modals/imageModal';

import { axiosGetCertificationCompanyById,
    axiosDeleteCertificationGalleryById,
    axiosEditCertificationGalleryById,
 } from "@/app/Func/axios";

 export default function MisCertificaciones() {

const [user, setUser] = useState(null);
const [certification, setCertification] = useState();
const [loading, setLoading] = useState(true);
const [modalOpen, setModalOpen] = useState(false);
const [selectedFile, setSelectedFile] = useState(null);

useEffect(() => {
    const user = getLocalStorage();
    setUser(user);
  }, []);

 const companyId = getCompanyId();

useEffect(() => {
    if(companyId) {
        axiosGetCertificationCompanyById(companyId, (data) => {
            setCertification(data);
            setLoading(false);
        });
    }
}), [companyId];

if (loading) {
    return <div>Cargando Certificaciones/Homologaciones...</div>;
  }

// Función para abrir el modal y establecer la imagen seleccionada
const openModal = (fileUrl) => {
  console.log("openMOdal fileURL", fileUrl);
    setSelectedFile(fileUrl);
    setModalOpen(true);
  };
  
  // Función para cerrar el modal
  const closeModal = () => {
    setSelectedFile(null);
    setModalOpen(false);
  };
  //modal

//Funcion para eliminar certificacion
const handleDelete = async (id) => {
    await axiosDeleteCertificationGalleryById(id, setCertification);
};

//Funcion para guardar la descripcion de una Certificacion
const handleSaveDescription = async (id, newDescription) => {
    try {
        await axiosEditCertificationGalleryById(id, newDescription);
        //Actualiza la galeria localmente
        setCertification((prevCertification) =>
        prevCertification.map((image) =>
        image.id === id ? { ...image, description:newDescription } : image
    )
    );
    } catch (error) {
        console.error("Error al actualizar la descripción: ", error);
        // Manejar error de actualización aquí
      }
};

if ( certification == null) {
    return (
        <div className="certification flex flex-col bg-white m-4 rounded-md p-3 justify-between">
        <div className="text-center text-gray-500">Todavía no agregaste ninguna Certificaciones/Homologaciones!</div>
      </div>
    );
}

return (
    
    <div className="certification flex flex-col bg-white m-4 rounded-md p-3 justify-between">
  {certification.length > 0 ? (
    <div className="mt-8 mb-0">
      <div className="flex flex-wrap justify-center">
        <FilesCardContainer
         certification={certification}
         openModal={openModal} 
         onDelete={handleDelete}
         onSaveDescription={handleSaveDescription}
          />
      </div>
    </div>
  ) : (
    <div>Cargando Certificaciones/Homologaciones...</div>
  )}
  {modalOpen && selectedFile && ( 
        <ModalImage imageUrl={selectedFile} onClose={closeModal} /> 
      )}
</div>
  );


 }