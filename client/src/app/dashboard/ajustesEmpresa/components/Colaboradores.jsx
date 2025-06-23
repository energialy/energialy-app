"use client";
import React, { useState, useEffect } from "react";
import { Montserrat } from "next/font/google";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  displayFailedMessage,
  displaySuccessMessage,
} from "../../../components/Toastify";
import { useRouter } from "next/navigation";
import getLocalStorage from "@/app/Func/localStorage";
import { urlProduction } from "@/app/data/dataGeneric";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function Colaboradores() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCollaborator, setNewCollaborator] = useState({
    email: "",
    name: "",
    permissions: {
      INSTITUCIONAL: false,
      COMUNICACIONES: false,
      LICITACIONES: false,
      FINANZAS: false
    }
  });  useEffect(() => {
    const userData = getLocalStorage();
    console.log("User data from localStorage:", userData); // Debug log
    console.log("User company data:", userData?.company); // Debug log
    console.log("User CompanyId:", userData?.CompanyId); // Debug log
    console.log("User company ID:", userData?.company?.id); // Debug log
    
    setUser(userData);
    
    // Try different possible structures
    const companyId = userData?.company?.id || userData?.CompanyId;
    
    if (companyId) {
      console.log("Using company ID:", companyId); // Debug log
      fetchCollaborators(companyId);
    } else {
      console.log("No company ID found. User data structure:", userData); // Debug log
      // Don't show error message immediately, just log it
      // displayFailedMessage("No se pudo obtener la información de la empresa. Estructura del usuario: " + JSON.stringify(userData));
    }
  }, []);const fetchCollaborators = async (companyId) => {
    try {
      setIsLoading(true);
      console.log("Fetching collaborators for company:", companyId); // Debug log
      
      // Get token from localStorage/sessionStorage
      const userData = getLocalStorage();
      const token = userData?.accessToken;      
      console.log("Token found:", !!token); // Debug log
        const response = await axios.get(
        `${urlProduction}/collaborators/company-collaborators?companyId=${companyId}`, 
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Collaborators response:", response.data); // Debug log
      setCollaborators(response.data.collaborators || response.data);
    } catch (error) {
      console.error("Error fetching collaborators:", error);
      console.error("Error response:", error.response?.data); // Debug log
      
      if (error.response?.status === 401) {
        displayFailedMessage("No tienes permisos para ver colaboradores o tu sesión ha expirado.");
      } else {
        displayFailedMessage("Error al cargar colaboradores: " + (error.response?.data?.error || error.message));
      }
    } finally {
      setIsLoading(false);
    }
  };const handleAddCollaborator = async () => {
    if (!newCollaborator.email || !newCollaborator.name) {
      displayFailedMessage("Email y nombre son requeridos");
      return;
    }

    // Convert permissions object to array format expected by backend
    const selectedPermissions = Object.entries(newCollaborator.permissions)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);

    if (selectedPermissions.length === 0) {
      displayFailedMessage("Debes seleccionar al menos un permiso");
      return;
    }

    try {      setIsLoading(true);
      
      // Get token from localStorage/sessionStorage
      const userData = getLocalStorage();
      const token = userData?.accessToken;
        console.log("Token found for invite:", !!token); // Debug log

      console.log("Sending invite with data:", {
        email: newCollaborator.email,
        firstName: newCollaborator.name.split(' ')[0],
        lastName: newCollaborator.name.split(' ').slice(1).join(' ') || '',
        permissions: selectedPermissions,
        position: 'Colaborador'
      }); // Debug log

      const response = await axios.post(
        `${urlProduction}/collaborators/invite`,
        {
          email: newCollaborator.email,
          firstName: newCollaborator.name.split(' ')[0],
          lastName: newCollaborator.name.split(' ').slice(1).join(' ') || '',
          permissions: selectedPermissions,
          position: 'Colaborador'        },
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        }
      );// Refresh collaborators list
      const companyId = user?.company?.id || user?.CompanyId;
      if (companyId) {
        await fetchCollaborators(companyId);
      }
      
      setNewCollaborator({
        email: "",
        name: "",
        permissions: {
          INSTITUCIONAL: false,
          COMUNICACIONES: false,
          LICITACIONES: false,
          FINANZAS: false
        }
      });
      setShowAddModal(false);
      displaySuccessMessage("Invitación enviada exitosamente");    } catch (error) {
      console.error("Error adding collaborator:", error);
      console.error("Error response:", error.response?.data); // Debug log
      
      if (error.response?.status === 401) {
        displayFailedMessage("No tienes permisos para invitar colaboradores.");
      } else {
        displayFailedMessage(error.response?.data?.error || "Error al enviar invitación");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionChange = (permission, value) => {
    setNewCollaborator(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: value
      }
    }));
  };  const handleRemoveCollaborator = async (collaboratorId) => {
    try {
      // Get token from localStorage/sessionStorage
      const userData = getLocalStorage();
      const token = userData?.accessToken;
        console.log("Token found for remove:", !!token); // Debug log

      await axios.delete(`${urlProduction}/collaborators/${collaboratorId}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
        
      // Refresh collaborators list
      const companyId = user?.company?.id || user?.CompanyId;
      if (companyId) {
        await fetchCollaborators(companyId);
      }
      displaySuccessMessage("Colaborador eliminado exitosamente");
    } catch (error) {
      console.error("Error removing collaborator:", error);
      console.error("Error response:", error.response?.data); // Debug log
      
      if (error.response?.status === 401) {
        displayFailedMessage("No tienes permisos para eliminar colaboradores.");
      } else {
        displayFailedMessage("Error al eliminar colaborador: " + (error.response?.data?.error || error.message));
      }
    }
  };
  return (
    <div className={`p-4 sm:p-6 ${montserrat.className}`}>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Agregar Colaboradores
            </h2>
            <p className="text-gray-600 text-sm">
              Gestiona los usuarios colaboradores de tu empresa y sus permisos
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <span className="text-sm sm:text-base">+ AGREGAR COLABORADOR</span>
          </button>
        </div>

        {/* Collaborators List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando colaboradores...</p>
            </div>
          ) : collaborators.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay colaboradores agregados</p>
              <p className="text-sm">Agrega tu primer colaborador usando el botón superior</p>
            </div>          ) : (            collaborators.map((collaborator) => (
              <div key={collaborator.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800 text-base">
                        {collaborator.firstName} {collaborator.lastName}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded w-fit ${
                        collaborator.status === 'accepted' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {collaborator.status === 'accepted' ? 'Activo' : 'Pendiente'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1 break-all">{collaborator.email}</p>
                    {collaborator.position && (
                      <p className="text-gray-500 text-xs mb-2">{collaborator.position}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {(collaborator.permissions || []).map((permission) => (
                        <span key={permission} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveCollaborator(collaborator.id)}
                    className="text-red-600 hover:text-red-800 text-sm px-3 py-1 rounded border border-red-200 hover:border-red-300 transition-colors w-full sm:w-auto text-center"
                  >
                    {collaborator.status === 'accepted' ? 'Eliminar' : 'Cancelar invitación'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>        {/* Add Collaborator Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Agregar Nuevo Colaborador</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={newCollaborator.name}
                      onChange={(e) => setNewCollaborator(prev => ({...prev, name: e.target.value}))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Nombre del colaborador"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newCollaborator.email}
                      onChange={(e) => setNewCollaborator(prev => ({...prev, email: e.target.value}))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="email@ejemplo.com"
                    />
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-4">
                    Selecciona las funciones para este Usuario Colaborador:
                  </h4>
                  <div className="space-y-4">
                    {[
                      {
                        key: 'INSTITUCIONAL',
                        title: 'INSTITUCIONAL',
                        description: 'Editar datos de empresa.'
                      },
                      {
                        key: 'COMUNICACIONES',
                        title: 'COMUNICACIONES',
                        description: 'Chatear con otros usuarios. Leer/Enviar documentación vía chat.'
                      },
                      {
                        key: 'LICITACIONES',
                        title: 'LICITACIONES',
                        description: '- Crear/Editar Licitaciones Propias. Invitar a proveedores. Seleccionar propuestas.\n- Enviar Propuestas en Licitaciones Externas. Leer/Enviar documentación.'
                      },
                      {
                        key: 'FINANZAS',
                        title: 'FINANZAS',
                        description: 'Solicitar productos financieros.'
                      }
                    ].map((permission) => (
                      <div key={permission.key} className="border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium">
                                {permission.title}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                              {permission.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-center sm:justify-end gap-3 sm:ml-4">
                            <span className="text-sm text-gray-500">NO</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newCollaborator.permissions[permission.key]}
                                onChange={(e) => handlePermissionChange(permission.key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                            <span className="text-sm text-gray-500">SÍ</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors order-2 sm:order-1"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddCollaborator}
                    disabled={isLoading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 order-1 sm:order-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span className="text-sm">Procesando...</span>
                      </>
                    ) : (
                      <span className="text-sm font-medium">CONFIRMAR</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>        )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
