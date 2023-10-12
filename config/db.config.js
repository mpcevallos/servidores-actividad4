const mongoose = require("mongoose")
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer

MongoMemoryServer.create()
  .then((mongoServer) => {
    return mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      dbName: "servidores2-crud",
      useUnifiedTopology: true,
    })
  })
  .then(() => console.info(`Successfully connected to the database`))
  .catch((err) => {
    console.error(err)
  })
