import React from "react";
import Image from "next/image";

function GalleryCard({imageUrl, description, openModal} ) {

  const handleImageClick = () => {
    openModal(imageUrl); 
  };

    return (
      <>
      <div
        className="w-[320px] h-[200px] flex flex-col rounded-md bg-white shadow-md hover:shadow-2xl "
      >
        <div className="flex w-full h-1/2 rounded-tr-md rounded-tl-md">
          <Image
            className="rounded-tr-md rounded-tl-md w-full h-full object-cover"
            src={imageUrl}
            width={320}
            height={220}
          />
        </div>
        
        <div className=" w-full mt-2 pt-2 flex justify-center">
          <h3 className="text-lg ">
            {description}
          </h3>
        </div>
        <div className="mt-2 flex justify-center">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={handleImageClick}
          >
            Ver Producto/Servicio
          </button>
        </div>
      </div>
    </>
    );
}

export default GalleryCard