import React from "react";
import Image from "next/image";

function CertificationCard({filesUrl, description, openModal} ) {

    const isPdf = (url) => {
        return url.toLowerCase().endsWith('.pdf');
      };
     
      const isImage = (url) => {
        return url.toLowerCase().match(/\.(jpeg|jpg|gif|png)$/) !== null;
      };

  const handleFileClick = () => {
    if (isPdf(filesUrl)) {
        window.open(filesUrl, '_blank');
      } else {
         openModal(filesUrl);
      }
  };

    return (
        <div className="w-[320px] h-[200px] flex flex-col rounded-md bg-white shadow-md hover:shadow-2xl ">
        <div className="flex w-full h-1/2 rounded-tr-md rounded-tl-md">
          {isImage(filesUrl) ? (
            <Image
              className="rounded-tr-md rounded-tl-md w-full h-full object-cover"
              src={filesUrl}
              width={320}
              height={220}
             // onClick={handleFileClick}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-tr-md rounded-tl-md">
              {isPdf(filesUrl) ? (
                <p className="text-gray-600">PDF Documento</p>
              ) : (
                <p className="text-gray-600">Archivo no soportado</p>
              )}
            </div>
          )}
        </div>
  
        <div className="w-full mt-2 pt-2 flex justify-center">
          <h3 className="text-lg ">
            {description}
          </h3>
        </div>
  
        <div className="w-full mt-2 pt-2 flex justify-center">
          {isImage(filesUrl) ? (
            <button
              onClick={handleFileClick}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-800"
            >
              Ver Certificación/Homologación
            </button>
          ) : isPdf(filesUrl) ? (
            <button
              onClick={handleFileClick}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-800"
            >
              Ver Certificación/Homologación
            </button>
           
          ) : null}
        </div>
        <></>
      </div>
    );
}

export default CertificationCard;