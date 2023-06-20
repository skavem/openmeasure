import { Check, Close } from "@mui/icons-material";
import { Grid, MenuItem, Select, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  ActionFunctionArgs,
  redirect,
  useLoaderData,
  useSubmit,
} from "react-router-dom";
import { z } from "zod";
import supabase from "../../supabase";
import { DBTables } from "../../types/supabase";

export const measurmentLoader = async ({ params }: ActionFunctionArgs) => {
  const id = Number(params.measurementId);
  if (isNaN(id))
    throw new Response("", { status: 404, statusText: "Wrong measurementId" });

  const { data, error } = await supabase
    .from("Measurement")
    .select(
      "id, MeasurementProgram ( name ), MeasurementStep ( *, MeasurementProgramStep ( *, MeasurementUnit ( * ) ) )"
    )
    .eq("id", id)
    .single();
  console.log(error);
  if (error || !data)
    throw new Response("", { status: 404, statusText: error.message });

  return data as {
    id: number;
    MeasurementProgram: {
      name: string;
    };
    MeasurementStep: Array<
      | DBTables["MeasurementStep"]["Row"] & {
          MeasurementProgramStep: DBTables["MeasurementProgramStep"]["Row"] & {
            MeasurementUnit: DBTables["MeasurementUnit"]["Row"];
          };
        }
    >;
  };
};

const updateStep = async (
  step: DBTables["MeasurementStep"]["Row"] & {
    MeasurementProgramStep?: DBTables["MeasurementProgramStep"]["Row"] & {
      MeasurementUnit: DBTables["MeasurementUnit"]["Row"];
    };
  }
) => {
  delete step.MeasurementProgramStep;
  console.log(step);

  const { error } = await supabase
    .from("MeasurementStep")
    .update(step)
    .eq("id", step.id);

  return !error;
};

const MeasurmentPage = () => {
  const measurment = useLoaderData() as Awaited<
    ReturnType<typeof measurmentLoader>
  >;

  return (
    <Grid container direction={"column"}>
      <Typography variant="h4">
        {measurment.MeasurementProgram?.name}
      </Typography>

      <Typography variant="h5" mt={2}>
        Шаги
      </Typography>

      <Grid container direction={"row"} gap={2} mt={2} wrap="nowrap">
        <Grid item sm={8}>
          <Grid container direction={"column"}>
            <DataGrid
              columns={[
                {
                  field: "№",
                  valueGetter: (params) =>
                    params.row.MeasurementProgramStep.order,
                },
                {
                  field: "Название",
                  valueGetter: (params) =>
                    params.row.MeasurementProgramStep.name,
                  flex: 1,
                },
                {
                  field: "LSL",
                  valueGetter: (params) =>
                    `${params.row.MeasurementProgramStep.lsl} ${params.row.MeasurementProgramStep.MeasurementUnit.symbol}`,
                },
                {
                  field: "Размер",
                  valueGetter: (params) =>
                    `${params.row.MeasurementProgramStep.targetValue} ${params.row.MeasurementProgramStep.MeasurementUnit.symbol}`,
                },
                {
                  field: "USL",
                  valueGetter: (params) =>
                    `${params.row.MeasurementProgramStep.usl} ${params.row.MeasurementProgramStep.MeasurementUnit.symbol}`,
                },
                {
                  field: "realValue",
                  headerName: "Реальное значение",
                  valueGetter: (params) => params.row.realValue,
                  editable: true,
                },
                {
                  field: "status",
                  headerName: "Статус",
                  valueGetter: (params) => params.row.status,
                  renderCell: (params) => (
                    <>
                      {params.row.status === "Done" ? (
                        <Check color="success" />
                      ) : (
                        <Close color="error" />
                      )}
                    </>
                  ),
                  renderEditCell: (params) => {
                    return (
                      <Select
                        onChange={(e) => {
                          params.api.setEditCellValue({
                            field: "status",
                            id: params.row.id,
                            value: e.target.value,
                          });
                        }}
                        value={params.row.status}
                      >
                        <MenuItem value="Done">
                          <Check color="success" />
                        </MenuItem>
                        <MenuItem value="InProgress">
                          <Close color="error" />
                        </MenuItem>
                      </Select>
                    );
                  },
                  editable: true,
                },
              ]}
              rows={measurment.MeasurementStep}
              processRowUpdate={async (newRow, oldRow) =>
                (await updateStep(newRow)) ? newRow : oldRow
              }
            />
          </Grid>
        </Grid>
        <Grid item sm={4}>
          <Grid container direction={"column"}>
            Текущий шаг
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MeasurmentPage;
