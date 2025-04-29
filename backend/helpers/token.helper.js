"use strict";

import jwt from 'jwt-simple';
import moment from 'moment';

import dotenv from 'dotenv';
dotenv.config();

const SECRET  = process.env.SECRET;
const EXP_TIME  = process.env.EXP_TIME;

// Devuelve un token tipo JSON Web Token
// Formato JWT:
// HEADER.PAYLOAD.VERIFY_SIGNATURE
//
// Donde:
// HEADER ( Objeto JSON con Algoritmo y tipo de token, codificado en formato base64Url ):
// {
//    "typ": "JWT",
//    "alg": "HS256"
//    }.base64UrlEncode()
//    PAYLOAD (Objeto JSON con lo que deseamos guardar, codificado en formato base64Url) 
//    {
//        "sub": "56789123456789",
//        "iat": 1603211718,
//        "exp": 1604424918
//    }.base64UrlEncode()
// }
// VERIFY SIGNATURE:
// HMACSHA256 ( base64UrlEncode(HEADER) + "." + base64UrlEncode(PAYLOAD), SECRET )

function generateToken(ID) {
  const payload = {
    sub: ID,
    iat: moment(),
    exp: moment().add(EXP_TIME, "minutes"),
  };
  return jwt.encode(payload, SECRET);
}

function decodeToken(token) {
  return new Promise((resolve, reject) => {
    try {
      const payload = jwt.decode(token, SECRET, true); // Marcamos false para que verifique firma y caducidad
      resolve(payload.sub); // Si todo ha ido bien, devolvemos el id del usuario
    } catch (err) {
      reject({
        status: 401,
        message: err.msg,
      });
    }
  });
}

export {
  generateToken,
  decodeToken
};
