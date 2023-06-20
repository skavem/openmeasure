import React from "react";
import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
} from "react-router-dom";
import supabase from "../../supabase";
import { Button, Grid, TextField } from "@mui/material";
import { Save } from "@mui/icons-material";

export const updateUnitAction = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  const id = Number(params.unitId);
  if (isNaN(id)) throw new Response("", { status: 404 });

  const form = Object.fromEntries(await request.formData()) as {
    name: string;
    symbol: string;
  };

  const { data: unit, error } = await supabase
    .from("MeasurementUnit")
    .update(form)
    .eq("id", id)
    .select()
    .single();
  if (!unit || error)
    throw new Response("", { status: 500, statusText: error?.message });

  return redirect("/units");
};

export const deleteUnitAction = async ({ params, request }: ActionFunctionArgs) => {
  const id = Number(params.unitId);
  if (isNaN(id)) throw new Response("", { status: 404 });

  const { error } = await supabase
    .from("MeasurementUnit")
    .delete()
    .eq("id", id);
  if (error)
    throw new Response("", { status: 500, statusText: error?.message });

  return redirect("/units");
}

export const unitLoader = async ({ params }: LoaderFunctionArgs) => {
  const unitId = Number(params.unitId);
  if (isNaN(unitId)) throw new Response("", { status: 404 });

  const { data: unit, error } = await supabase
    .from("MeasurementUnit")
    .select()
    .eq("id", unitId)
    .single();
  if (!unit || error) throw new Response(error.message, { status: 500 });

  return { unit };
};

const UnitPage = () => {
  const { unit } = useLoaderData() as Awaited<ReturnType<typeof unitLoader>>;

  return (
    <Form method="PATCH" action={`/units/${unit.id}`}>
      <Grid container gap={2} direction={"column"}>
        <TextField name="name" label="Имя" variant="filled" defaultValue={unit.name} />
        <TextField name="symbol" label="Символ" variant="filled" defaultValue={unit.symbol} />
        <Button
          type="submit"
          variant="outlined"
          sx={{ alignSelf: "center" }}
          endIcon={<Save />}
        >
          Сохранить
        </Button>
      </Grid>
    </Form>
  );
};

export default UnitPage;
