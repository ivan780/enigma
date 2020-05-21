const moment = require('moment');
const jwt = require('jwt-simple');



function encodeToken(user) {
    const playload = {
        exp: moment().add(process.env.expireToken, 'days').unix(),
        iat: moment().unix(),
        sub: user
    };
    return jwt.encode(playload, process.env.secretKey);
}
function decodeToken(token, callback) {
    const payload = jwt.decode(token, process.env.secretKey);
    const now = moment().unix();
    // check if the token has expired
    if (now > payload.exp) callback('Token has expired.');
    else callback(null, payload);
}


module.exports = {
    encodeToken,
    decodeToken
};
