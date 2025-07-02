import React, { useState } from 'react';
import { useGetTenderInvitationsQuery } from '@/app/redux/services/tendersApi';
import TenderInvitationsModal from './TenderInvitationsModal';

const TenderInvitationsPanel = ({ tenderId, tenderTitle }) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { data: invitations, isLoading, refetch } = useGetTenderInvitationsQuery(tenderId);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'invited': { label: 'Invitado', class: 'bg-yellow-100 text-yellow-800' },
      'proposal_sent': { label: 'Envió Propuesta', class: 'bg-green-100 text-green-800' },
      'viewed': { label: 'Visto', class: 'bg-blue-100 text-blue-800' },
      'declined': { label: 'Rechazó', class: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || statusConfig['invited'];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="border-t pt-4 mt-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-gray-700">Invitaciones</h4>
        <button
          onClick={() => setShowInviteModal(true)}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
        >
          + Invitar Usuarios
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Cargando invitaciones...</p>
      ) : (
        <>
          {invitations && invitations.length > 0 ? (
            <div className="space-y-2">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{invitation.userEmail}</p>
                    {invitation.isRegistered && invitation.user && (
                      <p className="text-xs text-gray-600">
                        {invitation.user.firstName} {invitation.user.lastName}
                        {invitation.user.company && ` - ${invitation.user.company.name}`}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Invitado el {new Date(invitation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(invitation.status)}
                    <span className={`text-xs px-2 py-1 rounded ${
                      invitation.isRegistered 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {invitation.isRegistered ? 'Registrado' : 'Por email'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p className="text-sm">No hay invitaciones enviadas</p>
              <p className="text-xs">Haz clic en "Invitar Usuarios" para comenzar</p>
            </div>
          )}
        </>
      )}

      <TenderInvitationsModal
        isOpen={showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          refetch(); // Refrescar la lista de invitaciones
        }}
        tenderId={tenderId}
        tenderTitle={tenderTitle}
      />
    </div>
  );
};

export default TenderInvitationsPanel;
