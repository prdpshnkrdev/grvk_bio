import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import DashboardLayout from "../../layouts/DashboardLayout";

interface DashboardData {
  totalProducts: number;
  lowStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  recentOrders: {
    _id: string;
    productId: { name: string };
    quantity: number;
    totalPrice: number;
    status: string;
    createdAt: string;
  }[];
}

const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/dashboard");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <DashboardLayout>
      <Container>
        <Typography variant="h4" gutterBottom>
          Dashboard Overview
        </Typography>

        <Grid container spacing={3}>
          {/* Total Products */}
          <Grid component="div">
            <Paper elevation={3} style={{ padding: 16 }}>
              <Typography variant="h6">Total Products</Typography>
              <Typography variant="h4">{data.totalProducts}</Typography>
            </Paper>
          </Grid>

          {/* Low Stock Products */}
          <Grid component="div">
            <Paper elevation={3} style={{ padding: 16 }}>
              <Typography variant="h6">Low Stock Products</Typography>
              <Typography variant="h4">{data.lowStockProducts}</Typography>
            </Paper>
          </Grid>

          {/* Total Orders */}
          <Grid component="div">
            <Paper elevation={3} style={{ padding: 16 }}>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4">{data.totalOrders}</Typography>
            </Paper>
          </Grid>

          {/* Pending Orders */}
          <Grid component="div">
            <Paper elevation={3} style={{ padding: 16 }}>
              <Typography variant="h6">Pending Orders</Typography>
              <Typography variant="h4">{data.pendingOrders}</Typography>
            </Paper>
          </Grid>

          {/* Recent Orders */}
          <Grid component="div">
            <Paper elevation={3} style={{ padding: 16 }}>
              <Typography variant="h6">Recent Orders</Typography>
              <List>
                {data.recentOrders.map((order) => (
                  <ListItem key={order._id}>
                    <ListItemText
                      primary={`Product: ${
                        order.productId?.name || "Unknown"
                      }, Quantity: ${order.quantity}, Total: $${
                        order.totalPrice
                      }`}
                      secondary={`Status: ${
                        order.status
                      } | Created At: ${new Date(
                        order.createdAt
                      ).toLocaleString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default DashboardPage;
