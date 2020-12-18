const userPrivilege = {
    isModerator: async (req, res, next) => {
        if (req.user.role === 'user') {
            return res
                .status(403)
                .send({error: 'User not Authorised. Require Moderator Role!'});
        }
        next();
    },
    isAdmin: async (req, res, next) => {
        if (req.user.role === 'user' || req.user.role === 'moderator') {
            return res
                .status(403)
                .send({error: 'User not Authorised. Require Admin Role!'});
        }
        next();
    }
}

module.exports = userPrivilege
