require('dotenv').config()
const express = require("express")
const mongodb=require('./db/connectdb')
const path = require('path')
const cors=require("cors")
const productRoutes = require('./routers/route')
const auth = require('./middleware/auth')
const userRoutes = require('./routers/users.route')
//const { error } = require("console")
const { MulterError } = require("multer")

const app = express()
app.use(express.json())
app.use(cors());
mongodb()


app.use(express.urlencoded({ extended: false }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Different prefixes to avoid conflicts;

app.use('/api/users', userRoutes);

app.use('/api/product',auth,productRoutes); 


app.get('/', (req, resp) => {
    resp.sendFile(path.join(__dirname, "views", "form.html"))
});

//Middlewar
app.use((error,req,resp,next)=>{
    if(error instanceof  MulterError)
    {
        return resp.status(400).send(`Image Error : ${error.message} : ${error.code}`)
    }else if(error){
        return resp.status(500).send(`Something went wrong :${error.message}`)
    }
    next()
})
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});