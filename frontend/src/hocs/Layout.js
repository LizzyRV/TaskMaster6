import Navbarr from "../Components/navigation/Navbar";
import Footer from "../Components/navigation/Footer";

//Función de reutilizar código para manejar varias páginas, le dejo listo para ir mejorando el sitio web con el tiempo
const Layout = (props) => {
    return(
        <div>
            <Navbarr/>
            {props.children} 
            <Footer/>
        </div>
    )//{props.children} Mostrará la información de las diferentes páginas que creo en contendedores
}
    
export default Layout