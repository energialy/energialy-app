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
  const [videos, setVideos] = useState([]);
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
            setProductsPicture([...productsPicture, file.secure_url]);
        } else if (imageType === "license") {
            setLicensePicture([...licensePicture, file.secure_url]);
        }

        // Guardar la URL de la imagen en la base de datos
        const companyData = {
            profilePicture: file.secure_url
        };

        await axios.post(
            `${urlProduction}/companies`,
            companyData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.log("Error al cargar la imagen:", error);
    }

    setLoading(false);
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

      setVideos([...videos, file.secure_url]);

    } catch (error) {
      console.log("Error al cargar el video:", error);     
    }

    setLoading(false);
  };

  const deleteImange = async (e) => {

  }

  // ------------------------------------------------------------------------ //

  return (
    <div className="flex flex-column gap-3 m-auto">
      <hr />
      <div className="bg-gray-200 rounded-md h-[30vh]">
            {/*PRODUCTOS Y SERVICIOS*/}
        <div className="flex justify-between flex-column">
          <h3 className="p-3 font-bold">Productos y Servicios</h3>
          <div>
            <div className="flex p-2 gap-3 justify-center">
              {productsPicture?.map((product, index) => (
                <div>
                  <button 
                    // onClick={deleteImage(product)} 
                    className="bg-black-100"
                  > X </button>
                  <Image
                    key={index}
                    alt="Product Image"
                    src={product}
                    width="200"
                    height="200"
                    objectFit="contain"
                    className="hover:cursor-pointer hover:border-2 rounded-md"
                  />
                </div>
                ))}
            </div>
            {productsPicture.length < 3 && (
              <div className="p-3">
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
                  onChange={(e) => uploadImage(e, "product")}
                />
              </div>
            )}
          </div>
        </div>
      </div>
              {/*Homologaciones y Licencias*/}     
      <div className="bg-gray-200 rounded-md h-[30vh]">
        <div className="flex justify-between flex-column">
          <h3 className="p-3 font-bold">Homologaciones / Certificaciones</h3>
          <div className="flex p-2 gap-3 justify-center">
              {licensePicture?.map((license, index) => (
                  <Image
                    key={index}
                    alt="License Image"
                    src={license}
                    width="200"
                    height="200"
                    objectFit="contain"
                    className="hover:cursor-pointer hover:border-2 rounded-md "
                  />
                ))}
            </div>
            {licensePicture.length < 3 && (
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
              onChange={(e) => uploadImage(e, "license")}
            />
          </div>
            )}
        </div>
      </div>
              {/*Videos*/}
      <div className="bg-gray-200 rounded-md h-[30vh]">
        <div className="flex justify-between flex-column">
          <h3 className="p-3 font-bold">Videos</h3>
          <div className="flex p-2 gap-3 justify-center">
              {videos?.map((video, index) => (
                  <Image
                    key={index}
                    alt="Video Image"
                    src={video}
                    width="200"
                    height="200"
                    objectFit="contain"
                    className="hover:cursor-pointer hover:border-2 rounded-md "
                  />
                ))}
            </div>

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
              onChange={(e) => uploadVideo(e)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoBar;
