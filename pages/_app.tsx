import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../utils/theme";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
