import { Button, List, ListItem, Paper } from "@mui/material";
import {
  ChecklistRtl,
  Scale,
  Straighten,
  ThermostatAuto,
} from "@mui/icons-material";
import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";

const LinkListItem = ({
  to,
  icon,
  text,
}: {
  to: string;
  icon: ReactNode;
  text: string;
}) => {
  return (
    <ListItem
      sx={{
        width: "100%",
        py: 1 / 2,
        "& .active": { border: "1px black solid" },
      }}
    >
      <Button
        component={NavLink}
        to={to}
        variant="text"
        startIcon={icon}
        sx={(theme) => ({
          width: "100%",
          color: theme.palette.getContrastText(theme.palette.background.paper),
          justifyContent: "start",
          border: `1px ${theme.palette.background.paper} solid`,
        })}
      >
        {text}
      </Button>
    </ListItem>
  );
};

const getCalcSizeExceptHeader = (headerSize: string) =>
  `calc(100vh - ${headerSize || "0px"})`;

const Sidebar = () => {
  return (
    <Paper
      elevation={2}
      sx={(theme) => ({
        maxWidth: "240px",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        height: {
          xs: getCalcSizeExceptHeader(theme.spacing(7)),
          sm: getCalcSizeExceptHeader(theme.spacing(8)),
        },
      })}
    >
      <List>
        <LinkListItem
          to={"/programs"}
          icon={<ChecklistRtl />}
          text="программы"
        />
        <LinkListItem to={"/measurments"} icon={<Scale />} text="измерения" />
        <LinkListItem
          to={"/instruments"}
          icon={<Straighten />}
          text="инструменты"
        />
        <LinkListItem
          to={"/units"}
          icon={<ThermostatAuto />}
          text={"единицы"}
        />
      </List>
    </Paper>
  );
};

export default Sidebar;
