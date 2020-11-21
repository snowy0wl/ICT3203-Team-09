import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { RiBankLine } from 'react-icons/ri'
import { FaBars, FaTimes } from 'react-icons/fa'
import { Button } from './Button'
import './Navbar.css'
import { IconContext } from 'react-icons/lib'

function Navbar({isLoggedIn, setLogout}) {
    const [click, setClick] = useState(false)
    const [button, setButton] = useState(true)
    const [loggedOut, setLoggedOut] = useState(true)

    const handleClick = () => setClick(!click)
    const closeMobileMenu = () => { 
        setClick(false) 
    }
    const logoutAndCloseMobileMenu = () => {
        sessionStorage.clear()
        setClick(false)
        setLogout(false)
        setLoggedOut(false)
    }

    const showButton = () => {
        if(window.innerWidth <= 960) {
            setButton(false)
        } else {
            setButton(true)
        }
    }

    function setLogoutCallback() {
        sessionStorage.clear()
        setLogout(false)
        setLoggedOut(false)
    }

    useEffect(() => {
        showButton();
    }, [])

    window.addEventListener('resize', showButton)

    return (
        <div>
        <IconContext.Provider value={{ color: '#fff'}}>
            <div className="navbar">
                <div className="navbar-container container">
                {isLoggedIn || sessionStorage.getItem('userName') != null ?
                    (<Link to='/home' className="navbar-logo" onClick={closeMobileMenu}>
                        <RiBankLine className='navbar-icon' />
                        WESTOAK
                    </Link>)
                    :
                    (<Link to='/home' className="navbar-logo" onClick={closeMobileMenu}>
                        <RiBankLine className='navbar-icon' />
                        WESTOAK
                    </Link>)
                }

                    <div className='menu-icon' onClick={handleClick}>
                        {click ? <FaTimes /> : <FaBars />}
                    </div>
                    
                    {isLoggedIn || sessionStorage.getItem('userName') != null ?
                        (<ul className={click ? 'nav-menu active' : 'nav-menu'}>
                            <li className='nav-item'>
                                <Link to='/banking' className='nav-links' onClick={closeMobileMenu}>
                                    Banking
                                </Link>
                            </li>
                            <li className='nav-item'>
                                <Link to='/account' className='nav-links' onClick={closeMobileMenu}>
                                    Account
                                </Link>
                            </li>
                            <li className='nav-btn'>
                                    {button ? (
                                        <Link to='/' className='btn-link' onClick={setLogoutCallback}>
                                            <Button buttonStyle=
                                            'btn--outline'>LOGOUT</Button>
                                        </Link>
                                    ) : (
                                        <Link to='/' className='btn-link' onClick={logoutAndCloseMobileMenu}>
                                            <Button buttonStyle='btn--outline'
                                                    buttonSize='btn--mobile'>LOGOUT</Button>
                                        </Link>
                                    )}
                            </li>
                        </ul>) 
                        :
                        (<ul className={click ? 'nav-menu active' : 'nav-menu'}>
                            <li className='nav-item'>
                                <Link to='/home' className='nav-links' onClick={closeMobileMenu}>
                                    Home
                                </Link>
                            </li>
                            {/* <li className='nav-item'>
                                <Link to='/services' className='nav-links' onClick={closeMobileMenu}>
                                    Services
                                </Link>
                            </li> */}
                            <li className='nav-btn'>
                                {button ? (
                                    <Link to='/login' className='btn-link' >
                                        <Button buttonStyle=
                                        'btn--outline'>LOGIN</Button>
                                    </Link>
                                ) : (
                                    <Link to='/login' className='btn-link' onClick={closeMobileMenu}>
                                        <Button buttonStyle='btn--outline'
                                                buttonSize='btn--mobile'>LOGIN</Button>
                                    </Link>
                                )}
                            </li>
                        </ul>)
                    }
                </div>
            </div>
        </IconContext.Provider>
        </div>
    )
}

export default Navbar