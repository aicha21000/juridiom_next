const jwt = require('jsonwebtoken');

const checkAuthenticatedUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: 'Accès refusé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded;
    next(); 
  } catch (err) {
    console.error("Erreur de décodage du token :", err);
    return res.status(403).json({ message: 'Token invalide ou expiré' });
  }
};

module.exports = { checkAuthenticatedUser };
