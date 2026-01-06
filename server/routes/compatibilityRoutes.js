//Implemented by Nusayba
import express from 'express';
import { getCompatibilityScore } from '../controllers/compatibilityController.js';

const compatibilityRouter = express.Router();

compatibilityRouter.post('/score', getCompatibilityScore);

export default compatibilityRouter;