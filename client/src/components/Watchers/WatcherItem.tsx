import { Card, CardContent, Typography, CardMedia, Box, Link, TextField, IconButton, Switch, Backdrop, CircularProgress } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import theme from "../../theme";
import { AlertType } from "../../api/types";
import { useState } from 'react';
import { setWatcherActive, deleteWatcher } from '../../api/API'
import { AxiosError, AxiosResponse } from 'axios';
import Notifier from "../../controllers/notificationsController";

const WatcherItem = ({ 
  watcher, 
  refreshWatchersList 
}: { 
  watcher: Watcher,
  refreshWatchersList: () => void 
}) => {

  const [backdropEnabled, setBackdropEnabled] = useState(false);

  const onActiveSwitchChange = (watcherId: string, checked: boolean) => {

    setBackdropEnabled(true);
    setWatcherActive(watcherId, checked)
      .then((res: AxiosResponse) => {
        console.log("deleted")
        refreshWatchersList();
        Notifier.logSuccess(`Watcher ${res.data.active ? "enabled" : "disabled"}`);
      })
      .catch((error: AxiosError) => {
        const errorMsg = error.response?.data.message ?? error.message;
        Notifier.logError(errorMsg);
        console.error(error);
      })
      .finally(() => {
        setBackdropEnabled(false);
      });
  }

  const onDeleteButtonClick = (watcherId: string) => {

    setBackdropEnabled(true);
    deleteWatcher(watcherId)
      .then((res: AxiosResponse) => {
        refreshWatchersList();
        Notifier.logSuccess(`Watcher deleted`);
      })
      .catch((error: AxiosError) => {
        const errorMsg = error.response?.data.message ?? error.message;
        Notifier.logError(errorMsg);
        console.error(error);
      })
      .finally(() => {
        setBackdropEnabled(false);
      });
  }

  return (
    <Card sx={{
      width: { xl: '50%' },
      backgroundColor: theme.colors.fourth,
      marginTop: "16px",
      position: 'relative'
    }}>
      <CardContent>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
          open={backdropEnabled}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Box sx={{ display: 'flex' }}>
          <Link href={watcher.coinInfo.url} target="_blank" rel="noreferrer">
            <CardMedia component='img'
              src={`data:image/png;base64, ${watcher.coinInfo.iconBase64}`}
              sx={{ width: '28px', height: '28px' }} />
          </Link>
          <Typography variant="subtitle1" sx={{ marginLeft: "8px" }}>{watcher.coinInfo.symbol}</Typography>
          <Typography variant="subtitle1" sx={{ marginLeft: "auto", marginTop: "5px", color: "gray" }}>Active</Typography>
          <Switch aria-label="active" color={watcher.active ? "warning" : "default"} checked={watcher.active} onChange={e => onActiveSwitchChange(watcher._id!, e.target.checked)} />
          <IconButton aria-label="delete" onClick={e => onDeleteButtonClick(watcher._id!)}>
            <DeleteIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', marginTop: '16px' }}>
          {(watcher.type === AlertType.TargetPriceBelow || watcher.type === AlertType.TargetPriceAbove) &&
            <Typography variant="subtitle1" sx={{ marginLeft: "8px" }}>
              {watcher.coinInfo.symbol}
            </Typography>}
        </Box>
        <Box sx={{ display: 'flex', marginTop: '16px' }}>
          <TextField
            label="Entry price (USD)"
            value={watcher.entryPrice}
            disabled
          />
          {watcher.amountToSell !== undefined &&
            <TextField sx={{ marginLeft: '8px' }}
              label="Amount to sell (USD)"
              value={watcher.amountToSell}
              disabled
            />}
        </Box>
        {watcher.note !== undefined &&
          <Box sx={{ marginTop: '16px' }}>
            <TextField fullWidth
              label="Note"
              multiline
              maxRows={24}
              disabled
              value={watcher.note}
            />
          </Box>}
      </CardContent>
    </Card>
  )
};

export default WatcherItem;