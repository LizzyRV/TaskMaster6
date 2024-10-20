import React, { useState, useEffect } from 'react';
import axios2 from '../services/axios2';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios2.post('auth/register/', formData);
      setMessage('Registro exitoso. Ahora puedes iniciar sesión.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        navigate('/login');
      }, 1000); 
    } catch (error) {
      console.error('Error en el registro', error);
      setMessage('Hubo un problema con el registro. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [message]);

  return (
    <Container className="form-container">
      <div className="form">
        <h2 className="text-center">Registrarse</h2>
        {message && (
          <Alert variant={message.includes('exitoso') ? 'success' : 'danger'} className="mt-3">
            {message}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNombre" className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formApellido" className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Label>Nombre de Usuario</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Register;