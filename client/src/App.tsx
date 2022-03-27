import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import WatchersList from './components/Sections/WatchersList';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EventIcon from '@mui/icons-material/Event';
import AddWatcher from './components/Watchers/AddWatcher';
import { ThemeProvider } from "@mui/material/styles";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from "./theme";
import { Chip, CircularProgress } from '@mui/material';
import { getServerUrl } from './utils';
import { useEffect, useState } from 'react';
import { getWatchers } from './api/API';
import { AxiosResponse, AxiosError } from 'axios';

const drawerWidth = 240;
const SERVER_STATUS_REFRESH_SECONDS = 60;

enum ServerStatus {
  Idle,
  Connecting,
  Connected,
  Failure
}

export default function App() {

  const [menuIndex, setMenuIndex] = useState(0); // 0 for main, -1 for addWatcher
  const [mobileOpen, setMobileOpen] = useState(false);
  const [serverStatus, setServerConnectionStatus] = useState(ServerStatus.Idle); // 0 for connecting, 1 for ok, -1 for error

  useEffect(() => {
    const interval = setInterval(() => {
      attemptServerConnection();
    }, 1000 * SERVER_STATUS_REFRESH_SECONDS);
    attemptServerConnection();

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  const attemptServerConnection = () => {
    console.log("Attempting to connect to server...")
    if (serverStatus === ServerStatus.Connecting) {
      console.log("Already connecting, return...")
      return;
    }

    setServerConnectionStatus(ServerStatus.Connecting);
    getWatchers()
      .then((res: AxiosResponse) => {
        console.log("Connection successful")
        setServerConnectionStatus(ServerStatus.Connected);
      })
      .catch((error: AxiosError) => {
        setServerConnectionStatus(ServerStatus.Failure);
        console.log("Connection failure")
      });
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getCurrentMenuIndex = (list: number, index: number) => {
    return ++index * -list;
  };

  const getServerConnectionStatusColor = () => {
    if (serverStatus === ServerStatus.Idle || serverStatus === ServerStatus.Connecting)
      return "primary";
    if (serverStatus === ServerStatus.Connected)
      return "success";
    if (serverStatus === ServerStatus.Failure)
      return "error";
  }

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {['All alerts'/*, 'Opt2', 'Opt3'*/].map((text, index) => {
          const curMenuIndex = getCurrentMenuIndex(0, index);
          return (
            <ListItem button
              key={text}
              selected={menuIndex === curMenuIndex}
              onClick={() => setMenuIndex(curMenuIndex)}>
              <ListItemIcon>
                {index === 0 && <EventIcon sx={{ color: 'white' }} />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <List>
        {['Create'/*, 'Opt2', 'Opt3'*/].map((text, index) => {
          const curMenuIndex = getCurrentMenuIndex(1, index);
          return (
            <ListItem button
              key={text}
              selected={menuIndex === curMenuIndex}
              onClick={() => setMenuIndex(curMenuIndex)}>
              <ListItemIcon>
                {index === 0 && <AddIcon sx={{ color: 'white' }} />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <List>
        <ListItem>
          <ListItemIcon>
            {serverStatus === ServerStatus.Connecting && <CircularProgress sx={{ marginLeft: '5px' }} size={20} color="primary" />}
            {serverStatus === ServerStatus.Connected && <CheckIcon sx={{ color: 'white' }} />}
            {serverStatus === ServerStatus.Failure && <ErrorOutlineIcon sx={{ color: 'white' }} />}
          </ListItemIcon>
          <ListItemText>
          <Chip
            label={getServerUrl()}
            color={getServerConnectionStatusColor()}
          //onClick={handleClick}
          //deleteIcon={<DoneIcon />}
          />
          </ListItemText>
        </ListItem>
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme.currentTheme}>
      <CssBaseline />
      <ToastContainer closeOnClick={false} autoClose={8000} />
      <Box sx={{ display: 'flex' }} className='App'>
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: {
              sm: `${drawerWidth}px`,
              backgroundColor: theme.colors.fourth
            },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon sx={{ color: 'white' }} />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Crypto alerter
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Toolbar />
          {menuIndex === 0 && <WatchersList />}
          {menuIndex === -1 && <AddWatcher />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}