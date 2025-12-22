//Implemented by Nusayba

import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getCompatibilityScore } from '../controllers/compatibilityController.js';

const compatibilityRouter = express.Router();

compatibilityRouter.post('/score', userAuth, getCompatibilityScore);

export default compatibilityRouter;