import express from 'express';
import { ID } from './variables';

import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from '../controllers/userController';

const router = express.Router();
router.route('/').get(getAllUsers).post(createUser);

router.route(ID).get(getUserById).patch(updateUser).delete(deleteUser);

export default router;
