import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import supabase from "../supabase";
import { Grid, Typography } from "@mui/material";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [userSession, setUserSession] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    async function checkUser() {
      const { data: user, error } = await supabase.auth.getUser();
      if (user) {
        setUserSession(user.user);
        setLoading(false);
      } else {
        if (error) console.log(error);
        setUserSession(null);
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  if (loading) {
    return (
      <Grid
        container
        alignItems={"center"}
        justifyContent={"center"}
        width={"100%"}
      >
        <Grid item>
          <Typography variant="h3" pt={6}>
            Загрузка...
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      {userSession ? (
        children
      ) : (
        <Navigate to="/login" state={{ from: location.pathname }} />
      )}
    </>
  );
}
