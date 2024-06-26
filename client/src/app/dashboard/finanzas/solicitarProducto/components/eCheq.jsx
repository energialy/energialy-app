"use client";
import React, { useState } from "react";
import axios from "axios";
import {
  displayFailedMessage,
  displaySuccessMessage,
} from "@/app/components/Toastify";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { useGetCompaniesByIdQuery } from "@/app/redux/services/companiesApi";
import getLocalStorage from "@/app/Func/localStorage";
import { urlProduction } from "@/app/data/dataGeneric";

export default function ECheq() {
  // Estados Locales
  const { company } = getLocalStorage();
  const [error, setError] = useState();
  const [eCheqData, setECheqData] = useState({
    businessName: "",
    docType: "",
    dni: "",
    beneficiaryName: "",
    beneficiaryDocType: "",
    beneficiaryDni: "",
    paymentDate: "",
    amount: "",
    modo: "Cruzado",
    cheqType: "",
    caracter: "A la Orden",
  });
  const { data: userCompany, isLoading } = useGetCompaniesByIdQuery(company.id);
  const bankAccountId = userCompany?.bankAccount?.id;

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setECheqData({ ...eCheqData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasEmptyFields = Object.values(eCheqData).some(
      (value) => value === ""
    );
    if (hasEmptyFields) {
      setError("Completa todos los campos");
      return;
    } else {
      setError("");
    }

    const accountData = {
      productName: "E-Cheqs",
      bankAccountId,
      additionalData: eCheqData,
    };

    console.log("Información enviada:", accountData);

    try {
      const res = await axios.post(
        `${urlProduction}/FinanceProducts`,
        accountData
      );
      console.log("resData server:", res);
      displaySuccessMessage("Datos enviados con éxito");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.log("errorData:", error);
      displayFailedMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <h3 className="text-center p-4 border-b-2 border-gray-300 font-bold">E-Cheq</h3>
      <div>
        <label className="block mb-2 bg-[#f7f7f7] py-4 pl-7 mt-4 font-bold border-l-4 border-primary-500 text-left">
          Emisor
        </label>
        <div className="mt-4 text-left">
          <input
            type="text"
            id="businessName"
            value={eCheqData.businessName}
            name="businessName"
            placeholder="Nombre/Razón Social"
            onChange={handleChange}
            className="w-full px-3 py-3 font-bold text-lg border"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 text-left">
          <div className="mt-4 text-left">
            <select
              id="docType"
              value={eCheqData.docType}
              name="docType"
              onChange={handleChange}
              className="w-full px-3 py-3 font-bold text-lg border"
            >
              <option value="">Tipo de Documento</option>
              <option value="DNI">DNI</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </div>
          <div className="mt-4 text-left">
            <input
              type="text"
              id="dni"
              value={eCheqData.dni}
              name="dni"
              placeholder="Numero"
              onChange={handleChange}
              className="w-full px-3 py-3 font-bold text-lg border"
            />
          </div>
        </div>
        <label className="block mb-2 bg-[#f7f7f7] py-4 pl-7 mt-4 font-bold border-l-4 border-primary-500 text-left">
          Beneficiario del E-cheq
        </label>
        <div className="mt-4 text-left">
          <input
            type="text"
            id="beneficiaryName"
            value={eCheqData.beneficiaryName}
            name="beneficiaryName"
            placeholder="Nombre del beneficiario"
            onChange={handleChange}
            className="w-full px-3 py-3 font-bold text-lg border"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 text-left">
          <div className="mt-4 text-left">
            <select
              id="beneficiaryDocType"
              value={eCheqData.beneficiaryDocType}
              name="beneficiaryDocType"
              onChange={handleChange}
              className="w-full px-3 py-3 font-bold text-lg border"
            >
              <option value="">Tipo de Documento</option>
              <option value="DNI">DNI</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </div>
          <div className="mt-4 text-left">
            <input
              type="text"
              id="beneficiaryDni"
              value={eCheqData.beneficiaryDni}
              name="beneficiaryDni"
              placeholder="Numero"
              onChange={handleChange}
              className="w-full px-3 py-3 font-bold text-lg border"
            />
          </div>
        </div>
        <label className="block mb-2 bg-[#f7f7f7] py-4 pl-7 mt-4 font-bold border-l-4 border-primary-500 text-left">
          E-cheq
        </label>
        <div className="grid grid-cols-2 gap-2 text-left">
          <div className="mt-4">
            <label
              htmlFor="paymentDate"
              className="font-bold text-lg mb-1 block"
            >
              Fecha de Pago
            </label>
            <input
              type="date"
              id="paymentDate"
              value={eCheqData.paymentDate}
              name="paymentDate"
              onChange={handleChange}
              className="w-full px-3 py-3  text-lg border"
            />
          </div>
          <div className="mt-5 pt-2">
            <input
              type="text"
              id="amount"
              value={eCheqData.amount}
              name="amount"
              placeholder="Importe Total"
              onChange={handleChange}
              className="w-full px-3 py-3 font-bold text-lg border"
            />
          </div>

          <div className="mt-4">
            <input
              type="text"
              id="modo"
              value="Modo: Cruzado"
              name="modo"
              placeholder="Modo"
              onChange={handleChange}
              className="w-full px-3 py-3 font-bold text-lg border"
              readOnly
            />
          </div>
          <div className="mt-4">
            <select
              id="cheqType"
              value={eCheqData.cheqType}
              name="cheqType"
              onChange={handleChange}
              className="w-full px-3 py-3 font-bold text-lg border"
            >
              <option value="">Tipo de Cheque</option>
              <option value="normal">Normal</option>
              <option value="diferido">Diferido</option>
            </select>
          </div>
          <div className="mt-4">
            <input
              type="text"
              id="caracter"
              value="Caracter: a la Orden"
              name="caracter"
              placeholder="Caracter"
              onChange={handleChange}
              className="w-full px-3 py-3 font-bold text-lg border"
              readOnly
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="px-10 py-2 m-4 font-bold text-white bg-[#191654] rounded hover:bg-secondary-600 transition duration-300"
            type="button"
            onClick={handleSubmit} // Al hacer clic en este botón, se ejecutará handleSubmit
          >
            Solicitar
          </button>
        </div>
        {error && (
          <div className="flex justify-center text-danger mt-2 mb-2">
            {error}
          </div>
        )}
      </div>
      <ToastContainer style={{ marginTop: "100px" }} />
    </div>
  );
}
