module.exports = (req, res, next) => {
    if (req.user?.role !== "farmer") {
      return res.status(403).json({ message: "Access denied. Farmers only." });
    }
    next();
  };
  