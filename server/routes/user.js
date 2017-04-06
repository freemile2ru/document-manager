/* eslint import/no-extraneous-dependencies: 0 */
/* eslint import/no-unresolved: 0 */
import express from 'express';
import Controller from '../controllers';
import Authenticator from '../middleware/authenticator';

const UserController = Controller.user;
const DocumentController = Controller.document;
const router = express.Router();

router.route('/')
    .get(Authenticator.authenticateUser,
        Authenticator.authenticateAdmin, UserController.fetchAllUsers)
    .post(UserController.createUser);

export default router;