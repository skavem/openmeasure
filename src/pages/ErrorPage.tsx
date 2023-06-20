import { Grid, Link, Typography } from "@mui/material";
import React from "react";
import { Link as RouterLink, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError() as Response;
  console.log(error);

  return (
    <Grid
      container
      direction={"column"}
      paddingTop={10}
      width={"100%"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Typography variant="h4">Произошла ошибка</Typography>
      <Typography>{error.status}</Typography>
      <Typography>{error.statusText}</Typography>
      <Link component={RouterLink} to={"/"}>
        <Typography variant="h5">На главную</Typography>
      </Link>
    </Grid>
  );
};

export default ErrorPage;
