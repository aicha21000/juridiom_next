const generateGuestId = (req, res, next) => {
  if (!req.cookies.guestId) {
    const guestId = `guest-${Math.random().toString(36).substr(2, 9)}`;
    res.cookie('guestId', guestId, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // Expire dans 30 jours
    req.guestId = guestId;
  } else {
    req.guestId = req.cookies.guestId;
  }
  next();
};