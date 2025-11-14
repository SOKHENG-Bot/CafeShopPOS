import { Add, Edit, Delete } from "@mui/icons-material"
import { TableContainer, Tabs, Tab, TableCell, Chip, Dialog, DialogTitle, TableBody, TableRow, TableHead, Typography, Box, Button, Paper, Table, IconButton } from "@mui/material";
import { useMenuContext } from "../hooks/useMenu.jsx"
import { useState } from "react"

const Menu = () => {
  const { menuItems, categories, deleteMenuItem, } = useMenuContext();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleCategoryDialog = () => { /* Implement category dialog */ };
  const handleCategoryChange = (_, eventValue) => { setSelectedCategory(eventValue) };

  const filteredItems = selectedCategory === "all" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)
  const getCategoryName = (category) => {
    return categories.find((cate) => cate.id === category)?.name || "Unknown";
  }
  const itemThreshold = 5;


  { /* Dialog Functions */ }
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const handleOpenAddItemDialog = (item) => {
    setEditingMenuItem(item);
    setFormData({
      name: "",
      description: "",
      price: 0,
      srock: 0,
      category: categories[0]?.id || "",
    })
    setDialogOpen(true);
  }

  const handleOpenMenuItemsDialog = (item) => {
    if (item) {
      setEditingMenuItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        stock: item.stock,
        category: item.category,
      })
    }
    setDialogOpen(true);
  }

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  return (
    <Box sx={{ p: 3 }}>

      {/* Top Bar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Menu Management
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleCategoryDialog()}
          >
            Manage Categories
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenAddItemDialog()}
          >
            Add Item
          </Button>
        </Box>
      </Box>

      {/* Categories List */}
      <Paper elevation={5} sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              minHeight: "58px"
            },
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: 1
            }
          }}
        >
          <Tab label={`All Items (${menuItems.length})`} value="all" />
          {categories.map((category) => {
            const count = menuItems.filter((item) => item.category === category.id).length;
            return (
              <Tab key={category.id} label={`${category.name} (${count})`} value={category.id} />
            )
          }
          )}
        </Tabs>
      </Paper>

      {/* Items List */}
      <TableContainer component={Paper}>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Stock</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Typography fontWeight={500}>{item.name}</Typography>
                  <Typography varaint="body2" color="text.secondary">{item.description}</Typography>
                </TableCell>
                <TableCell>{getCategoryName(item.category)}</TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>
                  <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}>
                    {item.stock}
                    {item.stock <= itemThreshold && (
                      <Chip label="Low" color="warning" size="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="grey.50"
                    onClick={() => handleOpenMenuItemsDialog(item)}
                  >
                    <Edit fontSize="medium" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => deleteMenuItem(item.id)}
                  >
                    <Delete fontSize="medium" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} maxWidth="sm" fullWidth>
        <DialogTitle>{editingMenuItem ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
      </Dialog>

    </Box>
  )
}

export default Menu;
