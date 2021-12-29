import { Box, Card, CardContent, Typography, TextField, Alert, Link, LinearProgress } from '@mui/material';
import React, { useState, useEffect } from 'react';
import theme from '../../theme';
import { getCoinInfo } from '../../api/API'
import { AxiosError, AxiosResponse } from 'axios';

type Props = {
  addWatcher: (e: React.FormEvent, formData: Watcher | any) => void;
}

const AddWatcher: React.FC<Props> = ({ addWatcher }) => {
  const [watcher, setWatcher] = useState<Watcher>();
  const [cmcUrlState, setCmcUrlState] = useState({
    hidden: false,
    loading: false,
    errorMessage: ""
  });

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

  return (
    <Box>
      <Typography variant="h4" sx={{ marginBottom: '16px' }}>Add watcher</Typography>
      <Card sx={{ width: { xl: '50%' }, backgroundColor: theme.colors.fourth }}>
        <CardContent>
          {!cmcUrlState.hidden && <Box>
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
          </Box>}
          {watcher && <Box>
            <TextField sx={{ width: { xs: '100%', md: '80%' }, marginBottom: "16px" }}
              label="CoinMarketCap URL"
              value={watcher.coinInfo.url.replace("https://coinmarketcap.com", "")}
              disabled
            />
            <Box>
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
            </Box>
          </Box>}
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