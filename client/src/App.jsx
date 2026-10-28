import About from './about';
import Home from './home';
import { Routes,Route } from 'react-router-dom';
import Parts from './parts';
import Contact from './contact';
import Nav from './nav';
import Footer from './homeComp/footer';

const App = () => {

  return (

    <>

      <Nav/>

      <Routes>

        <Route path = "/" element = {<Home/>}></Route>
        <Route path = "/parts" element = {<Parts/>}></Route>
        <Route path = "/about" element = {<About/>}></Route>
        <Route path = "/contact" element = {<Contact/>}></Route>

      </Routes>

      <Footer/>

    </>
  )
}

export default App;
