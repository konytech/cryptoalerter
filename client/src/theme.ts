import { createTheme } from "@mui/material/styles";

const colors = {
    main: "#121212",
    secondary: "#1F1B24",
    third: "#332940",
    fourth: "#3700B3",
    errorLight: "#CF6679",
    error: "#B00020",
    textPrimary: "#ffffff"
};

const currentTheme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: colors.main
        },
        text: {
            primary: colors.textPrimary
        }
    },
    components: {
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: colors.secondary
                }
            }
        }
    },
    typography: {
        fontFamily: [
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    }
});

const theme = {
    colors,
    currentTheme
}
export default theme;