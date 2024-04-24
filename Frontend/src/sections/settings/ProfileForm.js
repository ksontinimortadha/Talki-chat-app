import React, { useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "../../components/hook-form/FormProvider";
import { Button, Stack } from "@mui/material";
import { RHFTextField } from "../../components/hook-form";
import { useSelector } from "react-redux";

const ProfileForm = () => {
  const { user } = useSelector((state) => state.app);
  const [setError] = useState(null);

  const ProfileSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    about: Yup.string().required("About is required"),
    avatarUrl: Yup.string().required("Avatar is required").nullable(true),
  });

  const defaultValues = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    about: "",
  };

  const methods = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  const onSubmit = (data) => {
    try {
      console.log(data);
      // submit data to backend
      console.log("Data", data);
    } catch (error) {
      console.error(error);
      reset();
      setError("afterSubmit", {
        ...error,
        message: error.message,
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Stack spacing={3}>
          <RHFTextField
            helperText={"This name is visible to your contacts"}
            name="firstName"
            label="First Name"
          />
          <RHFTextField
            helperText={"This name is visible to your contacts"}
            name="lastName"
            label="Last Name"
          />
          <RHFTextField multiline rows={3} name="about" label="About" />
        </Stack>
        <Stack direction={"row"} justifyContent="end">
          <Button
            color="primary"
            size="large"
            type="submit"
            variant="outlined"
            // loading={isSubmitSuccessful || isSubmitting}
          >
            Save
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default ProfileForm;
