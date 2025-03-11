import React from 'react';
import '../styles/header.css'

const Header = () => {
    if (localStorage.getItem("signed-in")!==true) {
        return (
            <div className='header'>
                <h1 className='logo'>TAITAJA</h1>
                <div className='nav-bar'>
                    <nav>
                        <a href='../'>Tulokset</a>
                    </nav>
                </div>
                <a href='login' className='header-sign-in-out'>Kirjaudu sisään</a>
            </div>
        );
    } else if (localStorage.getItem("admin")===true) {
        return (
            <div className='header'>
                <h1 className='logo'>TAITAJA</h1>
                <div className='nav-bar'>
                    <nav>
                        <a href='käyttäjän-luoti'>Luo käyttäjä</a>
                        <a href='kisan-luoti'>Luo kisa</a>
                        <a href='../'>Tulokset</a>
                        <a href='ryhmät'>Ryhmät</a>
                        <a href='ajan-kirjaus'>Kirjaa aika</a>
                    </nav>
                </div>
                {localStorage.getItem("kisa-menossa")===true ? (
                    <button className='lopetus'>Lopeta Kisa</button>
                ):(<></>)}
                <a href='kirjautuminen' className='header-sign-in-out'>Kirjaudu ulos</a>
            </div>
        );
    } else {
        return (
            <div className='header'>
                <h1 className='logo'>TAITAJA</h1>
                <div className='nav-bar'>
                    <nav>
                        <a href='../'>Tulokset</a>
                        <a href='ajan-kirjaus'>Kirjaa aika</a>
                    </nav>
                </div>
                <a href='kirjautuminen' className='header-sign-in-out'>Kirjaudu ulos</a>
            </div>
        );
    }
};

export default Header;