import { Card, CardContent, Typography, CardMedia, Box, Link, TextField, IconButton, Switch, Backdrop, CircularProgress } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import theme from "../../theme";
import { AlertType } from "../../api/types";
import { useState } from 'react';
import { setWatcherActive } from '../../api/API'
import { AxiosError, AxiosResponse } from 'axios';

const WatcherItem = ({ watcherProp }: { watcherProp: Watcher }) => {

  const [watcher, setWatcher] = useState(watcherProp);
  const [backdropEnabled, setBackdropEnabled] = useState(false);

  const onActiveSwitchChange = (watcherId: string, checked: boolean) => {
    setBackdropEnabled(true);
    setWatcherActive(watcherId, checked)
      .then((res: AxiosResponse) => {
        setWatcher({ ...watcher, active: res.data.active });
      })
      .catch((error: AxiosError) => {
        const errorMsg = error.response?.data.message ?? error.message;
        alert(errorMsg); // TODO
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
      marginTop: "16px"
    }}>
      <CardContent>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
          <IconButton aria-label="delete">
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