import axios from "axios";
import { getAccessToken } from "./sessionStorage";

export async function axiosPostMessage(body) {
  try {
    const token = getAccessToken();
    if (!token) {
      console.error("No access token found");
      return;
    }

    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/messages`, 
      body,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log("post-message:", data);
    return data;
  } catch (error) {
    console.log("Error en axiosPostMessage por:", error.response?.data || error.message);
    throw error;
  }
}

export async function axiosGetAllMessages(setAllMessages) {
  try {
    const token = getAccessToken();
    if (!token) {
      console.error("No access token found");
      return;
    }

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/messages`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log("get-message:", data);
    setAllMessages(data);
  } catch (error) {
    console.log("Error en axiosGetAllMessages por:", error.response?.data || error.message);
  }
}

export async function axiosGetAllUsers(setAllUsers) {
  try {
    const token = getAccessToken();
    if (!token) {
      console.error("No access token found");
      return;
    }

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    // console.log("get-users:", data);
    const usersWithCompany = data.filter(user=>user.company!==null);
    setAllUsers(usersWithCompany);
  } catch (error) {
    console.log("Error en axiosGetAllUsers por:", error.response?.data || error.message);
  }
}

export async function axiosGetDetailCompany(id, setCompany) {
  try {
    if (id) {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/companies/${id}`);
      // console.log("get-companies-id:", data);
      setCompany(data)
    }
  } catch (error) {
    console.log("Error en axiosGetDetailCompany por:", error);
  }
}

export async function axiosGetAllCompanies(setAllCompanies) {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/companies`)
    setAllCompanies(data)
  } catch (error) {
    console.log("Error en axiosGetAllCompanies por:", error);
  }
}

//Traer todas las imagenes de Productos/Servicios de una compañia
export async function axiosGetGalleryCompanyById(companyid, setGallery) {
 
  try {
    if(companyid) {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/gallery/${companyid}`);
      setGallery(data)
    }
  } catch (error) {
    console.log("Error en axiosGetGalleryCompanyById por: ", error);
  }
}

//ELIMINAR UNA IMAGEN DE UN PRODUCTO/SERVICIO DE UNA COMPAÑIA

export async function axiosDeleteCompanyGalleryById (id, setGallery) {
try {
  if(id) {
    await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/gallery/${id}`);
     // Actualiza la galería localmente eliminando la imagen con el publicId
     setGallery(prevGallery => prevGallery.filter(image => image.id !== id));
  }
} catch (error) {
  console.log("Error en axiosDeleteCompanyGalleryById por: ", error);
}
}

//EDITAR DESCRIPCION DE UNA IMAGEN PARA PRODUCTOS/SERVICIOS DE UNA COMPAÑIA

export async function axiosEditCompanyGalleryById (id, newDescription) {
  try {
    if(id) {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/gallery/${id}`, { description: newDescription });
    return response.data;
    }
  } catch (error) {
    console.log("Error en axiosEditCompanyGalleryById por: ", error);
  }
}

//AGREGAR IMAGEN A PRODUCTOS/SERIVCIOS DE UNA COMPAÑIA


export async function axiosPostCompanyGallery(description, companyId, files) {
  try {
    
    const formData = new FormData();

    // Agregar archivos a FormData
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        formData.append('files', file); 
      });
    } else {
      throw new Error("No files provided");
    }

    // Agregar otros datos a FormData
    formData.append('description', description);
    formData.append('companyId', companyId);
    
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/gallery/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    return response.data;
  } catch (error) {
    console.log("Error en axiosPostCompanyGallery por: ", error);
    throw error; 
  }
}

// OBTENER EL NUMERO DE IMAGENES EN LA GALERIA DE UNA COMPAÑIA

export async function axiosGetImageCount(companyId) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/gallery/count/${companyId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el número de imágenes: ", error);
    throw error; 
  }
}

// PARA PDF CERTIFICACIONES/HOMOLOGACIONES
//
//Traer todas las CERTIFICACIONES/HOMOLOGACIONES de una compañia
export async function axiosGetCertificationCompanyById(companyid, setCertification) {
 
  try {
    if(companyid) {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/certification/${companyid}`);
      setCertification(data)
    }
  } catch (error) {
    console.log("Error en axiosGetCertificationCompanyById por: ", error);
  }
}

//ELIMINAR UNA IMAGEN DE UN CERTIFICACIONES/HOMOLOGACIONES DE UNA COMPAÑIA

export async function axiosDeleteCertificationGalleryById (id, setCertification) {
try {
  if(id) {
    await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/certification/${id}`);
     // Actualiza la galería localmente eliminando la CERTIFICACIONES/HOMOLOGACIONES con el publicId
     setCertification(prevCertification => prevCertification.filter(image => image.id !== id));
  }
} catch (error) {
  console.log("Error en axiosDeleteCertificationGalleryById por: ", error);
}
}

//EDITAR DESCRIPCION DE UNA CERTIFICACIONES/HOMOLOGACIONES DE UNA COMPAÑIA

export async function axiosEditCertificationGalleryById (id, newDescription) {
  try {
    if(id) {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/certification/${id}`, { description: newDescription });
    return response.data;
    }
  } catch (error) {
    console.log("Error en axiosEditCertificationGalleryById por: ", error);
  }
}

//AGREGAR CERTIFICACIONES/HOMOLOGACIONES DE UNA COMPAÑIA


export async function axiosPostCertificationGallery(description, companyId, files) {
 
  try {
    const formData = new FormData();

    // Agregar archivos a FormData
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        formData.append('files', file); 
      });
    } else {
      throw new Error("No files provided");
    }

    // Agregar otros datos a FormData
    formData.append('description', description);
    formData.append('companyId', companyId);
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/certification/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    
    return response.data;
  } catch (error) {
    console.log("Error en axiosPostCertificationGallery por: ", error);
    throw error; 
  }
}

// OBTENER EL NUMERO DE CERTIFICACIONES/HOMOLOGACIONES EN LA GALERIA DE UNA COMPAÑIA

export async function axiosGetCertificationCount(companyId) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/certification/count/${companyId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el número de certificaciones/homologaciones: ", error);
    throw error; 
  }
}