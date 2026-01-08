import { useDataProvider } from 'react-admin';
import { toast } from 'react-toastify';

/**
 * Hook personalizado para eliminar recursos con confirmación y notificaciones
 * 
 * @param {string} resource - El nombre del recurso (ej: 'users', 'tenders', 'proposals')
 * @param {string} resourceLabel - La etiqueta amigable del recurso (ej: 'usuario', 'licitación')
 * @param {number} successToastDuration - Duración del toast de éxito en ms (por defecto: 3000)
 * @param {number} errorToastDuration - Duración del toast de error en ms (por defecto: 3000)
 * @param {boolean} reloadOnSuccess - Si debe recargar la página después de eliminar (por defecto: true)
 * @returns {Function} - Función handleDelete que acepta el id del recurso
 */
const useDeleteResource = ({
  resource,
  resourceLabel = 'recurso',
  successToastDuration = 3000,
  errorToastDuration = 3000,
  reloadOnSuccess = true
}) => {
  const dataProvider = useDataProvider();

  const handleDelete = async (id) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar este ${resourceLabel}?`)) {
      try {
        await dataProvider.delete(resource, { id });
        
        // Mostrar mensaje de éxito
        toast.success(`Eliminaste el ${resourceLabel} con id ${id}`, {
          position: "top-right",
          autoClose: successToastDuration,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Recargar la página después de que el toast termine
        if (reloadOnSuccess) {
          setTimeout(() => {
            window.location.reload();
          }, successToastDuration + 500);
        }
        
        return { success: true };
        
      } catch (error) {
        console.error(`Error deleting ${resource}:`, error);
        
        // Mostrar mensaje de error
        toast.error(`No pudimos eliminar el ${resourceLabel} con id ${id}`, {
          position: "top-right",
          autoClose: errorToastDuration,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        return { success: false, error };
      }
    }
    
    return { success: false, cancelled: true };
  };

  return handleDelete;
};

export default useDeleteResource;
