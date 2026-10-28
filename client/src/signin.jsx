import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const SERVER_URL = "http://localhost:5000";

const SignIn = ({ onSignIn }) =>{

    const [mode, setMode] = useState("signin");
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const handleChange = (e)=>{

        setForm({ ...form, [e.target.name] : e.target.value });
    };

    const submit = (e)=>{

        e.preventDefault();

        const endpoint = mode === "signin" ? "/login" : "/signup";
        const body = mode === "signin" ? { email: form.email, password: form.password } : form;

        fetch(SERVER_URL + endpoint, {

            method : "POST",
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify(body)

        })
        .then(async (res)=>{

            const data = await res.json();

            if (!res.ok) {

                setMsg(data.msg || "Something went wrong");
                return;
            }

            localStorage.setItem("fp_token", data.jwtToken);
            onSignIn(data.user);
            navigate("/");
        })
        .catch((err)=>{

            console.log("Auth failed : " + err);
            setMsg("Failed to reach the server. Is it running?");
        });
    };

    return (
        <div className="page-cont sign-cont">

            <h1 className='page-title'>{ mode === "signin" ? "Sign In" : "Create Account" }</h1>
            <p className='section-sub'>Accounts live in the database with bcrypt-hashed passwords</p>

            <form className='add-form' onSubmit = {submit}>

                { mode === "signup" && (

                    <div className='form-row'>
                        <input type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required/>
                    </div>
                )}

                <div className='form-row'>
                    <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required/>
                </div>

                <div className='form-row'>
                    <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required/>
                </div>

                <button type="submit" className='cta-btn'>
                    { mode === "signin" ? "Sign In" : "Create Account" }
                </button>

                { msg && <p className='status-msg'>{msg}</p> }
            </form>

            <p className='switch-msg'>
                { mode === "signin" ? "New here? " : "Already have an account? " }
                <button className='link-btn' onClick = {()=>{ setMode(mode === "signin" ? "signup" : "signin"); setMsg(""); }}>
                    { mode === "signin" ? "Create an account" : "Sign in instead" }
                </button>
            </p>

        </div>
    )
}


export default SignIn;
