const express = require('express')
const router = express.Router()



// controllers
const { register, login, listUser, editUser, deleteUser, currentUser } = require('../controllers/auth')

// middleware
const {auth, adminCheck} = require('../middleware/auth')


//@Endpoint  http://localhost:3000/api/register
//@Method    POST
//@Access    Public
router.post('/register', register)


//@Endpoint  http://localhost:3000/api/login
//@Method    POST
//@Access    Public
router.post('/login', login)


//@Endpoint  http://localhost:3000/api/current-user
//@Method    POST
//@Access    Private
router.post('/current-user', auth, currentUser)


//@Endpoint  http://localhost:3000/api/current-admin
//@Method    POST
//@Access    Private
router.post('/current-admin', auth, adminCheck, currentUser)


//@Endpoint  http://localhost:3000/api/auth
//@Method    GET
//@Access    Public
router.get('/auth', listUser)


//@Endpoint  http://localhost:3000/api/auth
//@Method    PUSH (แก้ไข)
//@Access    Public
router.put('/auth', editUser)


//@Endpoint  http://localhost:3000/api/auth
//@Method    DELETE 
//@Access    Public
router.delete('/auth', deleteUser)


module.exports = router