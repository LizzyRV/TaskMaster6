import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios2 from '../../services/axios2';
import taskMasterLogo from '../../assets/taskmaster.jpeg';

const Navbarr = () => {
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem('access_token');


  const [user, setUser] = useState({ nombre: '', apellido: '', username: '' });

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isAuthenticated) {
        try {
          const response = await axios2.get('auth/profile/');
          setUser(response.data);
        } catch (error) {
          console.error('Error al obtener la información del usuario', error);
        }
      }
    };
    fetchUserInfo();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      const refresh_token = localStorage.getItem('refresh_token');
      await axios2.post('auth/logout/', { refresh_token });
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login', { replace: true }); //Redirigir al usuario a la página de inicio de sesión, no puede volver atrás
    }
  };

  return (
    <Navbar expand="lg" className="navbar custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src={taskMasterLogo}
            alt="TaskMaster Logo"
            className="d-inline-block align-top custom-logo me-2"
          />
          TaskMaster
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/tasks/create" className="custom-nav-link">Gestionar tareas</Nav.Link>
                <Nav.Link as={Link} to="/kanban" className="custom-nav-link">Visualizar tareas</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="custom-nav-link">Iniciar sesión</Nav.Link>
              </>
            )}
          </Nav>
          {isAuthenticated && (
            <>
              <span className="navbar-text custom-navbar-text ms-auto me-3">
                Bienvenido, {user.nombre} {user.apellido} ({user.username})
              </span>
              <Nav>
                <Nav.Link as={Link} to="/profile" className="custom-nav-link">Perfil</Nav.Link>
                <Nav.Link className="custom-nav-link logout" onClick={handleLogout}>Cerrar sesión</Nav.Link>
              </Nav>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navbarr;