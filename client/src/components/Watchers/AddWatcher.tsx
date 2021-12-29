import { Box, Card, CardContent, Typography, TextField, Alert, Link, LinearProgress, Divider } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import React, { useState, useEffect } from 'react';
import theme from '../../theme';
import { getCoinInfo } from '../../api/API'
import { AxiosError, AxiosResponse } from 'axios';
import LinkIcon from '@mui/icons-material/Link';

const enum AlertType {
  TargetPrice = 10,
  TargetPositivePercentage = 20,
  TargetNegativePercentage = 30
}

type Props = {
  addWatcher: (e: React.FormEvent, formData: Watcher | any) => void;
}

const AddWatcher: React.FC<Props> = ({ addWatcher }) => {
  const [watcher, setWatcher] = useState<Watcher>({
    // TODO DEV ONLY
    coinInfo: {
      cmcId: 1,
      url: "https://coinmarketcap.com/currencies/bitcoin/",
      symbol: "BTC"
    }
  });
  const [cmcUrlState, setCmcUrlState] = useState({
    hidden: true, // TODO DEV ONLY
    loading: false,
    errorMessage: ""
  });
  const [alertType, setAlertType] = useState(AlertType.TargetPrice);

  useEffect(() => {
    console.log('[useEffect] Watcher: ', watcher);
  }, [watcher])

  const handleForm = (e: React.FormEvent<HTMLInputElement>): void => {
    setWatcher({
      ...watcher,
      [e.currentTarget.id]: e.currentTarget.value,
    } as Watcher);
  };

  const onCMCUrlChange = (url: string) => {
    if (url.match("^https://coinmarketcap.com/currencies/[a-zA-Z-]*/?$")) {
      // Valid url
      setCmcUrlState({ ...cmcUrlState, loading: true });
      getCoinInfo(url)
        .then((res: AxiosResponse) => {
          setCmcUrlState({ ...cmcUrlState, hidden: true });
          setWatcher({ ...watcher, coinInfo: res.data.coinInfo });
        })
        .catch((error: AxiosError) => {
          const errorMsg = error.response?.data.message ?? error.message;
          setCmcUrlState({ ...cmcUrlState, loading: false, errorMessage: errorMsg });
          console.error(error);
        });
    }
  }

  const onAlertTypeChange = (type: number) => {
    setAlertType(type);
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ marginBottom: '16px' }}>Add watcher</Typography>
      <Card sx={{ width: { xl: '50%' }, backgroundColor: theme.colors.fourth }}>
        <CardContent>
          {!cmcUrlState.hidden &&
            <Box>
              <Box>
                <TextField sx={{ width: { xs: '100%', md: '80%' }, marginBottom: "8px" }}
                  label="CoinMarketCap URL"
                  placeholder="https://"
                  onChange={e => onCMCUrlChange(e.target.value)}
                  type="url"
                  disabled={cmcUrlState.loading}
                />
                {cmcUrlState.loading && <LinearProgress />}
              </Box>
              <Box>
                <Typography variant="caption" sx={{ marginBottom: '8px', color: 'gray' }}>e.g. </Typography>
                <Link href="https://coinmarketcap.com/currencies/bitcoin/" variant="caption" sx={{ marginBottom: '8px', color: 'gray' }}>
                  https://coinmarketcap.com/currencies/bitcoin/
                </Link>
              </Box>
              {cmcUrlState.errorMessage && <Box sx={{ marginTop: '8px' }}>
                <Alert severity="error" onClose={() => setCmcUrlState(x => { return { ...x, errorMessage: "" } })}>{cmcUrlState.errorMessage}</Alert>
              </Box>}
            </Box>
          }
          {watcher &&
            <Box>
              <Box sx={{ width: '56px', height: '56px' }}>
                <Link href={watcher.coinInfo.url} target="_blank" rel="noreferrer">
                  <LinkIcon sx={{ color: 'white', width: '32px', height: '32px' }} />
                </Link>
              </Box>
              <TextField sx={{ width: { xs: '100%', md: '50%' }, marginBottom: "16px", marginRight: "8px" }}
                label="CoinMarketCap URL"
                value={watcher.coinInfo.url.replace("https://coinmarketcap.com", "")}
                disabled
                color='success'
              />
              <TextField sx={{ width: { xs: '45%', md: '20%' }, marginBottom: "8px", marginRight: "8px" }}
                label="CoinMarketCap ID"
                value={watcher.coinInfo.cmcId}
                disabled
              />
              <TextField sx={{ width: { xs: '45%', md: '20%' }, marginBottom: "8px" }}
                label="Symbol"
                value={watcher.coinInfo.symbol}
                disabled
              />
              <Box sx={{ marginTop: '8px' }}>
                <FormControl sx={{ width: { xs: '100%', md: '50%' } }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    id="type-select"
                    value={alertType}
                    label="Type"
                    onChange={e => onAlertTypeChange(+e.target.value)}
                  >
                    <MenuItem value={AlertType.TargetPrice}>Target price</MenuItem>
                    <MenuItem value={AlertType.TargetPositivePercentage}>Target positive percentage</MenuItem>
                    <MenuItem value={AlertType.TargetNegativePercentage}>Target negative percentage</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          }
          <Box sx={{ marginTop: '16px' }}>
            {alertType === AlertType.TargetPrice &&
              <TextField sx={{ width: { xs: '45%', md: '30%' } }}
                label="Target Price (USD)"
                type="number"
              />
            }
          </Box>
          <Box sx={{ marginTop: '32px' }}>
            <Typography variant="h6">Optional</Typography>
            <Divider sx={{ marginBottom: '16px' }} />
            <TextField sx={{ width: { xs: '45%', md: '30%' } }}
              label={`Amount to sell (${watcher.coinInfo.symbol})`}
              type="number"
            />
            <Box sx={{ marginTop: '16px' }}>
              <TextField fullWidth
                label="Note"
                type="text"
                multiline
                rows={6}
                maxRows={24}
              />
            </Box>
          </Box>
          {/* <FormControl onSubmit={(e) => addWatcher(e, formData)}>
              <Box>
                <TextField sx={{ width: { xs: '100%', md: '80%' }, marginBottom: "8px" }}
                  required
                  id="outlined-required"
                  label="URL"
                  placeholder="https://"
                />
              </Box>
            <Button variant="contained">Add</Button>
          </FormControl> */}
        </CardContent>
      </Card>
    </Box>
  )
};

export default AddWatcher;