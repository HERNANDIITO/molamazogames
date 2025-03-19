import {decodeToken} from '../helpers/token.helper.js';

const auth = (req, res, next) => {

    const token = (req.headers.authorization).split(' ')[1];
  
    if ( !token ) {
        res.status(401)
        .json({
            result: "KO",
            msg: "Envía un código válido en la cabecera 'token'",
        });
        return;
    }
  
    decodeToken(token).then(
        (userID) => { 

            req.user = {
                id: userID,
                token
            }
  
            //  TODO: Adaptar todo el nuevo usuario
            return next();
        }, (err) => { res.status(401).json({ result: "KO", msg: "No autorizado" }); }
    )
  }

export {
    auth
}