import { Router } from "express";
import { saveDocumentos } from "../controllers/documentos";
import { upload } from '../controllers/multer';

const router = Router();

router.post("/api/documentos/create", upload.single('file'), saveDocumentos); 

export default router