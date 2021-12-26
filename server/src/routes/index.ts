import { Router } from "express";
import { getWatchers, addWatcher } from "../controllers/watchers";

const router: Router = Router()
router.get("/watchers", getWatchers);
router.post("/add-watcher", addWatcher);

//router.put("/edit-todo/:id", updateTodo)
//router.delete("/delete-todo/:id", deleteTodo)

export default router;