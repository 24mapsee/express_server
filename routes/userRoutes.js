const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('', (req, res) => {
    res.send('hi');
});

router.get('/create-user', userController.createRandomUser)

// 회원가입 라우트
router.post(
    '/register',
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    userController.register
);

module.exports = router;
