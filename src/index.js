const express = require('express')

const app = express()

app.use(express.json())
app.use('/api/auth', require('./routes/auth'))
app.use('/api/note', require('./routes/note'))

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
)
