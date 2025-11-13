const express = require("express")
const jwt = require("jsonwebtoken")
const router = express.Router()
const User = require("../Schemas/User")
const bcrypt = require('bcryptjs');
require('dotenv').config()



//Login ke baad → jwt.sign() se token create
//Protected route pe → jwt.verify() se check

router.post('/register', async (req, res) => {
    try {

        const { name, email, password } = req.body
       
        const existingUser = await User.findOne({ $or: [{ name }, { email }] })
        if (existingUser) return res.status(400).json({ message: 'name and email already existe.' })

        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({ name, email, password: hashPassword })
        const saveUser = await user.save()

        res.json(saveUser)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/login', async (req, resp) => {
    try {
        const { name, password } = req.body
        const user = await User.findOne({ name })
        if (!user) return resp.status(404).json({ message: 'User not found' })


        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return resp.status(400).json({ message: 'Invalid Credentils' })

        const token = jwt.sign({ userId: user._id, name: user.name, },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        resp.json({ token })
    } catch (error) {
        resp.status(500).json({ message: error.message })
    }
})

router.post('/logout', async (req, resp) => {
    resp.json({ message: 'Logout Sucessfuly.' })
})

//router.use('/', router)
//export route middlewar
module.exports = router

