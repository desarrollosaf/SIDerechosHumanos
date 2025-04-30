import { Router } from "express";
import { deleteRegistro, getRegistros, getRegistro, saveRegistro, putRegistro} from "../controllers/solicitud";

const router = Router();


router.get("/api/solicitud", getRegistros)
router.post("/api/solicitud/:id", getRegistro)
router.delete("/api/solicitud/:id", deleteRegistro)
router.post("/api/solicitud/", saveRegistro)
router.put("/api/solicitud/:id", putRegistro)

export default router