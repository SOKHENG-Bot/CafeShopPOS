import {
  Typography,
  Button,
  Card,
  Box,
  Grid,
  CardContent,
  Chip,
} from '@mui/material';
import { useOrderContext } from '../hooks/useOrder';
import { format } from 'date-fns';

const statusColor = {
  new: 'primary',
  preparing: 'warning',
  ready: 'success',
  completed: 'default',
  cancelled: 'error',
};

const OrderPage = () => {
  const { orders, updateOrderStatus } = useOrderContext();
  const activeOrders = orders.filter(
    (order) => order.status !== 'completed' && order.status !== 'cancelled'
  );
  const completedOrders = orders.filter(
    (order) => order.status === 'completed' || order.status === 'cancelled'
  );
  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };
  const OrderCard = ({ order }) => (
    <Card sx={{ mb: '1rem', boxShadow: 2, borderRadius: '1rem' }}>
      <CardContent
        sx={{ padding: '1rem', ':last-child': { paddingBottom: '1rem' } }}
      >
        <Box
          sx={{
            mb: '1rem',
            py: '0.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: 2,
            borderColor: 'divider',
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {order.orderNumber}
            </Typography>
            <Typography variant="h6">
              {format(order.createdAt, 'hh:mm a')}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Chip
              label={order.status}
              color={statusColor[order.status]}
              size="medium"
              sx={{
                textTransfrom: 'capitalize',
                fontSize: '1rem',
                borderRadius: '1.5rem',
              }}
            />
          </Box>
        </Box>

        <Box sx={{ mb: '1rem' }}>
          {order.items.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 0.5,
                minHeight: '1.5rem',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  flex: 1,
                  minWidth: 0,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.quantity}x {item.name}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  ml: 2,
                  fontSize: '1rem',
                  fontWeight: 500,
                  minWidth: '4rem',
                  textAlign: 'right',
                }}
              >
                ${(item.price * item.quantity).toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            pt: '0.75rem',
            borderTop: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Total: ${order.total.toFixed(2)}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {order.status === 'new' && (
              <Button
                size="medium"
                variant="contained"
                onClick={() => handleStatusChange(order.id, 'preparing')}
              >
                Start preparing
              </Button>
            )}
            {order.status === 'preparing' && (
              <Button
                size="medium"
                variant="contained"
                color="success"
                onClick={() => handleStatusChange(order.id, 'ready')}
              >
                Mark ready
              </Button>
            )}
            {order.status === 'ready' && (
              <Button
                size="medium"
                variant="contained"
                color="inherit"
                onClick={() => handleStatusChange(order.id, 'completed')}
              >
                Complete order
              </Button>
            )}
            {(order.status === 'new' ||
              order.status === 'preparing' ||
              order.status === 'ready') && (
              <Button
                size="medium"
                variant="contained"
                color="error"
                onClick={() => handleStatusChange(order.id, 'cancelled')}
              >
                Cancel order
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Order Management
      </Typography>
      {/* Grid of Orders */}
      <Grid container spacing={3}>
        {/* Active Orders */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: '1rem' }}>
            Active Orders ({activeOrders.length})
          </Typography>
          <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
            {activeOrders.length === 0 ? (
              <Card sx={{ bgcolor: 'transparent' }}>
                <CardContent sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="h6" color="textSecondary">
                    No active orders
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              activeOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </Box>
        </Grid>

        {/* Completed Orders */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: '1rem' }}>
            Completed Orders ({completedOrders.length})
          </Typography>
          <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
            {completedOrders.length === 0 ? (
              <Card sx={{ bgcolor: 'transparent' }}>
                <CardContent sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="h6" color="textSecondary">
                    No completed orders
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              completedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderPage;
