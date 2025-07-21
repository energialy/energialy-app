"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import CollapsedBar from "./components/collapsedBar";
import {
  axiosGetDetailCompany,
  axiosGetGalleryCompanyById,
  axiosGetCertificationCompanyById,
} from "@/app/Func/axios";
import Chat from "@/app/components/Chat";
const Page = ({ params: { id } }) => {
  const [company, setCompany] = useState({});
  const [gallery, setGallery] = useState([]); 
  const [certification, setCertification] = useState([]);

  useEffect(() => {
    if (id) {
      axiosGetDetailCompany(id, setCompany);
      axiosGetGalleryCompanyById(id, setGallery);
      axiosGetCertificationCompanyById(id,setCertification);
    }
  }, [id]);
  if (!company) return "loading...";

  return (
    <div className="md:max-w-[70%] m-auto">
      <div className="flex justify-center mt-10">
        <div className="w-full h-1/2 object-cover overflow-hidden -z-10">
          <Image
            className="max-h-[60%]"
            src={company.bannerPicture}
            alt={"Company banner picture"}     
            fill={true}
          />
        </div>
      </div>

      <div className="mt-20">
        <CollapsedBar title="Compañía" company={company} intState={false} />
        <CollapsedBar title="Licitaciones" company={company} intState={true} />
            <CollapsedBar
              title={"Productos/Servicios"}
              gallery={gallery}
              intState={true}
              
            />
            <CollapsedBar
              title={"Certificaciones/Homologaciones"}
              certification={certification}
              intState={true}
              
            />
      </div>
    </div>
  );
};

export default Page;
