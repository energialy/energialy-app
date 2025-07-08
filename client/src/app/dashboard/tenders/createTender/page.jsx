'use client';
import { useGetCategoriesQuery } from '@/app/redux/services/categoriesApi';
import { useGetLocationsQuery } from '@/app/redux/services/locationApi';
import { Card, Typography } from '@material-tailwind/react';
import { FormGroup } from 'react-bootstrap';
import Select from 'react-select';
import { useState } from 'react';
import { duration, etapa, tendersTypes, exampleCategories, exampleLocations, urlProduction } from '@/app/data/dataGeneric';
import axios from 'axios';
import { displayFailedMessage, displaySuccessMessage } from '@/app/components/Toastify';
import ErrorMensage from '@/app/components/ErrorMensage';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import getLocalStorage from '@/app/Func/localStorage';

function CreateTenderForm() {
  //fetch states
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { data: locations, isLoading: loadingLocations } = useGetLocationsQuery();

  // Usar datos de ejemplo si no hay conectividad
  const displayCategories = categories && categories.length > 0 ? categories : exampleCategories;
  const displayLocations = locations && locations.length > 0 ? locations : exampleLocations;

  const userData = getLocalStorage();

  const router = useRouter();
  //local states
  const [tenderData, setTenderData] = useState({
    title: '',
    description: '',
    contractType: '',
    budget: 0,
    showBudget: false,
    majorSector: '',
    projectDuration: '',
    validityDate: '',
    locationId: '',
    subcategories: [],
    address: '',
    companyId: userData?.company.id,
    files: [],
    customFields: [], // Campos personalizados
    servicePrices: [] // array de servicios con precios
  });

  const [inputError, setInputError] = useState({
    title: '',
    description: '',
    contractType: '',
    budget: '',
    majorSector: '',
    projectDuration: '',
    validityDate: '',
    locationId: '',
    subcategories: '',
    files: [],
    customFields: '',
    servicePrices: '',
  });
  const [categorieSelected, setCategorieSelected] = useState([]);
  const [subCatSelected, setSubCatSelected] = useState([]);
  const [isShow, setIsShow] = useState(true);
  const [isPrivateCheqed, setIsPrivateCheqed] = useState(false);
  const [isSponsoredCheqed, setIsSponsoredCheqed] = useState(false);
  const [editorValue, setEditorValue] = useState('');
  const [fileName, setFileName] = useState('');

  // Estados para campos personalizados
  const [customFields, setCustomFields] = useState([]);
  const [showCustomFieldModal, setShowCustomFieldModal] = useState(false);
  const [newField, setNewField] = useState({
    type: 'text', // text, textarea, select, radio, number, date
    label: '',
    placeholder: '',
    required: false,
    options: [] // Para select y radio
  });

  // Estados para servicios y precios
  const [servicePrices, setServicePrices] = useState([]);

  //Handlers
  const handleChangeCategories = (e) => {
    //crear las subcategorias para el select
    const subcategories = displayCategories?.find((cat) => cat.id === e.value)?.subcategories || [];
    setSubCatSelected(subcategories.map((subcat) => ({ name: subcat.name, value: subcat.id })));
  };
  const handleSubcategorieChange = (e) => {
    const arr = [];
    arr.push(e.value);
    setTenderData({ ...tenderData, subcategories: arr });
  };

  const handleChangeLocation = (e) => {
    setTenderData({ ...tenderData, locationId: e.value });
  };
  const handlePrivateChange = (e) => {
    if (isPrivateCheqed === false) {
      setIsPrivateCheqed(true);
    } else {
      setIsPrivateCheqed(false);
    }
  };

  const handleSponsoredChange = (e) => {
    if (isSponsoredCheqed === false) {
      setIsSponsoredCheqed(true);
    } else {
      setIsSponsoredCheqed(false);
    }
  };

  const handleShowChange = () => {
    // if(isShow === false){
    //   setIsShow(true);
    //    setTenderData({ ...tenderData, showBudget: true });
    // }else{
    //   setIsShow(false)
    //    setTenderData({ ...tenderData, showBudget: false });
    // }
    setIsShow(!isShow);
    setTenderData({ ...tenderData, showBudget: isShow });
  };

  // const handleDescriptionChange = (data) => {
  //   setTenderData({ ...tenderData, description: data });
  // }

  const handleInputsChanges = (e) => {
    setTenderData({ ...tenderData, [e.target.name]: e.target.value });
    console.log(tenderData);
  };

  // Handlers para campos personalizados
  const handleAddCustomField = () => {
    if (newField.label.trim() === '') return;

    const fieldToAdd = {
      id: Date.now(), // ID temporal
      ...newField,
      options: newField.type === 'select' || newField.type === 'radio' ? newField.options : []
    };

    setCustomFields([...customFields, fieldToAdd]);
    setTenderData({ ...tenderData, customFields: [...customFields, fieldToAdd] });

    // Reset form
    setNewField({
      type: 'text',
      label: '',
      placeholder: '',
      required: false,
      options: []
    });
    setShowCustomFieldModal(false);
  };

  const handleRemoveCustomField = (fieldId) => {
    const updatedFields = customFields.filter(field => field.id !== fieldId);
    setCustomFields(updatedFields);
    setTenderData({ ...tenderData, customFields: updatedFields });
  };

  const handleAddOption = () => {
    setNewField({
      ...newField,
      options: [...newField.options, '']
    });
  };

  const handleUpdateOption = (index, value) => {
    const updatedOptions = [...newField.options];
    updatedOptions[index] = value;
    setNewField({ ...newField, options: updatedOptions });
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = newField.options.filter((_, i) => i !== index);
    setNewField({ ...newField, options: updatedOptions });
  };

  // Handlers para servicios y precios
  const handleAddServicePrice = () => {
    const newService = {
      id: Date.now(),
      name: '',
      description: '',
      price: 0,
      priceType: 'fixed' // 'fixed' o 'per_day'
    };
    setServicePrices([...servicePrices, newService]);
    setTenderData({ ...tenderData, servicePrices: [...servicePrices, newService] });
  };

  const handleUpdateServicePrice = (serviceId, field, value) => {
    const updatedServices = servicePrices.map(service =>
      service.id === serviceId ? { ...service, [field]: value } : service
    );
    setServicePrices(updatedServices);
    setTenderData({ ...tenderData, servicePrices: updatedServices });
  };

  const handleRemoveServicePrice = (serviceId) => {
    const updatedServices = servicePrices.filter(service => service.id !== serviceId);
    setServicePrices(updatedServices);
    setTenderData({ ...tenderData, servicePrices: updatedServices });
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'energialy_users');
    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/dbraa6jpj/image/upload', data);
      const file = res.data;
      setFileName(file.original_filename);
      // Asegurarse de que files sea un array de URLs
      setTenderData((prev) => ({ ...prev, files: [...(prev.files || []), file.secure_url] }));
    } catch (error) {
      console.log('Error al cargar la imagen:', error);
    }
  };

  const validation = (tenderData) => {
    console.log('entro acá');
    console.log(tenderData);
    const errors = {};

    if (tenderData.title === '') {
      errors.title = 'El titulo de la Licitación no puede estar vacío';
    }
    if (tenderData.description === '') {
      errors.description = 'La Licitación debe tener una descripción';
    }
    if (tenderData.contractType === '') {
      errors.contractType = 'El tipo de contrato es requerido';
    }
    if (tenderData.majorSector === '') {
      errors.majorSector = 'El sector es requerido';
    }
    if (tenderData.projectDuration === '') {
      errors.projectDuration = 'La duración del proyecto es requerida';
    }
    if (tenderData.validityDate === '') {
      errors.validityDate = 'La fecha límite para enviar propuestas es requerida';
    }
    if (tenderData.locationId === '') {
      errors.locationId = 'La ubicación del proyecto es requerida';
    }
    if (tenderData.subcategories.length === 0) {
      errors.subcategories = 'Las subcategorias del proyecto son requeridas';
    }
    if (tenderData.budget === 0 || tenderData.budget === '') {
      errors.budget = 'El presupuesto del proyecto es requerido';
    }
    if (tenderData.files.length === 0) {
      errors.files = 'La documentacion es requerida';
    }
    // Validación para campos personalizados
    if (tenderData.customFields && tenderData.customFields.length > 0) {
      const invalidFields = tenderData.customFields.filter(field => 
        !field.label || field.label.trim() === '' ||
        (field.type === 'select' || field.type === 'radio') && field.options.length === 0
      );
      if (invalidFields.length > 0) {
        errors.customFields = 'Todos los campos personalizados deben tener una etiqueta válida y opciones si son de tipo selección';
      }
    }
    // Validación para servicios y precios
    if (tenderData.servicePrices && tenderData.servicePrices.length > 0) {
      const invalidServices = tenderData.servicePrices.filter(service => 
        !service.name || service.name.trim() === '' || 
        service.price <= 0 ||
        !service.priceType || service.priceType.trim() === ''
      );
      if (invalidServices.length > 0) {
        errors.servicePrices = 'Todos los servicios deben tener un nombre, un tipo de precio y un precio válido';
      }
    }

    setInputError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasErrors = !validation(tenderData);
    if (!hasErrors) {
      try {
        // Limpiar campos temporales y asegurar tipos correctos
        const payload = { ...tenderData };
        // Convertir budget a número
        payload.budget = Number(payload.budget);
        // Limpiar servicePrices (remover id y asegurar price como número)
        if (Array.isArray(payload.servicePrices)) {
          payload.servicePrices = payload.servicePrices.map(({ id, ...rest }) => ({ 
            ...rest, 
            price: Number(rest.price),
            priceType: rest.priceType || 'fixed'
          }));
        }
        // Eliminar customFields del payload porque la tabla Tenders no lo soporta
        delete payload.customFields;
        // Enviar payload limpio
        const tender = await axios.post(`${urlProduction}/tenders`, payload);
        displaySuccessMessage('Licitación creada con éxito');
        setTimeout(() => router.back(), 2000);
      } catch (error) {
        console.log(error);
        const msg = error?.response?.data?.error || 'Error al crear la licitación';
        displayFailedMessage(msg);
      }
    }
  };

  return (
    <>
      <FormGroup>
        <Card className="p-4">
          {/*Header Form*/}
          <div className="border-b-1">
            <Typography variant="h6" className="mb-4">
              Publicar Licitación
            </Typography>
            <Typography variant="small" className="mb-4">
              Publicar licitación publica o privada para que una empresa pueda postularse y luego contratarla.
            </Typography>
          </div>
          {/*First Step Data*/}
          <div className="flex flex-col gap-4">
            <div className="border-l-4 border-primary-600">
              <Typography variant="h6" className="ml-5 my-0">
                Descripción de la Licitación
              </Typography>
            </div>
            <div className="ml-5 md:flex md:flex-col md:gap-2">
              <input
                className="w-full border-1 border-gray-300 rounded-md p-3"
                type="text"
                placeholder="Título"
                name="title"
                onChange={handleInputsChanges}
              />
              {inputError.title !== '' ? <ErrorMensage message={inputError.title} /> : null}
              <div className="md:flex md:gap-3">
                <select
                  className="w-1/2 border-1 bg-transparent border-gray-300 rounded-md p-3 text-gray-500"
                  onChange={handleInputsChanges}
                  name="contractType"
                >
                  <option>TIPO DE CONTRATACIÓN</option>
                  {tendersTypes?.map((type, index) => (
                    <option key={index}>{type}</option>
                  ))}
                </select>
                {inputError.contractType !== '' ? <ErrorMensage message={inputError.contractType} /> : null}
                <select
                  className="w-1/2 border-1 bg-transparent border-gray-300 rounded-md p-3 text-gray-500"
                  name="projectDuration"
                  onChange={handleInputsChanges}
                >
                  <option>DURACIÓN DE LA LICITACIÓN</option>
                  {duration.map((d, index) => (
                    <option key={index}>{d}</option>
                  ))}
                </select>
                {inputError.projectDuration !== '' ? <ErrorMensage message={inputError.projectDuration} /> : null}
              </div>
              <div className="md:flex md:gap-3">
                <select
                  className="w-1/2 border-1 bg-transparent border-gray-300 rounded-md p-3 text-gray-500"
                  name="majorSector"
                  onChange={handleInputsChanges}
                >
                  <option>ETAPA</option>
                  {etapa.map((e, index) => (
                    <option key={index}>{e}</option>
                  ))}
                </select>
                {inputError.majorSector !== '' ? <ErrorMensage message={inputError.majorSector} /> : null}
                <div className="w-1/2 border-1 bg-transparent border-gray-300 rounded-md p-3 text-gray-500 flex justify-between">
                  <label htmlFor="">Fecha límite para enviar Propuestas</label>
                  <input className="focus:border-none" type="date" name="validityDate" onChange={handleInputsChanges} />
                  {inputError.validityDate !== '' ? <ErrorMensage message={inputError.validityDate} /> : null}
                </div>
              </div>
              <div className="md:flex md:gap-3">
                <input
                  className="w-1/2 border-1 bg-transparent border-gray-300 rounded-md p-3 text-gray-500"
                  type="number"
                  name="budget"
                  onChange={handleInputsChanges}
                  placeholder="Presupuesto en U$S"
                />
                {inputError.budget !== '' ? <ErrorMensage message={inputError.budget} /> : null}
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <div className="border-l-4 border-primary-600 flex justify-between">
                <Typography variant="h6" className="ml-5 my-0">
                  Presupuesto Privado
                </Typography>
                <div className="flex gap-4">
                  <label class="inline-block pl-[0.15rem] hover:cursor-pointer" for="flexSwitchCheckDefault">
                    {isShow ? 'Mostrar Presupuesto' : 'No Mostrar Presupuesto'}
                  </label>

                  <input
                    class="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                    onChange={handleShowChange}
                  />
                </div>
              </div>
            </div>
          </div>
          {/*Categories*/}
          <div className="flex flex-col gap-4 mt-4">
            <div className="border-l-4 border-primary-600">
              <Typography variant="h6" className="ml-5 my-0">
                Categorias
              </Typography>
            </div>
            <div className="ml-5 flex flex-col gap-2">
              {categoriesLoading && 'Loading...'}
              <Select
                options={displayCategories?.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                  key: cat.id,
                }))}
                placeholder="CATEGORIA"
                onChange={handleChangeCategories}
              />
            </div>
          </div>
          {/*Sub-Categories*/}
          <div className="flex flex-col gap-4 mt-4">
            <div className="border-l-4 border-primary-600">
              <Typography variant="h6" className="ml-5 my-0">
                Subcategorias
              </Typography>
            </div>
            <div className="ml-5 flex flex-col gap-2">
              {categoriesLoading && 'Loading...'}
              <Select
                options={subCatSelected?.map((subCat) => ({
                  label: subCat.name,
                  value: subCat.value,
                  key: subCat.id,
                }))}
                name="subcategories"
                placeholder="SUBCATEGORIA"
                onChange={handleSubcategorieChange}
              />
              {inputError.subcategories !== '' ? <ErrorMensage message={inputError.subcategories} /> : null}
            </div>
          </div>
          {/*Location Data*/}
          <div className="flex flex-col gap-4 mt-4">
            <div className="border-l-4 border-primary-600">
              <Typography variant="h6" className="ml-5 my-0">
                Ubicación
              </Typography>
            </div>
            <div className="ml-5 flex flex-col gap-2">
              {loadingLocations && 'Loading...'}
              <Select
                options={displayLocations?.map((loc) => ({
                  value: loc.id,
                  label: loc.name,
                }))}
                placeholder="SELECCIONAR UBICACIÓN"
                onChange={handleChangeLocation}
              />
              {inputError.locationId !== '' ? <ErrorMensage message={inputError.locationId} /> : null}
              <input
                className="w-full border-1 border-gray-300 rounded-md p-3"
                type="text"
                name="address"
                placeholder="Su Dirección"
                onChange={handleInputsChanges}
              />
            </div>
          </div>
          {/*suscription plus*/}
          <div className="flex flex-col gap-4 mt-4">
            <div className="border-l-4 border-primary-600 flex justify-between">
              <Typography variant="h6" className="ml-5 my-0">
                Licitación Destacada
              </Typography>
              <div className="flex gap-4">
                <label class="inline-block pl-[0.15rem] hover:cursor-pointer" for="flexSwitchCheckDefault">
                  {isSponsoredCheqed ? 'Destacar' : 'No destacar'}
                </label>
                <input
                  class="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                  onChange={handleSponsoredChange}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <div className="border-l-4 border-primary-600 flex justify-between">
              <Typography variant="h6" className="ml-5 my-0">
                Licitación Privada
              </Typography>
              <div className="flex gap-4">
                <label class="inline-block pl-[0.15rem] hover:cursor-pointer" for="flexSwitchCheckDefault">
                  {isPrivateCheqed ? 'Privada' : 'Publica'}
                </label>

                <input
                  class="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                  onChange={handlePrivateChange}
                />
              </div>
            </div>
          </div>

          {/*Editor Data*/}
          <div className="flex flex-col gap-4 mt-4 -z-0">
            <div className="border-l-4 border-primary-600">
              <Typography variant="h6" className="ml-5 my-0">
                Detalles De La Licitación
              </Typography>
            </div>
            <div className="ml-5 flex flex-col gap-2">
              <textarea
                className="w-full border-1 border-gray-300 rounded-md p-3"
                name="description"
                onChange={handleInputsChanges}
                placeholder="Ingresa el detalle de la Licitación"
              ></textarea>
            </div>
          </div>

          {/*File Attachment */}
          <div className="flex flex-col gap-4 mt-4">
            <div className="border-l-4 border-primary-600 flex justify-between">
              <Typography variant="h6" className="ml-5 my-0">
                Requisitos
              </Typography>
            </div>
            <div className="flex border-dashed w-full border-2 border-gray-300 rounded-md p-3 justify-between items-center">
              <button className="bg-secondary-500 text-white py-3 px-5 rounded-lg inline-block text-center uppercase font-semibold tracking-wide text-sm">
                <label htmlFor="filePicker" className="bg-transparent cursor-pointer capitalize">
                  {tenderData.files.length > 0 ? `Documento Cargado: ${fileName}` : 'Seleccionar archivo. Ningún archivo selec.'}
                </label>
                <input name="files" type="file" id="filePicker" multiple className="invisible" onChange={handleFileChange} />
              </button>
              <Typography className="mb-0">
                Puedes cargar documentación con los requisitos.
                <br />
                Los Proveedores podrán descargar y luego adjuntar al momento de enviarte una Propuesta.
              </Typography>
            </div>
          </div>

          {/* Campos Personalizados */}
          <div className="flex flex-col gap-4 mt-4">
            <div className="border-l-4 border-primary-600 flex justify-between items-center">
              <div>
                <Typography variant="h6" className="ml-5 my-0">
                  Campos Personalizados
                </Typography>
                <Typography variant="small" className="ml-5 text-gray-600">
                  Crea campos específicos para recopilar información de los proveedores al enviar propuestas
                </Typography>
              </div>
              <button 
                type="button"
                onClick={() => setShowCustomFieldModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors"
                title="Agregar nuevo campo personalizado"
              >
                + Agregar Campo
              </button>
            </div>
            
            {/* Lista de campos personalizados */}
            <div className="ml-5 space-y-3">
              {customFields.map((field) => (
                <div key={field.id} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{field.label}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600">
                          Tipo: <span className="font-medium">{field.type}</span>
                        </span>
                        {field.required && (
                          <span className="text-sm text-red-600 font-medium">Requerido</span>
                        )}
                      </div>
                      {field.placeholder && (
                        <p className="text-sm text-gray-500 mt-1">Ayuda: {field.placeholder}</p>
                      )}
                      {field.options.length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          Opciones: {field.options.join(', ')}
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={() => handleRemoveCustomField(field.id)}
                      className="text-red-500 hover:text-red-700 text-sm ml-3 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      title="Eliminar campo"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
              
              {customFields.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-md">
                  <p className="text-gray-500 italic mb-2">No hay campos personalizados agregados</p>
                  <p className="text-sm text-gray-400">
                    Agrega campos para recopilar información específica de los proveedores
                  </p>
                </div>
              )}
              {inputError.customFields !== '' ? <ErrorMensage message={inputError.customFields} /> : null}
            </div>
          </div>

          {/* Servicios y Precios */}
          <div className="flex flex-col gap-4 mt-4">
            <div className="border-l-4 border-primary-600">
              <Typography variant="h6" className="ml-5 my-0">
                Servicios y Precios
              </Typography>
              <Typography variant="small" className="ml-5 text-gray-600">
                Configura servicios específicos como viáticos, transporte, etc. con precios fijos o por día
              </Typography>
            </div>
            
            <div className="ml-5 space-y-4">
              {/* Información sobre servicios */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Ejemplos de servicios:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>Viáticos:</strong> Gastos de comida y alojamiento por día</li>
                  <li>• <strong>Transporte:</strong> Precio fijo para movilización del equipo</li>
                  <li>• <strong>Equipamiento:</strong> Alquiler de maquinaria por día</li>
                  <li>• <strong>Personal especializado:</strong> Costo por día de técnicos</li>
                </ul>
              </div>

              {/* Botón para agregar servicio */}
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={handleAddServicePrice}
                  className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition-colors"
                >
                  + Agregar Servicio
                </button>
                <span className="text-sm text-gray-500">
                  {servicePrices.length === 0 ? 'No hay servicios agregados' : `${servicePrices.length} servicio(s) agregado(s)`}
                </span>
              </div>

              {/* Lista de servicios */}
              <div className="space-y-3">
                {servicePrices.map((service, index) => (
                  <div key={service.id} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-sm font-medium text-gray-700">Servicio #{index + 1}</h4>
                      <button 
                        onClick={() => handleRemoveServicePrice(service.id)}
                        className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
                        title="Eliminar servicio"
                      >
                        Eliminar
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Nombre del Servicio *</label>
                        <input
                          type="text"
                          placeholder="Ej: Viáticos de alimentación"
                          value={service.name}
                          onChange={(e) => handleUpdateServicePrice(service.id, 'name', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
                        <input
                          type="text"
                          placeholder="Ej: Gastos de comida y alojamiento"
                          value={service.description}
                          onChange={(e) => handleUpdateServicePrice(service.id, 'description', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de Precio *</label>
                        <select 
                          value={service.priceType || 'fixed'} 
                          onChange={(e) => handleUpdateServicePrice(service.id, 'priceType', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="fixed">Precio Fijo</option>
                          <option value="per_day">Precio por Día</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Precio de Referencia *
                          {service.priceType === 'per_day' && (
                            <span className="text-gray-500"> (por día)</span>
                          )}
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">U$D</span>
                          <input
                            type="number"
                            placeholder="0"
                            min="0"
                            step="0.01"
                            value={service.price}
                            onChange={(e) => handleUpdateServicePrice(service.id, 'price', parseFloat(e.target.value) || 0)}
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {service.priceType === 'per_day' && (
                            <span className="text-sm text-gray-600">/ día</span>
                          )}
                        </div>
                        {service.priceType === 'per_day' && (
                          <p className="text-xs text-gray-500 mt-1">
                            Vista previa: U$D {service.price || 0} por día
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {servicePrices.length === 0 && (
                  <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-md">
                    <p className="text-gray-500 italic mb-2">No hay servicios agregados</p>
                    <p className="text-sm text-gray-400">
                      Agrega servicios como viáticos, transporte, equipamiento, etc. para que los proveedores puedan cotizar con mayor precisión
                    </p>
                  </div>
                )}
                {inputError.servicePrices !== '' ? <ErrorMensage message={inputError.servicePrices} /> : null}
              </div>
            </div>
          </div>

          <button className="bg-primary-600 text-white font-semibold rounded-md p-2 mt-4" onClick={handleSubmit}>
            Crear Licitación
          </button>
        </Card>

        {/* Modal para crear campo personalizado */}
        {showCustomFieldModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Agregar Campo Personalizado</h3>
              
              <div className="space-y-4">
                {/* Tipo de campo */}
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de Campo *</label>
                  <select 
                    value={newField.type} 
                    onChange={(e) => setNewField({ ...newField, type: e.target.value, options: [] })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="text">Texto Corto</option>
                    <option value="textarea">Texto Largo</option>
                    <option value="number">Número</option>
                    <option value="date">Fecha</option>
                    <option value="select">Lista Desplegable</option>
                    <option value="radio">Opción Múltiple</option>
                  </select>
                </div>

                {/* Etiqueta */}
                <div>
                  <label className="block text-sm font-medium mb-1">Etiqueta *</label>
                  <input
                    type="text"
                    value={newField.label}
                    onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                    placeholder="Ej: ¿Cuántos años de experiencia tienes?"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Placeholder */}
                <div>
                  <label className="block text-sm font-medium mb-1">Texto de Ayuda (opcional)</label>
                  <input
                    type="text"
                    value={newField.placeholder}
                    onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                    placeholder="Texto que aparecerá como ayuda"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Opciones para select y radio */}
                {(newField.type === 'select' || newField.type === 'radio') && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Opciones *</label>
                    <div className="space-y-2">
                      {newField.options.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleUpdateOption(index, e.target.value)}
                            placeholder={`Opción ${index + 1}`}
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button 
                            type="button"
                            onClick={() => handleRemoveOption(index)}
                            className="text-red-500 hover:text-red-700 px-2"
                            title="Eliminar opción"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button"
                        onClick={handleAddOption}
                        className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                      >
                        + Agregar opción
                      </button>
                      {newField.options.length === 0 && (
                        <p className="text-sm text-red-500">Debe agregar al menos una opción</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Campo requerido */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="required"
                    checked={newField.required}
                    onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="required" className="text-sm">Campo requerido</label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => {
                    setShowCustomFieldModal(false);
                    setNewField({
                      type: 'text',
                      label: '',
                      placeholder: '',
                      required: false,
                      options: []
                    });
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleAddCustomField}
                  disabled={!newField.label.trim() || ((newField.type === 'select' || newField.type === 'radio') && newField.options.length === 0)}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Agregar Campo
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer style={{ marginTop: '300px' }} />
      </FormGroup>
    </>
  );
}

export default CreateTenderForm;
