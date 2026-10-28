import './App.css';
import MainContent from './homeComp/mainContentCont';

const About = () =>{

    return (
        <div className="page-cont">

            <MainContent>
                <h1 className='page-title'>About Flow Parts</h1>

                <p className='about-text'>
                    Flow Parts is a one-stop store for PC enthusiasts and builders. From flagship
                    processors and graphics cards to cooling and cabinets, we stock every
                    component you need to build your dream machine.
                </p>

                <p className='about-text'>
                    This project is a full-stack web application built with a React.js
                    frontend, a Node.js + Express backend, and MongoDB as the database.
                    Every part you see on the Parts page is stored in and retrieved from
                    MongoDB, and can be managed through the app.
                </p>

                <div className='parts-grid'>

                    <div className='part-card'>
                        <h3>Frontend</h3>
                        <p className='part-specs'>React.js with React Router, built using Vite. Components for navigation, product cards and forms.</p>
                    </div>

                    <div className='part-card'>
                        <h3>Backend</h3>
                        <p className='part-specs'>Node.js with Express exposing REST APIs for creating, reading, updating and deleting PC parts.</p>
                    </div>

                    <div className='part-card'>
                        <h3>Database</h3>
                        <p className='part-specs'>MongoDB stores the parts catalogue and contact messages, viewable in MongoDB Compass.</p>
                    </div>
                </div>
            </MainContent>

        </div>
    )
}


export default About;
