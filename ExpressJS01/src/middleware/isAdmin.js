const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            message: "Forbidden: Bạn không có quyền Admin"
        });
    }
};

module.exports = isAdmin;
