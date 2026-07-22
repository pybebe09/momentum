from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        custom_response_data = {
            "status": "error",
            "statusCode": response.status_code,
            "error": response.data.get("detail", "An operational error occurred."),
            "details": response.data if not isinstance(response.data.get("detail"), str) else None,
        }
        response.data = custom_response_data

    return response
