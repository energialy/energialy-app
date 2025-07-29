'use client'
import { useGetTenderByIdQuery } from "@/app/redux/services/tendersApi";
import { getLocalStorage } from "@/app/Func/localStorage";
import { useRouter } from "next/navigation";
import { handleChangeStatus, bankAccountOpen } from "@/app/Func/controllers";
import { useState, useEffect } from "react";

function Page({params}) {
  console.log("y que es esto?",params)
  const { data:tender, isLoading, isError } = useGetTenderByIdQuery(params.id);
  console.log("Consulta la propuesta por el ID",tender)

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isBankAccountOpen, setIsBankAccountOpen] = useState(false);
  const userData = getLocalStorage();

  const endpoint = 'proposals'
  const router = useRouter()
  
  useEffect(() => {
    const checkBankAccount = async () => {
      if (userData?.company?.id) {
        const result = await bankAccountOpen(userData.company.id);
        setIsBankAccountOpen(result);
      }
    };
    checkBankAccount();
  }, [userData]);

  const backPage = () => {
    router.back()
  }

  const handleAcceptProposal = (proposal) => {
    setSelectedProposal(proposal);
    
    if (!isBankAccountOpen) {
      setShowWarningModal(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  const confirmAcceptProposal = async () => {
    if (selectedProposal) {
      await handleChangeStatus(
        selectedProposal.id,
        { status: "accepted" },
        endpoint
      );
      setShowConfirmModal(false);
      setSelectedProposal(null);
      // Recargar la página o actualizar los datos
      window.location.reload();
    }
  };

  const handleWarningContinue = () => {
    setShowWarningModal(false);
    router.push('/dashboard/finanzas/aperturaCuenta');
  };

  const handleWarningCancel = () => {
    setShowWarningModal(false);
    setSelectedProposal(null);
  };
  return (
    <>
      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <div className="bg-white m-1 p-3 rounded-md">
          <p>
            Licitacion: <span className="font-bold">{tender.title}</span>
          </p>
          <p>
            Vencimiento:{" "}
            <span className="font-bold">{tender.validityDate}</span>
          </p>
          <p>
            Presupuesto: <span className="font-bold">U$S: {tender.budget}</span>
          </p>
          <h4 className="text-center mb-3">Propuestas Recibidas</h4>
          <div>
            {tender.proposals?.map((proposal) => (
              <div key={proposal.id} className="p-4 border rounded-md">
                <div>
                  <p>
                    Empresa Oferente:{" "}
                    <span className="font-bold">{proposal.Company.name}</span>
                  </p>
                  <p>
                    Propuesta en U$S:{" "}
                    <span className="font-bold"> {proposal.totalAmount}</span>
                  </p>
                  <p>
                    Duración del Servicio:{" "}
                    <span className="font-bold">
                      {proposal.projectDuration}
                    </span>
                  </p>
                  <p>
                    Estado:{" "}
                    <span className="font-bold">
                      {proposal.status === "sent"
                        ? "Recibida"
                        : proposal.status === "accepted"
                        ? "Aceptada"
                        : "Declinada"}
                    </span>
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    className={`bg-primary-600 rounded-md text-white font-semibold px-3 py-2 disabled: ${
                      proposal.status === "accepted"
                        ? "pointer-events-none opacity-50"
                        : null
                    }`}
                    onClick={() => handleAcceptProposal(proposal)}
                  >
                    Aceptar
                  </button>
                  <button
                    className={`bg-secondary-700 rounded-md text-white font-semibold px-3 py-2 disabled: ${
                      proposal.status === "declined"
                        ? "pointer-events-none opacity-50"
                        : null
                    }`}
                    onClick={() =>
                      handleChangeStatus(
                        proposal.id,
                        { status: "declined" },
                        endpoint
                      )
                    }
                  >
                    Declinar
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            className="bg-primary-600 text-white font-semibold rounded-md p-2 mt-4"
            onClick={backPage}
          >
            Volver
          </button>
        </div>
      )}

      {/* Modal de Confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 border border-red-300">
            <div className="text-center">
              <h3 className="text-lg font-medium text-red-600 mb-4">
                Estas a punto de Aceptar una Propuesta.
              </h3>
              <div className="mt-4">
                <button
                  onClick={confirmAcceptProposal}
                  className="w-full bg-white border-2 border-red-500 text-red-500 px-6 py-2 rounded text-sm font-medium hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  CONTINUAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Advertencia - No tiene cuenta bancaria */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <div className="mb-4">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100">
                  <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes una cuenta abierta
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Este popup aparecería luego de clickear en ACEPTAR.
                <br /><br />
                Dejar el mismo símbolo de warning.
                <br /><br />
                Vas a Aceptar una Propuesta.
                <br /><br />
                Eliminar este texto. Solo quedarían las 2 opciones de abajo.
                <br />
                VOLVER y CONTINUAR
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleWarningCancel}
                  className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 focus:outline-none"
                >
                  VOLVER
                </button>
                <button
                  onClick={handleWarningContinue}
                  className="flex-1 bg-white border-2 border-red-500 text-red-500 px-4 py-2 rounded text-sm font-medium hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  CONTINUAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Page