// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');


const checkAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: 'Accès refusé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
    }
    req.user = decoded; 
    next(); 
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: 'Token invalide ou expiré' });
  }
};

module.exports = { checkAdmin };

