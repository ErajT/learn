const { createUser,login,forgetPwd,resetPwd,logout }= require('./user.controller');

const router = require("express").Router();

router.post('/',createUser);
router.post('/login',login);
router.post('/forgetPassword',forgetPwd)
router.patch('/resetPassword/:token',resetPwd)
router.post('/logout',logout);

module.exports= router;