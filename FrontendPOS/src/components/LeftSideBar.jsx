import { Box, List, ListItem, ListItemButton, ListItemIcon, Typography } from "@mui/material";
import { Home, Menu, Package, Settings, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const LeftSideBar = () => {
  const location = useLocation();

  const navigationLink = [
    { name: "Home", href: "/", icon: Home },
    { name: "Orders", href: "/orders", icon: ShoppingBag },
    { name: "Menu", href: "/Menu", icon: Menu },
    { name: "Inventory", href: "/Inventory", icon: Package },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <Box
      sx={{
        borderRadius: 3,
        width: "5.5rem",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>

      <List sx={{ width: "100%" }}>
        {navigationLink.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                component={Link}
                to={item.href}
                selected={isActive}
                disableRipple
                sx={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "5rem",
                  color: isActive ? "#ff6374" : "grey.500",
                  borderRadius: "1rem",
                  "&.MuiButtonBase-root": {
                    p: 1.5,
                    bgcolor: "transparent",
                    "&:hover": {
                      bgcolor: "transparent",
                      color: "#ff6474"
                    }
                  }
                }}>

                <ListItemIcon sx={{ minWidth: "auto", color: "inherit" }}>
                  <Icon size={40} />
                </ListItemIcon>

                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    letterSpacing: "0.5px",
                  }}>
                  {item.name}
                </Typography>

              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box >
  );
};

export default LeftSideBar;
