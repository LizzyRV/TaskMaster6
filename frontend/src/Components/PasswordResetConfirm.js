import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios2 from '../services/axios2';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const PasswordResetConfirm = () => {
  const { uidb64, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword.length < 6 || confirmPassword.length < 6) {
      setMessage('Las contraseñas deben tener al menos 6 caracteres.');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    try {

      await axios2.post(`auth/password-reset-confirm/${uidb64}/${token}/`, {
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      setMessage('Contraseña restablecida con éxito');
      setIsSuccess(true);


      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error(error);
      setMessage(
        error.response && error.response.data && error.response.data.detail
          ? error.response.data.detail
          : 'El enlace de restablecimiento es inválido o ha expirado'
      );
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="form-container">
      <div className="form">
        <h2 className="text-center">Restablecer Contraseña</h2>
        {message && (
          <Alert variant={isSuccess ? 'success' : 'danger'} className="mt-3">
            {message}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="newPassword" className="mb-3">
            <Form.Label>Nueva Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="confirmPassword" className="mb-3">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
            {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default PasswordResetConfirm;
