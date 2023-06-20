import React from "react";
import {
  Form,
  Link,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
} from "react-router-dom";
import supabase from "../../supabase";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";

export const unitsLoader = async ({ params }: LoaderFunctionArgs) => {
  const { data: units, error } = await supabase
    .from("MeasurementUnit")
    .select("*");

  if (!units || error) throw new Response(error.message, { status: 500 });

  return { units };
};

export const createUnitAction = async () => {
  const { data: unit, error } = await supabase
    .from("MeasurementUnit")
    .insert({
      name: "",
      symbol: "",
    })
    .select()
    .single();

  if (!unit || error) throw new Response(error.message, { status: 500 });

  return redirect(`/units/${unit.id}`);
};

const UnitsPage = () => {
  const { units } = useLoaderData() as Awaited<ReturnType<typeof unitsLoader>>;

  return (
    <Grid direction={"column"} container>
      <Grid
        container
        direction={"row"}
        gap={2}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Typography variant="h4">Единицы</Typography>
        <Form action="/units" method="POST">
          <Button variant="outlined" type="submit" endIcon={<Add />}>
            Добавить
          </Button>
        </Form>
      </Grid>
      <Grid container gap={4}>
        {units.map((unit) => (
          <Card
            sx={{
              height: "200px",
              minWidth: "200px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            key={unit.id}
          >
            <CardContent>
              <Typography variant="h5">{unit.name}</Typography>
              <Typography>{unit.symbol}</Typography>
            </CardContent>
            <CardActions>
              <Form action={`/units/${unit.id}/delete`} method="DELETE">
                <IconButton type="submit">
                  <Delete />
                </IconButton>
              </Form>

              <Link to={`/units/${unit.id}`}>
                <IconButton>
                  <Edit />
                </IconButton>
              </Link>
            </CardActions>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
};

export default UnitsPage;
