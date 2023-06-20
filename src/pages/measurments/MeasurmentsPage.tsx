import { AccessTime, Delete, Description, Start } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import {
  ActionFunctionArgs,
  Form,
  Link,
  redirect,
  useLoaderData,
} from "react-router-dom";
import Zod from "zod";
import { OString } from "../../helpers";
import supabase from "../../supabase";
import { DBTables } from "../../types/supabase";

export const newMeasurment = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  const programId = Number(
    new URLSearchParams(await request.text()).get("programId")
  );
  if (!programId || Number.isNaN(programId)) {
    throw new Response("", { status: 400, statusText: "Invalid programId" });
  }

  const { data: measurement, error: measurementError } = await supabase
    .from("Measurement")
    .insert({ programId, startedAt: new Date().toISOString() })
    .select()
    .single();
  if (measurementError || !measurement) {
    throw new Response("", { status: 500 });
  }

  const { data: programSteps, error: programStepsError } = await supabase
    .from("MeasurementProgramStep")
    .select()
    .eq("programId", programId)
    .order("order", { ascending: true });
  if (programStepsError || !programSteps) {
    throw new Response("", { status: 500 });
  }

  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) throw new Response("", { status: 400 });

  const { data: operator, error: operatorError } = await supabase
    .from("Operator")
    .select()
    .eq("userId", userId)
    .single();
  if (operatorError || !operator) throw new Response("", { status: 500 });

  const newSteps = programSteps.map<DBTables["MeasurementStep"]["Insert"]>(
    (pstep) => ({
      instrumentId: pstep.instrumentId,
      measurmentId: measurement.id,
      operatorId: operator.id,
      measurementProgramStepId: pstep.id,
    })
  );

  const { data: mSteps, error: mStepsError } = await supabase
    .from("MeasurementStep")
    .insert(newSteps)
    .select();
  if (mStepsError || !mSteps) throw new Response("", { status: 500 });

  return redirect(`/measurments/${measurement?.id}`);
};

export const deleteMeasurementAction = async ({
  params,
}: ActionFunctionArgs) => {
  const measurementId = Zod.coerce.number().parse(params.measurementId);
  if (Number.isNaN(measurementId)) {
    throw new Response("", { status: 400 });
  }

  const { error } = await supabase
    .from("Measurement")
    .delete()
    .eq("id", measurementId);

  console.log(error);

  if (error) throw new Response("", { status: 500 });
  return redirect(`/measurments`);
};

export const measurmentsLoader = async ({ params }: ActionFunctionArgs) => {
  const { data: measurments, error } = await supabase
    .from("Measurement")
    .select("*, MeasurementProgram ( * )");
  if (error || !measurments) throw new Response("", { status: 500 });

  return { measurments } as {
    measurments: Array<
      DBTables["Measurement"]["Row"] & {
        MeasurementProgram: DBTables["MeasurementProgram"]["Row"];
      }
    >;
  };
};

const MeasurmentsPage = () => {
  const { measurments } = useLoaderData() as Awaited<
    ReturnType<typeof measurmentsLoader>
  >;

  return (
    <Grid container direction={"column"}>
      <Grid
        container
        direction={"row"}
        gap={2}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Typography variant={"h4"}>Измерения</Typography>
      </Grid>

      <Grid container direction={"row"} gap={2}>
        {measurments.map((m) => (
          <Grid item key={m.id} xs={12} md={4}>
            <Card>
              <CardContent>
                <Grid container direction={"column"} gap={2}>
                  <Typography variant="h5">
                    {m.MeasurementProgram.name}
                  </Typography>
                  <Grid
                    container
                    direction={"row"}
                    gap={1}
                    alignItems={"center"}
                  >
                    <Description />
                    <Typography>
                      {new OString(m.MeasurementProgram.description).truncateTo(
                        50
                      )}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    direction={"row"}
                    gap={1}
                    alignItems={"center"}
                  >
                    <AccessTime />
                    <Typography>
                      {dayjs(m.startedAt).format("DD.MM.YYYY HH:mm")}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Grid
                  container
                  direction={"row"}
                  gap={2}
                  justifyContent={"space-between"}
                >
                  <Form action={`/measurments/${m.id}/delete`} method="POST">
                    <IconButton type="submit">
                      <Delete />
                    </IconButton>
                  </Form>
                  <Link to={`/measurments/${m.id}`}>
                    <Button endIcon={<Start />}>Перейти</Button>
                  </Link>
                </Grid>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default MeasurmentsPage;
