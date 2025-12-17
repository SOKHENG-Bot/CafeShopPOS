from rest_framework import status
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework.exceptions import MethodNotAllowed, ValidationError
from rest_framework_simplejwt.exceptions import InvalidToken


class InsufficientStockException(Exception):
    # Raised when trying to reduce stock below zero or below required amount.
    def __init__(self, message="Insufficient stock available", item=None, requested=None):
        self.message = message
        self.item = item
        self.requested = requested
        super().__init__(self.message)


def custom_exception_handler(exc, context):
    # Call DRF's default exception handle first to get standard error response
    response = exception_handler(exc, context)

    # Handle InvalidToken specifically
    if isinstance(exc, InvalidToken):
        return Response(
            {"detail": "Invalid token", "code": "token_not_valid"},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    # Handle ValidationError
    if isinstance(exc, ValidationError):
        return Response({"detail": exc.detail, "code": "validation_error"}, status=status.HTTP_400_BAD_REQUEST)

    # Handle MethodNotAllowed specifically
    if isinstance(exc, MethodNotAllowed):
        return Response(
            {"detail": "Method not allowed"},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    # If DRF dont handle it, check if it's one of our custom exception
    if response is None:
        if isinstance(exc, InsufficientStockException):
            return Response(
                {
                    "error": "Insuffcient Stock",
                    "message": str(exc),
                    "details": {
                        "item": exc.item,
                        "requested": exc.requested,
                    }
                    if exc.item
                    else None,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
