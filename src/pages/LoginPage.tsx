import React from "react";
import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import {
  ActionFunctionArgs,
  Form,
  redirect,
  useActionData,
  useLocation,
} from "react-router-dom";
import supabase from "../supabase";

const FormSize = 56;

export const loginAction = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email) return new Map().set("email", "Не введена почта");
  if (!password) return new Map().set("password", "Не введен пароль");

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error)
    return new Map().set(
      "common",
      "Пользователь не найден или введен неверный пароль"
    );

  return redirect((formData.get("to") as string) || "/");
};

const LoginPage = () => {
  const errors = useActionData() as Map<string, string> | undefined;
  const from = useLocation().state?.from || "/";

  return (
    <Grid container alignItems={"center"} justifyContent={"center"}>
      <Grid
        item
        paddingTop={(theme) => `calc(50vh - ${theme.spacing(FormSize / 2)})`}
        xs={6}
      >
        <Paper
          elevation={3}
          sx={(theme) => ({
            height: theme.spacing(FormSize),
          })}
        >
          <Form method="post">
            <Grid
              container
              direction={"column"}
              height={"100%"}
              width={"100%"}
              padding={(theme) => theme.spacing(4)}
              rowSpacing={4}
            >
              <Grid item alignSelf={"center"}>
                <Typography variant="h3">Вход</Typography>
              </Grid>
              {errors?.has("common") && (
                <Typography color={(theme) => theme.palette.error.dark}>
                  {errors.get("common")}
                </Typography>
              )}
              <Grid item>
                <TextField
                  error={errors?.has("email")}
                  id="email"
                  label="Почта"
                  name="email"
                  variant="outlined"
                  fullWidth
                  type="email"
                  autoComplete="email"
                  helperText={errors?.get("email")}
                />
              </Grid>
              <Grid item>
                <TextField
                  error={errors?.has("password")}
                  id="password"
                  label="Пароль"
                  name="password"
                  variant="outlined"
                  fullWidth
                  type="password"
                  autoComplete="current-password"
                  helperText={errors?.get("password")}
                />
              </Grid>
              <Grid item alignSelf={"center"}>
                <Button variant="contained" size="large" type="submit">
                  Войти
                </Button>
              </Grid>
              <input name="to" defaultValue={from} hidden />
            </Grid>
          </Form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
