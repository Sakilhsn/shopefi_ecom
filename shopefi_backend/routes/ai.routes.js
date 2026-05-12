const express =require("express");
const { chatbot } =require( "../controller/aiBot/ai.controller");
 
const router = express.Router();
 
router.post("/chat", chatbot);
 
module.exports = router;