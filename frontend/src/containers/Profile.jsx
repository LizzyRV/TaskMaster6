import React, { useState, useEffect } from 'react';
import axios2 from '../services/axios2';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    nombre: '',
    apellido: '',
    email: '',
    username: '',
  });
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
  });
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios2.get('auth/profile/');
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error al obtener la información del usuario', error);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (message || errorMessage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [message, errorMessage]);

  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingProfile(true);
    try {
      await axios2.put('auth/profile/', userInfo);
      setMessage('Información actualizada con éxito.');
      setErrorMessage('');
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Desplazar hacia arriba
    } catch (error) {
      console.error('Error al actualizar la información del usuario', error);
      setErrorMessage('Error al actualizar la información. Inténtalo de nuevo.');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingPassword(true);

    if (passwordData.new_password.length < 6) {
      setErrorMessage('La nueva contraseña debe tener al menos 6 caracteres.');
      setIsLoadingPassword(false);
      window.scrollTo({ top: 0, behavior: 'smooth' }); //Desplazar hacia arriba cuando sale el mensaje
      return;
    }

    
    try {
      await axios2.put('change-password/', passwordData);
      setMessage('Contraseña actualizada con éxito.');
      setErrorMessage('');
      setPasswordData({
        old_password: '',
        new_password: '',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error al actualizar la contraseña', error);
      if (error.response && error.response.data) {
        const serverErrorMessage = error.response.data.detail || 'Error al actualizar la contraseña.';
        setErrorMessage(serverErrorMessage);
      } else {
        setErrorMessage('Error al actualizar la contraseña. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoadingPassword(false);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: '600px' }}>
      <h2 className="text-center">Perfil de Usuario</h2>

      {message && (
        <Alert variant="success" className="mt-3">
          {message}
        </Alert>
      )}

  
      {errorMessage && (
        <Alert variant="danger" className="mt-3">
          {errorMessage}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formNombre" className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={userInfo.nombre}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formApellido" className="mb-3">
          <Form.Label>Apellido</Form.Label>
          <Form.Control
            type="text"
            name="apellido"
            value={userInfo.apellido}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formUsername" className="mb-3">
          <Form.Label>Nombre de Usuario</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={userInfo.username}
            readOnly
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100" disabled={isLoadingProfile}>
          {isLoadingProfile ? 'Actualizando...' : 'Actualizar Información'}
        </Button>
      </Form>

      {/*Formulario para cambiar la contraseña*/}
      <h3 className="mt-5 text-center">Cambiar Contraseña</h3>
      <Form onSubmit={handlePasswordSubmit}>
        <Form.Group controlId="formOldPassword" className="mb-3">
          <Form.Label>Contraseña Actual</Form.Label>
          <Form.Control
            type="password"
            name="old_password"
            value={passwordData.old_password}
            onChange={handlePasswordChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formNewPassword" className="mb-3">
          <Form.Label>Nueva Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="new_password"
            value={passwordData.new_password}
            onChange={handlePasswordChange}
            required
          />
        </Form.Group>
        <Button variant="secondary" type="submit" className="w-100" disabled={isLoadingPassword}>
          {isLoadingPassword ? 'Actualizando...' : 'Cambiar Contraseña'}
        </Button>
      </Form>
    </Container>
  );
};

export default Profile;
