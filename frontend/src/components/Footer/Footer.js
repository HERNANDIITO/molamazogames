import React from 'react';
import classNames from 'classnames'; 
import './Footer.scss';  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faTwitter, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';
import Logo from '../Logo/Logo'

const Footer = ({}) => {
	return(
	<footer className='App-footer'>
		<article className='footer-col-1'>
			<div className='footer-logo-wrapper'>
				<Logo></Logo>
			</div>
			<nav className='footer-rrss'>
				<FontAwesomeIcon icon={faTwitter}   size='3x' className='faIcon'/>
				<FontAwesomeIcon icon={faInstagram} size='3x' className='faIcon'/>
				<FontAwesomeIcon icon={faLinkedin}  size='3x' className='faIcon'/>
				<FontAwesomeIcon icon={faYoutube}   size='3x' className='faIcon'/>
			</nav>
		</article>

		<article className='footer-col-2'>
			<div className='footer-link-col'>
				<p className='decorator'>Categorías</p>
				<ul className='footer-link-list'>
					<li><a>2D 		</a></li>
					<li><a>3D 		</a></li>
					<li><a>Audio 	</a></li>
					<li><a>Video 	</a></li>
					<li><a>Código 	</a></li>
					<li><a>Otros 	</a></li>
				</ul>
			</div>

			<div className='footer-link-col'>
				<p className='decorator'>Usuario</p>
				<ul className='footer-link-list'>
					<li><a>Iniciar sesión 	</a></li>
					<li><a>Registrarse 		</a></li>
					<li><a>Mi perfil 		</a></li>
				</ul>
			</div>
		</article>
	</footer>
	);
};


export default Footer