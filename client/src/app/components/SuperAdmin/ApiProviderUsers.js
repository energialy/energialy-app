// Enhanced ApiProvider.js for Admin Panel

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Helper function to get auth token
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;
  return token ? {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  } : {
    'Content-Type': 'application/json'
  };
};

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
    console.log(`[DataProvider] Fetching ${resource} from:`, url);
    
    return fetch(url, { headers: getAuthHeaders() })
      .then((response) => {
        console.log(`[DataProvider] Response status for ${resource}:`, response.status);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((json) => {
        console.log(`[DataProvider] Data received for ${resource}:`, json);
        const dataArray = Array.isArray(json) ? json : [json];
        console.log(`[DataProvider] Processed data for ${resource}:`, { total: dataArray.length, sample: dataArray[0] });
        
        return {
          data: dataArray,
          total: dataArray.length
        };
      })
      .catch(error => {
        console.error(`[DataProvider] Error fetching ${resource}:`, error);
        return { data: [], total: 0 };
      });
  },

  getOne: (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    return fetch(url, { headers: getAuthHeaders() })
      .then((response) => response.json())
      .then((json) => ({
        data: json,
      }))
      .catch(error => {
        console.error(`Error fetching ${resource} ${params.id}:`, error);
        throw error;
      });
  },

  getMany: (resource, params) => {
    console.log(`[DataProvider] getMany called for ${resource}`, params);
    // params.ids contains array of IDs to fetch
    const ids = params.ids || [];
    
    if (ids.length === 0) {
      return Promise.resolve({ data: [] });
    }

    // Fetch each resource individually and combine results
    const promises = ids.map(id =>
      fetch(`${apiUrl}/${resource}/${id}`, { headers: getAuthHeaders() })
        .then(response => response.json())
        .catch(error => {
          console.error(`Error fetching ${resource} ${id}:`, error);
          return null;
        })
    );

    return Promise.all(promises)
      .then(results => {
        const data = results.filter(item => item !== null);
        console.log(`[DataProvider] getMany results for ${resource}:`, data);
        return { data };
      })
      .catch(error => {
        console.error(`Error in getMany for ${resource}:`, error);
        return { data: [] };
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
    console.log(`[DataProvider] Creating ${resource}`, { url, data: params.data });
    
    const options = {
      method: "POST",
      body: JSON.stringify(params.data),
      headers: getAuthHeaders(),
    };

    return fetch(url, options)
      .then((response) => {
        console.log(`[DataProvider] Create response status for ${resource}:`, response.status);
        if (!response.ok) {
          return response.json().then(errorData => {
            console.error(`[DataProvider] Error response data:`, errorData);
            throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
          }).catch(err => {
            throw new Error(`HTTP error! status: ${response.status}`);
          });
        }
        return response.json();
      })
      .then((json) => {
        console.log(`[DataProvider] Created ${resource}:`, json);
        return {
          data: { ...params.data, id: json.id || Date.now() }
        };
      })
      .catch(error => {
        console.error(`[DataProvider] Error creating ${resource}:`, error);
        throw error;
      });
  },
  update: (resource, params) => { 
    const url = `${apiUrl}/${resource}/${params.id}`;
    const options = {
      method: "PUT", 
      body: JSON.stringify(params.data),
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
    };

    return fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Status 204 No Content no tiene cuerpo
        if (response.status === 204) {
          return { id: params.id };
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