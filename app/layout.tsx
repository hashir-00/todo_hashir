import { CssBaseline, Grid } from "@mui/material";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CssBaseline />
        <Grid container>{children}</Grid>
      </body>
    </html>
  );
}
