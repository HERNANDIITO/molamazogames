import React from 'react';
import './Footer.scss';  
import Logo from '../Logo/Logo'

const Footer = ({}) => {
	return(
	<footer className='App-footer'>
		<article className='footer-col-1'>
			<div className='footer-logo-wrapper'>
				<Logo></Logo>
			</div>
			{/* <nav className='footer-rrss'>
				<FontAwesomeIcon icon={faTwitter}   size='2x' className='faIcon'/>
				<FontAwesomeIcon icon={faInstagram} size='2x' className='faIcon'/>
				<FontAwesomeIcon icon={faLinkedin}  size='2x' className='faIcon'/>
				<FontAwesomeIcon icon={faYoutube}   size='2x' className='faIcon'/>
			</nav> */}
		</article>

		<article className='footer-col-2'>
			<div className='footer-link-col'>
				<p className='decorator'>Categorías</p>
				<ul className='footer-link-list'>
					<li><a href="#">2D 		</a></li>
					<li><a href="#">3D 		</a></li>
					<li><a href="#">Audio 	</a></li>
					<li><a href="#">Video 	</a></li>
					<li><a href="#">Código 	</a></li>
					<li><a href="#">Otros 	</a></li>
				</ul>
			</div>

			<div className='footer-link-col'>
				<p className='decorator'>Usuario</p>
				<ul className='footer-link-list'>
					<li><a href="/login">Iniciar sesión 	</a></li>
					<li><a href="/registrar">Registrarse 		</a></li>
					<li><a href="#">Mi perfil 		</a></li>
				</ul>
			</div>
		</article>
	</footer>
	);
};


export default Footer