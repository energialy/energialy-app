// Enhanced ApiProvider.js for Admin Panel

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const dataProvider = {
  getList: (resource, params) => {
    // Handle special resources
    if (resource === 'subscriptions') {
      // For now, return mock data for subscriptions
      return Promise.resolve({
        data: [
          {
            id: 1,
            name: "Plan Básico",
            description: "Plan básico para empresas pequeñas",
            price: 29.99,
            currency: "USD",
            duration: 30,
            maxTenders: 5,
            maxProposals: 20,
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            name: "Plan Pro",
            description: "Plan profesional para empresas medianas",
            price: 99.99,
            currency: "USD",
            duration: 30,
            maxTenders: 25,
            maxProposals: 100,
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ],
        total: 2
      });
    }
    
    if (resource === 'companySubscriptions') {
      // For now, return mock data for company subscriptions
      return Promise.resolve({
        data: [
          {
            id: 1,
            companyId: 1,
            subscriptionId: 1,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
            status: 'active',
            createdAt: new Date().toISOString()
          }
        ],
        total: 1
      });
    }

    const url = `${apiUrl}/${resource}`;
    return fetch(url)
      .then((response) => response.json())
      .then((json) => ({
        data: Array.isArray(json) ? json : [json],
        total: Array.isArray(json) ? json.length : 1
      }))
      .catch(error => {
        console.error(`Error fetching ${resource}:`, error);
        return { data: [], total: 0 };
      });
  },

  getOne: (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    return fetch(url)
      .then((response) => response.json())
      .then((json) => ({
        data: json,
      }))
      .catch(error => {
        console.error(`Error fetching ${resource} ${params.id}:`, error);
        throw error;
      });
  },

  create: (resource, params) => {
    // Handle special resources
    if (resource === 'subscriptions') {
      // Mock creation for subscriptions
      return Promise.resolve({
        data: { ...params.data, id: Date.now() }
      });
    }
    
    if (resource === 'companySubscriptions') {
      // Mock creation for company subscriptions
      return Promise.resolve({
        data: { ...params.data, id: Date.now() }
      });
    }

    const url = `${apiUrl}/${resource}`;
    const options = {
      method: "POST",
      body: JSON.stringify(params.data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    return fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => ({
        data: { ...params.data, id: json.id || Date.now() }
      }))
      .catch(error => {
        console.error(`Error creating ${resource}:`, error);
        throw error;
      });
  },
  update: (resource, params) => { 
    const url = `${apiUrl}/${resource}/${params.id}`;
    const options = {
      method: "PUT", 
      body: JSON.stringify(params.data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    return fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => ({
        data: json,
      }))
      .catch(error => {
        console.error(`Error updating ${resource} ${params.id}:`, error);
        throw error;
      });
  },

  delete: (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    const options = {
      method: "DELETE",
    };

    return fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => ({
        data: json,
      }))
      .catch(error => {
        console.error(`Error deleting ${resource} ${params.id}:`, error);
        throw error;
      });
  },

  deleteMany: (resource, params) => {
    const url = `${apiUrl}/${resource}`;
    const options = {
      method: "DELETE",
      body: JSON.stringify(params.ids),
      headers: {
        "Content-Type": "application/json",
      },
    };

    return fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => ({
        data: json,
      }))
      .catch(error => {
        console.error(`Error batch deleting ${resource}:`, error);
        throw error;
      });
  },
};

export default dataProvider;