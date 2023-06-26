const User = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { transporter, sendMail } = require('../services/node-mail')
const registerTemplate = require('../templates/register-template')
const verifytemplate = require('../templates/successfull-verication')
const axios = require('axios');
const userModel = require('../models/user-model');
const queryModel = require('../models/query-model');
const validateEmail = email => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  
  const validatePassword = password => {
    // Add your own validation rules for the password, such as minimum length, numbers, symbols, etc.
    return password.length >= 6;
  };
  
  const signup = async (req, res) => {
    const { email, password, token } = req.body;
    let userType = req.body.userType || 'user';
  
    if (!email || !password) {
      return res.status(400).send('Please provide email and password!');
    }
  
    if (!validateEmail(email)) {
      return res.status(400).send('Please provide a valid email address!');
    }
  
    if (!validatePassword(password)) {
      return res
        .status(400)
        .send('Please provide a password with at least 6 characters!');
    }
  
    try {
      const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SITE_SECRET}&response=${token}`
      );
  
      if (!response.data.success) {
        return res
          .status(401)
          .send('Sorry, but robots or bots are not allowed!');
      }
  
      const alreadyUser = await User.findOne({ email });
  
      if (alreadyUser) {
        return res.status(409).send('This email address is already registered!');
      }
  
      const user = new User({ email, password, userType });
      const userDetails = await user.save({ select: '-password' });
  
      if (userDetails) {
        const link = `${process.env.FRONTEND_SITE_URL}verify?userId=${userDetails._id}`;
        const mailOptions = {
          from: process.env.NODEMAILER_EMAIL,
          to: userDetails.email,
          subject: `Thanks for registering on ${process.env.FRONTEND_SITE_URL}`,
          html: registerTemplate(userDetails, link),
        };
        const mailDetails = await sendMail(transporter, mailOptions);
  
        if (!mailDetails) {
          // delete the user if sending verification email fails
          await User.deleteOne({ _id: userDetails._id });
          return res.status(500).send('Unable to send verification email!');
        }
  
        return res.status(201).send({
          message:
            'Thank you for registration! Please verify your email address before logging in.',
          user: userDetails,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error!');
    }
  
    res.status(500).send('Internal server error!');
  };

const login = async (req, res) => {
    const { email, password, token } = req.body;
  console.log(1);
    if (!email || !password) {
      return res.status(400).send('Please provide email and password!');
    }
  
    try {
    //   const response = await axios.post(
    //     `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SITE_SECRET}&response=${token}`
    //   );
  
    //   if (!response.data.success) {
    //     return res
    //       .status(401)
    //       .send('Sorry, but robots or bots are not allowed!');
    //   }
  
      const alreadyUser = await User.findOne({ email });
  
      if (!alreadyUser) {
        return res.status(401).send('Please register first!');
      }
  
      if (!alreadyUser.isVerified) {
        return res.status(401).send('Please verify your account!');
      }
  
      const passwordMatch = await bcrypt.compare(password, alreadyUser.password);
  
      if (!passwordMatch) {
        return res.status(401).send('Bad credentials!');
      }
  
      const lastLoginAt = Date.now();
  
      await alreadyUser.updateOne({ lastLoginAt });
  
      const loginToken = jwt.sign({ _id: alreadyUser._id }, process.env.SECRET_KEY, {
        expiresIn: '1h',
      });
  
      return res.status(200).send({ email: alreadyUser.email, loginToken });
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal server error!');
    }
  };

const signupFacebook = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).send('Please provide email and password!')
    } else {
        const alreadyUser = await User.findOne({ email });
        if (alreadyUser) {
            res.status(402).send('Email already exists!')
        } else {
            const user = new User({ email, password });
            const userDetails = await user.save();
            if (userDetails) {
                var link = `${process.env.FRONTEND_SITE_URL}verify?userId=${userDetails._id}`
                var mailOptions = {
                    from: process.env.NODEMAILER_EMAIL,
                    to: userDetails.email,
                    subject: `Thanks for registering to ${process.env.FRONTEND_SITE_URL}`,
                    html: registerTemplate(userDetails, link)
                };
                const mailDetails = await sendMail(transporter, mailOptions, link)
                if (mailDetails == undefined || mailDetails == null) {
                    res.status(404).send('Mail Not Found !')
                    await User.deleteOne({ _id: userDetails._id });
                }
                else {
                    res.status(200).send('Register successfully !')
                }
            } else {
                res.status(500).send('Internal server error!')
            }
        }

    }
}

const loginWithGoogle = async (req, res) => {
    try {
        const { token, provider_name } = req.body;
        const userData = jwt.decode(token)

        // Generate the authentication token
        const loginToken = jwt.sign({ email: userData?.email }, process.env.SECRET_KEY, { expiresIn: '1h' })
        // Send the response back to the frontend
        res.status(200).json({ success: true, loginToken: loginToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error occurred while logging in with Gmail' });
    }
}

const loginWithGithub = async (req, res) => {
    try {
        const { code } = req.body;

        const data = {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: process.env.GITHUB_REDIRECT_URI

        }
        const accesToken = await axios.post(`https://github.com/login/oauth/access_token`, data)
        let token = accesToken?.data?.split('&');
        token = token.find(tok => tok.startsWith('access_token='))
        const bearerToken = token?.split('=')[1]
        if (bearerToken) {
            const response = await axios.get('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `token ${bearerToken}`,
                },
            });
            if (response) {
                const emails = response.data.map((email) => email.email);
                const token = jwt.sign({ email: emails[0] }, process.env.SECRET_KEY, { expiresIn: '1h' });
                res.status(200).send({token})
            } else {
                res.status(404).send('Not authorized')
            }
        }

    } catch (error) {
        console.log(error);
    }

}

const heavy = async(req,res)=>{
    let z=0;
    for(let i=0;i<5000000;i++){
        z++
    }
    res.status(200).send({z})
}


const profileData = async (req, res) => {
    if (req.user) {
        const alreadyUser = await User.findOne({ _id: req.user._id });
        if (alreadyUser) {
            res.status(200).send({ email: alreadyUser.email })
        }
    } else {
        res.status(401).send('Unauthorized Access!')
    }
}

const updateStatus = async (req, res) => {
    const { userId } = req.body;
    const alreadyUser = await User.findById({ _id: userId });
    
    if (alreadyUser) {
        const updateUser=await User.findByIdAndUpdate({_id:userId}, { isActive: !alreadyUser.isActive }, { new: true })
        if(updateUser.isModified){
            res.status(200).send("Account Status Updated successfully !")
        }else{
        res.status(500).send("Can't update !")
        }
    } else {
        res.status(401).send('Unauthorized Access!')
    }
}

const getUsers = async (req, res) => {
    try {
      if (req.user) {
        let query = {};
        const { isActive, isVerified, email, sortBy, pageNo, rowsPerPage } = req.body;
        if (typeof isActive === "boolean") {
          query.isActive = isActive;
        }
        if (typeof isVerified === "boolean") {
          query.isVerified = isVerified;
        }
        if (email) {
          query.email = { $options: "i", $regex: email };
        }
  
        let sorter;
        if (sortBy === "ASC") {
          sorter = { lastLoginAt: 1 };
        }
        if (sortBy === "DES") {
          sorter = { lastLoginAt: -1 };
        }
        if(pageNo && rowsPerPage){
            const totalCount = await User.countDocuments(query);
            const totalPages = Math.ceil(totalCount / rowsPerPage);
      
            const users = await User.find(query)
              .sort(sorter)
              .skip((pageNo - 1) * rowsPerPage)
              .limit(rowsPerPage);
      
            res.status(200).send({ users, totalCount, totalPages });
        }else{
            const users = await User.find(query)
            .sort(sorter)
            res.status(200).send({ users });
        }
        
      } else {
        res.status(200).send({ users: [], totalCount: 0, totalPages: 0 });
      }
    } catch (error) {
        console.log(error);
      res.status(500).send(error);
    }
};

const verifyUser = async (req, res) => {
    const { userId } = req.body;
    const alreadyUser = await User.findByIdAndUpdate({ _id: userId }, { isVerified: true }, { new: true, upsert: true });
    var mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: alreadyUser.email,
        subject: `Thanks for verifying your account`,
        html: verifytemplate(alreadyUser)
    };
    const mailDetails = await sendMail(transporter, mailOptions)
    if (alreadyUser) {
        res.status(200).send("Account Verified successfully !")
    } else {
        res.status(401).send('Unauthorized Access!')
    }
}

const migration = async(req,res) =>{
    try {
      const updateAll =await userModel.updateMany({},{$set:{isActive:true}}) ;
      if(updateAll.modifiedCount>0){
        res.status(401).send('Migration completed')
      }else{
        res.status(401).send('Some eror occured!')
      }
    } catch (error) {
        res.status(500).send(error)
    }
}

const addQuery = (req,res) =>{
    try {
        const {email,name,query}=req.body;
        const newQuery =new queryModel({email,name,query});
         newQuery.save().then((result)=>{
            res.status(200).send(result);
         }).catch((savingError)=>{
            res.status(403).send(savingError) ;   
         })
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = {
    signup, login, profileData, verifyUser, loginWithGoogle
    , loginWithGithub,heavy,getUsers,updateStatus,migration,addQuery
}