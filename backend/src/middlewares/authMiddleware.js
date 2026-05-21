const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
	// El frontend nos enviará el token en los headers de la petición
	const token = req.header("Authorization");

	if (!token) {
		return res
			.status(401)
			.json({ mensaje: "Acceso denegado. Debes iniciar sesión para comprar." });
	}

	try {
		// Limpiamos el string (usualmente viene como "Bearer <token>")
		const tokenLimpio = token.replace("Bearer ", "");

		// Verificamos si es válido usando nuestra clave secreta
		const verificado = jwt.verify(tokenLimpio, process.env.JWT_SECRET);

		// Inyectamos los datos del usuario (como su ID) en la request para que el controlador los use
		req.usuario = verificado;
		next(); // Permite que la petición continúe hacia el controlador
	} catch (_error) {
		res.status(400).json({ mensaje: "Token inválido o expirado" });
	}
};

const verificarAdmin = (req, res, next) => {
	if (!req.usuario) {
		return res.status(401).json({ mensaje: "Debes iniciar sesiÃ³n" });
	}

	if (req.usuario.rol !== "ADMINISTRADOR") {
		return res
			.status(403)
			.json({ mensaje: "No tienes permisos de administrador" });
	}

	next();
};

module.exports = { verificarToken, verificarAdmin };
