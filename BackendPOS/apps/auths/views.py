from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer, UserSerializer, get_tokens_for_user


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # To skip authentication while login

    # Handles user login by validating credentials and returning user data with JWT tokens
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]  # type: ignore
        tokens = get_tokens_for_user(user)
        data = {
            "user": UserSerializer(user, context={"request": request}).data,
            "token": tokens,
        }
        return Response(data)


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    # Returns the current authenticated user's profile information
    def get(self, request):
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(serializer.data)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    # Logs out the user by blacklisting refresh token to invalidate
    def post(self, request):
        # Blacklist refresh token
        refresh_token = request.data.get("refresh")
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response(
                    {"detail": "Logged out."},
                    status=status.HTTP_205_RESET_CONTENT,
                )
            except Exception:
                return Response(
                    {"detail": "Invalid Token"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        return Response(
            {"detail": "Refresh token is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )
