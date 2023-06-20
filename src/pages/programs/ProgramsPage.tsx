import { Add, Delete, Edit, Start } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  ActionFunctionArgs,
  Form,
  Link,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { useModal } from "../../components/Modal/Modal";
import supabase from "../../supabase";
import { DBTables } from "../../types/supabase";

export const newProgramAction = async ({ params }: ActionFunctionArgs) => {
  let { data, error } = await supabase
    .from("MeasurementProgram")
    .insert({ name: "", updatedAt: new Date().toISOString() })
    .select()
    .single();

  if (!data || error) return new Response("", { status: 400 });

  return redirect(`/programs/${data.id}`);
};

export const programsLoader = async ({ params }: LoaderFunctionArgs) => {
  let { data: programs, error } = await supabase
    .from("MeasurementProgram")
    .select("*");

  if (error) throw new Response(error.message, { statusText: error.details });

  return { programs };
};

const useDeleteProgram = () => {
  const confirmDeleteModal = useModal();
  const [programId, setProgramId] =
    useState<DBTables["MeasurementProgram"]["Row"]["id"]>();
  const open = (programId: DBTables["MeasurementProgram"]["Row"]["id"]) => {
    setProgramId(programId);
    confirmDeleteModal.open();
  };

  return { ...confirmDeleteModal, open, programId, setProgramId };
};

const ProgramsPage = () => {
  const { programs } = useLoaderData() as Awaited<
    ReturnType<typeof programsLoader>
  >;

  const deleteModal = useDeleteProgram();

  return (
    <Grid container direction={"column"}>
      <Grid
        container
        direction={"row"}
        gap={2}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Typography variant="h4">Программы измерений</Typography>
        <Form method="POST">
          <Button variant="outlined" endIcon={<Add />} type="submit">
            Новая
          </Button>
        </Form>
      </Grid>

      <Modal
        open={deleteModal.isOpen && deleteModal.programId !== undefined}
        onClose={() => deleteModal.close()}
      >
        <Grid
          container
          direction={"column"}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Grid item>
            <Typography variant="h5">Удалить?</Typography>
          </Grid>
          <Grid item>
            <Grid
              container
              direction={"row"}
              justifyContent={"space-between"}
              marginTop={4}
            >
              <Form
                method="DELETE"
                action={`/programs/${deleteModal.programId}/delete`}
                onSubmit={() => {
                  deleteModal.close();
                }}
              >
                <Button type="submit">Да</Button>
              </Form>
              <Button onClick={() => deleteModal.close()} variant="contained">
                Отмена
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Modal>

      <Grid container width={"100%"} spacing={3} justifyContent={"left"}>
        {programs &&
          programs.map((program) => {
            return (
              <Grid item md={3} key={program.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h5">{program.name}</Typography>
                    {program.description && (
                      <Typography>
                        {program.description.slice(0, 50) +
                          (program.description.length > 49 ? "..." : "")}
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions>
                    <Link to={`/programs/${program.id}`}>
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                    </Link>

                    <IconButton
                      size="small"
                      sx={{ marginRight: "auto" }}
                      type="submit"
                      onClick={() => deleteModal.open(program.id)}
                    >
                      <Delete />
                    </IconButton>

                    <Form action="/measurments/new" method="POST">
                      <input
                        type="hidden"
                        name="programId"
                        value={program.id}
                      />
                      <Button size="small" type="submit" endIcon={<Start />}>
                        Начать
                      </Button>
                    </Form>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
      </Grid>
    </Grid>
  );
};

export default ProgramsPage;
