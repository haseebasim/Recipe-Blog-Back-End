const express = require("express")
const User = require('../models/user')
const router = new express.Router();
const auth = require('../middlewear/auth')
const sendEmail = require('../nodeMailer/nodeMailer')
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
      await user.save();
      const token = await user.generateAuthToken(); 
      res.send({user,token})
  } catch (error) {
      res.send(error)
  }
}); 

router.post('/user/logout',auth, async (req,res)=>{
  
  try {
        req.user.tokens = [];
        await req.user.save();
        res.send("1")
    } catch (error) {
        res.send(error)
    }
})


router.post('/user_login', async (req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        
        const token = await user.generateAuthToken();
        res.send({user, token})
    } catch (error) {
        res.send('-1')
    }
})

router.get('/user_val/:name/:email', async (req,res)=>{
    
    try {
        const user = await User.findOne({
          name: req.params.name,
          email: req.params.email,
        });

        if(!user){
            res.send("-1")
        }

        res.send('1')
    } catch (error) {
        res.send(error)
    }
})

router.post("/suggestion",auth, async (req, res) => {
  const email = req.user.email;
  const comment = req.body.comment;
  const subject = req.body.subject;

  const msg = `FROM : <h3>${email}</h3> <br> <p>${comment}</p>`;

  try {
    await sendEmail(msg, subject);
    res.send("1");
  } catch (error) {
    res.send(err);
  }
});

router.post("/contact", async (req, res) => {
  const email = req.body.email;
  const comment = req.body.comment;
  const subject = req.body.subject;

  const msg = `FROM : <h3>${email}</h3> <br> <p>${comment}</p>`;

  try {
    await sendEmail(msg, subject);
    res.send("1");
  } catch (error) {
    res.send(err);
  }
});


module.exports = router;
