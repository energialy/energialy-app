"use client";
import React, { useState, useEffect } from "react";
import { Montserrat } from "next/font/google";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useRecordContext } from "react-admin";
import { displayFailedMessage, displaySuccessMessage } from "./Toastify";
import { annualRevenueOptions, employeeCountOptions, organizationTypes} from '@/app/data/dataGeneric'
import {handleCategoryChange, handleSubcategoryChange} from '@/app/Func/handlers'
import getLocalStorage from "../Func/localStorage";
import { urlProduction } from "@/app/data/dataGeneric";


const stepsForm = ["01", "02", "03", "04"];

export default function UpdateCompany() {
  const router = useRouter();
  const record = useRecordContext();
  const companyId = record?.id;
  const user = getLocalStorage();
  
  console.log("Record completo:", record);
  console.log("Company ID extraído:", companyId);

  // ------------ Estados Locales ---------------------//
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [foundationYear, setfoundationYear] = useState("");
  const [annualRevenue, setAnnualRevenue] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [cuit, setCuit] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(true);


  //-------------- Funciones para traer las opciones del form --------------//
  const [locationsOptions, setLocationsOptions] = useState([]);
  const [subcategoriesOptions, setSubcategoriesOptions] = useState([]);
  const [subcategorySelected, setSubcategorySelected] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stepCompletion, setStepCompletion] = useState([false, false, false, false]);
  const [errorMessages, setErrorMessages] = useState({
    step1: "",
    step2: "",
    step3: "",
    step4: "",
  });
  

  const getLocation = async () => {
    try {
      const response = await axios.get(`${urlProduction}/locations`);
      const transformedData = response.data.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      setLocationsOptions(transformedData);
      console.log("Locations: ", transformedData);
    } catch (error) {
      console.log("Error al traer las ubicaciones: ", error);
      throw error;
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(`${urlProduction}/categories`);
      const transformedData = response.data.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      setCategories(transformedData);
      console.log("Categories: ", transformedData);
    } catch (error) {
      console.log("Error al traer las categorias: ", error);
      throw error;
    }
  };

  const getSubcategories = async () => {
    try {
      const response = await axios.get(`${urlProduction}/subcategories`);
      const transformedData = response.data.map((item) => ({
        id: item.id,
        name: item.name,
        categoryId: item.parentCategory.id,
      }));
      setSubcategories(transformedData);
      console.log('Subcategories: ', transformedData)
    } catch (error) {
      console.log("Error al traer las subcategorias: ", error);
      throw error;
    }
  };

  // Función para obtener los datos de la empresa
  const getCompanyData = async () => {
    if (!companyId) {
      console.log("No hay companyId disponible");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log("Cargando datos de la empresa con ID:", companyId);
      const response = await axios.get(`${urlProduction}/companies/${companyId}`);
      const companyData = response.data;
      console.log("Datos de la empresa obtenidos:", companyData);
      
      // Rellenar los campos con los datos existentes
      setName(companyData.name || "");
      setDescription(companyData.description || "");
      setfoundationYear(companyData.foundationYear || "");
      setCuit(companyData.cuit || "");
      setOrganizationType(companyData.organizationType || "");
      setAnnualRevenue(companyData.annualRevenue || "");
      setEmployeeCount(companyData.employeeCount || "");
      setProfilePicture(companyData.profilePicture || "");
      setBannerPicture(companyData.bannerPicture || "");
      
      // Rellenar locations
      if (companyData.locations && Array.isArray(companyData.locations)) {
        setLocations(companyData.locations.map(loc => loc.id));
      }
      
      // Rellenar subcategories y category
      if (companyData.subcategories && Array.isArray(companyData.subcategories) && companyData.subcategories.length > 0) {
        const subcategoryIds = companyData.subcategories.map(sub => sub.id);
        setSubcategorySelected(subcategoryIds);
        
        // Obtener la categoría de la primera subcategoría y filtrar las subcategorías de esa categoría
        const firstSubcategory = companyData.subcategories[0];
        if (firstSubcategory && firstSubcategory.CategoryId) {
          const categoryId = firstSubcategory.CategoryId;
          setSelectedCategory(categoryId);
          
          // Filtrar las subcategorías de esa categoría usando el estado ya cargado
          const filteredSubcategories = subcategories.filter(
            (subcategory) => subcategory.categoryId === categoryId
          );
          setSubcategoriesOptions(filteredSubcategories);
          console.log('Categoría inicial seleccionada:', categoryId);
          console.log('Subcategorías filtradas:', filteredSubcategories);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar los datos de la empresa:", error);
      displayFailedMessage("Error al cargar los datos de la empresa");
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
    getSubcategories();
    getCategories();
  }, []);

  // Cargar datos de la empresa después de que se carguen las subcategorías
  useEffect(() => {
    if (subcategories.length > 0 && companyId) {
      getCompanyData();
    }
  }, [companyId, subcategories.length]);

  // -------- Handlers de campos ----------------- //

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleCategoryChangeLocal = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    console.log('categoryId:',categoryId)
    const filteredSubcategories = subcategories.filter(
      (subcategory) => subcategory.categoryId === categoryId
    );
    setSubcategoriesOptions(filteredSubcategories);
    // Limpiar las subcategorías seleccionadas cuando se cambia de categoría
    setSubcategorySelected([]);
    console.log('nuevas opciones de subcat:',filteredSubcategories)
  };

  const handleSubcategoryChangeLocal = (e) => {
    const subcategoryId = e.target.value;
    setSubcategorySelected((prevSubcategories) => {
      if (prevSubcategories.includes(subcategoryId)) {
        return prevSubcategories.filter(id => id !== subcategoryId);
      } else {
        return [...prevSubcategories, subcategoryId];
      }
    });
    console.log('Subcategorias seleccionadas:', subcategoryId)
  };
  console.log('Estado subcategorySelected:', subcategorySelected)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const companyData = {
      name,
      description,
      locations,
      subcategories: subcategorySelected,
      foundationYear,
      annualRevenue,
      employeeCount,
      cuit,
      profilePicture,
      bannerPicture,
      organizationType,
    };

    console.log("Datos enviados para actualización:", companyData);

    try {
      const response = await axios.put(
        `${urlProduction}/companies/${companyId}`,
        companyData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Respuesta del servidor:", response);
      displaySuccessMessage("Empresa actualizada con éxito");
      
      setTimeout(() => {
        router.push("/directory");
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar la empresa:", error);
      console.log("Datos enviados en companyData:", companyData);
      displayFailedMessage(error.response?.data?.error || "Error al actualizar la empresa");
    }
  };

  // ------------------------ Cloudinary ----------------------------//

  const [profilePicture, setProfilePicture] = useState("");
  const [bannerPicture, setBannerPicture] = useState("");
  const [profilePictureError, setProfilePictureError] = useState("");
  const [bannerPictureError, setBannerPictureError] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);

  const uploadImage = async (e, imageType) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "energialy_users");
    setLoadingImage(true);

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dbraa6jpj/image/upload",
        data  
      );
      const file = res.data;
      console.log("Respuesta de cloudinary:", res);

      if (imageType === "profile") {
        setProfilePicture(file.secure_url);
      } else if (imageType === "banner") {
        setBannerPicture(file.secure_url);
      }

      setLoadingImage(false);
    } catch (error) {
      console.log("Error al cargar la imagen:", error);
      setLoadingImage(false);
    }
  };

  // ------------------------------------------------------------------------ //

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Cargando datos de la empresa...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center min-h-screen">
      {/* BANNER */}
      <div className="relative mb-4">
        <img
          src="https://energialy.ar/uploads/settings/home//Back-Acceso-Denegado.png"
          alt="Fondo de la imagen"
          className="w-full h-auto"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container relative z-10 px-4 mx-auto text-center text-white font-poppins">
            <h2 className="mb-2 text-4xl font-bold">Actualiza los datos de</h2>
            <h2 className="text-4xl font-bold">tu empresa en Energialy</h2>
          </div>
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
      </div>

      {/* FORMULARIO */}

      <div className="w-full">
        <div className="m-20">
          <form
            className="m-10 p-8 max-w-[70%] mx-auto"
            onSubmit={handleSubmit}
          >
            <div className="items-center mb-3">
              <div className="w-full mx-auto text-center mb-15 font-poppins">
                <h3 className="mb-4 text-2xl font-bold leading-7">
                  Actualiza los datos de tu empresa
                </h3>
                <p className="mb-4 text-base leading-6">
                  Modifica la información que necesites actualizar.
                </p>
              </div>

              <div className="flex items-center justify-center flex-grow">
                <ul className="flex p-0 mb-5">
                  {stepsForm.map((option, index) => (
                    <li key={index} className="mx-4">
                      <a
                        onClick={() => setStep(index + 1)}
                        className={`no-underline w-10 h-10 cursor-pointer flex items-center justify-center rounded-full border-2 border-solid font-bold text-xs leading-[38px] font-poppins ${
                          step === index + 1
                            ? "border-[#191654] text-[#191654]"
                            : "text-gray-400 border-gray-400"
                        }`}
                      >
                        {option}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              {step === 1 && (
                <div>
                  <div className="mb-3">
                    <input
                      type="text"
                      id="name"
                      placeholder="Nombre de la empresa"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-lg border rounded"
                    />
                  </div>
                  <div className="mb-3">
                    <textarea
                      id="description"
                      placeholder="Descripción de la empresa"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 text-lg border rounded resize-y"
                      rows="4"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-3">
                      <input
                        type="number"
                        id="foundationYear"
                        placeholder="Año de fundación (ej. 1990)"
                        value={foundationYear}
                        onChange={(e) => setfoundationYear(e.target.value)}
                        className={`w-full px-3 py-2 text-lg border ${
                          foundationYear.length === 4
                            ? "border-green-500"
                            : "border-red-500"
                        }`}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        id="cuit"
                        placeholder="CUIT de la empresa"
                        value={cuit}
                        onChange={(e) => setCuit(e.target.value)}
                        className="w-full px-3 py-2 text-lg border"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-4 py-2 text-white bg-[#191654] rounded hover:bg-secondary-600 transition duration-300"
                  >
                    Siguiente
                  </button>
                </div>
              )}
              {step === 2 && (
                <div>
                  <div className="space-y-2">
                    <div className="mb-3">
                      <label className="block mb-2 font-bold">Tipo de Organización</label>
                      <div className="flex flex-wrap">
                        {organizationTypes.map((type, index) => (
                          <div key={index} className="w-1/2 mb-2">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                id={`organizationType${index}`}
                                value={type}
                                checked={organizationType === type}
                                onChange={(e) =>
                                  setOrganizationType(e.target.value)
                                }
                              />
                              <span className="ml-2">{type}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block mb-2 font-bold">Ingresos Anuales</label>
                        {annualRevenueOptions.map((option, index) => (
                          <div key={index} className="mb-2">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                value={option}
                                checked={annualRevenue === option}
                                onChange={(e) =>
                                  setAnnualRevenue(e.target.value)
                                }
                              />
                              <span className="ml-2">{option}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                      <div>
                        <label className="block mb-2 font-bold">
                          Cantidad de Empleados
                        </label>
                        {employeeCountOptions.map((option, index) => (
                          <div key={index} className="mb-2">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                value={option}
                                checked={employeeCount === option}
                                onChange={(e) =>
                                  setEmployeeCount(e.target.value)
                                }
                              />
                              <span className="ml-2">{option}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 space-x-4">
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="px-4 py-2 text-gray-500 transition duration-300 bg-gray-200 rounded hover:bg-secondary-600 hover:text-white"
                      >
                        Volver
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-4 py-2 text-white bg-[#191654] rounded hover:bg-secondary-600 transition duration-300"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div>
                  <div className="mb-3">
                    <label className="block mb-2 font-bold">
                      Seleccionar ubicaciones
                    </label>
                    <div className="flex flex-wrap">
                      {locationsOptions.map((option) => (
                        <div key={option.id} className="w-1/2 mb-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              value={option.id}
                              checked={locations.includes(option.id)}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                setLocations((prevLocations) =>
                                  isChecked
                                    ? [...prevLocations, option.id]
                                    : prevLocations.filter(
                                        (id) => id !== option.id
                                      )
                                );
                              }}
                            />
                            <span className="ml-2">{option.name}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <select
                      value={selectedCategory}
                      onChange={handleCategoryChangeLocal} 
                      className="w-full px-2 py-2 border rounded"
                    >
                      <option value="">Seleccione una categoria</option>
                      {categories?.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="block mb-2 font-bold">Subcategorías</label>
                    <div className="flex flex-wrap">
                      {subcategoriesOptions.map((option) => (
                        <div key={option.id} className="w-1/2 mb-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              value={option.id}
                              checked={subcategorySelected.includes(option.id)}
                              onChange={handleSubcategoryChangeLocal}
                            />
                            <span className="ml-2">{option.name}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-4 py-2 text-gray-500 transition duration-300 bg-gray-200 rounded hover:bg-secondary-600 hover:text-white"
                    >
                      Volver
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-4 py-2 text-white bg-[#191654] rounded hover:bg-secondary-600 transition duration-300"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
              {step === 4 && (
                <div>
                  <div className="mb-3">
                    <label htmlFor="profilePicture" className="block mb-2 font-bold">Foto de Perfil</label>
                    <input
                      type="file"
                      id="profilePicture"
                      accept="image/*"
                      onChange={(e) => uploadImage(e, "profile")}
                      className="w-full px-2 py-1 border rounded"
                    />
                    {profilePictureError && (
                      <p className="text-sm text-red-500">
                        {profilePictureError}
                      </p>
                    )}
                    {loadingImage ? (
                      <h3>Cargando Imagenes...</h3>
                    ) : (
                      profilePicture && <img src={profilePicture} style={{ width: "300px" }} alt="Profile" />
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="bannerPicture" className="block mb-2 font-bold">Banner</label>
                    <input
                      type="file"
                      id="bannerPicture"
                      accept="image/*"
                      onChange={(e) => uploadImage(e, "banner")}
                      className="w-full px-2 py-1 border rounded"
                    />
                    {bannerPictureError && (
                      <p className="text-sm text-red-500">
                        {bannerPictureError}
                      </p>
                    )}
                    {loadingImage ? (
                      <h3>Cargando Imagenes...</h3>
                    ) : (
                      bannerPicture && <img src={bannerPicture} style={{ width: "300px" }} alt="Banner" />
                    )}
                  </div>
                  <div className="mt-4 space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-4 py-2 text-gray-500 transition duration-300 bg-gray-200 rounded hover:bg-secondary-600 hover:text-white"
                    >
                      Volver
                    </button>
                    <button
                      className="px-4 py-2 text-white bg-[#191654] rounded hover:bg-secondary-600 transition duration-300"
                      type="submit"
                    >
                      Actualizar Empresa
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
