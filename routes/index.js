import { Router } from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import UserController from '../controllers/UsersController';
import FilesController from '../controllers/FilesController';
import validateToken from '../middleware/validateToken';

const router = Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UserController.postNew);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UserController.getMe);
router.post('/files', validateToken, FilesController.postUpload);
router.get('/files/:id', validateToken, FilesController.getShow);
router.get('/files', validateToken, FilesController.getIndex);
router.put('/files/:id/publish', validateToken, FilesController.putPublish);
router.put('/files/:id/unpublish', validateToken, FilesController.putUnpublish);
router.put('/files/:id/data', FilesController.getFile);

export default router;
