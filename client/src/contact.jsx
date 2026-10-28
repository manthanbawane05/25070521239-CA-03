import { useState } from 'react';
import './App.css';

const SERVER_URL = "http://localhost:5000";

const Contact = () =>{

    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [msg, setMsg] = useState("");

    const handleChange = (e)=>{

        setForm({ ...form, [e.target.name] : e.target.value });
    };

    const submitContact = (e)=>{

        e.preventDefault();

        fetch(SERVER_URL + "/contact", {

            method : "POST",
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify(form)

        })
        .then((res)=>res.json())
        .then(()=>{

            setMsg("Thanks! Your message was saved to MongoDB.");
            setForm({ name: "", email: "", message: "" });
        })
        .catch((err)=>{

            console.log("Failed to send message : " + err);
            setMsg("Failed to send message. Is the server running?");
        });
    };

    return (
        <div className="page-cont">

            <h1 className='page-title'>Contact Us</h1>
            <p className='section-sub'>Need help picking a part? Send us a message &mdash; it lands straight in our database.</p>

            <form className='add-form' onSubmit = {submitContact}>

                <div className='form-row'>
                    <input type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required/>
                    <input type="email" name="email" placeholder="Your email" value={form.email} onChange={handleChange} required/>
                </div>

                <div className='form-row'>
                    <textarea name="message" placeholder="Your message" value={form.message} onChange={handleChange} rows="4" required></textarea>
                </div>

                <button type="submit" className='cta-btn'>Send Message</button>

                { msg && <p className='status-msg'>{msg}</p> }
            </form>

        </div>
    )
}


export default Contact;
