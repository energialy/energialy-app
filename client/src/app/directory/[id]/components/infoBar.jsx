import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { urlProduction } from "@/app/data/dataGeneric";

function InfoBar({ company }) {

  useEffect(() => {
    // // Obtener imágenes y videos ya cargados del servidor
    // axios
    //   .get(`${urlProduction}/companies/${company.id}`)
    //   .then((res) => {
    //     const { productsPicture, licensePicture, videos } = res.data;
    //     setProductsPicture(productsPicture || []);
    //     setLicensePicture(licensePicture || []);
    //     setVideos(videos || []);
    //   })
    //   .catch((err) => {
    //     console.log("Error al obtener imágenes y videos:", err);
    //   });
  }, [company.id]);

   const [productsPicture, setProductsPicture] = useState([]);
   const [licensePicture, setLicensePicture] = useState([]);
   const [videos, setVideos] = useState(false);
   const [loading, setLoading] = useState("");
 
   const uploadImage = async (e, imageType) => {
     const files = e.target.files;
     const data = new FormData();
     data.append("file", files[0]);
     data.append("upload_preset", "energialy_users");
     setLoading(true);
 
     try {
       const res = await axios.post(
         "https://api.cloudinary.com/v1_1/dbraa6jpj/image/upload",
         data  
       );
       const file = res.data;
       console.log("Respuesta de cloudinary:", res);
 
       if (imageType === "product") {
        console.log('es product');
        setProductsPicture( file.secure_url);
       } else if (imageType === "license") {
        console.log('es license');
        setLicensePicture( file.secure_url);
       }

       setLoading(false);
     } catch (error) {
       console.log("Error al cargar la imagen:", error);
       setLoading(false);
     }
   };
 
   const uploadVideo = async (e, imageType) => {
     const files = e.target.files;
     const data = new FormData();
     data.append("file", files[0]);
     data.append("upload_preset", "energialy_users");
     setLoading(true);
 
     try {
       const res = await axios.post(
         "https://api.cloudinary.com/v1_1/dbraa6jpj/image/upload",
         data  
       );
       const file = res.data;
       console.log("Respuesta de cloudinary:", res);
 
        setVideos(file.secure_url);
 
       setLoading(false);
     } catch (error) {
       console.log("Error al cargar el video:", error);
       setLoading(false);
     }
   };

   const handleSubmit = async (e) => {
    e.preventDefault();

    const companyData = {
      profilePicture,
      licensePicture,
      videos
    };

    console.log("Datos enviados en companyData:", companyData);

    try {
      const response = await axios.post(
        `${urlProduction}/companies`,
        companyData,
        {
          headers: {
            "Content-Type": "application/json", // Cambiado a JSON
          },
        }
      );
      console.log("Respuesta del servidor:", response);
      displaySuccessMessage("Empresa registrada con éxito");
      setTimeout(() => {
        router.push("/directory");
      }, 2000);
    } catch (error) {
      console.error("Error al registrar la empresa:", error);
      console.log("Datos enviados en companyData:", companyData);
      displayFailedMessage(error.response.data.error);
    }
  };

   // ------------------------------------------------------------------------ //

  return (
    <div className="flex flex-column gap-3 m-auto">
      <hr />
      <div className="bg-gray-100 rounded-md h-[18vh]">
        <div className="flex justify-between flex-column">
          <h3 className="p-3 font-bold">Productos y Servicios</h3>
          {Array.isArray(productsPicture) && productsPicture.map(product => (
          <div key={product}>
            <Image
              alt="Product Image"
              src={product}
              width="15%"
              height="15%"
              objectFit="contain"
            />
          </div>
        ))}
          {productsPicture.length < 3 && <div className="p-3"> 
            <input
            id="services-image-upload"
            type="file"
            accept="image/*"
            className="
              file:appearance-none 
              file:border-none
              file:bg-gradient-to-b file:from-[rgb(25,22,84)] file:to-[rgba(25,22,84,0.7)]
              file:px-3 file:py-1 file:m-2
              file:text-white
              file:cursor-pointer
              file:rounded-lg 
              file:shadow-sm
              file:shadow-grey

            "
            onChange={e => uploadImage(e, 'product')}
          />
          </div>}
        </div>
      </div>
      <div className="bg-gray-100 rounded-md h-[18vh]">
        <div className="flex justify-between flex-column">
          <h3 className="p-3 font-bold">Homologaciones / Certificaciones</h3>
          <div className="p-3">
            <input
            id="certifications-image-upload"
            type="file"
            accept="image/*"
            className="
              file:appearance-none 
              file:border-none
              file:bg-gradient-to-b file:from-[rgb(25,22,84)] file:to-[rgba(25,22,84,0.7)]
              file:px-3 file:py-1 file:m-2
              file:text-white
              file:cursor-pointer
              file:rounded-lg 
              file:shadow-sm
              file:shadow-grey

            "
            onChange={e => uploadImage(e, 'license')}
          />
          </div>
        </div>
      </div>
      <div className="bg-gray-100 rounded-md h-[18vh]">
        <div className="flex justify-between flex-column">
          <h3 className="p-3 font-bold">Videos</h3>
          <div className="p-3">
            <input
            id="videos-image-upload"
            type="file"
            accept="image/*"
            className="
              file:appearance-none 
              file:border-none
              file:bg-gradient-to-b file:from-[rgb(25,22,84)] file:to-[rgba(25,22,84,0.7)]
              file:px-3 file:py-1 file:m-2
              file:text-white
              file:cursor-pointer
              file:rounded-lg 
              file:shadow-sm
              file:shadow-grey

            "
            onChange={e  => uploadVideo(e)}
          />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoBar;
