import { useEffect, useState } from 'react';
import './App.css';

const SERVER_URL = "http://localhost:5000";

const emptyForm = { name: "", category: "Processor", brand: "", price: "", stock: "", specs: "" };

const Parts = () =>{

    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [form, setForm] = useState(emptyForm);
    const [msg, setMsg] = useState("");

    const categories = ["All", "Processor", "Graphics Card", "RAM", "Storage", "Motherboard", "Power Supply", "Cabinet", "Cooler"];

    const loadParts = ()=>{

        setLoading(true);

        fetch(SERVER_URL + "/getall")
            .then((res)=>res.json())
            .then((data)=>{

                setParts(data);
                setLoading(false);
            })
            .catch((err)=>{

                console.log("Failed to fetch parts : " + err);
                setLoading(false);
            });
    };

    useEffect(()=>{

        loadParts();
    },[]);

    const handleChange = (e)=>{

        setForm({ ...form, [e.target.name] : e.target.value });
    };

    const addPart = (e)=>{

        e.preventDefault();

        fetch(SERVER_URL + "/create", {

            method : "POST",
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify(form)

        })
        .then((res)=>res.json())
        .then(()=>{

            setMsg("Part added to MongoDB successfully!");
            setForm(emptyForm);
            loadParts();
            setTimeout(()=>setMsg(""), 3000);
        })
        .catch((err)=>{

            console.log("Failed to add part : " + err);
            setMsg("Failed to add part. Is the server running?");
        });
    };

    const deletePart = (id)=>{

        fetch(SERVER_URL + "/delete/" + id, { method : "DELETE" })
            .then((res)=>res.json())
            .then(()=>{

                setParts(parts.filter((part)=>part._id !== id));
            })
            .catch((err)=>console.log("Failed to delete part : " + err));
    };

    const visibleParts = filter === "All" ? parts : parts.filter((part)=>part.category === filter);

    return (
        <div className="page-cont">

            <h1 className='page-title'>PC Parts</h1>
            <p className='section-sub'>Stored in MongoDB &mdash; add, browse and remove components</p>

            <div className='filter-bar'>
                { categories.map((cat)=>(

                    <button key = {cat}
                        className = {filter === cat ? "filter-btn active" : "filter-btn"}
                        onClick = {()=>setFilter(cat)}>

                        {cat}
                    </button>
                ))}
            </div>

            <form className='add-form' onSubmit = {addPart}>

                <h2>Add a New Part</h2>

                <div className='form-row'>
                    <input type="text" name="name" placeholder="Part name" value={form.name} onChange={handleChange} required/>
                    <input type="text" name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} required/>
                    <select name="category" value={form.category} onChange={handleChange}>
                        { categories.filter((cat)=>cat !== "All").map((cat)=>(
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className='form-row'>
                    <input type="number" name="price" placeholder="Price ($)" value={form.price} onChange={handleChange} min="0" required/>
                    <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} min="0"/>
                    <input type="text" name="specs" placeholder="Specs (e.g. 8 cores, 16GB GDDR7)" value={form.specs} onChange={handleChange}/>
                </div>

                <button type="submit" className='cta-btn'>Add Part</button>

                { msg && <p className='status-msg'>{msg}</p> }
            </form>

            { loading ? (

                <p className='status-msg'>Loading parts from the server...</p>

            ) : visibleParts.length === 0 ? (

                <p className='status-msg'>No parts found. Start the backend server and add parts above.</p>

            ) : (

                <div className='parts-grid'>

                    { visibleParts.map((part)=>(

                        <div className='part-card' key = {part._id}>

                            <button className='delete-btn' onClick = {()=>deletePart(part._id)} title="Delete part">&times;</button>
                            <span className='part-category'>{part.category}</span>
                            <h3>{part.name}</h3>
                            <p className='part-brand'>{part.brand}</p>
                            <p className='part-specs'>{part.specs}</p>
                            <div className='part-foot'>
                                <span className='part-price'>${part.price}</span>
                                <span className='part-stock'>{part.stock} in stock</span>
                            </div>

                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}


export default Parts;
