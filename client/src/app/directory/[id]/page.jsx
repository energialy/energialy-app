'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import { urlProduction } from "@/app/data/dataGeneric";

import CollapsedBar from "./components/collapsedBar";
import { setAllCompanies } from "@/app/redux/features/companieSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function page({params}) {
  const dispatch = useDispatch()
  const companies = useSelector((state) => state.companies)
  const [company, setCompany] = useState({})
  const id = params.id

  
  useEffect(() => {
    fetch(`${urlProduction}/companies/${id}`)
      .then((response) => response.json())
      .then((data) => setCompany(data))
      .catch((error) => console.error("Error fetching data:", error));
    
  }, []);
    
  return (
    <>
      {!company ? (
        "loading..."
      ) : (
        <div className="md:max-w-[70%] m-auto">
          <div className="flex justify-center mt-10">
            <div className="w-full h-1/2 object-cover overflow-hidden -z-10">
              <Image
                className="max-h-[60%]"
                src={company.bannerPicture}
                alt="banner img company"
                fill={true}
                priority
              />
            </div>
          </div>

          <div className="mt-20">
            <CollapsedBar
              title={"Compañía"}
              company={company}
              intState={false}
            />
            <CollapsedBar
              title={"Licitaciones"}
              company={company}
              intState={true}
            />
          </div>
          <button>POP - UP</button>
        </div>
      )}
    </>
  );
}

export default page