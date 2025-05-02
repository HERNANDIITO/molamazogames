
/**
 * Valida si un email tiene un formato correcto.
 * @param {string} email - Email a validar
 * @returns {boolean} true si es válido, false si no
 */
const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

/**
 * Valida si una ontraseña tiene un formato correcto.
 * @param {string}  pass - Contraseña a validar
 * @returns {boolean} true si es válido, false si no
 */
const validatePass = (pass) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{7,15}$/;
    return regex.test(pass);
}

/**
 * Valida si un numero de telefono tiene un formato correcto.
 * @param {string}  phone - Teléfono a validar
 * @returns {boolean} true si es válido, false si no
 */
const validatePhone = (phone) => {
    const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return regex.test(phone);
}

export {
    validateEmail,
    validatePass,
    validatePhone
}