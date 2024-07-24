require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Configure multer for file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    })
});

// Set up Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes
app.post('/apply', upload.single('resume'), (req, res) => {
    const { name, email, phone, position, duration } = req.body;
    const resume = req.file ? req.file.path : 'No resume uploaded';

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Application Received',
        text: `Thank you for applying!

        Here are the details we received:
        Full Name: ${name}
        Email: ${email}
        Phone Number: ${phone}
        Position: ${position}
        Internship Duration: ${duration}
        Resume: ${resume}

        Best regards,
        Company`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred:', error);
            return res.status(500).send('Error sending email');
        } else {
            res.redirect('/submitted');
        }
    });
});

app.get('/submitted', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'submitted.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
