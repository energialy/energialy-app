'use client';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { displaySuccessMessage, displayFailedMessage } from '@/app/components/Toastify';
import axios from 'axios';
import { urlProduction } from '@/app/data/dataGeneric';

function EmailModal({ open, handleOpen, id, company }) {
  const [emails, setEmails] = useState([]);
  const [email, setEmail] = useState('');

  const endpoint = 'inviteCompanies';
  console.log('companyID', id);
  const sendObj = {
    companyId: id,
    emails: emails,
  };

  const handleStatus = async () => {
    if (emails.length <= 0) {
      displayFailedMessage('Agregá al menos un email para enviar la invitación');
    } else {
      try {
        const response = await sendInvitations();
        displaySuccessMessage('Invitaciones enviadas con exito');
        setTimeout(() => {
          handleOpen();
        }, 3000);
      } catch (error) {
        displayFailedMessage('Error al invitar empresas');
      }
    }
  };

  const hanbleEmail = (e) => {
    setEmail(e.target.value);
  };

  const saveEmail = (e) => {
    e.preventDefault();
    setEmails([...emails, email]);
    e.target.reset();
    setEmail('');
  };

  const removeEmail = (index) => {
    const updatedEmails = [...emails];
    updatedEmails.splice(index, 1);
    setEmails(updatedEmails);
  };

  const sendInvitations = async () => {
    try {
      const response = axios.post(`${urlProduction}/${endpoint}`, sendObj);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded flex flex-col justify-center items-center gap-5 h-screem">
            <h4 className="">
              Invita a otras empresas a formar parte de Energialy! <span className="font-bold">{company}</span>
            </h4>
            <div className="w-full">
              <form onSubmit={saveEmail} className="flex gap-2 w-full">
                <input
                  className="p-2 rounded-sm w-full border-1 border-gray-100"
                  type="text"
                  placeholder="Correo electrónico"
                  onChange={hanbleEmail}
                />
                <button className="rounded-md bg-secondary-400 font-semibold text-white px-4 py-2" type="submit">
                  Agregar
                </button>
              </form>
            </div>
            {emails.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {emails.map((email, index) => (
                  <div key={index} className="bg-gray-400 text-gray-50 flex gap-2  text-xs px-2 py-2 rounded-full justify-between items-center">
                    <span className="font-semibold">{email}</span>
                    <button onClick={() => removeEmail(index)} className="bg-gray-700 w-5 h-5 rounded-full">
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <button className="bg-primary-500 py-2 px-4 rounded-md text-white font-bold m-5" onClick={handleStatus}>
                Enviar
              </button>
              <button className="bg-secondary-500 py-2 px-4 rounded-md text-white font-bold m-5" onClick={handleOpen}>
                Cerrar
              </button>
            </div>
            <ToastContainer style={{ marginTop: '100px' }} />
          </div>
        </div>
      )}
    </>
  );
}

export default EmailModal;
