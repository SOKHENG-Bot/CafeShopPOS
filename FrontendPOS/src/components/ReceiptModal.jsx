import { Dialog, Box, Divider, DialogContent, DialogTitle, IconButton, Typography, DialogActions, Button } from '@mui/material'
import { Close, Print } from '@mui/icons-material'
import { useOrderContext } from '../hooks/useOrder'
import { format } from 'date-fns'

const ReceiptModal = ({ isOpen, onClose, orderId }) => {
  const { getOrderById } = useOrderContext();
  const order = getOrderById(orderId);
  const handlePrintReceipt = () => {
    window.print();
  }

  if (!order) return null;

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={isOpen}
      onClose={onClose}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography component='div' variant='h6'>Receipt</Typography>
        <IconButton onClick={onClose} size='small'>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant='h5' fontWeight="bold">Caffee Shop</Typography>
            <Typography variant='body2' color='textSecondary'>123 Coffee Shop Address</Typography>
            <Typography variant='body2' color='textSecondary'>Tel: (855) 123-123-123</Typography>
          </Box>

          <Divider />

          <Box sx={{ textAlign: "center" }}>
            <Typography variant='subtitle1' fontWeight="bold">Order {order.orderNumber}</Typography>
            <Typography variant='body2' color='textSecondary'>{format(order.createdAt, "MMM dd, yyyy hh:mm a")}</Typography>
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {order.items.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant='body2' fontWeight="500">{item.name}</Typography>
                  <Typography variant='body2' color='textSecondary'>{item.quantity} x ${parseFloat(item.price || 0).toFixed(2)}</Typography>
                </Box>
                <Typography variant='body2' fontWeight='500'>${(item.price * item.quantity).toFixed(2)}</Typography>
              </Box>
            ))}
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='body2'>Subtotal</Typography>
              <Typography variant='body2'>${order.subtotal.toFixed(2)}</Typography>
            </Box>
            <Box>
              {order.discount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2' color='success.main'>Discount</Typography>
                  <Typography variant='body2' color='success.main'>-${order.discount.toFixed(2)}</Typography>
                </Box>
              )}

              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='h6' fontWeight='bold'>Total</Typography>
                <Typography variant='h6' fontWeight='bold'>${order.total.toFixed(2)}</Typography>
              </Box>
              {order.paymentMethod && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2'>Payment Method</Typography>
                  <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>{order.paymentMethod}</Typography>
                </Box>
              )}
            </Box>

            <Divider />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='body2' color='textSecondary'>Thank you for your visit!</Typography>
              <Typography variant='body2' color='textSecondary'>Please come again</Typography>
            </Box>

          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handlePrintReceipt}
          startIcon={<Print />}
        >
          Print Receipt
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ReceiptModal;
