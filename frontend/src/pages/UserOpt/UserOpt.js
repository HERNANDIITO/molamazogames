import './UserOpt.scss';

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import perfil from '../../assets/images/perfil.png';
import { FaPen, FaTrash, FaCheck, FaArrowLeft } from "react-icons/fa";

import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";

import { updateUser } from "../../services/userServices";
import { getUserByToken } from "../../services/authServices";

function UserOptContent() {
    const navigate = useNavigate();

    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPhone, setUserPhone] = useState('');

    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        phone: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem("token");

                if (token) {
                    const userData = await getUserByToken(token);
                    setUserName(userData.name);
                    setUserEmail(userData.email);
                    setUserPhone(userData.phone);
                    setFormData({ ...formData, userName: userData.name, email: userData.email, phone: userData.phone });
                }

            } catch (error) {
                console.error("Error cargando datos:", error.error);
                navigate("/login");
            }
        }

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        let newErrors = {};

        if (!formData.userName.trim()) {
            newErrors.userName = "El nombre de usuario no puede quedar vacío.";
        }

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
            newErrors.email = "El formato de correo electrónico no es válido.";
        }

        if (formData.phone.trim() !== "") {
            if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.phone)) {
                newErrors.phone = "El teléfono debe seguir el formato: +34678564738";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validate()) {

            const response = await updateUser(formData);            

        }
    };


    return (
        <main className="fondoOpt">
            <div className="optPerfil">
                <p className='decoratorTit titOptUser'>Mis datos</p>
                <div className="cambiaDatos">
                    <div className='imgPass'>
                        <div className='imgBut'>
                            <img src={perfil} className='imgOptUser' />
                            <Button
                                className='enano-btn imgEdit'
                                icon={<FaPen />}
                            />
                        </div>

                        <Button
                            label='Cambiar contraseña'
                            className='warning-btn botonUser'
                            icon={<FaPen />}
                            href={'/cambiarPass'}
                        />

                        <Button
                            label='Eliminar cuenta'
                            className='danger-btn botonUser'
                            icon={<FaTrash />}
                            href={'/eliminarCuenta'}
                        />
                    </div>

                    <div className='datosUser'>
                        <form onSubmit={handleSubmit}>
                            <Input
                                type="text"
                                name="userName"
                                id="userName"
                                label="Nombre de usuario"
                                value={formData.userName}
                                onChange={handleChange}
                                autoFocus
                                placeholder={userName}
                                className={`login ${errors.userName ? "error" : ""}`} />
                            {errors.userName && <p className="register-error">{errors.userName}</p>}

                            <Input
                                type="email"
                                name="email"
                                id="email"
                                label="Email*"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder={userEmail}
                                className={`login ${errors.email ? "error" : ""}`} />
                            {errors.email && <p className="register-error">{errors.email}</p>}

                            <Input
                                type="tel"
                                name="phone"
                                id="phone"
                                label="Teléfono"
                                placeholder={userPhone || "+34 695 79 62 59"}
                                value={formData.phone}
                                onChange={handleChange}
                                className={`login ${errors.phone ? "error" : ""}`} />
                            {errors.phone && <p className="register-error">{errors.phone}</p>}

                            <Button
                                label="Guardar cambios"
                                icon={<FaCheck />}
                                className="botonUser"
                                type="submit"
                            />
                        </form>
                    </div>
                </div>

                <Button
                    label="Volver a mi perfil"
                    icon={<FaArrowLeft />}
                    className="botonFinOpt"
                    href={'/perfil'}
                />


            </div>
        </main>
    );
}

function UserOpt() {
    return <UserOptContent />;
}

export default UserOpt;
