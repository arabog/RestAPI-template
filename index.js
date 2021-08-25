const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const morgan = require("morgan")
const helmet = require("helmet")


dotenv.config()

const PORT = process.env.PORT

// db setup
const dbSetup = require("./db/db")


// routes
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")


// db called
dbSetup()


// middleware 
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))


app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)


app.listen(process.env.PORT || PORT, () => {
          console.log(`Backend server is running on port ${PORT}`);
})