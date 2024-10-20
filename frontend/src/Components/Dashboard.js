import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Container className="dashboard mt-5">
      <Row>
        <Col>
          {isAuthenticated ? (
            <>
              <h2 className="text-center mb-4" style={{ color: '#007bff', fontWeight: 'bold' }}>TaskMaster</h2>
              <p style={{ fontSize: '1.2em', lineHeight: '1.6' }}>
                Con <strong>TaskMaster</strong>, podrás gestionar todas tus tareas y actividades pendientes de forma organizada y efectiva. 
                Nunca más se te olvidará asistir a reuniones, pagar tus cuentas, o cumplir con tus responsabilidades.
              </p>
              <p style={{ fontSize: '1.2em', lineHeight: '1.6' }}>
                Podrás crear tareas y asignarles un nombre, una descripción, y una fecha límite para facilitar su seguimiento. También podrás editar o eliminar tareas según tus necesidades y visualizar el <strong>tablero Kanban</strong> para gestionar el progreso de cada una de tus actividades.
              </p>
              <p style={{ fontSize: '1.2em', lineHeight: '1.6' }}>
                ¡Verás cómo tu vida se hará más sencilla y productiva con TaskMaster!
              </p>
              <div className="text-center mt-4">
                <Link to="/tasks/create">
                  <Button variant="primary" className="me-3">
                    Crear Tarea
                  </Button>
                </Link>
                <Link to="/kanban">
                  <Button variant="secondary">
                    Ver Tablero Kanban
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-center mb-4" style={{ color: '#007bff', fontWeight: 'bold' }}>Bienvenido a TaskMaster</h2>
              <p style={{ fontSize: '1.2em', lineHeight: '1.6' }}>
                Con <strong>TaskMaster</strong>, podrás gestionar todas tus tareas y actividades pendientes de forma organizada y efectiva. 
                Nunca más se te olvidará asistir a reuniones, pagar tus cuentas, o cumplir con tus responsabilidades.
              </p>
              <p style={{ fontSize: '1.2em', lineHeight: '1.6' }}>
                Podrás crear tareas y asignarles un nombre, una descripción, y una fecha límite para facilitar su seguimiento. También podrás editar o eliminar tareas según tus necesidades y visualizar el <strong>tablero Kanban</strong> para gestionar el progreso de cada una de tus actividades.
              </p>
              <p style={{ fontSize: '1.2em', lineHeight: '1.6' }}>
                ¡Verás cómo tu vida se hará más sencilla y productiva con TaskMaster!
              </p>
              <p style={{ fontSize: '1.2em', lineHeight: '1.6' }}>
                Para crear y administrar tus actividades, por favor <strong>inicia sesión</strong> o <strong>regístrate</strong>.
              </p>
              <div className="text-center mt-4">
                <Link to="/login">
                  <Button variant="primary" className="me-3">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="secondary">
                    Registrarse
                  </Button>
                </Link>
              </div>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
