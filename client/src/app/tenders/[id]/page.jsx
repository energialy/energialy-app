'use client'

import { ProposalModal } from "@/app/components/ProposalModal"
import { useGetTenderByIdQuery } from "@/app/redux/services/tendersApi"
import { useState, useEffect  } from "react"
import { useRouter} from "next/navigation"
import getLocalStorage from "@/app/Func/localStorage"

function TenderDetail({params}) {
  const tenderId = params.id
  const router = useRouter()
  const {data, isLoading} = useGetTenderByIdQuery(tenderId)
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  const handleOpen = () => setOpen(!open);
  
  useEffect(() => {
    const user = getLocalStorage();
    setUser(user)
  },[])

  console.log(user);
  const renderDescription = () => {
    // Check if data.description is not empty
    return data?.description ? (
      <div
        dangerouslySetInnerHTML={{
          __html: data?.description,
        }}
      />
    ) : null;
  };

  return (
    <div>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <div class="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 m-3">
          <div class="border-b-2 border-neutral-100 px-6 py-3 dark:border-neutral-600 dark:text-neutral-50">
            {data?.company?.name}
          </div>
          <div class="p-6">
            <h5 class="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
              {data?.title}
            </h5>
            <div class="mb-4 text-base text-neutral-600 dark:text-neutral-200">
              {renderDescription()}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="inline-block rounded bg-primary-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] disabled:bg-slate-400"
                onClick={handleOpen}
                 disabled={user?.company?.subscription === 'free'}
              >
                Presentar Propuesta
              </button>
              {/* <button
                type="button"
                href="#"
                class="inline-block rounded bg-secondary-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-secondary-700 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
              >
                Ver Documentos
              </button> */}
              <button
                type="button"
                href="#"
                class="inline-block rounded bg-secondary-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-secondary-800 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                onClick={() => router.back()}
              >
                Volver
              </button>
            </div>
            <div className="text-gray-600 italic my-2">
              <p>
              {user?.company?.subscription === 'free' && "Para presentar una propuesta necesitás una suscripción Base o Plus"}
              </p>
            </div>
          </div>

          <ProposalModal open={open} handleOpen={handleOpen} data={data} />
        </div>
      )}
    </div>
  );
}

export default TenderDetail