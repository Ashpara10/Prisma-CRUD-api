const { PrismaClient } = require('@prisma/client')
const express = require('express')
const router = express.Router()
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post(`/signup`, async (req, res) => {
  const { name, email, password } = req.body
  const useremail = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })

  if (useremail) {
    res.status(400).json('user with this email already exists')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPwd = await bcrypt.hash(password, salt)

  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPwd,
    },
  })
  const payload = {
    user: {
      id: user.id,
    },
  }
  const token = jwt.sign(payload.user, process.env.DATABASE_URL)
  res.json({ Status: 'OK', token: token })
})

router.post('/login', async (req, res) => {
  let { email, password } = req.body
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      password: true,
    },
  })

  if (!user) {
    res.status(400).json({ error: 'Please try to login with correct Email' })
  }

  const pwdCompare = await bcrypt.compare(password, user.password)

  if (!pwdCompare) {
    return res
      .status(400)
      .json({ error: 'Please try to login with correct Password' })
  }

  const payload = {
    user: {
      id: user.id,
    },
  }
  const authtoken = jwt.sign(payload.user, process.env.DATABASE_URL)

  if ((user, pwdCompare)) {
    return (
      res.json({ Status: 'OK', token: authtoken }),
      console.log({ email: email, pwd: password })
    )
  } else {
    res.json({ Status: 'NOT OK' })
  }
})

module.exports = router
