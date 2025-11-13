const express = require("express")
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const cliend = require("../Schemas/Schema")
const route = express.Router()

//image uplode
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        const newfilename = Date.now() + path.extname(file.originalname)
        cb(null, newfilename)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error('only images are allowed'), false)
    }
}

let upload = multer({
    storage: storage,
    fileFilter: fileFilter
})

//get find all product
route.get('/prod', async (req, resp) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { First_Name: { $regex: search, $options: 'i' } },
        { Last_Name: { $regex: search, $options: 'i' } },
        { Email: { $regex: search, $options: 'i' } }
      ]
    };

    const total = await cliend.countDocuments(query);

    const data = await cliend
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 });

    resp.json({
      data,
      totalItems: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      limit
    });
  } catch (error) {
    console.error('pagination error:', error);
    resp.status(500).json({ message: error.message });
  }
});


//get a single product 
route.get('/prod/:id', async (req, resp) => {
    try {
        let data = await cliend.findById(req.params.id)
        if (!data) return resp.status(404).json({ message: "User Not found" })
        resp.json(data)

    } catch (error) {
        resp.status(500).json({ message: error.message })
    }
})

//add new product
route.post('/addprod', upload.single('profile_pic'),async (req, resp) => {
    try {
       // let newProduct = await cliend.create(req.body)
       const Product = new cliend(req.body)
       if(req.file){
        Product.profile_pic = req.file.filename
       }
       const newProduct =await Product.save()
        resp.status(200).json(newProduct)
    } catch (error) {
        resp.status(400).json({ message: error.message })
    }
})

//update product 
route.put('/update/:id',upload.single('profile_pic'), async (req, resp) => {
    try {
        const existingProduct =await cliend.findById(req.params.id)

        if(!existingProduct){
            if(req.file.filename)
            {
                const filePath=path.join('./uploads',req.file.filename)
                fs.unlink(filePath,(error)=>{
                    if(error)console.log('Failed to Delete image:',error)
                })
            }
            return resp.status(404).json({message:'Product not found'})
        } 
            if(req.file)
            {
                 if(existingProduct.profile_pic)
                 {
                    const oldimage=path.join('./uploads',existingProduct.profile_pic)
                    fs.unlink(oldimage,(error)=>{
                        if(error)console.log('Failed to Delete old image:',error)
                    })
                 }
                 req.body.profile_pic=req.file.filename
            }

        let updateProd = await cliend.findByIdAndUpdate(req.params.id, req.body,
            { new: true }
        )
        resp.json(updateProd)
    } catch (error) {
        resp.status(400).json({ message: error.message })
    }
})

//delete product 
route.delete('/delete/:id', async (req, resp) => {
    try {
        const deleProduct = await cliend.findByIdAndDelete(req.params.id)
        if (!deleProduct) return resp.status(404).json({ message: "Product Not found" })

            if(deleProduct.profile_pic)
            {
                const filePath=path.join('./uploads',deleProduct.profile_pic)
                fs.unlink(filePath,(error)=>{
                    if(error)console.log('Failed to delete'.error)
                })
            }
        resp.json(deleProduct)
    } catch (error) {
        resp.status(404).json({ message: error.message })
    }
})
module.exports = route