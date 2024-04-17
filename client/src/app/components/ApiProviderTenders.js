// Nuevo ApiProvider para manejar los datos de companies
const tendersApiUrl = "http://localhost:3001/tenders";

const tenderDataProvider = {
  getList: (resource, params) => {
    const url = `${tendersApiUrl}/${resource}`;
    return fetch(url)
      .then((response) => response.json())
      .then((json) => ({
        data: json,
      }));
  },
  getOne: (resource, params) => {
    const url = `${tendersApiUrl}/${resource}/${params.id}`;
    return fetch(url)
      .then((response) => response.json())
      .then((json) => ({
        data: json,
      }));
  },
  // Implementa las funciones restantes según sea necesario
};

export default tenderDataProvider;