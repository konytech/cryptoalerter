import { useEffect, useState } from 'react'
import WatcherItem from '../Watchers/WatcherItem'
import { getWatchers } from '../../api/API'
import { Box, Typography } from '@mui/material'
import { AxiosError, AxiosResponse } from 'axios';
import Notifier from "../../controllers/notificationsController";

const WatchersList = ({ authToken } : { authToken: string }) => {
  const [watchers, setWatchers] = useState<Watcher[]>([]);

  useEffect(() => {
    refreshWatchersList();
    console.log("useEffect-fetchWatchers")
  }, []);

  const refreshWatchersList = (): void => {
    getWatchers(authToken)
      .then((res: AxiosResponse) => {
        setWatchers(res.data.watchers);
      })
      .catch((error: AxiosError) => {
        const errorMsg = error.response?.data.message ?? error.message;
        Notifier.logError(`[refreshWatchersList] ${errorMsg}`);
        console.error(error);
      });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ marginBottom: '16px' }}>My watchers</Typography>
        {watchers && watchers.map((watcher: Watcher) => (
          <WatcherItem
            authToken={authToken}
            key={watcher._id}
            watcher={watcher}
            refreshWatchersList={refreshWatchersList}
          />
        ))}
    </Box>
  )
};

export default WatchersList;