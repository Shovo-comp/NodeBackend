const roleMiddleware = (requiredRole) => (req, res, next) => {
    const { role } = req.user;

    if(role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
}

function authorizeRoles(...roles) {
    return (req, res, next) => {
        const { role } = req.user; // Make sure req.user.role exists (set during authentication)

        if (!roles.includes(role)) {
            return res.status(403).json({ error: "Access denied: insufficient permissions" });
        }
        
        next();
    };
}


module.exports = {roleMiddleware, authorizeRoles};