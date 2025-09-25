import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button'; 
import { AuthContext } from '../../context/AuthContext';

  const HomeView = () => {
    const {user, logout} = useContext(AuthContext)
    
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Bienvenido - Alquiler de autos</h1>
        
        {user ?
            <div>
                <Link to="/usuarios">
                    <Button label="Ir a Usuarios" />
                </Link>

                <Link to="/productos">
                    <Button label="Ir a Productos" />
                </Link>

                <Button label='Cerrar Sesión' onClick={logout}/>
            </div>
        : 
            <div>
                <Link to='/inicio-sesion'>
                    <Button label='Iniciar sesión'/>
                </Link>
                <Link to='/registro'>
                    <Button label='Registrarse'/>
                </Link>
          </div>

        }
        
      </div>
    );
  };

  export default HomeView;