import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const auth = (req, res, next) => {
  try {
    // Extraer el token del encabezado de autorización
    const token = req.headers.authorization?.split(' ')[1]; // El formato esperado es "Bearer <token>"

    // Verificar si el token está presente
    if (!token) {
      return res.status(401).json({ message: "Sin token, autorización denegada" });
    }

    // Verificar y decodificar el token JWT
    jwt.verify(token, TOKEN_SECRET, (error, user) => {
      if (error) {
        return res.status(401).json({ message: "El token no es válido" });
      }

      // Si el token es válido, añadir el usuario decodificado al objeto de solicitud (`req`)
      req.user = user;
      next(); // Continuar con la ejecución de la siguiente función/middleware
    });
  } catch (error) {
    // Manejar errores internos del servidor
    return res.status(500).json({ message: error.message });
  }
};
