import { useEffect, useState } from 'react';
import About from './about';
import Home from './home';
import { Routes,Route } from 'react-router-dom';
import Parts from './parts';
import Contact from './contact';
import Nav from './nav';
import Footer from './homeComp/footer';
import SignIn from './signin';

const SERVER_URL = "http://localhost:5000";

const App = () =>{

    const [user, setUser] = useState(null);

    // restore the session from a saved token on load
    useEffect(()=>{

        const token = localStorage.getItem("fp_token");

        if (token == null) return;

        fetch(SERVER_URL + "/me", { headers : { "Authorization" : "Bearer " + token } })
            .then((res)=> res.ok ? res.json() : null)
            .then((data)=>{

                if (data && data.user) setUser(data.user);
            })
            .catch((err)=>console.log("Session check failed : " + err));

    },[]);

    const logout = ()=>{

        localStorage.removeItem("fp_token");
        setUser(null);
    };

    return (

        <>

            <Nav user = {user} onLogout = {logout}/>

            <Routes>

                <Route path = "/" element = {<Home/>}></Route>
                <Route path = "/parts" element = {<Parts/>}></Route>
                <Route path = "/about" element = {<About/>}></Route>
                <Route path = "/contact" element = {<Contact/>}></Route>
                <Route path = "/signin" element = {<SignIn onSignIn = {setUser}/>}></Route>

            </Routes>

            <Footer/>

        </>
    )
}

export default App;
