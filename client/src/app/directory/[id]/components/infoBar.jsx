import Image from "next/image";
import plusIcon from "../../../assets/plus-circle.png";
import { useState } from "react";

function InfoBar({ company }) {
  const [companyInfo, setCompanyInfo] = useState({
    Services: "",
    Certificaciones: "",
    Videos: "",
  });

  return (
    <div className="flex flex-column gap-3 m-auto">
      <hr />
      <div className="bg-gray-100 rounded-md h-[18vh]">
        <div className="flex justify-between">
          <h3 className="p-3 font-bold">Productos y Servicios</h3>
          <button className="mx-5" onClick={handleProductos}>
            <Image src={plusIcon} width={25} height={25} />
          </button>
        </div>
      </div>
      <div className="bg-gray-100 rounded-md h-[18vh]">
        <div className="flex justify-between">
          <h3 className="p-3 font-bold">Homologaciones / Certificaciones</h3>
          <button className="mx-5" onClick={handleCertificaciones}>
            <Image src={plusIcon} width={25} height={25} />
          </button>
        </div>
      </div>
      <div className="bg-gray-100 rounded-md h-[18vh]">
        <div className="flex justify-between">
          <h3 className="p-3 font-bold">Videos</h3>
          <button className="mx-5" onClick={handleVideos}>
            <Image src={plusIcon} width={25} height={25} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default InfoBar;
