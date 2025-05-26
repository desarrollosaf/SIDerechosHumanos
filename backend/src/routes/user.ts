import { Router } from "express";
import { CreateUser, LoginUser, ReadUser, getvalidadores, changevalidador, saveValidador, deletevali, updatevalidador, getvalidador } from "../controllers/user";

const router = Router();

router.get("/api/user/read", ReadUser)
router.post("/api/user/create", CreateUser)
router.post("/api/user/register", CreateUser)
router.post("/api/user/login", LoginUser)
router.get("/api/user/getvalidadores", getvalidadores)
router.post("/api/user/updatevalidador", changevalidador)
router.post("/api/user/savevalidador", saveValidador)
router.post('/api/user/delete/:id', deletevali)
router.put('/api/user/updatedatos/:id', updatevalidador)
router.get("/api/user/getvalidador/:id", getvalidador)


export default router