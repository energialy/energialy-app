// ApiProvider.js

const apiUrl = "http://localhost:3001"; // URL de tu backend

const dataProvider = {
  getList: (resource, params) => {
    const url = `${apiUrl}/${resource}`;
    return fetch(url)
      .then((response) => response.json())
      .then((json) => ({
        data: json, // Devuelve los datos como están
        total: json.length // Asume que la longitud del array es el total de elementos
      }));
  },
  getOne: (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    return fetch(url)
      .then((response) => response.json())
      .then((json) => ({
        data: json,
      }));
  },

  create: (resource, params) => {
    const url = `${apiUrl}`;
    const options = {
      method: "POST",
      body: JSON.stringify(params.data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    return fetch(url, options)
      .then((response) => response.json())
      .then((json) => ({
        data: { ...params.data, id: json.id }, // Devuelve los datos del nuevo usuario con su ID
      }));
  },
};

export default dataProvider;
  // Implementa las funciones restantes para las operaciones CRUD según sea necesario
