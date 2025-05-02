import React, { act, useState } from 'react';
import './NavBar.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faBars, faImage, faCube, faVideo, faMusic, faCode, faEllipsis } from '@fortawesome/free-solid-svg-icons';


const NavBar = () => {
    var show = true;

    const mostrarOpciones = (button) =>{
        var nav = document.querySelector('nav');
        var elements = document.querySelectorAll('.nav_content li');
        var chk = nav.querySelector('#chkMenu');
        chk.checked = !chk.checked;
        if(show) {
            elements.forEach(item => {
                item.setAttribute('aria-hidden', 'false');
                item.classList.remove("navbar-hidden")
                item.querySelector('a').setAttribute('tabindex', '0');
            });
            show = !show
        }
        else {
            elements.forEach(item => {
                item.setAttribute('aria-hidden', 'true');
                item.classList.add("navbar-hidden")
                item.querySelector('a').setAttribute('tabindex', '-1');
            });
            show = !show
        }
    }

    return(
        <nav class="navbar">
            <button class="nav_but" onClick={(event) => mostrarOpciones(event.target)}><span><FontAwesomeIcon icon={faBars}/></span>Mostrar enlaces</button>
            {/*<label for="chkMenu" class="nav_label">
                Mostrar enlaces
                <span><FontAwesomeIcon icon={faBars}/></span>
            </label>*/}
            <input id="chkMenu" type='checkbox' value='Mostrar enlaces'></input>
            
            
            <ul class='nav_content'>
                <li className='navbar-hidden' ><a href='/buscarAssets/2D'><span><FontAwesomeIcon icon={faImage} /></span>2D</a></li>
                <li className='navbar-hidden' ><a href='/buscarAssets/3D'><span><FontAwesomeIcon icon={faCube} /></span>3D</a></li>
                <li className='navbar-hidden' ><a href='/buscarAssets/Audio'><span><FontAwesomeIcon icon={faMusic} /></span>Audio</a></li>
                <li className='navbar-hidden' ><a href='/buscarAssets/Video'><span><FontAwesomeIcon icon={faVideo} /></span>Video</a></li>
                <li className='navbar-hidden' ><a href='/buscarAssets/Codigo'><span><FontAwesomeIcon icon={faCode} /></span>Código</a></li>
                <li className='navbar-hidden' ><a href='/buscarAssets/Otros'><span><FontAwesomeIcon icon={faEllipsis} /></span>Otros</a></li>
            </ul>
        </nav>
    );
}

/*const NavBar = () => {
    var state=1;
    var active = 1;
    const navItems = [
        { id: 1, label: "2D", icon: faImage},
        { id: 2, label: "3D", icon: faCube },
        { id: 3, label: "Audio", icon: faVideo },
        { id: 4, label: "Video", icon: faMusic },
        { id: 5, label: "Código", icon: faCode },
        { id: 6, label: "Otros", icon: faEllipsis }
    ];
    const links = {
        1: "#1",
        2: "#2",
        3: "#3",
        4: "#4",
        5: "#5",
        6: "#6",
    };

    const aria = () => {
        if (window.matchMedia("(max-width: 48rem)").matches) {
            return true;
        }
        else{
            return false;
        }
    }

    //Aria dinámicos
    window.addEventListener("resize", () => {
        var cont=1;
        const listItems = document.querySelectorAll(".nav_element");
        if(!aria()){
            
            listItems.forEach(li => {
                //if(li.classList.contains("nav_active")){
                    const a = li.querySelector("a");
                    if (a) {
                        a.removeAttribute("aria-haspopup");
                        a.removeAttribute("aria-expanded");
                        //a.removeAttribute("aria-controls");
                    }
               //}
                //cont++;
            });
        }
        else{
            cont=1;
            listItems.forEach(li => {
                if(cont === active){
                    const a = li.querySelector("a");
                    if (a) {
                        a.setAttribute("aria-haspopup", "menu");
                        a.setAttribute("aria-expanded", "false");
                        //a.setAttribute("aria-controls", "submenu");
                    }
                }
                cont++;
            });
        }
    });

    // Mostrar elementos al clicar
    const handleClick = (event, index) => {
        event.preventDefault();
        active=index+1;
        var cont=1;
        const ul = event.target.closest("ul");
        const listItems = ul.querySelectorAll("li");

        // Si menor que tamaño tablet, lista que se despliegue
        if (window.matchMedia("(max-width: 48rem)").matches) {
            
            cont=1;
            // Si clicado por primera vez, aparecerá la lista
            if(state==1){
                listItems.forEach(li => {
                    if(cont==active){
                        const a = li.querySelector("a");
                        if (a) {
                            a.setAttribute("aria-expanded", "true");
                        }
                    }
                    li.classList.add("nav_active");
                    const icon = li.querySelector(".faIconDown");
                    if (icon) {
                        icon.style.display = "none";
                    }
                    cont++;
                });
                state=2;
            }

            // Si clicado por segunda vez, redirigir
            else{
                cont=1;
                
                listItems.forEach(li => {
                    const a = li.querySelector("a");
                    if(cont!=active){
                        li.classList.remove("nav_active");
                        if (a) {
                            a.removeAttribute("aria-haspopup");
                            a.removeAttribute("aria-expanded");
                            //a.removeAttribute("aria-controls");
                        }
                    }
                    else{
                        if (a) {
                            a.setAttribute("aria-haspopup", "menu");
                            a.setAttribute("aria-expanded", "false");
                            //a.setAttribute("aria-controls", "submenu");
                        }
                    }
                    const icon = li.querySelector(".faIconDown");
                    if (icon) {
                        icon.style.display = "";
                    }
                    cont++;
                });
                state=1;
                window.location.href = links[active];
            }
        }

        // Si mayor que tamaño tablet, funcionalidad de enlace normal
        else{
            state=1;
            //active=index+1;
            cont=1;
            listItems.forEach(li => {
                if(cont==active){
                    li.classList.add("nav_active");
                }
                else{
                    li.classList.remove("nav_active");
                }
                cont++;
            });
            window.location.href = links[active];
        }
    };

    return (
        <nav>
            <ul id="submenu" role="menu">
                {navItems.map((item, index) => (
                    <li role="menuitem" key={item.id} className={`nav_element ${index === 0 ? "nav_active" : ""}`} >
                        <a href={`#${item.id}`} 
                            onClick={(event) => handleClick(event, index)} 
                            aria-haspopup={index === 0 && aria() === true ? "menu" : undefined} 
                            aria-expanded={index === 0 && aria() === true ? "false" : undefined} 
                            aria-controls={index === 0 && aria() === true ? "submenu" : undefined}
                        >
                            <FontAwesomeIcon icon={item.icon}/> {item.label} <FontAwesomeIcon icon={faCaretDown} className='faIconDown' />
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}*/

export default NavBar;