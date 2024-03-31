import {
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  Stack,
  TextField,
} from "@mui/material";

import { useForm, FormProvider } from "react-hook-form";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import RHFTextField from "../../components/hook-form/RHFTextField";
import RHFAutocomplete from "../../components/hook-form/RHFAutocomplete";
import { useDispatch, useSelector } from "react-redux";
import { FetchFriends } from "../../redux/slices/app";

const MEMBERS = ["Name 1", "Name 2", "Name 3", "Name 4", "Name 5"];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const GroupElement = ({ img, firstName, lastName, online, _id }) => {
  const theme = useTheme();
  const name = `${firstName} ${lastName}`;

  return (
    <StyledChatBox
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems={"center"} spacing={2}>
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

const CreateGroupForm = ({ handleClose }) => {
  const dispatch = useDispatch();

  const { friends } = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(FetchFriends());
  }, [dispatch]);

  const NewGroupSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    friends: Yup.array().min(2, "Must have at least 2 members"),
  });
  const defaultValues = {
    title: "",
    friends: [],
  };
  const methods = useForm({
    resolver: yupResolver(NewGroupSchema),
    defaultValues,
  });
  const { handleSubmit } = methods;

  const onSubmit = (data) => {
    try {
      //  API Call
      console.log("DATA", data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <FormProvider {...methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="title" label="Group Title" />

        {/* Dropdown menu to select friends */}
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="friends-label">Friends List</InputLabel>
          <Select
            name="friends"
            labelId="friends-label"
            label="Friends"
            multiple
            value={methods.watch("friends") || []}
            onChange={(e) => {
              methods.setValue("friends", e.target.value);
            }}
            renderValue={(selected) => {
              return (
                <div>
                  {selected.map((value) => (
                    <Chip
                      sx={{ marginRight: "5px" }}
                      key={value}
                      label={value}
                    />
                  ))}
                </div>
              );
            }}
            error={!!methods.formState.errors.friends}
            helperText={
              methods.formState.errors.friends &&
              methods.formState.errors.friends.message
            }
          >
            {friends.map((friend, idx) => (
              <MenuItem
                key={idx}
                value={friend.firstName + " " + friend.lastName}
              >
                {friend.firstName} {friend.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent="end"
        >
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit(onSubmit)}
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

const CreateGroup = ({ open, handleClose }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{ p: 4 }}
    >
      <DialogTitle sx={{ mb: 3 }}>Create New Group</DialogTitle>

      <DialogContent sx={{ mt: 5 }}>
        {/* Create Group Form */}
        {<CreateGroupForm handleClose={handleClose} />}
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroup;
