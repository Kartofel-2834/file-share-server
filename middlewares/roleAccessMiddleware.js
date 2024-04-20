function checkRoleAccess(req, res, next) {
    const role = req?.tokenData?.role || 'user';
    const allowedRoles = this?.allowedRoles || [];

    if (allowedRoles?.includes(role)) {
        return next();
    }

    return res.status(403).json({
        message: `Request error: This action available only for ${allowedRoles.join(', ')}`,
    });
}

export default function roleAccessMiddleware(allowedRoles = []) {
    return checkRoleAccess.bind({ allowedRoles });
}
