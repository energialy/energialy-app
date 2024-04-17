// Nuevo ApiProvider para manejar los datos de companies
const companyApiUrl = "http://localhost:3001/companies";

const companyDataProvider = {
  getList: (resource, params) => {
    const url = `${companyApiUrl}/${resource}`;
    return fetch(url)
      .then((response) => response.json())
      .then((json) => ({
        data: json,
      }));
  },
  getOne: (resource, params) => {
    const url = `${companyApiUrl}/${resource}/${params.id}`;
    return fetch(url)
      .then((response) => response.json())
      .then((json) => ({
        data: json,
      }));
  },
  // Implementa las funciones restantes según sea necesario
};

export default companyDataProvider;