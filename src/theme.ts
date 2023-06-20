import { createTheme } from "@mui/material/styles";
import { ruRU } from "@mui/x-data-grid/locales";

const theme = createTheme(
  {
    palette: {
      primary: {
        main: "#2196f3", // Blue
        dark: "#1769aa",
        light: "#4dabf5",
      },
      secondary: {
        main: "#4caf50", // Green
        dark: "#357a38",
        light: "#81c784",
      },
    },

    components: {
      MuiButton: {
        styleOverrides: {
          outlined: ({ theme }) => ({
            "&:hover": {
              backgroundColor: theme.palette.grey[200],
            },
          }),
          text: ({ theme }) => ({
            "&:hover": {
              backgroundColor: theme.palette.grey[200],
            },
          }),
          sizeSmall: {
            minWidth: 0,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            "&:hover": {
              backgroundColor: theme.palette.grey[200],
            },
          }),
          sizeSmall: {
            minWidth: 0,
          },
        },
      },
    },
  },

  ruRU
);

export default theme;
