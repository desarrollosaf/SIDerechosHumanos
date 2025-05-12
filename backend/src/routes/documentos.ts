import { Router } from "express";
import { getDocumentos, saveDocumentos } from "../controllers/documentos";
import { upload } from '../controllers/multer';

const router = Router();
router.post("/api/documentos/create/:usuarioId", upload.single('archivo'), saveDocumentos); 
router.post("/api/documentos/getdocumentos/:id", getDocumentos)

export default router 