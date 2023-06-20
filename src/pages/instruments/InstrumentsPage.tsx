import { Add, Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  Form,
  Link,
  LoaderFunctionArgs,
  useLoaderData,
} from "react-router-dom";
import { useModal } from "../../components/Modal/Modal";
import supabase from "../../supabase";
import { DBTables } from "../../types/supabase";

export const instrumentsLoader = async ({ params }: LoaderFunctionArgs) => {
  const { data: instruments, error } = await supabase
    .from("Instrument")
    .select();

  console.log(instruments, error);

  if (!instruments || error)
    throw new Response("", {
      status: 500,
      statusText: "Error handling response",
    });

  return { instruments };
};

const useDeleteInstrument = () => {
  const confirmDeleteModal = useModal();
  const [instrumentId, setInstrumentId] =
    useState<DBTables["Instrument"]["Row"]["id"]>();
  const open = (instrumentId: DBTables["Instrument"]["Row"]["id"]) => {
    setInstrumentId(instrumentId);
    confirmDeleteModal.open();
  };

  return { ...confirmDeleteModal, open, instrumentId, setInstrumentId };
};

const InstrumentsPage = () => {
  const { instruments } = useLoaderData() as Awaited<
    ReturnType<typeof instrumentsLoader>
  >;

  const deleteModal = useDeleteInstrument();

  return (
    <Grid container direction={"column"} gap={4}>
      <Grid
        container
        direction={"row"}
        gap={2}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Typography variant="h4">Инструменты</Typography>
        <Form method="GET" action="/instruments/new">
          <Button endIcon={<Add />} variant="outlined" type="submit">
            Добавить
          </Button>
        </Form>
      </Grid>

      <Modal
        open={deleteModal.isOpen && deleteModal.instrumentId !== undefined}
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
                action={`/instruments/${deleteModal.instrumentId}/delete`}
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

      <Grid item>
        <Grid container gap={2}>
          {instruments.map((instrument) => (
            <Grid item sm={6} lg={3} key={instrument.id}>
              <Card sx={{ height: "200px" }}>
                <Grid
                  container
                  direction={"column"}
                  height={"100%"}
                  justifyContent={"space-between"}
                >
                  <CardContent>
                    <Typography variant="h5" fontWeight={600}>
                      {instrument.name}
                    </Typography>
                    <Grid container direction={"row"} gap={1 / 4}>
                      <Chip label={instrument.manufacturer} />
                      <Chip label={instrument.model} />
                    </Grid>
                  </CardContent>

                  <CardActions>
                    <Grid
                      container
                      direction={"row"}
                      gap={1}
                      justifyContent={"end"}
                    >
                      <Link to={`/instruments/${instrument.id}`}>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                      </Link>

                      <IconButton
                        size="small"
                        type="submit"
                        onClick={() => deleteModal.open(instrument.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </CardActions>
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default InstrumentsPage;
