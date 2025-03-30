import React from "react";
import { Button, Typography } from "@mui/material";
import Link from "next/link";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "10%" }}>
      <Typography variant="h4">404 - Page Not Found</Typography>
      <Link href="/dashboard">
        <Button variant="contained" sx={{ mt: 2 }}>
          Go Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
