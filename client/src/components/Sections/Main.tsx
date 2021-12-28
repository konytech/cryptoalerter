import React, { useEffect, useState } from 'react'
import WatcherItem from '../Watchers/WatcherItem'
import AddWatcher from '../Watchers/AddWatcher'
import { getWatchers, addWatcher } from '../../api/API'
import { Box } from '@mui/material'

const Main: React.FC = () => {
  const [watchers, setWatchers] = useState<Watcher[]>([]);

  useEffect(() => {
    fetchWatchers()
  }, []);

  const fetchWatchers = (): void => {
    getWatchers()
      .then(({ data: { watchers } }: Watcher[] | any) => {
        setWatchers(watchers);
      })
      .catch((err: Error) => console.log(err))
  };

  const handleAddWatcher = (e: React.FormEvent, formData: Watcher): void => {
    e.preventDefault();
    console.log(new Date());
    addWatcher(formData)
      .then(res => {
        setWatchers(res.data.watchers);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <Box>
      <main className='App'>
        <h1>My Watchers</h1>
        <AddWatcher addWatcher={handleAddWatcher} />
        {watchers && watchers.map((watcher: Watcher) => (
          <WatcherItem
            key={watcher._id}
            // updateTodo={handleUpdateTodo}
            // deleteTodo={handleDeleteTodo}
            watcher={watcher}
          />
        ))}
      </main>
    </Box>
  )
}

export default Main;