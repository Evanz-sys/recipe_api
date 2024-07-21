import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const createAccessToken = async (payload) => {
  try {
    // Crear un nuevo token JWT con el payload proporcionado y una fecha de expiración de 1 día
    const token = jwt.sign(payload, TOKEN_SECRET, { expiresIn: "1d" });
    return token; // Devolver el token generado
  } catch (error) {
    // Manejar errores al crear el token
    throw new Error("Error al crear el token de acceso");
  } 
};
