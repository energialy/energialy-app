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
const socketIo = io(process.env.NEXT_PUBLIC_BASE_URL);

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
    if (userData.role === "company_collaborator") {
      return (
        userData.permissions && userData.permissions.includes("COMUNICACIONES")
      );
    }

    // Otros roles (admin, superAdmin, company_owner, bank) tienen acceso por defecto
    return true;
  };

  const convertirFecha = (fechaISO) => {
    try {
      let fecha = new Date(fechaISO);

      // Verificar si la fecha es válida
      if (isNaN(fecha.getTime())) {
        return new Date().toISOString();
      }

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
      return fechaString; // Ejemplo de salida: "26-6-2024-19:38"
    } catch (error) {
      console.error("Error al convertir fecha:", error);
      return new Date().toISOString();
    }
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
    console.log("🔄 Cargando usuarios y mensajes...");
    axiosGetAllUsers(setAllUsers);
    axiosGetAllMessages(setAllMessages);
    !company && setShowPopup(true);
  }, []);

  // Cargar mensajes específicos cuando hay una empresa determinada
  useEffect(() => {
    if (company && allUsers.length > 0 && allMessages.length > 0) {
      // Encontrar el usuario de la empresa específica
      const companyUser = allUsers.find(
        (user) => user.company?.name === company.name
      );
      if (companyUser) {
        setReceiver(companyUser);
        setSelectedCompany(company.name);

        // Filtrar mensajes para esta empresa específica inmediatamente
        const filtered = allMessages.filter((message) => {
          const senderCompany = message.sender?.company
            ? message.sender.company.name
            : message.sender?.Company?.name;

          const receiverCompany = message.receiver?.company
            ? message.receiver.company.name
            : message.receiver?.Company?.name;

          return (
            (senderCompany === company.name && receiverCompany === myName) ||
            (senderCompany === myName && receiverCompany === company.name)
          );
        });

        setFilteredMessages(filtered);
      }
    }
  }, [company, allUsers, allMessages, myName]);

  // Debug: Verificar mensajes cargados
  useEffect(() => {
    if (allMessages.length > 0) {
      console.log("📧 Mensajes cargados:", allMessages.length);
      console.log("📧 Primer mensaje:", allMessages[0]);
    } else {
      console.log("📧 No hay mensajes cargados");
    }
  }, [allMessages]);

  //Carga sender y receiver
  useEffect(() => {
    if (allUsers.length > 0) {
      // SIEMPRE establecer el sender (usuario actual)
      const foundSender = allUsers.find(
        (user) => user.company.id === companyId
      );

      if (foundSender) {
        setSender(foundSender);
        if (process.env.NODE_ENV === "development") {
          console.log("Sender establecido:", foundSender);
        }
      }

      // Si hay un ID específico, establecer receiver
      if (id) {
        const foundReceiver = allUsers.find((user) => user.company.id === id);
        if (foundReceiver) {
          setReceiver(foundReceiver);
          setSelectedCompany(foundReceiver.company.name);
          if (process.env.NODE_ENV === "development") {
            console.log("Receiver establecido desde ID:", foundReceiver);
          }
        }
      }
    }
  }, [allUsers, id, companyId]);

  //Filtra chat por compañía seleccionada
  useEffect(() => {
    if (selectedCompany && allUsers.length > 0) {
      // Limpiar la compañía de notificaciones (🔔) si las tiene
      const cleanCompanyName = selectedCompany.replace("🔔", "");

      // Actualizar el estado si tenía notificaciones
      if (selectedCompany !== cleanCompanyName) {
        setSelectedCompany(cleanCompanyName);

        // Actualizar buttonChat para remover la notificación
        const updatedButtonChat = buttonChat.map((button) =>
          button === selectedCompany ? cleanCompanyName : button
        );
        setButtonChat(updatedButtonChat);
      }

      // Establecer el receiver SIEMPRE cuando se selecciona una empresa
      const newReceiver = allUsers.find(
        (user) => user.company?.name === cleanCompanyName
      );

      if (newReceiver) {
        setReceiver(newReceiver);
      }

      // Filtrar mensajes solo si hay mensajes
      if (allMessages.length > 0) {
        const filtered = allMessages.filter((message) => {
          const senderCompany = message.sender?.company
            ? message.sender.company.name
            : message.sender?.Company?.name;

          const receiverCompany = message.receiver?.company
            ? message.receiver.company.name
            : message.receiver?.Company?.name;

          return (
            (senderCompany === cleanCompanyName &&
              receiverCompany === myName) ||
            (senderCompany === myName && receiverCompany === cleanCompanyName)
          );
        });

        setFilteredMessages(filtered);
        if (process.env.NODE_ENV === "development") {
          console.log(
            "🔍 Mensajes filtrados para",
            cleanCompanyName + ":",
            filtered.length
          );
        }
      } else {
        setFilteredMessages([]);
        if (process.env.NODE_ENV === "development") {
          console.log("🔍 No hay mensajes para filtrar");
        }
      }
    }
  }, [selectedCompany, allUsers, allMessages, myName]);

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
        // Buscar si la empresa ya existe en buttonChat (con o sin notificación)
        const existingButtonIndex = buttonChat.findIndex(
          (button) =>
            button === foundCompanyName || button === foundCompanyName + "🔔"
        );

        if (existingButtonIndex !== -1) {
          // Si existe, moverla al principio con notificación
          const newButtonChat = [...buttonChat];
          newButtonChat.splice(existingButtonIndex, 1); // Remover de posición actual
          newButtonChat.unshift(foundCompanyName + "🔔"); // Agregar al principio con notificación
          setButtonChat(newButtonChat);
        } else {
          // Si no existe, agregarla al principio
          setButtonChat((prev) => [foundCompanyName + "🔔", ...prev]);
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
    async (event) => {
      event.preventDefault();

      if (!socketIo || !messageText.trim()) return;

      if (process.env.NODE_ENV === "development") {
        console.log("Enviando mensaje:", {
          selectedCompany,
          receiver,
          sender,
          company,
        });
      }

      // Si hay una empresa específica (company prop), validar receiver
      // Si no hay empresa específica, validar que haya una compañía seleccionada
      if (company) {
        if (!receiver || !receiver.company) {
          alert(
            `No se pudo establecer conexión con ${company.name}. Inténtalo nuevamente.`
          );
          return;
        }
      } else {
        if (!selectedCompany) {
          alert("Por favor, selecciona una empresa para enviar el mensaje.");
          return;
        }
        if (!receiver || !receiver.company) {
          alert(
            "Error de conexión. Por favor, vuelve a seleccionar la empresa."
          );
          return;
        }
      }

      const newMessage = {
        text: messageText,
        sender,
        receiver,
        createdAt: convertirFecha(new Date().toISOString()),
      };

      setAllMessages((prevMessages) => [...prevMessages, newMessage]);

      socketIo.emit("sendMessage", {
        _message: messageText,
        _sender: companyId,
        _receiver: receiver.company.id,
      });

      try {
        await axiosPostMessage({
          text: messageText,
          senderId: sender.id,
          receiverId: receiver.id,
        });
      } catch (error) {
        console.error("Error al guardar mensaje:", error);
        // Si hay error al guardar, podrías mostrar una notificación
        if (error.response?.status === 401) {
          alert("Error de autenticación. Por favor, inicia sesión nuevamente.");
        } else if (error.response?.status === 403) {
          alert("No tienes permisos para enviar mensajes.");
        } else {
          alert("Error al guardar el mensaje. Inténtalo nuevamente.");
        }
      }

      setMessageText("");
    },
    [messageText, sender, receiver, companyId, id, company]
  );

  //Establece compañía seleccionada en boton del chat
  const handleSelectCompany = (companyName) => {
    // Limpiar nombre de notificaciones
    const cleanCompanyName = companyName.replace("🔔", "");
    if (process.env.NODE_ENV === "development") {
      console.log("Selecting company:", cleanCompanyName);
    }
    setSelectedCompany(cleanCompanyName);

    // Si tenía notificación, limpiarla del buttonChat
    if (companyName.includes("🔔")) {
      const updatedButtonChat = buttonChat.map((button) =>
        button === companyName ? cleanCompanyName : button
      );
      setButtonChat(updatedButtonChat);
    }
  };

  return (
    <>
      {/* Verificar permisos antes de mostrar cualquier funcionalidad de chat */}
      {!hasPermission ? (
        <div className="p-4 text-center text-gray-500">
          <p className="text-sm">No tienes permisos para acceder al chat.</p>
          <p className="text-xs">
            Contacta a tu empleador para solicitar permisos de comunicación.
          </p>
        </div>
      ) : (
        <>
          {company ? (
            // Vista específica para chatear con una empresa en particular
            <div className="w-full h-full flex flex-col">
              {/* Área de mensajes - sin doble scroll */}
              <div className="flex-1 border border-gray-200 rounded-lg mb-4 overflow-hidden">
                <Messages filteredMessages={filteredMessages} userId={userId} />
              </div>

              {/* Formulario para enviar mensajes */}
              <form className="flex gap-3" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white placeholder-gray-500"
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  placeholder={`Escribe un mensaje a ${company.name}...`}
                />
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 min-w-[80px] ${
                    messageText.trim()
                      ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
                      : "bg-gray-300 hover:bg-gray-400 text-gray-600 cursor-not-allowed"
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
              <h2 className="font-semibold text-center text-lg mb-4 text-gray-800 dark:text-gray-200">
                Chat
              </h2>

              <div className="grid grid-cols-12 gap-4 mb-4">
                {/* Lista de empresas */}
                <div className="col-span-3">
                  <h3 className="text-sm font-semibold mb-3 text-gray-700 text-center">
                    Empresas
                  </h3>
                  <div
                    className="max-h-80 overflow-y-auto p-2"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#d1d5db #f3f4f6",
                    }}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      {buttonChat.map((item) => {
                        const companyUser = allUsers.find(
                          (user) =>
                            user.company?.name === item.replace("🔔", "")
                        );
                        const profilePicture =
                          companyUser?.company?.profilePicture;
                        const companyName = item.replace("🔔", ""); // Remover notificación para obtener nombre limpio

                        return (
                          <button
                            key={item}
                            className={`w-20 h-20 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                              selectedCompany === companyName
                                ? "ring-2 ring-blue-500 shadow-lg"
                                : "hover:shadow-md"
                            }`}
                            onClick={() => handleSelectCompany(companyName)}
                            title={companyName}
                          >
                            {profilePicture ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={profilePicture}
                                  alt={companyName}
                                  className="w-full h-full rounded-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.parentNode.querySelector(
                                      ".fallback-avatar"
                                    ).style.display = "flex";
                                  }}
                                />
                                <div
                                  className="fallback-avatar w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg"
                                  style={{ display: "none" }}
                                >
                                  {companyName.charAt(0).toUpperCase()}
                                </div>
                                {item.includes("🔔") && (
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">
                                      !
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {companyName.charAt(0).toUpperCase()}
                                {item.includes("🔔") && (
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">
                                      !
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Área de mensajes */}
                <div className="col-span-9">
                  <h3 className="text-sm font-semibold mb-2 text-gray-700">
                    {selectedCompany
                      ? `Conversación con ${selectedCompany}`
                      : "Selecciona una empresa"}
                  </h3>
                  <Messages
                    filteredMessages={filteredMessages}
                    userId={userId}
                  />
                </div>
                {/* Formulario para enviar mensajes */}
                <form className="flex gap-3 mt-4" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white placeholder-gray-500"
                    value={messageText}
                    onChange={(event) => setMessageText(event.target.value)}
                    placeholder={
                      selectedCompany
                        ? "Escribe tu mensaje..."
                        : "Selecciona una empresa para chatear..."
                    }
                    disabled={!selectedCompany}
                  />
                  <button
                    type="submit"
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 min-w-[80px] ${
                      selectedCompany && messageText.trim()
                        ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
                        : "bg-gray-300 hover:bg-gray-400 text-gray-600 cursor-not-allowed"
                    }`}
                    disabled={!selectedCompany || !messageText.trim()}
                  >
                    Enviar
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
export default Chat;
