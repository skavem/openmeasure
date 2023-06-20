import React from "react";
import Header from "../components/Header";
import { Grid } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Root = () => {
  return (
    <>
      <Header />
      <Grid container direction={"row"} wrap="nowrap">
        <Grid item>
          <Sidebar />
        </Grid>
        <Grid item padding={4} flexGrow={1}>
          <Outlet />
        </Grid>
      </Grid>
    </>
  );
};

export default Root;
