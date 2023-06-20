import { Save } from "@mui/icons-material";
import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import { DateField, DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";
import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
} from "react-router-dom";
import supabase from "../../supabase";
import { ZInstrument } from "../../types/ZodDBTypes";

export const newInstrumentAction = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  const bodyParams = Object.fromEntries(
    new URLSearchParams(await request.text()).entries()
  );

  const instrumentData = ZInstrument.safeParse(bodyParams);
  if (!instrumentData.success)
    throw new Response("", {
      status: 400,
      statusText: "Some fields are wrong",
    });

  const { data, error } = await supabase
    .from("Instrument")
    .insert(instrumentData.data)
    .select()
    .single();

  if (!data || error)
    throw new Response("", { status: 500, statusText: "Error" });

  return redirect("/instruments");
};

export const editInstrumentAction = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  const instrumentId = Number(params.instrumentId);
  if (isNaN(instrumentId))
    throw new Response("", { status: 404, statusText: "Instrument not found" });

  const bodyParams = Object.fromEntries(
    new URLSearchParams(await request.text()).entries()
  );

  const instrumentData = ZInstrument.safeParse(bodyParams);
  if (!instrumentData.success)
    throw new Response("", {
      status: 400,
      statusText: "Some fields are wrong",
    });

  const { data, error } = await supabase
    .from("Instrument")
    .update({ ...instrumentData.data, id: instrumentId })
    .eq("id", instrumentId)
    .select()
    .single();

  if (!data || error)
    throw new Response("", { status: 500, statusText: "Error" });

  return redirect("/instruments");
};

export const deleteInstrumentAction = async ({
  params,
}: ActionFunctionArgs) => {
  const instrumentId = Number(params.instrumentId);
  if (isNaN(instrumentId)) {
    throw new Response("", { status: 404, statusText: "Wrong instrument id" });
  }

  const { error } = await supabase
    .from("Instrument")
    .delete()
    .eq("id", instrumentId);

  if (error)
    throw new Response("", {
      status: 500,
      statusText: "Error handling response",
    });

  return redirect("/instruments");
};

export const editInstrumentLoader = async ({ params }: LoaderFunctionArgs) => {
  const instrumentId = Number(params.instrumentId);
  if (isNaN(instrumentId)) {
    throw new Response("", { status: 404, statusText: "Wrong instrument id" });
  }

  const { data: instrument, error: instrumentError } = await supabase
    .from("Instrument")
    .select()
    .eq("id", instrumentId)
    .single();
  if (instrumentError || !instrument)
    throw new Response("", { status: 404, statusText: "Instrument not found" });

  const { data: units, error: unitsError } = await supabase
    .from("MeasurementUnit")
    .select();
  if (unitsError || !units)
    throw new Response("", { status: 500, statusText: "Error getting units" });

  return { instrument, units };
};

export const newInstrumentLoader = async () => {
  const { data: units, error: unitsError } = await supabase
    .from("MeasurementUnit")
    .select();
  if (unitsError || !units)
    throw new Response("", { status: 500, statusText: "Error getting units" });

  return {
    instrument: {
      name: "",
      accuracy: 0,
      calibrationDate: new Date().toISOString(),
      verificationDate: new Date().toISOString(),
      verificationDueDate: new Date().toISOString(),
      location: "",
      lowerLimit: 0,
      upperLimit: 0,
      manufacturer: "",
      measurementRange: "",
      model: "",
      notes: "",
      resolution: 0,
      serialNumber: "",
      measurementUnitId: null,
    },
    units,
  };
};

const InstrumentPage = () => {
  const { instrument, units } = useLoaderData() as
    | Awaited<ReturnType<typeof editInstrumentLoader>>
    | Awaited<ReturnType<typeof newInstrumentLoader>>;
  const [unit, setUnit] = useState(
    units.find((u) => u.id === instrument.measurementUnitId)
  );

  return (
    <Form
      method="post"
      action={`/instruments/${"id" in instrument ? instrument.id : "new"}`}
    >
      <Grid container direction="column" gap={2}>
        <TextField
          label="Название"
          name="name"
          defaultValue={instrument.name}
        />
        <Grid item sx={{ width: "100%" }}>
          <Grid container direction={"row"} gap={2} sx={{ width: "100%" }}>
            <TextField
              label="Производитель"
              name="manufacturer"
              defaultValue={instrument.manufacturer}
              sx={{ flexGrow: 1 }}
            />
            <TextField
              label="Модель"
              name="model"
              defaultValue={instrument.model}
              sx={{ flexGrow: 2 }}
            />
          </Grid>
        </Grid>
        <TextField
          label="Серийный номер"
          name="serialNumber"
          defaultValue={instrument.serialNumber}
        />
        <TextField
          label="Записи"
          name="notes"
          defaultValue={instrument.notes}
        />
        <DateField
          label="Дата поверки"
          InputProps={{ name: "verificationDate" }}
          defaultValue={dayjs(instrument.verificationDate)}
        />
        <DateField
          label="Дата поверки до"
          InputProps={{ name: "verificationDueDate" }}
          defaultValue={dayjs(instrument.verificationDueDate)}
        />
        <DateField
          label="Дата калибровки"
          InputProps={{ name: "calibrationDate" }}
          defaultValue={dayjs(instrument.calibrationDate)}
        />
        <TextField
          label="Месторасположение"
          name="location"
          defaultValue={instrument.location}
        />
        <Grid item sx={{ width: "100%" }}>
          <Grid container direction={"row"} gap={2} sx={{ width: "100%" }}>
            <TextField
              label="Точность"
              name="accuracy"
              defaultValue={instrument.accuracy}
              sx={{ flexGrow: 1 }}
              inputProps={{
                type: "number",
                step: 0.001,
              }}
            />
            <TextField
              label="Нижний предел измерений"
              name="lowerLimit"
              defaultValue={instrument.lowerLimit}
              type="number"
              sx={{ flexGrow: 1 }}
              inputProps={{
                type: "number",
                step: 0.001,
              }}
            />
            <TextField
              label="Верхний предел измерений"
              name="upperLimit"
              defaultValue={instrument.upperLimit}
              type="number"
              sx={{ flexGrow: 1 }}
              inputProps={{
                type: "number",
                step: 0.001,
              }}
            />
            <TextField
              label="Цена деления"
              name="resolution"
              defaultValue={instrument.resolution}
              type="number"
              sx={{ flexGrow: 1 }}
              inputProps={{
                type: "number",
                step: 0.001,
              }}
            />
          </Grid>
        </Grid>
        <Autocomplete
          options={units}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} label="Единица измерения" />
          )}
          defaultValue={unit}
          onChange={(e, newUnit) => setUnit(newUnit || undefined)}
        />
        <input value={unit?.id} name="measurementUnitId" type="hidden" />
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

export default InstrumentPage;
