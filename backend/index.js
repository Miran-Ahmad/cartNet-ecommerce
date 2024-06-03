const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { body, validationResult } = require('express-validator');
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const port = process.env.PORT;
const jwtSecret = process.env.JWT_SECRET;
const dbUri = process.env.DB_URI;

app.use(express.json());
app.use(cors());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));

app.use(fileUpload({ useTempFiles: true }));

// Database connection
mongoose.connect((process.env.DB_URI), {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// API creation
app.get("/", (req, res) => {
    res.send("Express app is running");
});

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// Endpoint for uploading images directly to Cloudinary
app.post("/upload", async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ success: 0, error: "No files were uploaded." });
    }

    let productImage = req.files.product;

    try {
        let result = await cloudinary.uploader.upload(productImage.tempFilePath, {
            folder: "uploads", // Folder name in Cloudinary
            public_id: `product_${Date.now()}`, // Public ID for the file in Cloudinary
            resource_type: "auto" // Detect the file type
        });

        res.json({
            success: 1,
            image_url: result.secure_url // Cloudinary URL of the uploaded image
        });
    } catch (error) {
        res.status(500).json({
            success: 0,
            error: "Internal Server Error",
            details: error.message
        });
    }
});

// Schema for creating products
const Product = mongoose.model("Product", {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    new_price: { type: Number, required: true },
    old_price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true }
});

// API to create a new Product
app.post('/addproduct', async (req, res) => {
    try {
        let products = await Product.find({});
        let id = products.length ? products[products.length - 1].id + 1 : 1;
        const product = new Product({ id, ...req.body });
        await product.save();
        res.json({ success: true, name: req.body.name });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Deleting products
app.post('/removeproduct', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        res.json({ success: true, name: req.body.name });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// API to get all products
app.get('/allproducts', async (req, res) => {
    try {
        let products = await Product.find({});
        res.send(products);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Schema for user model
const User = mongoose.model('User', {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    date: { type: Date, default: Date.now }
});

// Endpoint for registering user
app.post('/signup', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        let check = await User.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, errors: "Existing user found with same email" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const cart = Array.from({ length: 300 }, () => 0).reduce((acc, val, idx) => {
            acc[idx] = val;
            return acc;
        }, {});

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            cartData: cart
        });
        await user.save();

        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint for user login
app.post('/login', async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            const passMatch = await bcrypt.compare(req.body.password, user.password);
            if (passMatch) {
                const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
                res.json({ success: true, token });
            } else {
                res.status(400).json({ success: false, errors: "Wrong Password" });
            }
        } else {
            res.status(400).json({ success: false, errors: "Wrong email address" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint for new collections
app.get('/newcollections', async (req, res) => {
    try {
        let products = await Product.find({});
        let newcollection = products.slice(1).slice(-8);
        res.send(newcollection);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint for popular products in clothing
app.get('/popularproducts', async (req, res) => {
    try {
        let products = await Product.find({ category: "clothing" });
        let popularproducts = products.slice(0, 4);
        res.send(popularproducts);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ errors: "Please authenticate using valid login" });
    }
    try {
        const data = jwt.verify(token, jwtSecret);
        req.user = data.id;
        next();
    } catch (error) {
        res.status(401).send({ errors: "Please authenticate using valid login" });
    }
};

// Endpoint for add products in cart items
app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        let userData = await User.findById(req.user);
        userData.cartData[req.body.itemId] = (userData.cartData[req.body.itemId] || 0) + 1;
        await User.findByIdAndUpdate(req.user, { cartData: userData.cartData });
        res.send({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint to remove product from cart
app.post('/removefromcart', fetchUser, async (req, res) => {
    try {
        let userData = await User.findById(req.user);
        if (userData.cartData[req.body.itemId] > 0) {
            userData.cartData[req.body.itemId] -= 1;
        }
        await User.findByIdAndUpdate(req.user, { cartData: userData.cartData });
        res.send({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint for getting cart data
app.post('/getcart', fetchUser, async (req, res) => {
    try {
        let userData = await User.findById(req.user);
        res.json(userData.cartData);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, (error) => {
    if (!error) {
        console.log(`Server is running on Port ${port}`);
    } else {
        console.log("Error:", error);
    }
});
