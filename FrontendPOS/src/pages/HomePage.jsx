import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  InputAdornment,
  Paper,
  Tab,
  Tabs,
  TextField,
} from '@mui/material'
import { useState } from 'react'
import MenuItemCard from '../components/MenuItemCard'
import { useMenuContext } from '../hooks/useMenu'
import CartGrid from '../components/Cart.jsx'

const HomePage = () => {
  const { menuItems, categories } = useMenuContext();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch
  });

  const handleCategoryChange = (_, newValue) => {
    setSelectedCategory(newValue)
  };

  return (
    <Box sx={{
      boxShadow: 3,
      display: 'flex',
      height: '100%',
      overflow: 'hidden'
    }}>

      {/* Menu Section */}
      <Box sx={{
        flex: 1,
        minWidth: 0,
        height: "100%",
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'column'
      }}>

        {/* Search and List of Categorie Box */}
        <Box sx={{
          p: 3,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}>

          {/* Search Section */}
          <TextField
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                height: 56,
                borderRadius: 2,
                bgcolor: "background.paper",
                '&:hover': {
                  bgcolor: "grey.50",
                },
                "&.Mui-focused": {
                  bgcolor: "background.paper",
                },
              },
              '& .MuiOutlinedInput-input': {
                fontSize: '1.35rem',
              },
            }}
            fullWidth
            variant="outlined"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Categories Section */}
          <Paper elevation={5} sx={{ borderRadius: 2 }}>
            <Tabs sx={{
              '& .MuiTab-root': {
                minHeight: '58px',
                fontWeight: 500,
                fontSize: "1rem",
                textTransform: 'uppercase',
                "&:hover": {
                  color: "#ff6474"
                },
              },
              '& .MuiTab-root.Mui-selected': {
                color: "#ff6374",
                fontWeight: "bold",
                fontSize: "1rem",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#ff6374",
                height: "0.3rem",
              },
            }}
              value={selectedCategory}
              onChange={handleCategoryChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="menu categories"
            >
              <Tab label="All Items" value="all" />
              {categories.sort((a, b) => a.order - b.order).map((category) => (
                <Tab key={category.id} label={category.name} value={category.id} />
              ))}
            </Tabs>
          </Paper>
        </Box>

        {/* MenuItems Section */}
        <Box sx={{
          p: 3,
          flex: 1,
          flexDirection: "column",
          overflow: "auto"
        }}>
          <Box sx={{
            gap: 3,
            display: "grid",
            gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
          }}>
            {filteredItems.map((items) => (
              <MenuItemCard key={items.id} item={items} />
            ))}
          </Box>
        </Box>
      </Box >

      {/* Cart Section */}
      <Box sx={{
        width: { xs: "100%", md: "450px" },
        minWidth: { xs: "100%", md: "200px" },
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        boxShadow: 3,
      }}
      >
        <CartGrid />
      </Box>
    </Box >
  )
}

export default HomePage
