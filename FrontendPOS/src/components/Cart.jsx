import { useCartContext } from "../hooks/useCard"
import { Divider, Typography, Box, Button, IconButton, TextField } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Remove as RemoveIcon, Add as AddIcon, Delete } from '@mui/icons-material';
import { useState } from "react";
import {
  AccountBalanceWallet,
  QrCode2
} from '@mui/icons-material';
import { toast } from "sonner";

const CartGrid = () => {
  const { cart, clearCart, removeFromCart, updateQuantity, cartPriceTotal, cartSubTotal } = useCartContext();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashReceived, setCashReceived] = useState("");
  const [setReceipt] = useState(false);

  const cashChange = paymentMethod === "cash" && cashReceived ? Math.max(0, parseFloat(cashReceived) - cartPriceTotal) : 0;
  const handlePayment = () => {
    if (paymentMethod === "cash" && parseFloat(cashReceived) < cartPriceTotal) {
      toast.error("Insufficient cash amount")
      return;
    };

    toast.success("Payment successful!", {
      description: `Order has been created`,
    });

    setCashReceived("");
    // Not yet implement receipt
    setReceipt(true);
  }

  {/*
    const order = createOrder(
      cart,
      cartSubTotal,
      cartPriceTotal,
    );

*/}

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Start Header with Clear Items Button Section*/}
        <Box sx={{ px: "2rem", py: "1rem" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <ShoppingCartIcon fontSize="large" sx={{ color: "#ff6374" }} />
              <Typography variant="h4" fontWeight="bold">
                Orders
              </Typography>
            </Box>
            {cart.length > 0 && (
              <Button size="medium" color="error" variant="contained" onClick={clearCart} sx={{ fontWeight: "bold" }}>
                Clear All
              </Button>)}
          </Box>
        </Box>
        {/* Ended Header with Clear Items Button Section*/}
        <Divider sx={{ borderBottomWidth: "0.2rem", borderColor: "grey.700" }} />
        {/* Start Added Items Section */}
        <Box sx={{ flex: 1, px: "2.5rem", py: "1rem", overflow: 'auto' }}>
          {cart.length === 0 ? (
            <Box sx={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", py: "2.5rem"
            }}>
              <ShoppingCartIcon sx={{ fontSize: "7.5rem", color: "text.disabled", mb: "1rem" }} />
              <Typography color="text.secondary" sx={{ fontSize: "1.5rem" }}>No items in cart</Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "center" }}>
              {cart.map((item, index) => (
                <Box
                  key={`${item.id}-${index}`}
                  variant="outlined"
                  sx={{
                    "& .MuiCardContent-root": { bgcolor: "background.paper" },
                    borderBottom: 3,
                    borderColor: "divider",
                  }}>
                  <Box sx={{ justifyContent: "center", px: "1rem", pb: 0 }} >
                    {/* RightSide Added Items Section */}
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                        {item.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "3rem" }}>
                      <Box sx={{ display: "flex", flex: 1, flexDirection: "column", gap: "1rem" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem", pb: "1rem" }}>
                          <IconButton
                            size="medium"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            sx={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "0.75rem",
                              backgroundColor: "#ffffff",
                              '&:hover': { bgcolor: "#f0f0f0" },
                              boxShadow: 2,
                            }}>
                            <RemoveIcon sx={{ color: "#ff6347", fontWeight: "bold" }} />
                          </IconButton>
                          <Typography
                            variant="subtitle2"
                            color="textSecondary"
                            sx={{
                              fontSize: "1.25rem",
                              fontWeight: "bold",
                              minWidth: "20px",
                              textAlign: "center"
                            }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="medium"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            sx={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "0.75rem",
                              backgroundColor: "#ff6374",
                              '&:hover': {
                                bgcolor: "#e55a6b",
                              },
                              boxShadow: 1,
                            }}>
                            <AddIcon sx={{ color: "#ffffff", fontWeight: "bold" }} />
                          </IconButton>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", pb: "1rem" }}>
                        <Typography
                          variant="subtitle2"
                          component="span"
                          color="textSecondary"
                          letterSpacing="0.5"
                          sx={{
                            px: "0.5rem",
                            fontSize: "1.25rem"
                          }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                        <IconButton
                          size="medium"
                          color="error"
                          onClick={() => removeFromCart(item.id)}
                          sx={{
                            p: 0,
                            m: 0,
                          }}>
                          <Delete fontSize="large" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
        {/* End Added Items Section */}

        {/* Start Calculate Items Price Section */}
        {cart.length > 0 && (
          <>
            <Divider sx={{ borderBottomWidth: "0.2rem", borderColor: "grey.500" }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.1rem", px: "2.5rem", py: "1rem" }}>
              {/* Order Summary */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" color="textSecondary">Subtotal</Typography>
                  <Typography variant="h6" color="textPrimary" sx={{ fontWeight: "bold" }}>${cartSubTotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" color="textSecondary">Discount</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: "0.75rem", borderBottomWidth: "0.2rem", borderColor: "grey.500" }} />
              {/* Total */}
              <Box sx={{ display: "flex", justifyContent: "space-between" }} >
                <Typography variant="h6" color="textPrimary" sx={{ fontWeight: "bold" }}>Total</Typography>
                <Typography variant="h6" color="#ff6374" sx={{ fontWeight: "bold" }}>${cartPriceTotal.toFixed(2)}</Typography>
              </Box>

              <Divider sx={{ my: "0.75rem", borderBottomWidth: "0.2rem", borderColor: "grey.500" }} />
              {/* Payment Methods */}
              <Box>
                <Typography variant="h6" color="textPrimary" sx={{ fontWeight: "bold", mb: "1rem" }}>Payment Method</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", mb: "1rem" }}>
                  <Button
                    onClick={() => setPaymentMethod("qrcode")}
                    sx={{
                      height: "5rem",
                      boxShadow: 3,
                      borderRadius: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      color: paymentMethod === "qrcode" ? "#ff6374" : "#9e9e9e",
                    }}>
                    <QrCode2 sx={{ fontSize: "2rem" }} />
                    <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: "medium" }}>QR CODE</Typography>
                  </Button>
                  <Button
                    onClick={() => setPaymentMethod("cash")}
                    sx={{
                      height: "5rem",
                      boxShadow: 3,
                      borderRadius: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      color: paymentMethod === "cash" ? "#ff6374" : "#9e9e9e",
                    }}>
                    <AccountBalanceWallet sx={{ fontSize: "2rem" }} />
                    <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: "medium" }}>Cash</Typography>
                  </Button>
                </Box>

                {paymentMethod === "cash" && (
                  <Box sx={{ p: 0, display: "flex", justifyContent: "space-between", gap: " 1rem" }}>
                    <TextField
                      fullWidth
                      label="Received"
                      type="number"
                      value={cashReceived}
                      placeholder="Cash Received"
                      onChange={(event) => setCashReceived(event.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: "1rem",
                          padding: '0 1rem',
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '1.15rem',
                        },
                      }} />
                    {cashReceived && cashChange >= 0 && (
                      <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: "1rem" }}>
                        Change:{" "}
                        <Typography
                          component="span"
                          fontWeight="bold"
                          color="#ff6374"
                          fontSize="1rem"
                        >
                          ${cashChange.toFixed(2)}
                        </Typography>
                      </Typography>
                    )}
                  </Box>
                )}

                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={handlePayment}
                  disabled={
                    paymentMethod === "cash" && (!cashReceived || parseFloat(cashReceived) < cartPriceTotal)
                  }
                  sx={{
                    py: "1rem",
                    borderRadius: "1rem",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    backgroundColor: "#ff6374",
                    boxShadow: 3,
                    my: "1rem",
                  }}>
                  Proceed Transaction
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box >

    </>
  )
}

export default CartGrid;
