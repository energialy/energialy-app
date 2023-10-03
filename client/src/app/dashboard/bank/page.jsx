'use client'
import { BankCard } from "@/app/components/CardBankDashboard"
import { SortableTable } from "@/app/components/Table"
import {useGetFinanceProductsQuery} from "@/app/redux/services/financeProductsApi"
import {backAccountById, banckAccount, documentsAccount, financeProducts} from "@/app/dashboard/bank/data"


const testingData = [
  {
    title: "Solicitados",
    quantity: 5,
  },
  {
    title: "Aprobados",
    quantity: 15,
  },
  {
    title: "En revisión",
    quantity: 4,
  },
];


function BankDashboard() {
  //const {data: financeProducts, isLoading, error} = useGetFinanceProductsQuery()
  console.log(financeProducts)
 
  let solicitados = financeProducts.filter((item) => item.status === "sent");
  let aprobados = financeProducts.filter((item) => item.status === "accepted");
  let enRevisión = financeProducts.filter((item) => item.status === "declined");

  let cardData = [
    {
      title: "Solicitados",
      quantity: solicitados.length,
    },
    {
      title: "Aprobados",
      quantity: aprobados.length,
    },
    {
      title: "En revisión",
      quantity: enRevisión.length,
    },
  ];


  return (
    <>
      <div className="flex w-full gap-4 justify-evenly mb-4">
        {cardData.map((item) => (
          <BankCard key={item.title} data={item} />
        ))}
      </div>
      <SortableTable data={financeProducts} />
    </>
  );
}

export default BankDashboard