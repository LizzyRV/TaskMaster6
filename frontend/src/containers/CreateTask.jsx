import React, { useState, useEffect } from 'react';
import axios2 from '../services/axios2';
import { Container, Form, Button, Table, Alert, Row, Col } from 'react-bootstrap';
import '../styles/styles.css';

const CreateTask = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    expiration_date: '',
    priority: 'R',
    category: '',
  });
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [taskIdToEdit, setTaskIdToEdit] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await axios2.get('taskmaster/tasks/');
      setTasks(response.data);
      setFilteredTasks(response.data);
    } catch (error) {
      console.error('Error al obtener las tareas', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios2.get('taskmaster/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error al obtener las categorías', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        expiration_date: new Date(formData.expiration_date).toISOString(),
      };
  
      if (editMode) {
        await axios2.put(`taskmaster/tasks/${taskIdToEdit}/`, payload);
        setMessage('Tarea actualizada con éxito.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        await axios2.post('taskmaster/tasks/', payload);
        setMessage('Tarea creada con éxito.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setIsSuccess(true);
      setFormData({
        name: '',
        description: '',
        expiration_date: '',
        priority: 'R',
        category: '',
      });
      setEditMode(false);
      setTaskIdToEdit(null);
      await fetchTasks();
    } catch (error) {
      console.error('Error al crear/actualizar la tarea', error);
      setMessage('Hubo un problema al crear/actualizar la tarea. Inténtalo de nuevo.');
      setIsSuccess(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const handleEdit = (task) => {
    let expirationDate = task.expiration_date;
    if (expirationDate) {
      expirationDate = expirationDate.split('Z')[0];
    }
  
    setFormData({
      name: task.name,
      description: task.description,
      expiration_date: expirationDate, 
      priority: task.priority,
      category: task.category,
    });
    setEditMode(true);
    setTaskIdToEdit(task.id);

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDelete = async (taskId) => {
    try {
      await axios2.delete(`taskmaster/tasks/${taskId}/`);
      setMessage('Tarea eliminada con éxito.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsSuccess(true);
      await fetchTasks();
    } catch (error) {
      console.error('Error al eliminar la tarea', error);
      setMessage('Hubo un problema al eliminar la tarea. Inténtalo de nuevo.');
      setIsSuccess(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleFilterChange = (e) => {
    const status = e.target.value;
    setFilterStatus(status);
    if (status === '') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter((task) => task.status === status));
    }
  };

  const handleCategoryFilterChange = (e) => {
    const category = e.target.value;
    setFilterCategory(category);
    applyFilters(filterStatus, category);
  };

  const applyFilters = (status, category) => {
    let filtered = tasks;
    if (status) {
      filtered = filtered.filter((task) => task.status === status);
    }
    if (category) {
      filtered = filtered.filter((task) => task.category === parseInt(category));
    }
    setFilteredTasks(filtered);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios2.post('taskmaster/categories/', { name: newCategory });
      setCategories([...categories, response.data]);
      setNewCategory('');
      setMessage('Categoría creada con éxito.');
      setIsSuccess(true);
    } catch (error) {
      console.error('Error al crear la categoría', error);
      setMessage('Hubo un problema al crear la categoría. Inténtalo de nuevo.');
      setIsSuccess(false);
    }
  };

  return (
    <Container className="create-task-container mt-4">
      <h2 className="text-center">{editMode ? 'Editar Tarea' : 'Crear Tarea'}</h2>

      {message && (
        <Alert variant={isSuccess ? 'success' : 'danger'} className="mt-3">
          {message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} className="create-task-form">
        <Form.Group controlId="formName" className="mb-3">
          <Form.Label>Nombre de la Tarea</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formDescription" className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="form-control"
          />
        </Form.Group>
        <Row>
          <Col>
            <Form.Group controlId="formExpirationDate" className="mb-3">
              <Form.Label>Fecha de Vencimiento</Form.Label>
              <Form.Control
                type="datetime-local"
                name="expiration_date"
                value={formData.expiration_date}
                onChange={handleChange}
                required
                className="form-control"
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="formPriority" className="mb-3">
          <Form.Label>Prioridad</Form.Label>
          <Form.Select name="priority" value={formData.priority} onChange={handleChange} className="form-control">
            <option value="P">Prioritaria</option>
            <option value="R">Requiere seguimiento</option>
            <option value="N">No prioritaria</option>
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="formCategory" className="mb-3">
          <Form.Label>Categoría</Form.Label>
          <Form.Select name="category" value={formData.category} onChange={handleChange} required className="form-control">
            <option value="">Seleccionar categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit" className="btn-primary w-100" disabled={isLoading}>
          {isLoading ? (editMode ? 'Actualizando...' : 'Creando...') : (editMode ? 'Actualizar Tarea' : 'Crear Tarea')}
        </Button>
      </Form>

      <h3 className="mt-5 text-center">Crear Nueva Categoría</h3>
      <Form onSubmit={handleCategorySubmit} className="mb-4">
        <Form.Group controlId="formNewCategory" className="mb-3">
          <Form.Label>Nombre de la Categoría</Form.Label>
          <Form.Control
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="secondary" type="submit" className="btn-secondary w-100">
          Crear Categoría
        </Button>
      </Form>

      <h3 className="mt-5 text-center">Lista de Tareas</h3>
      <Form.Group controlId="formFilter" className="mb-3">
        <Form.Label>Filtrar por Estado</Form.Label>
        <Form.Select value={filterStatus} onChange={handleFilterChange}>
          <option value="">Todas</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En progreso">En progreso</option>
          <option value="Completada">Completada</option>
        </Form.Select>
      </Form.Group>
      <Form.Group controlId="formFilterCategory" className="mb-3">
        <Form.Label>Filtrar por Categoría</Form.Label>
        <Form.Select value={filterCategory} onChange={handleCategoryFilterChange}>
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Fecha de Vencimiento</th>
            <th>Prioridad</th>
            <th>Estado</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task.id}>
              <td>{task.name}</td>
              <td>{task.description}</td>
              <td>{new Date(task.expiration_date).toLocaleString()}</td>
              <td>{task.priority_display}</td>
              <td>{task.status}</td>
              <td>{categories.find((category) => category.id === task.category)?.name || 'Sin categoría'}</td>
              <td>
                <Button size="sm" style={{ backgroundColor: '#90ee90', borderColor: '#90ee90' }} className="me-2" onClick={() => handleEdit(task)}>
                  Editar
                </Button>
                <Button size="sm" style={{ backgroundColor: '#90ee90', borderColor: '#90ee90' }} onClick={() => handleDelete(task.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default CreateTask;
