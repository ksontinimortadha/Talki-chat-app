import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
} from "@mui/material";
import React, { useEffect } from "react";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/search";
import { MagnifyingGlass } from "phosphor-react";
import CallElement from "../../components/CallElement";
import { MembersList } from "../../data";
import { useDispatch, useSelector } from "react-redux";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StartCall = ({ open, handleClose }) => {
  const { all_users } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(FetchAllUsers());
  }, [dispatch]);

  console.log(CallList, all_users, "Call List Info");

  const list = all_users.map((el) => ({
    id: el?._id,
    name: `${el?.firstName} ${el?.lastName}`,
    image: faker.image.avatar(),
  }));
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
      <DialogTitle sx={{ mb: 3 }}>{"Start New Conversation"}</DialogTitle>

      <DialogContent sx={{ mt: 4 }}>
        <Stack sx={{ width: "100%" }}>
          {/* <Search>
            <SearchIconWrapper>
              <MagnifyingGlass color="#709CE6" />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search> */}
        </Stack>
        {/*call lists */}
        {list.map((el) => {
          return <CallElement {...el} handleClose={handleClose} />;
        })}
      </DialogContent>
    </Dialog>
  );
};

export default StartCall;
