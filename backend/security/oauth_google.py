import httpx
from backend.config import settings
import logging

logger = logging.getLogger(__name__)

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"

def get_google_oauth_url():
    url = (
        f"{GOOGLE_AUTH_URL}?response_type=code"
        f"&client_id={settings.GOOGLE_CLIENT_ID}"
        f"&redirect_uri={settings.GOOGLE_REDIRECT_URI}"
        f"&scope=openid%20email%20profile"
        f"&access_type=offline"
    )
    logger.debug(f"Generated Google OAuth URL: {url}")
    return url

async def get_google_user_info(code: str):
    try:
        async with httpx.AsyncClient() as client:
            logger.debug(f"Requesting token with code: {code}")
            logger.debug(f"Using client_id: {settings.GOOGLE_CLIENT_ID}")
            logger.debug(f"Using redirect_uri: {settings.GOOGLE_REDIRECT_URI}")
            
            token_resp = await client.post(
                GOOGLE_TOKEN_URL,
                data={
                    "code": code,
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                    "grant_type": "authorization_code"
                }
            )
            
            if not token_resp.is_success:
                logger.error(f"Token request failed: {token_resp.text}")
                raise Exception(f"Token request failed: {token_resp.text}")
                
            token_json = token_resp.json()
            access_token = token_json.get("access_token")
            
            if not access_token:
                logger.error(f"No access token in response: {token_json}")
                raise Exception("No access token in response")

            userinfo_resp = await client.get(
                GOOGLE_USERINFO_URL,
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if not userinfo_resp.is_success:
                logger.error(f"Userinfo request failed: {userinfo_resp.text}")
                raise Exception(f"Userinfo request failed: {userinfo_resp.text}")
                
            return userinfo_resp.json()
            
    except Exception as e:
        logger.error(f"Error in get_google_user_info: {str(e)}")
        raise
