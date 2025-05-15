import { Router } from "express";
import { deleteRegistro, getRegistros, getRegistro, saveRegistro, putRegistro, getsolicitudes} from "../controllers/solicitud";

const router = Router();

router.post("/api/solicitud/create", saveRegistro)
router.get("/api/solicitud/read", getRegistros)
router.delete("/api/solicitud/delete/:id", deleteRegistro)
router.post("/api/solicitud/edit/:id", getRegistro)
router.put("/api/solicitud/update/:id", putRegistro)
router.get("/api/solicitud/getsolicitudes/:id", getsolicitudes)

export default router