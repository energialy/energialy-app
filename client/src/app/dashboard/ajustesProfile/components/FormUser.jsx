"use client";
import React, { useState } from "react";

export default function FormUser() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [error, setError] = useState("");

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastName = (event) => {
    setLastName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleFirstNameBlur = () => {
    if (!isValidName(firstName)) {
      setFirstNameError("Por favor, ingresa un nombre válido.");
    } else {
      setFirstNameError('');
    }
  };

  const handleLastNameBlur = () => {  
    if (!isValidName(lastName)) {
      setLastNameError("Por favor, ingresa un apellido válido.");
    } else {
      setLastNameError('');
    }
  };

  const handlePasswordBlur = () => {
    if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
    } else {
      setPasswordError("");
    }
  };

  const handleModify = () => {
    
  }

  const isValidName = (name) => {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(name);
  };

  return (
    <div>
      <form className="mb-2 pl-4 pr-4 pt-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label w-40">
              Nombre
            </label>
            <input
              type="firstName"
              className="form-control"
              id="firstName"
              value={firstName}
              onChange={handleFirstNameChange}
              onBlur={handleFirstNameBlur}
              required
            />
            {firstNameError && (
              <div className="text-danger mb-2">{firstNameError}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="lastName" className="form-label w-40">
              Apellido
            </label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              value={lastName}
              onChange={handleLastName}
              onBlur={handleLastNameBlur} // Reutilizamos la misma función
              required
            />
            {lastNameError && (
              <div className="text-danger mb-2">{lastNameError}</div>
            )}
          </div>
        </div>

        {/* Campo de Contraseña */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label w-40">
            Contraseña
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            required
          />
          {passwordError && (
            <div className="text-danger mt- mb-2">{passwordError}</div>
          )}
        </div>

        {/* Botón de Registro */}
        <button
          type="button"
          className="px-4 py-2 text-white bg-[#191654] rounded hover:bg-secondary-600 transition duration-300"
          onClick={handleModify}
        >
          Guardar Cambios
        </button>

        {error && (
          <div className="flex justify-center text-danger mt-2 mb-2">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
