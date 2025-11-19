import { Add, Close, CloudUpload, Delete, Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useMenuContext } from '../hooks/useMenu.jsx';

const Menu = () => {
  const nameInputRef = useRef(null);
  const {
    menuItems,
    categories,
    deleteMenuItem,
    updateMenuItem,
    createMenuItem,
    updateCategory,
    createCategory,
    deleteCategory,
  } = useMenuContext();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryDeleteDialogOpen, setCategoryDeleteDialogOpen] =
    useState(false);
  const [menuItemDialogOpen, setMenuItemDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    image: null,
    imagePreview: null,
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    order: '',
  });
  const itemThreshold = 5;

  useEffect(() => {
    if (menuItemDialogOpen && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [menuItemDialogOpen]);

  /* Image Upload Handle */
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setMenuFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleRemoveImage = () => {
    setMenuFormData((prev) => ({
      ...prev,
      image: null,
      imagePreview: null,
    }));
  };

  // filteredItems
  const filteredItems =
    selectedCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);
  const getCategoryName = (category) => {
    return categories.find((cate) => cate.id === category)?.name || 'Unknown';
  };

  /* MenuItems Configuration */
  const handleOpenAddMenuItemDialog = () => {
    setEditingMenuItem(null);
    setMenuFormData({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      image: null,
      imagePreview: null,
      category: categories.length > 0 ? categories[0]?.id : '',
    });
    setMenuItemDialogOpen(true);
  };

  const handleOpenEditMenuItemsDialog = (item) => {
    setEditingMenuItem(item);
    setMenuFormData({
      name: item.name || '',
      description: item.description || '',
      price: parseFloat(item.price) || 0,
      stock: parseInt(item.stock) || 0,
      category: item.category || '',
      image: null,
      imagePreview: item.image || null,
    });
    setMenuItemDialogOpen(true);
  };

  const handleSaveMenuItems = async () => {
    if (
      !menuFormData.name ||
      !menuFormData.category ||
      menuFormData.price === '' ||
      menuFormData.price === null ||
      isNaN(menuFormData.price) ||
      menuFormData.stock === '' ||
      menuFormData.stock === null ||
      isNaN(menuFormData.stock)
    ) {
      toast.error('Please fill in all required fields with valid values');
      return;
    }

    const data = new FormData();
    data.append('name', menuFormData.name);
    data.append('description', menuFormData.description || '');
    data.append('price', parseFloat(menuFormData.price));
    data.append('stock', parseInt(menuFormData.stock));
    data.append('category', menuFormData.category);

    if (menuFormData.image && menuFormData.image instanceof File) {
      data.append('image', menuFormData.image);
    }

    try {
      if (editingMenuItem) {
        await updateMenuItem(editingMenuItem.id, data);
        toast.success('Menu item updated');
      } else {
        await createMenuItem(data);
        toast.success('Menu item created');
      }
      handleCloseMenuItemDialog();
    } catch (error) {
      console.error('Save error:', error);
      toast.error(
        `Failed to save item: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleCloseMenuItemDialog = () => {
    setMenuItemDialogOpen(false);
    setEditingMenuItem(null);
    // Reset form data
    setMenuFormData({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      image: null,
      imagePreview: null,
      category: '',
    });
  };

  // Safe Delete Item
  const handleDeleteMenuItemClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteMenuItem = () => {
    deleteMenuItem(itemToDelete.id);
    toast.success('Menu item deleted!');
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const cancelDeleteMenuItem = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  /* Categories Configuration */
  const handleCategoryChange = (_, eventValue) => {
    setSelectedCategory(eventValue);
  };

  const handleOpenAddCategoryDialog = () => {
    setEditingCategory(null);
    const maxOrder = Math.max(0, ...categories.map((cate) => cate.order));
    setCategoryFormData({
      name: '',
      description: '',
      order: maxOrder + 1,
    });
    setCategoryDialogOpen(true);
  };

  const handleOpenEditCategoryDialog = (category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description,
      order: category.order,
    });
    setCategoryDialogOpen(true);
  };

  const handleCloseCategoryDialog = () => {
    setCategoryDialogOpen(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = () => {
    if (!categoryFormData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, categoryFormData);
      toast.success('Category updated');
    } else {
      createCategory(categoryFormData);
      toast.success('Category created');
    }
    handleCloseCategoryDialog();
  };

  const handleDeleteCategoryClick = (cate) => {
    setCategoryToDelete(cate);
    setCategoryDeleteDialogOpen(true);
  };

  const confirmDeleteCategory = () => {
    deleteCategory(categoryToDelete.id);
    toast.success('Category deleted!');
    setCategoryDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const cancelDeleteCategory = () => {
    setCategoryDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Top Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Menu Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenAddCategoryDialog()}
          >
            Manage Categories
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenAddMenuItemDialog()}
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
            '& .MuiTab-root': {
              minHeight: '58px',
              fontWeight: 500,
              fontSize: '1rem',
              textTransform: 'uppercase',
              '&:hover': {
                color: '#ff6474',
              },
            },
            '& .MuiTab-root.Mui-selected': {
              color: '#ff6374',
              fontWeight: 'bold',
              fontSize: '1rem',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#ff6374',
              height: '0.3rem',
            },
          }}
        >
          <Tab label={`All Items(${menuItems.length})`} value="all" />
          {categories.map((category) => {
            const count = menuItems.filter(
              (item) => item.category === category.id
            ).length;
            return (
              <Tab
                key={category.id}
                label={`${category.name}(${count})`}
                value={category.id}
              />
            );
          })}
        </Tabs>
      </Paper>

      {/* Items List */}
      <TableContainer component={Paper}>
        <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  width: '30rem',
                  minWidth: '30rem',
                  maxWidth: '30rem',
                  fontSize: '1.25rem',
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  width: '25rem',
                  minWidth: '25rem',
                  maxWidth: '25rem',
                  fontSize: '1.25rem',
                }}
              >
                Category
              </TableCell>
              <TableCell
                sx={{
                  width: '25rem',
                  minWidth: '25rem',
                  maxWidth: '25rem',
                  fontSize: '1.25rem',
                }}
              >
                Price
              </TableCell>
              <TableCell
                sx={{
                  width: '20rem',
                  minWidth: '20rem',
                  maxWidth: '20rem',
                  fontSize: '1.25rem',
                }}
              >
                Stock
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                    {item.name}
                  </Typography>
                  <Typography variant="h5" color="textSecondary">
                    {item.description}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: '1.1rem' }}>
                  {getCategoryName(item.category)}
                </TableCell>
                <TableCell sx={{ fontSize: '1.1rem' }}>${item.price}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      gap: 1,
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '1.1rem',
                    }}
                  >
                    {item.stock}
                    {item.stock === 0 ? (
                      <Chip label="Out of Stock" color="error" size="medium" />
                    ) : item.stock <= itemThreshold ? (
                      <Chip label="Low" color="warning" size="medium" />
                    ) : null}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="medium"
                    color="grey"
                    onClick={() => handleOpenEditMenuItemsDialog(item)}
                  >
                    <Edit fontSize="medium" />
                  </IconButton>
                  <IconButton
                    size="medium"
                    color="error"
                    onClick={() => handleDeleteMenuItemClick(item)}
                  >
                    <Delete fontSize="medium" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for menuItems */}
      <Dialog
        open={menuItemDialogOpen}
        onClose={handleCloseMenuItemDialog}
        maxWidth="sm"
        fullWidth
        disableEnforceFocus={false}
        disableAutoFocus={false}
        disableRestoreFocus={false}
        aria-labelledby="menu-item-dialog-title"
      >
        <DialogTitle id="menu-item-dialog-title">
          {editingMenuItem ? 'Update Item' : 'Create Item'}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              p: 2,
              pb: 0,
            }}
          >
            <TextField
              label="Name"
              value={menuFormData.name}
              onChange={(event) =>
                setMenuFormData({ ...menuFormData, name: event.target.value })
              }
              required
              fullWidth
              inputRef={nameInputRef}
            />
            <TextField
              label="description"
              value={menuFormData.description}
              onChange={(event) =>
                setMenuFormData((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              multiline
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={menuFormData.category || ''}
                label="Category"
                onChange={(event) =>
                  setMenuFormData((prev) => ({
                    ...prev,
                    category: event.target.value,
                  }))
                }
              >
                {categories.map((cate) => (
                  <MenuItem key={cate.id} value={cate.id}>
                    {cate.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Price"
              type="number"
              value={menuFormData.price}
              onChange={(event) => {
                const value = event.target.value;
                const numValue = value === '' ? 0 : parseFloat(value);
                setMenuFormData((prev) => ({
                  ...prev,
                  price: isNaN(numValue) ? 0 : numValue,
                }));
              }}
              required
              fullWidth
              slotProps={{ input: { step: 0.01, min: 0 } }}
            />
            <TextField
              label="Stock Quantity"
              type="number"
              value={menuFormData.stock}
              onChange={(event) => {
                const value = event.target.value;
                const numValue = value === '' ? 0 : parseInt(value);
                setMenuFormData((prev) => ({
                  ...prev,
                  stock: isNaN(numValue) ? 0 : numValue,
                }));
              }}
              required
              fullWidth
              slotProps={{ input: { min: 0 } }}
            />
            <Box>
              <input
                hidden
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  fullWidth
                >
                  {menuFormData.imagePreview
                    ? 'Update Image'
                    : 'Upload Item Image'}
                </Button>
              </label>
            </Box>
            {menuFormData.imagePreview && (
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '100%',
                }}
              >
                <img
                  src={menuFormData.imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 200,
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1px solid #ccc',
                  }}
                />
                <IconButton
                  color="error"
                  onClick={handleRemoveImage}
                  size="medium"
                  sx={{
                    position: 'absolute',
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMenuItemDialog}>Cancel</Button>
          <Button onClick={handleSaveMenuItems} variant="contained">
            {editingMenuItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for categories */}
      <Dialog
        open={categoryDialogOpen}
        onClose={handleCloseCategoryDialog}
        maxWidth="md"
        fullWidth
        disableEnforceFocus={false}
        disableAutoFocus={false}
        disableRestoreFocus={false}
        aria-labelledby="menu-item-dialog-title"
      >
        <DialogTitle id="menu-item-dialog-title">Manage Categories</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: '8rem',
                        minWidth: '8rem',
                        maxWidth: '8rem',
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                      }}
                    >
                      Order
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                      }}
                    >
                      Items
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {categories.sort((a, b) => a.order - b.order).map((category) => {
                    const itemCount = menuItems.filter(item => item.category === category.id).length;
                    return (
                      <TableRow key={category.id} hover>
                        <TableCell sx={{ fontSize: '1.1rem' }}>
                          {category.name}
                        </TableCell>
                        <TableCell sx={{ fontSize: '1.1rem' }} align="center">
                          {category.description}
                        </TableCell>
                        <TableCell sx={{ fontSize: '1.1rem' }} align="center">
                          {category.order}
                        </TableCell>
                        <TableCell sx={{ fontSize: '1.1rem' }} align="center">
                          {itemCount}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEditCategoryDialog(category)}
                          >
                            <Edit fontSize="medium" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteCategoryClick(category)}
                            disabled={itemCount > 0}
                          >
                            <Delete fontSize="medium" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="h6">{editingCategory ? "Update Category" : "Add Category"}</Typography>
            <TextField
              required
              type="text"
              label="Name"
              value={categoryFormData.name}
              onChange={(event) =>
                setCategoryFormData({
                  ...categoryFormData,
                  name: event.target.value,
                })
              }
              sx={{ maxWidth: 600 }}
            />
            <TextField
              type="text"
              label="Description"
              multiline
              value={categoryFormData.description}
              onChange={(event) =>
                setCategoryFormData({
                  ...categoryFormData,
                  description: event.target.value,
                })
              }
              sx={{ maxWidth: 600 }}
            />
            <TextField
              type="number"
              label="Order"
              slotProps={{ min: 0 }}
              value={categoryFormData.order}
              onChange={(event) =>
                setCategoryFormData({
                  ...categoryFormData,
                  order: event.target.value,
                })
              }
              sx={{ maxWidth: 600 }}
            />
            <DialogActions>
              <Button onClick={handleCloseCategoryDialog}>Cancel</Button>
              <Button onClick={handleSaveCategory} variant="contained">
                {editingCategory ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Dialog for confirm delete item */}
      <Dialog
        autoFocus
        open={deleteDialogOpen}
        onClose={cancelDeleteMenuItem}
        disableEnforceFocus={false}
        disableAutoFocus={false}
        disableRestoreFocus={false}
        aria-labelledby="menu-item-dialog-title"
      >
        <DialogTitle id="menu-item-dialog-title">
          Do you want to delete {itemToDelete?.name}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="menu-item-dialog-description">
            This action <strong>cannot be undone</strong>. The item will be
            permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteMenuItem}>Cancel</Button>
          <Button
            onClick={confirmDeleteMenuItem}
            color="error"
            variant="contained"
          >
            Yes, Delete Forever
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for confirm delete category */}
      <Dialog
        autoFocus
        open={categoryDeleteDialogOpen}
        onClose={cancelDeleteCategory}
        disableEnforceFocus={false}
        disableAutoFocus={false}
        disableRestoreFocus={false}
        aria-labelledby="menu-item-dialog-title"
      >
        <DialogTitle id="menu-item-dialog-title">
          Do you want to delete {categoryToDelete?.name}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="menu-item-dialog-description">
            This action <strong>cannot be undone</strong>. The item will be
            permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteCategory}>Cancel</Button>
          <Button
            onClick={confirmDeleteCategory}
            color="error"
            variant="contained"
          >
            Yes, Delete Forever
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Menu;
