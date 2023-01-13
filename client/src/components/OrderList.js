import { forwardRef, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutlined, Edit } from "@mui/icons-material";
import { deleteOrder, getOrders } from "../redux/apiCalls";
import QuickSearchToolbar from "../utils/QuickSearchToolbar";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function OrderList() {
  const [orders, setOrders] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState(false);

  useEffect(() => {
    getOrders().then((res) => setOrders(res));
  }, []);

  const handleDelete = (id) => {
    setDeleteOrderId(false);
    deleteOrder(id).then(() => getOrders().then((res) => setOrders(res)));
  };

  const handleCloseDialog = () => {
    setDeleteOrderId(false);
  };

  const columns = [
    {
      field: "createdAt",
      headerClassName: "super-app-theme--header",
      headerName: "Created At",
      width: 200,
      editable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Typography>
            {new Date(params.row.createdAt).toLocaleString()}
          </Typography>
        );
      },
    },
    {
      field: "_id",
      headerClassName: "super-app-theme--header",
      headerName: "Order ID",
      width: 250,
      editable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "user.username",
      headerName: "User",
      headerClassName: "super-app-theme--header",
      width: 200,
      editable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Stack direction="row" alignItems="center" sx={{ gap: 2 }}>
            <Avatar src={params.row.user.img} alt="" />
            <Typography>{params.row.user.username}</Typography>
          </Stack>
        );
      },
    },
    {
      field: "orderStatus",
      headerClassName: "super-app-theme--header",
      headerName: "Status",
      width: 100,
      editable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "paymentMethod",
      headerClassName: "super-app-theme--header",
      headerName: "Payment",
      width: 150,
      editable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalAmount",
      headerClassName: "super-app-theme--header",
      headerName: "Amount",
      width: 150,
      editable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "action",
      headerClassName: "super-app-theme--header",
      headerName: "Action",
      width: 150,
      editable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Stack direction="row" alignItems="center" sx={{ gap: 2 }}>
            <Link
              href={"/order/" + params.row._id}
              underline="none"
              color="inherit"
            >
              <IconButton aria-label="edit">
                <Edit />
              </IconButton>
            </Link>
            <IconButton
              disabled={params.row.isAdmin === true}
              aria-label="delete"
              onClick={() => setDeleteOrderId(params.row._id)}
            >
              <DeleteOutlined />
            </IconButton>
          </Stack>
        );
      },
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }} disableGutters>
      {orders.length === 0 ? (
        <Typography variant="h6">No order has been placed yet.</Typography>
      ) : (
        <Box
          sx={{
            height: 500,
            width: "100%",
            "& .super-app-theme--header": {
              backgroundColor: "#2263a5",
              borderLeftWidth: 1,
              borderColor: "#f1f8ff",
              color: "white",
            },
          }}
        >
          <DataGrid
            headerHeight={30}
            loading={!orders.length}
            rows={orders}
            getRowId={(row) => row._id}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            density="comfortable"
            initialState={{
              sorting: {
                sortModel: [{ field: "createdAt", sort: "desc" }],
              },
            }}
            components={{ Toolbar: QuickSearchToolbar }}
          />
        </Box>
      )}
      <Dialog
        open={Boolean(deleteOrderId)}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            If you proceed now order with ID {deleteOrderId} will be erased.
            This action is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={() => handleDelete(deleteOrderId)}>Proceed</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
