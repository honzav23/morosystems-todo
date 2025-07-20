import { Snackbar, Alert } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { closeSnackbar } from "../store/slices/snackbarSlice.ts";


function ActionFeedback() {
    const dispatch = useAppDispatch();
    const { snackbarOpen, message, type } = useAppSelector((state) => state.snackbar);

    return (
        <Snackbar open={snackbarOpen} anchorOrigin={{horizontal: 'right', vertical: 'bottom'}} autoHideDuration={6000}
                  onClose={() => dispatch(closeSnackbar())}>
            <Alert
                onClose={() => dispatch(closeSnackbar())}
                severity={type}
                variant="filled"
                sx={{width: '100%'}}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}

export default ActionFeedback;