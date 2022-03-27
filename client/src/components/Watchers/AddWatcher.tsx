import { Box, Card, CardContent, Typography, TextField, Alert, Link, LinearProgress, Divider, Button, CardMedia } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Checkbox, CircularProgress } from '@mui/material';
import React, { useState, useEffect } from 'react';
import theme from '../../theme';
import { getCoinInfo, addWatcher } from '../../api/API'
import { AxiosError, AxiosResponse } from 'axios';
import { AlertType, getTriggerDescription } from '../../utils';

const enum FEAlertType {
  TargetPrice = 1,
  TargetPercentage = 2,
}

// type Props = {
//   addWatcher: (e: React.FormEvent, formData: Watcher | any) => void;
// }

const AddWatcher = ({ authToken } : { authToken: string }) => {
  const [watcher, setWatcher] = useState<Watcher>({
    coinInfo: {
      cmcId: 0, // TODO DEV ONLY
      url: "https://coinmarketcap.com/currencies/bitcoin/",
      symbol: "BTC",
      iconBase64: ""
    },
    entryPrice: 46916.97620031335
  });
  const [cmcUrlState, setCmcUrlState] = useState(
    {
      hidden: false, // TODO DEV ONLY
      loading: false,
      errorMessage: ""
    });
  const [feAlertType, setFEAlertType] = useState(FEAlertType.TargetPrice);
  const [addButtonEnabled, setAddButtonEnabled] = useState(false);
  const [addButtonLoading, setAddButtonLoading] = useState(false);
  const [addWatcherErrorMsg, setAddWatcherErrorMsg] = useState("");

  // Logging
  useEffect(() => {
    console.log('[useEffect] Watcher: ', watcher);
  }, [watcher])

  // Init watcher alert type
  useEffect(() => {
    switch (feAlertType) {
      case FEAlertType.TargetPrice:
        if (watcher.type !== AlertType.TargetPriceBelow && watcher.type !== AlertType.TargetPriceAbove) {
          setWatcher({ ...watcher, type: AlertType.TargetPriceAbove });
        }
        break;
      case FEAlertType.TargetPercentage:
        if (watcher.type !== AlertType.TargetNegativePercentage && watcher.type !== AlertType.TargetPositivePercentage) {
          setWatcher({ ...watcher, type: AlertType.TargetPositivePercentage });
        }
        break;
      default:
        console.error("Unhandled type: " + feAlertType);
        break;
    }
  }, [watcher, feAlertType])

  // Form validation
  useEffect(() => {
    // Add button state
    let canAdd = false;

    // Clamp
    if (watcher.type! === AlertType.TargetPriceAbove && watcher.targetPrice! >= watcher.entryPrice!)
      canAdd = true;

    // Clamp
    if (watcher.type! === AlertType.TargetPriceBelow && watcher.targetPrice! > 0 && watcher.targetPrice! <= watcher.entryPrice!)
      canAdd = true;

    // Clamp
    if ((watcher.type! === AlertType.TargetNegativePercentage || watcher.type! === AlertType.TargetPositivePercentage) && watcher.targetPercentage! >= 1)
      canAdd = true;

    setAddButtonEnabled(canAdd);
  }, [watcher])

  function setWatcherAlertType(checkboxChecked: boolean) {
    switch (feAlertType) {
      case FEAlertType.TargetPrice:
        setWatcher({ ...watcher, type: checkboxChecked ? AlertType.TargetPriceAbove : AlertType.TargetPriceBelow });
        break;
      case FEAlertType.TargetPercentage:
        setWatcher({ ...watcher, type: checkboxChecked ? AlertType.TargetPositivePercentage : AlertType.TargetNegativePercentage });
        break;
      default:
        console.error("Unhandled type: " + feAlertType);
        break;
    }
  }
  /*
    const handleForm = (e: React.FormEvent<HTMLInputElement>): void => {
      setWatcher({
        ...watcher,
        [e.currentTarget.id]: e.currentTarget.value,
      } as Watcher);
    };
  */

  const onCMCUrlChange = (url: string) => {
    if (url.match("^https://coinmarketcap.com/currencies/[a-zA-Z-]*/?$")) {
      // Valid url
      setCmcUrlState({ ...cmcUrlState, loading: true });
      getCoinInfo(authToken, url)
        .then((res: AxiosResponse) => {
          setCmcUrlState({ ...cmcUrlState, hidden: true });
          //console.log(res.data.watcher.entryPrice);
          setWatcher({ ...watcher, coinInfo: res.data.watcher.coinInfo, entryPrice: res.data.watcher.entryPrice });
        })
        .catch((error: AxiosError) => {
          const errorMsg = error.response?.data.message ?? error.message;
          setCmcUrlState({ ...cmcUrlState, loading: false, errorMessage: errorMsg });
          console.error(error);
        });
    }
  }

  const onAddBtnClick = () => {
    setAddButtonLoading(true);
    setAddWatcherErrorMsg("");
    addWatcher(authToken, watcher)
      .then((res: AxiosResponse) => {
        setAddButtonLoading(false);
        window.location.reload(); // Reload the app
      })
      .catch((error: AxiosError) => {
        const errorMsg = error.response?.data.message ?? error.message;
        setAddWatcherErrorMsg(errorMsg);
        setAddButtonLoading(false);
        console.error(error);
      });
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
                <Alert severity="error" onClose={() => setCmcUrlState({ ...cmcUrlState, errorMessage: "" })}>{cmcUrlState.errorMessage}</Alert>
              </Box>}
            </Box>
          }
          {watcher.coinInfo.cmcId > 0 &&
            <Box>
              <Box>
                <Box sx={{ width: '40px', height: '40px', marginBottom: "16px" }}>
                  <Link href={watcher.coinInfo.url} target="_blank" rel="noreferrer">
                    <CardMedia component='img' src={`data:image/png;base64, ${watcher.coinInfo.iconBase64}`} />
                  </Link>
                </Box>
                <TextField sx={{ width: { xs: '100%', md: '50%' }, marginBottom: "16px", marginRight: "8px" }}
                  label="CoinMarketCap URL"
                  value={watcher.coinInfo.url.replace("https://coinmarketcap.com", "")}
                  disabled
                  color='success'
                />
                <TextField sx={{ width: { xs: '48%', md: '20%' }, marginBottom: "8px", marginRight: "8px" }}
                  label="CoinMarketCap ID"
                  value={watcher.coinInfo.cmcId}
                  disabled
                />
                <TextField sx={{ width: { xs: '48%', md: '20%' }, marginBottom: "8px" }}
                  label="Symbol"
                  value={watcher.coinInfo.symbol}
                  disabled
                />
                <Box sx={{ marginTop: '8px' }}>
                  <TextField sx={{ width: { xs: '100%', md: '30%' }, marginBottom: "16px", marginRight: { xs: '0', md: '8px' } }}
                    label="Current price"
                    value={watcher.entryPrice}
                    onChange={e => setWatcher({ ...watcher, entryPrice: +e.target.value })}
                    type="number"
                  />
                  <FormControl sx={{ width: { xs: '100%', md: '50%' }, marginBottom: "16px" }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                      id="type-select"
                      value={feAlertType}
                      label="Type"
                      onChange={e => setFEAlertType(+e.target.value)}
                    >
                      <MenuItem value={FEAlertType.TargetPrice}>Target price</MenuItem>
                      <MenuItem value={FEAlertType.TargetPercentage}>Target percentage</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <Box>
                {feAlertType === FEAlertType.TargetPrice &&
                  <Box>
                    <Box sx={{ display: { xs: 'block', md: 'flex' }, marginBottom: "8px" }}>
                      <Box sx={{ width: { xs: '100%', md: '30%' }, marginRight: '8px' }}>
                        <TextField fullWidth
                          label="Target Price (USD)"
                          type="number"
                          value={watcher.targetPrice}
                          onChange={e => setWatcher({ ...watcher, targetPrice: +e.target.value })}
                        />
                      </Box>
                      <Box>
                        <FormGroup>
                          <FormControlLabel control=
                            {
                              <Checkbox
                                defaultChecked
                                onChange={e => setWatcherAlertType(e.target.checked)}
                              />
                            } label={watcher.type! === AlertType.TargetPriceBelow ? "Trigger below target" : "Trigger above target"} />
                        </FormGroup>
                      </Box>
                    </Box>
                    {addButtonEnabled === true &&
                      <Typography variant="subtitle2" sx={{ marginBottom: '8px', color: '#90caf9' }}>
                        {getTriggerDescription(watcher)}
                      </Typography>
                    }
                  </Box>
                }
                {feAlertType === FEAlertType.TargetPercentage &&
                  <Box>
                    <Box sx={{ display: { xs: 'block', md: 'flex' }, marginBottom: "8px" }}>
                      <Box sx={{ width: { xs: '100%', md: '30%' }, marginRight: '8px' }}>
                        <TextField fullWidth
                          label="Target percentage (%)"
                          type="number"
                          value={watcher.targetPercentage}
                          onChange={e => setWatcher({ ...watcher, targetPercentage: +e.target.value })}
                        />
                      </Box>
                      <Box>
                        <FormGroup>
                          <FormControlLabel control=
                            {
                              <Checkbox
                                defaultChecked
                                onChange={e => setWatcherAlertType(e.target.checked)}
                              />
                            } label={watcher.type! === AlertType.TargetNegativePercentage ? "Trigger below percentage" : "Trigger above percentage"} />
                        </FormGroup>
                      </Box>
                    </Box>
                    {addButtonEnabled === true &&
                      <Typography variant="subtitle2" sx={{ marginBottom: '8px', color: '#90caf9' }}>
                        {getTriggerDescription(watcher)}
                      </Typography>
                    }
                  </Box>
                }
                <Box sx={{ marginTop: '32px', marginBottom: '16px' }}>
                  <Typography variant="h6">Optional</Typography>
                  <Divider sx={{ marginBottom: '16px' }} />
                  <TextField sx={{ width: { xs: '100%', md: '30%' } }}
                    label={`Amount to sell (${watcher.coinInfo.symbol})`}
                    type="number"
                    onChange={e => setWatcher({ ...watcher, amountToSell: +e.target.value })}
                  />
                  <Box sx={{ marginTop: '16px' }}>
                    <TextField fullWidth
                      label="Note"
                      type="text"
                      multiline
                      maxRows={24}
                      onChange={e => setWatcher({ ...watcher, note: e.target.value })}
                    />
                  </Box>
                </Box>
                <Button variant="contained"
                  disabled={!addButtonEnabled || addButtonLoading}
                  onClick={onAddBtnClick}>
                  {addButtonLoading ? <CircularProgress size={25} /> : "Add"}
                </Button>
                {addWatcherErrorMsg && <Box sx={{ marginTop: '8px' }}>
                  <Alert severity="error" onClose={() => setAddWatcherErrorMsg("")}>{addWatcherErrorMsg}</Alert>
                </Box>}
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