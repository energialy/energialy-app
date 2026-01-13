/**
 * Hook personalizado para hacer scroll automático al primer campo con error en un formulario
 * @param {Object} errorFieldsMap - Mapa de nombres de campos a sus referencias (refs)
 * @returns {Function} scrollToFirstError - Función que recibe objeto de errores y hace scroll al primero
 */
export const useScrollToError = (errorFieldsMap) => {
    console.log(errorFieldsMap);
  /**
   * Hace scroll al primer campo con error
   * @param {Object} errors - Objeto con los errores del formulario
   */
  const scrollToFirstError = (errors) => {
    if (!errors || Object.keys(errors).length === 0) {
      return;
    }

    // Encontrar el primer campo con error
    const firstErrorField = Object.keys(errors)[0];
    const fieldRef = errorFieldsMap[firstErrorField];
    
    if (fieldRef && fieldRef.current) {
      fieldRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      
      // Agregar un pequeño delay y luego hacer focus si es un input
      setTimeout(() => {
        if (fieldRef.current && fieldRef.current.focus) {
          fieldRef.current.focus();
        }
      }, 500);
    }
  };

  return scrollToFirstError;
};
