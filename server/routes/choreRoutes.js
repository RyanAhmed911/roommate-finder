import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getChoresForToday, markChoreDone } from "../controllers/choreController.js";

const router = express.Router();

router.get("/", userAuth, getChoresForToday); 
router.post("/done", userAuth, markChoreDone); 

export default router;
//added by Nusayba