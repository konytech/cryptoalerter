import { Router } from "express";
import { getWatchers, addWatcher, setWatcherActive, deleteWatcher } from "../controllers/watchersController";
import { getCoinInfo } from "../controllers/cmcController";

const router: Router = Router();
router.post("/watchers", getWatchers);
router.post("/add-watcher", addWatcher);
router.post("/coinInfo", getCoinInfo);
router.post("/set-watcher-active", setWatcherActive);
router.post("/delete-watcher", deleteWatcher);

//router.put("/edit-todo/:id", updateTodo)
//router.delete("/delete-todo/:id", deleteTodo)

export default router;