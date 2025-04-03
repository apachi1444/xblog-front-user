import { Backdrop, CircularProgress } from "@mui/material";

type FullPageLoaderProps = {
  open: boolean;
};

export function FullPageLoader({ open }: FullPageLoaderProps) {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}