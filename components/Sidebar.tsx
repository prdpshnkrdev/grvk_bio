// components/Sidebar.tsx
import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import Link from "next/link";

const Sidebar = () => {
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    {
      text: "Products",
      icon: <ShoppingCartIcon />,
      path: "/dashboard/products",
    },
    { text: "Orders", icon: <ReceiptIcon />, path: "/dashboard/orders" },
    { text: "Invoices", icon: <ReceiptIcon />, path: "/dashboard/invoices" },
  ];

  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
      <List>
        {menuItems.map((item) => (
          <Link href={item.path} key={item.text} passHref>
            <ListItem component="a">
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
    </Drawer>
  );
};

export default Sidebar;
