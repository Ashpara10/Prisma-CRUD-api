const { PrismaClient } = require('@prisma/client')
const express = require('express')
const router = express.Router()
const prisma = new PrismaClient()
const fetchuser = require('../middleware/authUser')

router.post(`/note`, fetchuser, async (req, res) => {
  const { title, content, tag } = req.body
  const note = await prisma.note.create({
    data: {
      title: title,
      content: content,
      tags: tag,
      user: {
        connect: {
          id: req.user,
        },
      },
    },
  })
  res.json(note)
})
router.delete(`/note/:id`, fetchuser, async (req, res) => {
  const note = await prisma.note.delete({
    where: {
      id: req.params.id,
    },
  })
  res.json({ msg: 'Note Deleted', note })
})

module.exports = router
