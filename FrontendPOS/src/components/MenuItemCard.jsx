import { Add } from '@mui/icons-material';
import { Card, Box, IconButton, Typography } from '@mui/material';
import { useCartContext } from '../hooks/useCard';
import { toast } from 'sonner';

const MenuItemCard = ({ item }) => {
  const { addToCart } = useCartContext();

  const handleAddToCart = () => {
    if (item.stock <= 0) return;
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  const imageUrl = item.image || null;
  const handleImageError = (event) => { event.currentTarget.style.display = "none" };

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: '2rem',
        height: '100%',
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'column',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 6,
        },
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          flex: '0 0 10rem',
          bgcolor: 'grey.200',
          position: 'relative',
        }}
      >
        {imageUrl ? (
          <Box
            component="img"
            src={imageUrl}
            alt={item.name}
            onError={handleImageError}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              aspectRatio: '16/10',
              filter: item.stock === 0 ? 'grayscale(100%)' : 'none',
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              bgcolor: 'grey.200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography color="textSecondary">No Image</Typography>
          </Box>
        )}
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          flex: 1,
          px: 3,
          py: 2,
          justifyContent: 'space-between',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            noWrap
            letterSpacing="0.5"
            sx={{ m: 0 }}
          >
            {item.name}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            mt: 'auto',
          }}
        >
          <Box sx={{ flex: 4, display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant="body1"
              color="textSecondary"
              letterSpacing="0.5"
              noWrap
              sx={{
                mb: 0.75,
              }}
            >
              {item.stock} Available
            </Typography>

            <Box display="flex" alignItems="baseline">
              <Typography
                variant="h5"
                component="span"
                fontWeight="bold"
                color="textPrimary"
                letterSpacing="0.5"
              >
                ${item.price}
              </Typography>
              <Typography
                variant="body1"
                component="span"
                letterSpacing="0.5"
                color="textSecondary"
                sx={{ ml: 0.5 }}
              >
                / Portion
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <IconButton
              disabled={item.stock === 0}
              size="large"
              onClick={handleAddToCart}
              sx={{
                bgcolor: item.stock === 0 ? 'primary.main' : '#ff6374',
                width: 45,
                height: 45,
                borderRadius: '0.85rem',
                '&:hover': {
                  bgcolor: item.stock === 0 ? '#ff6374' : '#e55a6b',
                },
                boxShadow: 3,
              }}
            >
              <Add
                sx={{
                  fontWeight: 'bold',
                  color: item.stock === 0 ? 'textPrimary' : '#ffffff',
                }}
              />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default MenuItemCard;
