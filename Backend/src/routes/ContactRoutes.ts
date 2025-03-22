import { Router } from "express";
import { getAllContacts, getContactDMList, SearchContacts } from "../controllers";
import { Authenticate } from "../middleware/CommonAuth";

const router = Router();
router.post('/search',Authenticate ,SearchContacts);
router.get('/getContacts',Authenticate,getContactDMList);
router.get('/getallContacts',Authenticate,getAllContacts);

export{router as ContactRoutes};