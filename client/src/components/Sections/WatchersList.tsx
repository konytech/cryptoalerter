import { useEffect, useState } from 'react'
import WatcherItem from '../Watchers/WatcherItem'
import { getWatchers } from '../../api/API'
import { Box, Typography } from '@mui/material'
import { AxiosError, AxiosResponse } from 'axios';

const WatchersList = () => {
  const [watchers, setWatchers] = useState<Watcher[]>([]);

  useEffect(() => {
    fetchWatchers();
    console.log("useEffect-fetchWatchers")
  }, []);

  const fetchWatchers = (): void => {
    getWatchers()
      .then((res: AxiosResponse) => {
        setWatchers(res.data.watchers);
      })
      .catch((error: AxiosError) => {
        const errorMsg = error.response?.data.message ?? error.message;
        alert(errorMsg); // TODO
        console.error(error);
      });
  };

  // const handleAddWatcher = (e: React.FormEvent, formData: Watcher): void => {
  //   e.preventDefault();
  //   console.log(new Date());
  //   addWatcher(formData)
  //     .then(res => {
  //       setWatchers(res.data.watchers);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // };

  return (
    <Box>
      <Typography variant="h4" sx={{ marginBottom: '16px' }}>My watchers</Typography>
      {watchers && watchers.map((watcher: Watcher) => (
        <WatcherItem
          key={watcher._id}
          watcherProp={watcher}
        />
      ))}
    </Box>
  )
};

export default WatchersList;