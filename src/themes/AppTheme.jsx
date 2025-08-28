import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label.Mui-focused": {
            color: "#67C090",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#67C090",
            },
            "&:hover fieldset": {
              borderColor: "#67C090",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#67C090",
            },
          },
        },
      },
    },
  },
});

export default function AppTheme({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export { theme };
