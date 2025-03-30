import React from "react";
import Link from "next/link";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";

const Sidebar = () => {
  const menuItems = [
    { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    {
      text: "Products",
      path: "/dashboard/products",
      icon: <ShoppingCartIcon />,
    },
    { text: "Orders", path: "/dashboard/orders", icon: <ReceiptIcon /> },
    { text: "Invoices", path: "/dashboard/invoices", icon: <ReceiptIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
      }}
    >
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
    </Drawer>
  );
};

export default Sidebar;
