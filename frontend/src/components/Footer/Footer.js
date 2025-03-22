import React from 'react';
import classNames from 'classnames'; 
import './Footer.scss';  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faTwitter, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';
import Logo from '../Logo/Logo'

const Footer = ({}) => {
	return(
	<footer className='App-footer'>
		<div className='footer-col-1'>
			<div className='footer-logo-wrapper'>
				<Logo></Logo>
			</div>
			<div className='footer-rrss'>
				<FontAwesomeIcon icon={faTwitter}   size='3x' className='faIcon'/>
				<FontAwesomeIcon icon={faInstagram} size='3x' className='faIcon'/>
				<FontAwesomeIcon icon={faLinkedin}  size='3x' className='faIcon'/>
				<FontAwesomeIcon icon={faYoutube}   size='3x' className='faIcon'/>
			</div>
		</div>

		<div className='footer-col-2'>
			<div className='footer-link-col'>
				<p>Categorías</p>
				<hr className='decorator'></hr>
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
				<p>Usuario</p>
				<hr className='decorator'></hr>
				<ul className='footer-link-list'>
					<li><a>Iniciar sesión 	</a></li>
					<li><a>Registrarse 		</a></li>
					<li><a>Mi perfil 		</a></li>
				</ul>
			</div>
		</div>
	</footer>
	);
};


export default Footer