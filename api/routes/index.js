import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import multer from 'multer';


const router = express.Router();
const upload = multer({
  dest: './uploads/' 
});

/**
 * apps status and stats
 */
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

/**
 * user controll endpoints
 */
router.post('/register', UsersController.postNew);
router.put('/user/update-pfp', upload.single('file'), UsersController.putPfp);
router.put('/user/:username', UsersController.putMe);

/**
 * authentication endpoints
 */
router.post('/login', AuthController.postConnect);
router.get('/logout', AuthController.getDisconnect);

export default router;