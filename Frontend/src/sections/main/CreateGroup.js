import {
  Button,
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
} from "@mui/material";

import { useForm, FormProvider } from "react-hook-form";
import React from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import RHFTextField from "../../components/hook-form/RHFTextField";
import { useSelector } from "react-redux";
import { socket } from "../../socket";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateGroupForm = ({ handleClose, socket }) => {
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


  const { friends } = useSelector((state) => state.app);

  const handleCreateGroup = () => {
    // Call the onSubmit function directly
    onSubmit(methods.getValues())();
    handleClose();
  };

  const onSubmit = (data) => () => {
    // Here you can perform any additional logic you need with the form data
    console.log("Form submitted with data:", data);

    // Emit socket event to start a new group conversation with selected friends
    socket.emit("start_group_conversation", data);

    // Log data for verification
    console.log("Form Data:", data);
  };

  return (
    <FormProvider {...methods}>
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
          <Button type="button" variant="contained" onClick={handleCreateGroup}>
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
        {<CreateGroupForm handleClose={handleClose} socket={socket} />}
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroup;
