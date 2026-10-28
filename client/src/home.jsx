import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import Header from './homeComp/header';
import MainContent from './homeComp/mainContentCont';

const SERVER_URL = "http://localhost:5000";

const Home = () =>{

    const [featuredParts, setFeaturedParts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{

        fetch(SERVER_URL + "/getall")
            .then((res)=>res.json())
            .then((data)=>{

                setFeaturedParts(data.slice(0,3));
                setLoading(false);
            })
            .catch((err)=>{

                console.log("Failed to fetch parts : " + err);
                setLoading(false);
            });

    },[]);

    return (
        <div className="home-cont">

            <Header/>

            <MainContent>
                <h2 className='section-title'>Featured Parts</h2>
                <p className='section-sub'>Premium components fetched live from our MongoDB database</p>

                { loading ? (

                    <p className='status-msg'>Loading parts from the server...</p>

                ) : featuredParts.length === 0 ? (

                    <p className='status-msg'>
                        No parts in the database yet. Start the backend and visit
                        <Link to="/parts"> the Parts page</Link> to add some.
                    </p>

                ) : (

                    <div className='parts-grid'>

                        { featuredParts.map((part)=>(

                            <div className='part-card' key = {part._id}>

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

                <Link to="/parts" className='cta-btn'>Browse All Parts</Link>
            </MainContent>

        </div>
    )
}


export default Home;
