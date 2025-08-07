"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Popup from "../directory/[id]/components/popup";
import Messages from "./Messages";
import getLocalStorage from "@/app/Func/localStorage";

import {
  axiosGetAllMessages,
  axiosGetAllUsers,
  axiosPostMessage,
} from "@/app/Func/axios";

import {
  getCompanyId,
  getCompanyName,
  getUserId,
} from "@/app/Func/sessionStorage";

import io from "socket.io-client";
const socketIo = io("http://localhost:3001");

const Chat = ({ id, company }) => {
  //id: Compañía seleccionada en el perfil
  const [allUsers, setAllUsers] = useState([]); //Carga todos los usuarios
  const [allMessages, setAllMessages] = useState([]); //Mantiene todos los mensajes
  const [messageText, setMessageText] = useState(""); //Texto del mensaje a enviar
  const [showPopup, setShowPopup] = useState(false); //Muestra/esconde caja chat
  const [hasPermission, setHasPermission] = useState(true); //Verifica permisos de comunicación

  //FILTRADO EN CHAT
  const [buttonChat, setButtonChat] = useState([]); //Botones para seleccionar empresas en el chat
  const [filteredMessages, setFilteredMessages] = useState([]); //Mensajes filtrados en chat
  const [selectedCompany, setSelectedCompany] = useState(null); //Compañía seleccionada para mostrar en chat

  const [receiver, setReceiver] = useState(null); //Quien recibe
  const [sender, setSender] = useState(null); //Quien envia

  //Rescato del sessionStorage - son los datos del sender
  const companyId = getCompanyId(); //Id de compañía logueada -
  const userId = getUserId(); //Id de usuario logueado
  const myName = getCompanyName(); //Nombre de la compañía logueada->sirve para filtro de chat
  let usuariosUnicos = new Set();

  // Función para verificar permisos de comunicación
  const checkCommunicationPermission = () => {
    const userData = getLocalStorage();
    if (!userData) return false;
    
    // Si es company_collaborator, verificar que tenga permiso COMUNICACIONES
    if (userData.role === 'company_collaborator') {
      return userData.permissions && userData.permissions.includes('COMUNICACIONES');
    }
    
    // Otros roles (admin, superAdmin, company_owner, bank) tienen acceso por defecto
    return true;
  };

  const convertirFecha = (fechaISO) => {
    let fecha = new Date(fechaISO);

    // Extraer componentes de la fecha
    let dia = fecha.getUTCDate();
    let mes = fecha.getUTCMonth() + 1; // Los meses empiezan desde 0
    let año = fecha.getUTCFullYear();

    // Convertir la hora a la zona horaria deseada (ejemplo: UTC-3)
    let hora = fecha.getUTCHours() - 3;
    let minutos = fecha.getUTCMinutes();

    // Asegurarse de que la hora es válida después de la conversión
    if (hora < 0) {
      hora += 24;
      dia -= 1;
    }

    // Formatear la fecha y hora en el nuevo formato
    let fechaString = `${dia}-${mes}-${año}-${hora}:${minutos}`;
    return (fechaString); // Ejemplo de salida: "26-6-2024-19:38"
  };
  //Envio de usuarios a server para su asignacion
  //Se envia el id de la compañía
  useEffect(() => {
    // Verificar permisos de comunicación al cargar el componente
    setHasPermission(checkCommunicationPermission());
    
    // Emitir evento de autenticación para guardar el socket
    socketIo.emit("authenticate", { companyId });

    // Escuchar eventos para saber si se conecto
    socketIo.on("connect", () => {
      console.log("Connected to server");
    });
  }, []);

  //Carga usuarios y mensajes al comienzo, y detalles del primer destinatario
  useEffect(() => {
    axiosGetAllUsers(setAllUsers);
    axiosGetAllMessages(setAllMessages);
    !company && setShowPopup(true);
  }, []);

  // Debug: Verificar estructura de datos
  useEffect(() => {
    console.log('All Users:', allUsers);
    console.log('Button Chat:', buttonChat);
    if (allUsers.length > 0) {
      console.log('Sample user structure:', allUsers[0]);
      if (allUsers[0]?.company) {
        console.log('Sample company structure:', allUsers[0].company);
      }
    }
  }, [allUsers, buttonChat]);

  //Carga sender y receiver
  useEffect(() => {
    if (allUsers.length > 0 && id) {
      const foundReceiver = allUsers.find((user) => user.company.id === id);
      const foundSender = allUsers.find(
        (user) => user.company.id === companyId
      );
      setReceiver(foundReceiver);
      setSender(foundSender);
      //Seteo inicial de compañía seleccionada para filtrar en chat
      if (foundReceiver) {
        setSelectedCompany(foundReceiver.company.name);
      }
    } else if (allUsers.length > 0 && !id) {
      const foundSender = allUsers.find(
        (user) => user.company.id === companyId
      );
      setSender(foundSender);
    }
  }, [allUsers, id, companyId]);

  //Filtra chat por compañía seleccionada
  useEffect(() => {
    if (selectedCompany) {
      if (selectedCompany.slice(-2) === "🔔") {
        const oldSelectedCompany = selectedCompany;
        setSelectedCompany(selectedCompany.slice(0, -2));

        const indice = buttonChat.indexOf(oldSelectedCompany);
        const newButtonChat = buttonChat;
        newButtonChat[indice] = oldSelectedCompany.slice(0, -2);
        setButtonChat(newButtonChat);
      }

      const filtered = allMessages.filter((message) => {
        const senderCompany = message.sender?.company
          ? message.sender.company.name
          : message.sender?.Company?.name;

        const receiverCompany = message.receiver?.company
          ? message.receiver.company.name
          : message.receiver?.Company?.name;

        return (
          (senderCompany === selectedCompany && receiverCompany === myName) ||
          (senderCompany === myName && receiverCompany === selectedCompany)
        );
      });

      const newReceiver = allUsers.find(
        (user) => user.company?.name === selectedCompany
      );

      setFilteredMessages(filtered);
      if (newReceiver) {
        setReceiver(newReceiver);
      }
    }
  }, [allMessages, selectedCompany, myName, allUsers]);

  //Agrega las compañías a los botones de seleccion del chat
  //excepto al usuario
  useEffect(() => {
    if (allUsers.length > 0) {
      allUsers.forEach((item) => {
        if (item.company?.name && item.company.name !== myName) {
          usuariosUnicos.add(item.company.name);
        }
      });
      const usuariosUnicosArray = Array.from(usuariosUnicos);

      if (company) {
        const button = usuariosUnicosArray.find(
          (button) => button === company.name
        );
        const newButtonChat = usuariosUnicosArray.filter(
          (element) => element !== company.name
        );
        if (button) {
          newButtonChat.unshift(button);
        }
        setButtonChat(newButtonChat);
      } else {
        setButtonChat(usuariosUnicosArray);
      }
    }
  }, [allUsers, myName]);

  //Recibe los mensajes
  useEffect(() => {
    console.log("Recibe allMessages", allMessages);
    if (!socketIo) return;
    const messageListener = (message) => {
      const { _message, _sender, _receiver } = message;
      const foundReceiver = allUsers.find(
        (user) => user.company.id === _sender
      );

      //OJO CUANDO RECIBO EL MENSAJE PARA MI->YO SOY EL RECEIVER
      const foundSender = allUsers.find(
        (user) => user.company.id === _receiver
      );

      if (foundSender && foundReceiver) {
        const newMessage = {
          text: _message,
          sender: foundReceiver,
          receiver: foundSender,
          createdAt: new Date().toISOString(),
        };
        setAllMessages((prevMessages) => [...prevMessages, newMessage]);
      }

      const foundCompanyName = foundReceiver?.company?.name;
      if (selectedCompany !== foundCompanyName && foundCompanyName) {
        const button = buttonChat.find((button) => button === foundCompanyName);
        if (button) {
          const button2 = button.concat("🔔");
          const newButtonChat = buttonChat.filter(
            (element) => element !== foundCompanyName
          );
          newButtonChat.unshift(button2);
          setButtonChat(newButtonChat);
        }
      }
    };

    socketIo.on("message", messageListener);

    return () => {
      socketIo.off("message", messageListener);
    };
  }, [allMessages, allUsers, sender, receiver]);

  //Envia los mensajes
  const handleSendMessage = useCallback(
    (event) => {
      console.log("Envia allMessages", allMessages);
      event.preventDefault();

      if (!socketIo || !messageText.trim()) return;
      
      // Si hay una empresa específica (company prop), validar receiver
      // Si no hay empresa específica, validar que haya una compañía seleccionada
      if (company) {
        if (!receiver || !receiver.company) {
          alert(`No se pudo establecer conexión con ${company.name}. Inténtalo nuevamente.`);
          return;
        }
      } else {
        if (!receiver || !receiver.company) {
          alert("Por favor, selecciona una empresa para enviar el mensaje.");
          return;
        }
      }
      
      const newMessage = {
        text: messageText,
        sender,
        receiver,
        createdAt: convertirFecha(new Date().toISOString()),
      };
      console.log("Date", newMessage.createdAt);

      setAllMessages((prevMessages) => [...prevMessages, newMessage]);

      socketIo.emit("sendMessage", {
        _message: messageText,
        _sender: companyId,
        _receiver: receiver.company.id,
      });

      axiosPostMessage({
        text: messageText,
        senderId: sender.id,
        receiverId: receiver.id,
      });

      setMessageText("");
    },
    [messageText, sender, receiver, companyId, id, company]
  );

  //Establece compañía seleccionada en boton del chat
  const handleSelectCompany = (companyName) => {
    setSelectedCompany(companyName);
  };

  return (
    <>
      {/* Verificar permisos antes de mostrar cualquier funcionalidad de chat */}
      {!hasPermission ? (
        <div className="p-4 text-center text-gray-500">
          <p className="text-sm">No tienes permisos para acceder al chat.</p>
          <p className="text-xs">Contacta a tu empleador para solicitar permisos de comunicación.</p>
        </div>
      ) : (
        <>
          {company ? (
            // Vista específica para chatear con una empresa en particular
            <div className="w-full">
              <div className="flex flex-col h-80">
                {/* Área de mensajes */}
                <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg p-3 mb-4">
                  <Messages filteredMessages={filteredMessages} userId={userId} />
                </div>
              </div>
              
              {/* Formulario para enviar mensajes */}
              <form className="flex border-t border-gray-200 pt-4" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  className="flex-1 px-4 py-3 mr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  placeholder={`Escribe un mensaje a ${company.name}...`}
                />
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 min-w-[80px] ${
                    messageText.trim()
                      ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-600 cursor-not-allowed border border-gray-300"
                  }`}
                  disabled={!messageText.trim()}
                >
                  Enviar
                </button>
              </form>
            </div>
          ) : (
            // Vista original para cuando no hay company específica
            <div className="w-full">
              <h2 className="font-bold text-center text-md mb-4">Chat</h2>

              <div className="grid grid-cols-12 gap-4 mb-4">
                {/* Lista de empresas */}
                <div className="col-span-3">
                  <h3 className="text-sm font-semibold mb-2 text-gray-700">Empresas</h3>
                  <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    {buttonChat.map((item) => {
                      const companyUser = allUsers.find(user => user.company?.name === item);
                      const profilePicture = companyUser?.company?.profilePicture;
                      
                      console.log('Company:', item, 'ProfilePicture:', profilePicture); // Debug log
                      
                      return (
                        <button
                          key={item}
                          className={`w-full p-2 mb-2 text-sm text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center space-x-2 ${
                            selectedCompany === item
                              ? "bg-blue-500 hover:bg-blue-600"
                              : "bg-gray-600 hover:bg-gray-700"
                          }`}
                          onClick={() => handleSelectCompany(item)}
                          title={item}
                        >
                          {profilePicture ? (
                            <div className="flex items-center space-x-2 w-full">
                              <img
                                src={profilePicture}
                                alt={item}
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                onError={(e) => {
                                  console.log('Error loading image for company:', item, 'URL:', profilePicture);
                                  e.target.style.display = 'none';
                                  e.target.parentNode.querySelector('.fallback-text').style.display = 'block';
                                }}
                              />
                              <span className="text-xs font-medium text-white truncate flex-1">
                                {item}
                              </span>
                              <span className="fallback-text text-xs font-medium text-white w-full text-center" style={{ display: 'none' }}>
                                {item}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center w-full">
                              <span className="text-xs font-medium text-white text-center">
                                {item}
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Área de mensajes */}
                <div className="col-span-9">
                  <h3 className="text-sm font-semibold mb-2 text-gray-700">
                    {selectedCompany ? `Conversación con ${selectedCompany}` : 'Selecciona una empresa'}
                  </h3>
                  <Messages filteredMessages={filteredMessages} userId={userId} />
                </div>
              </div>

              {/* Formulario para enviar mensajes */}
              <form className="flex mt-4" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  className="flex-1 px-4 py-2 mr-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  placeholder={selectedCompany ? "Escribe tu mensaje..." : "Selecciona una empresa para chatear..."}
                  disabled={!selectedCompany}
                />
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg font-medium ${
                    selectedCompany && messageText.trim()
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                  disabled={!selectedCompany || !messageText.trim()}
                >
                  Enviar
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </>
  );
};
export default Chat;
