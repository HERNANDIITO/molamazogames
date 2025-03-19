"use strict";

import bcrypt from "bcryptjs";

// Devuelve un hash con salt incluido en formato:
// $2b$[cost]$[22 character salt][31 character hash]
// Ejemplo:
// '$2b$10$G1DDAoljDq90F9H/9uH6z.NQpkg4lbVVC/v4RTLQ87j1.6VDbpbTK'
// \__/\/ \____________________/\_____________________________/
// Alg Cost Salt Hash
//

function encryptPassword( password ) {
  return bcrypt.hash( password, 10 );
}

// Devuelve true o false
function checkPassword( password, hash ) {
  return bcrypt.compare( password, hash );
}

export {
  encryptPassword,
  checkPassword
};
