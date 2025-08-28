# 🔗 LinkedIn OAuth API Integration Guide for Frontend

## 📋 **Overview**

This document provides the complete API integration instructions for implementing LinkedIn OAuth connection in the frontend. The backend APIs are ready and this guide covers all the necessary endpoints and implementation details.

---

## 🌐 **API Endpoints**

### **Authentication**
All API calls require the user's JWT token in the Authorization header:
```
Authorization: Bearer {user_jwt_token}
```

---

## 🚀 **LinkedIn OAuth Flow Implementation**

### **Step 1: Get LinkedIn Authorization URL**

**Endpoint:**
```
GET /auth/linkedin/url
```

**Query Parameters:**
- `redirect_uri` (required): Your frontend callback URL
- `state` (optional): CSRF protection state, default: "linkedin_oauth"

**Example Request:**
```javascript
const redirectUri = `${window.location.origin}/auth/callback`;
const response = await fetch(
  `/api/v1/auth/linkedin/url?redirect_uri=${encodeURIComponent(redirectUri)}&state=linkedin_oauth`,
  {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
```

**Response:**
```json
{
  "auth_url": "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=...",
  "redirect_uri": "http://localhost:3000/auth/callback",
  "state": "linkedin_oauth",
  "scopes": ["r_liteprofile", "r_emailaddress", "w_member_social"]
}
```

### **Step 2: Open LinkedIn OAuth Popup**

```javascript
const handleLinkedInConnect = async () => {
  try {
    // Get authorization URL
    const redirectUri = `${window.location.origin}/auth/callback`;
    const response = await fetch(
      `/api/v1/auth/linkedin/url?redirect_uri=${encodeURIComponent(redirectUri)}`,
      {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      }
    );
    
    const { auth_url } = await response.json();
    
    // Open LinkedIn OAuth in popup
    const popup = window.open(
      auth_url,
      'linkedin-oauth',
      'width=600,height=700,scrollbars=yes,resizable=yes'
    );
    
    // Monitor popup closure
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        // Refresh connections or show success message
        console.log('LinkedIn OAuth completed');
      }
    }, 1000);
    
  } catch (error) {
    console.error('LinkedIn connection failed:', error);
  }
};
```

### **Step 3: Handle OAuth Callback**

Create a callback page at `/auth/callback` that handles the OAuth response:

```javascript
// OAuth Callback Handler
useEffect(() => {
  const handleOAuthCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      if (window.opener) {
        window.opener.postMessage({ 
          type: 'LINKEDIN_ERROR', 
          error: error 
        }, window.location.origin);
      }
      window.close();
      return;
    }

    // Process successful OAuth
    if (code && state === 'linkedin_oauth') {
      try {
        const response = await fetch('/api/v1/connect/linkedin/oauth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
          },
          body: JSON.stringify({
            authorization_code: code,
            redirect_uri: window.location.origin + '/auth/callback',
            state: state,
            profile_type: 'personal'
          })
        });

        const result = await response.json();
        
        if (response.ok) {
          // Success - notify parent window
          if (window.opener) {
            window.opener.postMessage({ 
              type: 'LINKEDIN_CONNECTED', 
              data: result 
            }, window.location.origin);
          }
          window.close();
        } else {
          throw new Error(result.detail || 'Connection failed');
        }
      } catch (error) {
        console.error('LinkedIn connection error:', error);
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'LINKEDIN_ERROR', 
            error: error.message 
          }, window.location.origin);
        }
        window.close();
      }
    }
  };

  handleOAuthCallback();
}, []);
```

### **Step 4: Connect LinkedIn Account**

**Endpoint:**
```
POST /connect/linkedin/oauth
```

**Request Body:**
```json
{
  "authorization_code": "string",
  "redirect_uri": "string", 
  "state": "string",
  "profile_type": "personal"
}
```

**Example Request:**
```javascript
const connectLinkedIn = async (authCode, redirectUri, state) => {
  const response = await fetch('/api/v1/connect/linkedin/oauth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({
      authorization_code: authCode,
      redirect_uri: redirectUri,
      state: state,
      profile_type: 'personal'
    })
  });

  return await response.json();
};
```

**Success Response:**
```json
{
  "message": "Successfully connected to LinkedIn",
  "store_id": 123,
  "profile_name": "John Doe",
  "user_id": "linkedin_user_id",
  "profile_type": "personal"
}
```

**Error Response:**
```json
{
  "detail": "Error message describing what went wrong"
}
```

---

## 📱 **Additional API Endpoints**

### **Get Social Media Connections**

**Endpoint:**
```
GET /connections/social-media
```

**Response:**
```json
{
  "social_media_connections": [
    {
      "id": 123,
      "name": "LinkedIn - John Doe",
      "platform": "linkedin",
      "avatar": "https://cdn-icons-png.flaticon.com/512/145/145807.png",
      "created_at": "2024-01-27T12:00:00",
      "category": "social_media",
      "connection_status": "connected",
      "profile_type": "personal",
      "user_id": "linkedin_user_id",
      "token_expires_at": "2024-02-27T12:00:00"
    }
  ],
  "count": 1
}
```

### **Get Connections by Type**

**Endpoint:**
```
GET /connections/by-type
```

**Response:**
```json
{
  "connections": {
    "website": {
      "connections": [
        {
          "id": 456,
          "name": "My WordPress Site",
          "platform": "wordpress",
          "category": "website",
          "store_url": "https://mysite.com"
        }
      ],
      "count": 1
    },
    "social_media": {
      "connections": [
        {
          "id": 123,
          "name": "LinkedIn - John Doe", 
          "platform": "linkedin",
          "category": "social_media",
          "connection_status": "connected"
        }
      ],
      "count": 1
    }
  },
  "total_count": 2
}
```

### **Disconnect LinkedIn Account**

**Endpoint:**
```
DELETE /disconnect/social-media/{store_id}
```

**Example Request:**
```javascript
const disconnectLinkedIn = async (storeId) => {
  const response = await fetch(`/api/v1/disconnect/social-media/${storeId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  });

  return await response.json();
};
```

**Response:**
```json
{
  "message": "Successfully disconnected LinkedIn account"
}
```

---

## 🔧 **Complete Implementation Example**

```javascript
// LinkedIn Connect Button Component
const LinkedInConnectButton = ({ userToken, onConnectionUpdate }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Step 1: Get OAuth URL
      const redirectUri = `${window.location.origin}/auth/callback`;
      const response = await fetch(
        `/api/v1/auth/linkedin/url?redirect_uri=${encodeURIComponent(redirectUri)}`,
        {
          headers: {
            'Authorization': `Bearer ${userToken}`
          }
        }
      );
      
      const { auth_url } = await response.json();
      
      // Step 2: Open OAuth popup
      const popup = window.open(
        auth_url,
        'linkedin-oauth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );
      
      // Step 3: Listen for completion
      const messageHandler = (event) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'LINKEDIN_CONNECTED') {
          console.log('LinkedIn connected successfully:', event.data.data);
          onConnectionUpdate?.();
        } else if (event.data.type === 'LINKEDIN_ERROR') {
          console.error('LinkedIn connection error:', event.data.error);
        }
        
        window.removeEventListener('message', messageHandler);
        setIsConnecting(false);
      };
      
      window.addEventListener('message', messageHandler);
      
      // Monitor popup closure
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageHandler);
          setIsConnecting(false);
        }
      }, 1000);
      
    } catch (error) {
      console.error('LinkedIn connection failed:', error);
      setIsConnecting(false);
    }
  };

  return (
    <button 
      onClick={handleConnect}
      disabled={isConnecting}
      className="linkedin-connect-btn"
    >
      {isConnecting ? 'Connecting...' : 'Connect LinkedIn Account'}
    </button>
  );
};
```

---

## ⚠️ **Error Handling**

### **Common Error Responses:**
- `400`: Bad request (invalid parameters)
- `401`: Unauthorized (invalid or missing token)
- `404`: Resource not found
- `429`: Too many requests (rate limited)
- `500`: Internal server error

### **LinkedIn-Specific Errors:**
- `"LinkedIn account already connected"`
- `"LinkedIn token expired. Please reconnect your account."`
- `"LinkedIn authentication failed"`
- `"Invalid LinkedIn authorization code"`

---

## 🔐 **Security Notes**

1. **Always use HTTPS** in production for OAuth redirects
2. **Validate the state parameter** to prevent CSRF attacks
3. **Store user tokens securely** (httpOnly cookies recommended)
4. **Handle popup blockers** gracefully
5. **Implement proper error boundaries** for OAuth failures

---

## 📋 **Testing Checklist**

- [ ] OAuth URL generation works
- [ ] Popup opens LinkedIn authorization page
- [ ] Callback page handles success/error cases
- [ ] Connection appears in connections list
- [ ] Disconnect functionality works
- [ ] Error scenarios are handled gracefully
- [ ] CSRF protection (state parameter) works

---

**🎯 This completes the LinkedIn OAuth integration. The backend APIs are ready and tested. Implement the frontend components using these examples and your LinkedIn connection feature will be fully functional!**
