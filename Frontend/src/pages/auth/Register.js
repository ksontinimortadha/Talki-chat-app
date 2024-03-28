import { Link, Stack, Typography } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import RegisterForm from "../../sections/auth/RegisterForm";

const Register = () => {
  return (
    <>
      <Stack spacing={1} sx={{ mb: 2, position: "relative" ,maxHeight:'100vh' }}>
        <Typography variant="h4">Get started with Talki</Typography>
        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2"> Already have an account? </Typography>
          <Link component={RouterLink} to={"/auth/login"} variant="subtitle2">
            Sign in
          </Link>
        </Stack>
      </Stack>
      {/* Form */}
      {<RegisterForm />}

      <Typography
        component="div"
        sx={{
          color: "text.secondary",
          mt: 3,
          typography: "caption",
          textAlign: "center",
        }}
      >
        {"By signing up, I agree to "}
        <Link underline="always" color="text.primary">
          Terms of Service
        </Link>
        {" and "}
        <Link underline="always" color="text.primary">
          Privacy Policy
        </Link>
        .
      </Typography>
    </>
  );
};

export default Register;
