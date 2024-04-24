import React, { useState } from "react";
import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import {
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  Button,
} from "@mui/material";

// components
import FormProvider, { RHFTextField } from "../../components/hook-form";
import { Eye, EyeSlash } from "phosphor-react";
import { RegisterUser } from "../../redux/slices/auth";
import { useDispatch, useSelector } from "react-redux";
const RegisterForm = () => {
  const { isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required("First name required"),
    lastName: Yup.string().required("Last name required"),
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "user@talki.com",
    password: "password",
    image: null,
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    try {
      // Submit data to backend by dispatching the RegisterUser action
      await dispatch(RegisterUser(data));
      // Redirect to the login page after successful registration
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      // If there's an error, set the error message without redirecting
      reset();
      setError("afterSubmit", {
        type: "server",
        message:
          error.response.data.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} mb={2}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <RHFTextField name="firstName" label="First name" />
          <RHFTextField name="lastName" label="Last name" />
        </Stack>
        <RHFTextField name="email" label="Email address" />
        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />{" "}
        <Button
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isLoading}
          sx={{
            bgcolor: "text.primary",
            color: (theme) =>
              theme.palette.mode === "light" ? "common.white" : "grey.800",
            "&:hover": {
              bgcolor: "text.primary",
              color: (theme) =>
                theme.palette.mode === "light" ? "common.white" : "grey.800",
            },
          }}
        >
          Create Account
        </Button>
      </Stack>
    </FormProvider>
  );
};

export default RegisterForm;
