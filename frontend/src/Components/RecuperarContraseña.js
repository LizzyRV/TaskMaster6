import React, { useState } from 'react';
import axios2 from '../services/axios2';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordResetRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios2.post('auth/password-reset/', { email });
      setMessage('Correo de recuperación de contraseña enviado. Revisa tu bandeja de entrada.');
      setIsSuccess(true);
    } catch (error) {
      console.error('Error al solicitar la recuperación de contraseña', error);
      setMessage('No se pudo enviar el correo de recuperación. Por favor, verifica el correo ingresado.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="form-container">
      <div className="form">
        <h2 className="text-center">Recuperar Contraseña</h2>
        {message && (
          <Alert variant={isSuccess ? 'success' : 'danger'} className="mt-3">
            {message}
          </Alert>
        )}
        <Form onSubmit={handlePasswordResetRequest}>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isLoading} className="w-100">
            {isLoading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default RecuperarContrasena;