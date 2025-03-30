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
  Stack,
  Box,
} from "@mui/material";
import { Doughnut, Pie, Line } from "react-chartjs-2";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Chart, registerables } from "chart.js";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import AssignmentIcon from "@mui/icons-material/Assignment";

Chart.register(...registerables);
interface DashboardData {
  totalProducts: number;
  lowStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  orderCompletionRate: string;
  averageOrderValue: string;
  salesData: { _id: string; totalSales: number }[];
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

  // Polling Function
  const fetchData = async () => {
    try {
      const response = await axios.get("/api/dashboard");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    // Initial data fetch
    fetchData();

    // Poll every 10 seconds (10000 ms)
    const intervalId = setInterval(fetchData, 10000);

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (!data) {
    return <Typography>Loading...</Typography>;
  }

  // Pie Chart Data for Products
  const productChartData = {
    labels: ["Total Products", "Low Stock Products", "Total Orders"],
    datasets: [
      {
        data: [data.totalProducts, data.lowStockProducts, data.totalOrders],
        backgroundColor: ["#4CAF50", "#FFC107", "#2196F3"],
      },
    ],
  };

  // Doughnut Chart Data for Order Status
  const orderChartData = {
    labels: ["Pending Orders", "Completed Orders"],
    datasets: [
      {
        data: [data.pendingOrders, data.totalOrders - data.pendingOrders],
        backgroundColor: ["#FF5722", "#4CAF50"],
      },
    ],
  };

  // Line Chart Data for Sales Trends
  const salesChartData = {
    labels: data.recentOrders.map((order) =>
      new Date(order.createdAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Sales Amount",
        data: data.recentOrders.map((order) => order.totalPrice),
        borderColor: "#2196F3",
        fill: false,
      },
    ],
  };

  return (
    <DashboardLayout>
      <Container>
        <Typography variant="h4" gutterBottom>
          Dashboard Overview
        </Typography>
        <Stack spacing={2} mb={3}>
          <Grid container spacing={3}>
            {/* Total Products */}
            <Grid component="div">
              <Paper elevation={3} style={{ padding: 16 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <InventoryIcon color="primary" />
                  <Typography variant="h6">Total Products</Typography>
                </Box>
                <Typography variant="h4">{data.totalProducts}</Typography>
              </Paper>
            </Grid>

            {/* Low Stock Products */}
            <Grid component="div">
              <Paper elevation={3} style={{ padding: 16 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <AssignmentIcon color="error" />
                  <Typography variant="h6">Low Stock Products</Typography>
                </Box>
                <Typography variant="h4">{data.lowStockProducts}</Typography>
              </Paper>
            </Grid>

            {/* Total Orders */}
            <Grid component="div">
              <Paper elevation={3} style={{ padding: 16 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <ShoppingCartIcon color="secondary" />
                  <Typography variant="h6">Total Orders</Typography>
                </Box>
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
          </Grid>
          <Grid container spacing={3}>
            {/* Pie Chart for Products */}
            <Grid component="div">
              <Paper elevation={3} style={{ padding: 16 }}>
                <Typography variant="h6">Product Overview</Typography>
                <Pie data={productChartData} />
              </Paper>
            </Grid>

            {/* Doughnut Chart for Orders */}
            <Grid component="div">
              <Paper elevation={3} style={{ padding: 16 }}>
                <Typography variant="h6">Order Status</Typography>
                <Doughnut data={orderChartData} />
              </Paper>
            </Grid>

            {/* Line Chart for Sales Trends */}
            <Grid component="div">
              <Paper elevation={3} style={{ padding: 16 }}>
                <Typography variant="h6">
                  Sales Trends (Recent Orders)
                </Typography>
                <Line data={salesChartData} />
              </Paper>
            </Grid>
          </Grid>
          {/* Recent Orders */}
          <Grid container spacing={3}>
            {/* Total Revenue */}
            <Grid component="div">
              <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h6">Total Revenue</Typography>
                <Typography variant="h4">${data.totalRevenue}</Typography>
              </Paper>
            </Grid>

            {/* Order Completion Rate */}
            <Grid component="div">
              <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h6">Order Completion Rate</Typography>
                <Typography variant="h4">
                  {data.orderCompletionRate}%
                </Typography>
              </Paper>
            </Grid>

            {/* Average Order Value */}
            <Grid component="div">
              <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h6">Average Order Value</Typography>
                <Typography variant="h4">${data.averageOrderValue}</Typography>
              </Paper>
            </Grid>

            {/* Sales Trend Chart */}
            <Grid component="div">
              <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h6">Sales Trends</Typography>
                <Line data={salesChartData} />
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
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
        </Stack>
      </Container>
    </DashboardLayout>
  );
};

export default DashboardPage;
