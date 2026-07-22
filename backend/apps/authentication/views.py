from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
    VerifyEmailSerializer,
    SocialAuthSerializer,
)
from drf_spectacular.utils import extend_schema
import uuid

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(summary="Get Current Authenticated Operator", responses={200: UserSerializer})
    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserSerializer(request.user)
        return Response({
            **serializer.data,
            'role': 'CEO',
            'avatarUrl': profile.avatar_url or 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            'isEmailVerified': profile.is_email_verified,
            'authProvider': profile.auth_provider,
        })

    @extend_schema(summary="Update Current Authenticated Operator Profile", responses={200: UserSerializer})
    def put(self, request):
        user = request.user
        profile, _ = UserProfile.objects.get_or_create(user=user)
        
        username = request.data.get('username')
        email = request.data.get('email')
        first_name = request.data.get('firstName') or request.data.get('first_name')
        last_name = request.data.get('lastName') or request.data.get('last_name')
        avatar_url = request.data.get('avatarUrl') or request.data.get('avatar_url')
        password = request.data.get('password')
        
        if username:
            user.username = username
        if email:
            user.email = email
        if first_name is not None:
            user.first_name = first_name
        if last_name is not None:
            user.last_name = last_name
        if password:
            user.set_password(password)
        user.save()
        
        if avatar_url is not None:
            profile.avatar_url = avatar_url
            profile.save()
            
        serializer = UserSerializer(user)
        return Response({
            **serializer.data,
            'role': 'CEO',
            'avatarUrl': profile.avatar_url or 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            'isEmailVerified': profile.is_email_verified,
            'authProvider': profile.auth_provider,
        })

class RegisterView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(summary="Register New Operator Account", request=RegisterSerializer, responses={201: dict})
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        username = serializer.validated_data['username']
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=username.split('_')[0].capitalize(),
        )

        profile = UserProfile.objects.create(
            user=user,
            auth_provider='EMAIL',
            is_email_verified=False,
            avatar_url='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
        )
        verification_token = profile.generate_email_token()

        tokens = get_tokens_for_user(user)
        user_serializer = UserSerializer(user)

        return Response({
            'message': 'Operator account registered successfully. Verification token issued.',
            'verificationToken': verification_token,
            'tokens': tokens,
            'user': {
                **user_serializer.data,
                'role': 'CEO',
                'avatarUrl': profile.avatar_url,
                'isEmailVerified': False,
                'authProvider': 'EMAIL',
            }
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(summary="Login Operator Account", request=LoginSerializer, responses={200: dict})
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        identifier = serializer.validated_data['email_or_username']
        password = serializer.validated_data['password']

        # Support login via email or username (case-insensitive)
        user = None
        if '@' in identifier:
            try:
                user_obj = User.objects.get(email__iexact=identifier)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None
        else:
            try:
                user_obj = User.objects.get(username__iexact=identifier)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = authenticate(username=identifier, password=password)

        if not user:
            return Response(
                {'error': 'Invalid email/username or security clearance passphrase.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        profile, _ = UserProfile.objects.get_or_create(user=user)
        tokens = get_tokens_for_user(user)
        user_serializer = UserSerializer(user)

        return Response({
            'tokens': tokens,
            'user': {
                **user_serializer.data,
                'role': 'CEO',
                'avatarUrl': profile.avatar_url or 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
                'isEmailVerified': profile.is_email_verified,
                'authProvider': profile.auth_provider,
            }
        })

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(summary="Request Security Password Reset Token", request=ForgotPasswordSerializer, responses={200: dict})
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
            profile, _ = UserProfile.objects.get_or_create(user=user)
            reset_token = profile.generate_reset_token()
            return Response({
                'message': 'Security password reset token generated successfully.',
                'resetToken': reset_token,
                'resetUrl': f"/reset-password?token={reset_token}"
            })
        except User.DoesNotExist:
            # Return uniform response to prevent user enumeration attacks
            return Response({
                'message': 'If an operator account matches this email, a security reset token has been dispatched.',
            })

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(summary="Reset Passphrase With Security Token", request=ResetPasswordSerializer, responses={200: dict})
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        try:
            profile = UserProfile.objects.get(password_reset_token=token)
            
            # Security Check: Verify token expiration
            if profile.password_reset_expires_at and profile.password_reset_expires_at < timezone.now():
                profile.password_reset_token = None
                profile.password_reset_expires_at = None
                profile.save()
                return Response({'error': 'Password reset security token has expired. Please request a new token.'}, status=status.HTTP_400_BAD_REQUEST)

            user = profile.user
            user.set_password(new_password)
            user.save()

            profile.password_reset_token = None
            profile.password_reset_expires_at = None
            profile.save()

            return Response({'message': 'Passphrase updated successfully. Please sign in.'})
        except UserProfile.DoesNotExist:
            return Response({'error': 'Invalid or expired password reset security token.'}, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(summary="Verify Email Token", request=VerifyEmailSerializer, responses={200: dict})
    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        token = serializer.validated_data['token']
        try:
            profile = UserProfile.objects.get(email_verification_token=token)
            profile.is_email_verified = True
            profile.email_verification_token = None
            profile.save()

            return Response({'message': 'Email clearance verified successfully.', 'isVerified': True})
        except UserProfile.DoesNotExist:
            return Response({'error': 'Invalid email verification security token.'}, status=status.HTTP_400_BAD_REQUEST)

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(summary="Google OAuth Login", request=SocialAuthSerializer, responses={200: dict})
    def post(self, request):
        serializer = SocialAuthSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        token = serializer.validated_data['token']
        email = serializer.validated_data.get('email') or f"google_operator_{token[:6]}@momentum.cyber"
        name = serializer.validated_data.get('name') or "Google Operator"

        username = email.split('@')[0].replace('.', '_')
        user, created = User.objects.get_or_create(email=email, defaults={
            'username': username,
            'first_name': name.split()[0],
            'last_name': ' '.join(name.split()[1:]) if len(name.split()) > 1 else '',
        })

        if created:
            user.set_unusable_password()
            user.save()

        profile, _ = UserProfile.objects.get_or_create(user=user, defaults={
            'auth_provider': 'GOOGLE',
            'is_email_verified': True,
            'avatar_url': 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
        })

        tokens = get_tokens_for_user(user)
        user_serializer = UserSerializer(user)

        return Response({
            'tokens': tokens,
            'user': {
                **user_serializer.data,
                'role': 'CEO',
                'avatarUrl': profile.avatar_url,
                'isEmailVerified': True,
                'authProvider': 'GOOGLE',
            }
        })

class AppleLoginView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(summary="Apple OAuth Login", request=SocialAuthSerializer, responses={200: dict})
    def post(self, request):
        serializer = SocialAuthSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        token = serializer.validated_data['token']
        email = serializer.validated_data.get('email') or f"apple_operator_{token[:6]}@momentum.cyber"
        name = serializer.validated_data.get('name') or "Apple Operator"

        username = email.split('@')[0].replace('.', '_')
        user, created = User.objects.get_or_create(email=email, defaults={
            'username': username,
            'first_name': name.split()[0],
            'last_name': ' '.join(name.split()[1:]) if len(name.split()) > 1 else '',
        })

        if created:
            user.set_unusable_password()
            user.save()

        profile, _ = UserProfile.objects.get_or_create(user=user, defaults={
            'auth_provider': 'APPLE',
            'is_email_verified': True,
            'avatar_url': 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80',
        })

        tokens = get_tokens_for_user(user)
        user_serializer = UserSerializer(user)

        return Response({
            'tokens': tokens,
            'user': {
                **user_serializer.data,
                'role': 'CEO',
                'avatarUrl': profile.avatar_url,
                'isEmailVerified': True,
                'authProvider': 'APPLE',
            }
        })
