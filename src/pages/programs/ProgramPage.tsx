import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
} from "react-router-dom";
import supabase from "../../supabase";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import {
  Save,
  ExpandMore,
  Add,
  Delete,
  Scale,
  VerticalAlignTop,
  VerticalAlignBottom,
} from "@mui/icons-material";
import { DBTables } from "../../types/supabase";
import { useState } from "react";

export const updateProgramAction = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  const id =
    typeof params.programId === "undefined" ? undefined : +params.programId;
  const form = Object.fromEntries(await request.formData()) as {
    name: string;
    description: string;
  };

  const { data, error } = await supabase
    .from("MeasurementProgram")
    .upsert({ id, ...form, updatedAt: new Date().toISOString() });

  if (error) throw new Response(error.code, { statusText: error.message });
  return redirect("/programs");
};

export const deleteProgramAction = async ({ params }: ActionFunctionArgs) => {
  const programId = Number(params.programId);
  if (isNaN(programId))
    throw new Response("", { status: 404, statusText: "Wrong link" });

  const { error } = await supabase
    .from("MeasurementProgram")
    .delete()
    .eq("id", programId);

  if (error) return new Response("", { status: 400 });

  return redirect("/programs");
};

export const programLoader = async ({ params }: LoaderFunctionArgs) => {
  const programId = Number(params.programId);
  if (isNaN(programId))
    throw new Response("", { status: 404, statusText: "Wrong link" });

  const [
    { data: program, error: programError },
    { data: units, error: unitsError },
    { data: instruments, error: instrumentsError },
  ] = await Promise.all([
    supabase
      .from("MeasurementProgram")
      .select("*, MeasurementProgramStep ( * )")
      .eq("id", programId)
      .single(),
    supabase.from("MeasurementUnit").select().order("name"),
    supabase.from("Instrument").select(),
  ]);

  if (!program || programError)
    throw new Response("", {
      status: 404,
      statusText: `Program not found`,
    });

  if (!units || unitsError)
    throw new Response("", {
      status: 500,
      statusText: `Units not found`,
    });

  if (!instruments || instrumentsError)
    throw new Response("", {
      status: 500,
      statusText: `Instruments not found`,
    });

  return { program, units, instruments } as {
    program: {
      createdAt: string;
      description: string | null;
      id: number;
      name: string;
      updatedAt: string;
      MeasurementProgramStep: DBTables["MeasurementProgramStep"]["Row"][];
    };
    units: DBTables["MeasurementUnit"]["Row"][];
    instruments: DBTables["Instrument"]["Row"][];
  };
};

const ProgramPage = () => {
  const { program, units, instruments } = useLoaderData() as Awaited<
    ReturnType<typeof programLoader>
  >;

  const [newStepUnit, setNewStepUnit] = useState(units[0]);
  const [newStepInstrument, setNewStepInstrument] = useState(instruments[0]);

  return (
    <Grid container direction={"column"} rowGap={3}>
      <Form method="PUT">
        <Grid container direction={"column"} gap={1}>
          <TextField
            name="name"
            label="Название"
            variant="filled"
            defaultValue={program.name}
          />
          <TextField
            name="description"
            label="Описание"
            variant="filled"
            multiline
            minRows={3}
            defaultValue={program.description}
          />

          <Grid item alignSelf={"center"}>
            <Button endIcon={<Save />} variant="outlined" type="submit">
              Сохранить
            </Button>
          </Grid>
        </Grid>
      </Form>

      <Grid container direction={"column"}>
        {program.MeasurementProgramStep.map((step) => (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h5">{step.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction={"column"} gap={1.5}>
                <Typography>{step.description}</Typography>
                <Typography>
                  <VerticalAlignTop />: {step.usl}
                </Typography>
                <Typography>
                  <Scale />: {step.targetValue}
                </Typography>
                <Typography>
                  <VerticalAlignBottom />: {step.lsl}
                </Typography>
              </Grid>
            </AccordionDetails>
            <AccordionActions>
              <Form method="DELETE" action={`/steps/${step.id}/delete`}>
                <input
                  type="hidden"
                  name="programId"
                  defaultValue={program.id}
                />
                <IconButton color="error" type="submit">
                  <Delete />
                </IconButton>
              </Form>
            </AccordionActions>
          </Accordion>
        ))}

        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Grid
              container
              direction={"row"}
              columnGap={1}
              alignItems={"center"}
            >
              <Add />
              <Typography variant="h6">Добавить шаг</Typography>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Form method="POST" action="/steps">
              <Grid container direction={"column"} gap={1}>
                <TextField name="name" label="Название" variant="filled" />

                <TextField
                  name="description"
                  label="Описание"
                  variant="filled"
                  multiline
                  minRows={3}
                />

                <input
                  type="hidden"
                  name="order"
                  defaultValue={program.MeasurementProgramStep.length + 1}
                />
                <input
                  type="hidden"
                  name="programId"
                  defaultValue={program.id}
                />

                <Grid item alignSelf={"center"}>
                  <Grid
                    container
                    direction={"row"}
                    columnGap={1}
                    flexWrap={"nowrap"}
                  >
                    <TextField
                      label="LSL"
                      name="lsl"
                      variant="filled"
                      inputProps={{
                        type: "number",
                        step: 0.001,
                      }}
                    />

                    <TextField
                      label="Значение"
                      name="targetValue"
                      variant="filled"
                      inputProps={{
                        type: "number",
                        step: 0.001,
                      }}
                    />

                    <TextField
                      label="USL"
                      name="usl"
                      variant="filled"
                      inputProps={{
                        type: "number",
                        step: 0.001,
                      }}
                    />

                    <Grid item sm={3}>
                      <Autocomplete
                        options={units}
                        renderInput={(params) => (
                          <TextField {...params} variant="filled" />
                        )}
                        getOptionLabel={(option) => option.name}
                        onChange={(e, value) => {
                          value && setNewStepUnit(value);
                        }}
                        value={newStepUnit}
                      />
                      <input
                        type="hidden"
                        name="measurementUnitId"
                        defaultValue={newStepUnit.id}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Autocomplete
                  options={instruments}
                  renderInput={(params) => (
                    <TextField {...params} variant="filled" />
                  )}
                  getOptionLabel={(option) => option.name}
                  onChange={(e, value) => {
                    value && setNewStepInstrument(value);
                  }}
                  defaultValue={newStepInstrument}
                />
                <input
                  type="hidden"
                  name="instrumentId"
                  value={newStepInstrument.id}
                />

                <Button
                  type="submit"
                  variant="outlined"
                  endIcon={<Add />}
                  sx={{ alignSelf: "center" }}
                >
                  Добавить
                </Button>
              </Grid>
            </Form>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default ProgramPage;
