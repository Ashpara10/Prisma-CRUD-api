const { PrismaClient } = require('@prisma/client')
const express = require('express')
const router = express.Router()
const prisma = new PrismaClient()
const fetchuser = require('../middleware/authUser')

router.get('/fetchnotes', fetchuser, async (req, res) => {
  const notes = await prisma.note.findMany({
    where: {
      userId: req.user,
    },
  })
  res.json(notes)
})

router.get('/note/:id', fetchuser, async (req, res) => {
  const note = await prisma.note.findUnique({
    where: {
      id: req.params.id,
    },
  })
  res.json(note)
})

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
router.put(`/note/:id`, fetchuser, async (req, res) => {
  const { title, content, tags, published } = req.body
  const note = await prisma.note.update({
    where: {
      id: req.params.id,
    },
    data: {
      title,
      content,
      tags,
      published,
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
