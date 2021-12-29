import { Router } from "express";
import { getWatchers, addWatcher } from "../controllers/watchersController";
import { getCoinInfo } from "../controllers/cmcController";

const router: Router = Router();
router.get("/watchers", getWatchers);
router.post("/add-watcher", addWatcher);
router.post("/coinInfo", getCoinInfo);

//router.put("/edit-todo/:id", updateTodo)
//router.delete("/delete-todo/:id", deleteTodo)

export default router;