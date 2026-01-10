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
        console.log(`[DataProvider] Raw JSON for ${resource}:`, json);
        console.log(`[DataProvider] Is array?`, Array.isArray(json));
        console.log(`[DataProvider] First item:`, json?.[0]);
        
        const dataArray = Array.isArray(json) ? json : [json];
        console.log(`[DataProvider] Processed data for ${resource}:`, { 
          total: dataArray.length, 
          sample: dataArray[0],
          allIds: dataArray.map(item => item.id)
        });
        
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
    console.log(`[DataProvider] getOne called for ${resource}/${params.id}`);
    
    return fetch(url, { headers: getAuthHeaders() })
      .then((response) => response.json())
      .then((json) => {
        console.log(`[DataProvider] getOne raw data for ${resource}:`, json);
        
        // Para companies, transformar locations y subcategories a arrays de IDs
        if (resource === 'companies' && json) {
          console.log('[DataProvider] Processing company data...');
          console.log('[DataProvider] json.profilePicture:', json.profilePicture, 'type:', typeof json.profilePicture);
          console.log('[DataProvider] json.bannerPicture:', json.bannerPicture, 'type:', typeof json.bannerPicture);
          console.log('[DataProvider] json.locations:', json.locations);
          console.log('[DataProvider] json.subcategories:', json.subcategories);
          console.log('[DataProvider] json.users:', json.users);
          
          const transformedData = {
            ...json,
            locations: Array.isArray(json.locations) 
              ? json.locations.map(loc => loc.id) 
              : [],
            subcategories: Array.isArray(json.subcategories) 
              ? json.subcategories.map(sub => sub.id) 
              : [],
            userId: json.users?.[0]?.id || null, // Obtener el primer usuario asociado
            // Mantener profilePicture y bannerPicture como strings para TextInput
            profilePicture: json.profilePicture || '',
            bannerPicture: json.bannerPicture || '',
          };
          
          console.log('[DataProvider] Images - profilePicture:', transformedData.profilePicture);
          console.log('[DataProvider] Images - bannerPicture:', transformedData.bannerPicture);
          
          console.log(`[DataProvider] getOne transformed data for ${resource}:`, transformedData);
          return { data: transformedData };
        }
        
        return { data: json };
      })
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

  getManyReference: (resource, params) => {
    console.log(`[DataProvider] getManyReference called for ${resource}`, params);
    // For now, just call getList and filter if needed
    const url = `${apiUrl}/${resource}`;
    
    return fetch(url, { headers: getAuthHeaders() })
      .then((response) => response.json())
      .then((json) => {
        const dataArray = Array.isArray(json) ? json : [json];
        console.log(`[DataProvider] getManyReference results for ${resource}:`, dataArray);
        return {
          data: dataArray,
          total: dataArray.length
        };
      })
      .catch(error => {
        console.error(`[DataProvider] Error in getManyReference for ${resource}:`, error);
        return { data: [], total: 0 };
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
    console.log(`[DataProvider] Updating ${resource}/${params.id}`, params.data);
    
    const url = `${apiUrl}/${resource}/${params.id}`;
    const options = {
      method: "PUT", 
      body: JSON.stringify(params.data),
      headers: getAuthHeaders(),
    };

    return fetch(url, options)
      .then((response) => {
        console.log(`[DataProvider] Update response status for ${resource}:`, response.status);
        if (!response.ok) {
          return response.json().then(errorData => {
            console.error(`[DataProvider] Update error response:`, errorData);
            throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
          }).catch(err => {
            throw new Error(`HTTP error! status: ${response.status}`);
          });
        }
        return response.json();
      })
      .then((json) => {
        console.log(`[DataProvider] Updated ${resource}:`, json);
        return { data: json };
      })
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