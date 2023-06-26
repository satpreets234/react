const router=require('express').Router();
const userController=require('../controllres/user-controllers')
const authMiddleware=require('../middleware/auth-middleware')

router.post('/login', userController.login);
router.post('/signup',userController.signup);
router.post('/login-facebook',userController.signup);
router.post('/login-gmail',userController.loginWithGoogle);
router.post('/login-github',userController.loginWithGithub);
router.get('/profile-data',authMiddleware.authenticateToken,userController.profileData);
router.post('/users-data',authMiddleware.authenticateAdminToken,userController.getUsers);
router.post('/update-user-status',authMiddleware.authenticateAdminToken,userController.updateStatus);
router.post('/heavy', userController.heavy)
router.post('/verify',userController.verifyUser);
router.post('/migration',authMiddleware.authenticateAdminToken,userController.migration)
router.post('/query',userController.addQuery)




module.exports = router;
