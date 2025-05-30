const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()
const sendMail = require('../services/sendMail.js')
const multer = require('multer');
const { getBucket } = require('../dbconn/dbconn.js');
const { Readable } = require('stream');
const { default: mongoose } = require('mongoose');
const order = require('../models/Order.js')
const product = require('../models/Product.js')
const admin = require('../models/Admin.js')

// Initialize multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//default
router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html'); // Explicitly set content type
    res.send(`<h3 style="animation: marquee 10s linear infinite;">Hello Iphunga Fragrances Database </h3>
              <style>
                  @keyframes marquee {
                      0% { transform: translateX(100%); }
                      100% { transform: translateX(-100%); }
                  }
                  h3 {
                      white-space: nowrap;
                      overflow: hidden;
                      display: inline-block;
                  }
              </style>`);
});
//add order
router.post('/add-order', async(req, res)=>{
    try {
         // Generate a unique invoice number (e.g., "INV-YYYYMMDD-RANDOM4")
    const today = new Date();
    const dateString = today.toISOString().slice(0, 10).replace(/-/g, ''); // "YYYYMMDD"
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4-digit random
    const invoiceNumber = `INV-${dateString}-${randomDigits}`;

    // Build the order payload, including the generated invoiceNumber
    const payload = { ...req.body, invoiceNumber };

    // Create and save the order in MongoDB
    const newOrder = new order(payload);
    const result = await newOrder.save();

    // Prepare email data
    const emailData = {
      to: result.customerEmail,
      subject: `Order Confirmation - ${result.invoiceNumber}`,
      text: `Hello ${result.customerName},

        Thank you for your order at Iphunga Fragrances!
        Your invoice number is ${result.invoiceNumber}.

        Order Details:
        - Total: R${result.total}
        - Delivery Method: ${result.deliveryMethod}
        - Status: ${result.status}

        We will notify you once your order is being packaged or has shipped.

        Thank you for choosing Iphunga Fragrances!`,
    };

    // Send an email (using your sendMail service)
    await sendMail(emailData);

    // Send back the newly created order as a response
    res.status(201).json(result); 
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
})
//get orders
router.get('/get-orders', async(req, res)=> {
    try {
        const Allorders = await order.find()
        res.status(200).send(Allorders)
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
})
//get specific order by invoice number
router.get('/orders/:invoiceNumber', async (req, res) => {
    try {
        const findOrder = await order.findOne({ invoiceNumber: req.params.invoiceNumber });
        if (!findOrder) {
            return res.status(404).send('Order not found');
          }
        res.status(200).send(findOrder);
    } catch (error) {
        res.status(500).send('Could not find a specific order');
    }
});
//update order
router.put('/update-order/:id', async (req, res) => {
    try {
        const updatedOrder = await order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) return res.status(404).send('order not found');

        const body = req.body
        // Send a email

        res.status(200).send(updatedOrder);
    } catch (error) {
        res.status(500).send('Could not update order');
    }
});
//delete order
router.delete('/delete-order/:id', async (req, res)=> {
    try {
        const id = req.params.id;
        const result = await order.deleteOne({ _id: id });

        if (result) {
            return res.status(200).send("Order deleted successfully");
        } else {
            return res.status(404).send("Order not found");
        }

    } catch (error) {
        res.status(500).json({ error: err.message });
    }
})

//register admin
router.post('/admin-register', async(req,res)=> {
    try {

        //check to see if they havent already registered
        const user = await admin.findOne({email: req.body.email})
        if(user) {
            return res.status(409).send("Email already registered, sign in or forgot password")
        }

        //add to payload
        const payload = {...req.body}
        //hash password - wait till salt is done, hash the request password and replace payload with new hashed password 
        const salt = await bcrypt.genSalt(12)
        const newPassword = await bcrypt.hash(req.body.password, salt)
        payload.password = newPassword
        const newUser = new admin(payload)

        //save to mongoDB
        const result = await newUser.save()
        res.status(201).send(result) 
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
})
//login admin
router.post('/admin-login', async(req, res)=> {
    try {
        //check to see if they haven't already registered
        const user = await admin.findOne({email: req.body.email})

        //if user email is not found
        if(!user) {
            return res.status(404).send("Email address not found, register!")
        }

        //compare password
        const correctPassword = await bcrypt.compare(req.body.password, user.password)
        if(!correctPassword) {
            return res.status(401).send("Password is Incorrect!");
        }

        //generate token
        const token = jwt.sign({
            id: user._id
        },process.env.JWT_SECRET, {expiresIn: '1h'})

        //store token in http cookie
        res.cookie('access_token', token, {httpOnly: true})

        //send response
        res.status(200).json({
            message: "Login Success",
            data: user,
            status: 200,
            token: token
        })
        
    } catch (error) {
        return res.status(500).send("Internal Server Error")
    }
})

//add product
router.post('/add-product', async(req, res)=>{
    try {
        //add to payload
        const payload = {...req.body}
        const newProduct = new product(payload)
        //save to mongoDB
        const result = await newProduct.save()
        res.status(201).send(result) 
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
})
// upload a file for a product image
router.post('/upload/:name', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }

        // Find the product by name
        const existingOrder = await product.findOne({ name: req.params.name });
        if (!existingOrder) {
            return res.status(404).send("Order not found");
        }

        const { originalname, mimetype, buffer } = req.file;

        const bucket = getBucket()
        // Open upload stream to GridFS
        const uploadStream = bucket.openUploadStream(originalname, {
            contentType: mimetype,
            metadata: { product: req.params.name }
        });

        const readBuffer = new Readable();
        readBuffer.push(buffer);
        readBuffer.push(null);

        // Pipe buffer to GridFS
        readBuffer.pipe(uploadStream)
            .on('error', (err) => res.status(500).send("Error uploading file"))
            .on('finish', async () => {
                const newFile = {
                    filename: originalname,
                    id: uploadStream.id.toString(),
                    contentType: mimetype,
                    length: buffer.length,
                    fileId: new Date().getTime().toString(),
                };

                // Save file information in the product object
                existingOrder.file = newFile;
                await existingOrder.save();

                res.status(201).send({
                    message: "File uploaded successfully",
                    file: newFile
                });
            });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});
// get a file by id
router.get('/get-file/:id', (req, res) => {
const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid file ID");
    }

    const bucket = getBucket()

    // Download file stream from GridFS
    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(id));

    // Set necessary CORS and content headers
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Cross-Origin-Resource-Policy': 'cross-origin',
    });

    downloadStream.on('error', (err) => {
        if (err.code === 'ENOENT') {
            return res.status(404).send("File not found");
        }
        return res.status(500).send("Internal Server Error");
    });

    downloadStream.on('file', (file) => {
        res.set('Content-Type', file.contentType);
    });

    downloadStream.pipe(res);
});
//get products
router.get('/get-products', async(req, res)=> {
    try {
        const Allproducts = await product.find()
        res.status(200).send(Allproducts)
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
})
//get specific product by id
router.get('/products/:id', async (req, res) => {
    try {
        const findProduct = await product.findOne({ _id: req.params.id });
        if (!findProduct) {
            return res.status(404).send('Product not found');
          }
        res.status(200).send(findProduct);
    } catch (error) {
        res.status(500).send('Could not find a specific product');
    }
});
//update product
router.put('/update-product/:id', async (req, res) => {
    try {
        const updatedProduct = await product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).send('product not found');

        const body = req.body
        // Send a email

        res.status(200).send(updatedProduct);
    } catch (error) {
        res.status(500).send('Could not update product');
    }
});
//delete product
router.delete('/delete-product/:id', async (req, res)=> {
    try {
        const id = req.params.id;
        const result = await product.deleteOne({ _id: id });

        if (result) {
            return res.status(200).send("Product deleted successfully");
        } else {
            return res.status(404).send("Product not found");
        }

    } catch (error) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router