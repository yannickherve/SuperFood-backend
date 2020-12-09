const userPrivilege = {
    isModerator: async (req, res, next) => {
        if (req.user.role === 0) {
            return res
                .status(403)
                .send({error: 'User not Authorised. Require Moderator Role!'});
        }
        next();
    },
    isAdmin: async (req, res, next) => {
        if (req.user.role === 0 || req.user.role === 1) {
            return res
                .status(403)
                .send({error: 'User not Authorised. Require Admin Role!'});
        }
        next();
    }
}

module.exports = userPrivilege
