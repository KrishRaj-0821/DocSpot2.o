from rest_framework.renderers import JSONRenderer

class PurniaJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        if not renderer_context:
            return super().render(data, accepted_media_type, renderer_context)

        response = renderer_context.get('response')
        status_code = response.status_code if response else 200

        # Avoid formatting if already formatted
        if isinstance(data, dict) and 'success' in data and 'message' in data:
            return super().render(data, accepted_media_type, renderer_context)

        success = status_code < 400
        message = "Success"
        errors = []

        if not success:
            message = "Validation Error"
            if isinstance(data, dict):
                if 'detail' in data:
                    message = data['detail']
                errors = data
            else:
                errors = data
            data = None

        formatted_data = {
            "success": success,
            "message": message,
            "data": data
        }

        if not success:
            formatted_data["errors"] = errors

        return super().render(formatted_data, accepted_media_type, renderer_context)
