const jwt = require('jsonwebtoken')
const User = require('../Schemas/User')

const auth = async (req, resp, next) => {
    try {
        const bearerHeader = req.headers['authorization']
        console.log(bearerHeader)
        if (typeof bearerHeader != 'undefined') {
            const token = bearerHeader.split(' ')[1]
            const user = jwt.verify(token, process.env.JWT_SECRET)
          //  console.log(user)
            req.token = user
            next()
        } else {
            resp.status(401).json({ message: 'No token Provided' })
        }
    } catch (error) {
        resp.status(403).json({ message: 'Invalid or expired token' })
    }
}

module.exports = auth