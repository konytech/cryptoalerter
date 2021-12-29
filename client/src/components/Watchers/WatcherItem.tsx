import React from "react";

type Props = WatcherProps & {
  //updateWatcher: (watcher: Watcher) => void;
  //deleteWatcher: (id: number) => void;
};

const WatcherItem: React.FC<Props> = ({ watcher/*, updateWatcher, deleteWatcher*/ }) => {
  const checkTodo: string = watcher.active ? `line-through` : ""
  console.log(watcher);
  return (
    <div className="Card">
      <div className="Card--text">
        <h1 className={checkTodo}>{watcher.coinInfo.symbol}</h1>
      </div>
      <div className="Card--button">
        <button
          //onClick={() => updateWatcher(watcher)}
          className={watcher.active ? `hide-button` : "Card--button__done"}
        >
          Complete
        </button>
        <button
          //onClick={() => deleteWatcher(watcher.id)}
          className="Card--button__delete"
        >
          Delete
        </button>
      </div>
    </div>
  )
};

export default WatcherItem;