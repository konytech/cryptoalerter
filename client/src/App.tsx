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
import Main from './components/Sections/Main';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import AddWatcher from './components/Watchers/AddWatcher';
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

const drawerWidth = 240;

export default function App() {
  const [menuIndex, setMenuIndex] = React.useState(-1);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getCurrentMenuIndex = (list: number, index: number) => {
    return ++index * -list;
  };

  const handleAddWatcher = (e: React.FormEvent, formData: Watcher): void => {
    // e.preventDefault();
    // console.log(new Date());
    // addWatcher(formData)
    //   .then(res => {
    //     setWatchers(res.data.watchers);
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });
  };

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
                {index === 0 && <EventIcon sx={{ color: 'white' }}/>}
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
                {index === 0 && <AddIcon sx={{ color: 'white' }}/>}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme.currentTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }} className='App'>
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px`,
            backgroundColor: theme.colors.fourth },
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
          {menuIndex === 0 && <Main />}
          {menuIndex === -1 && <AddWatcher addWatcher={handleAddWatcher} />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}