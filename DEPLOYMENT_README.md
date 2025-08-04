# 🚀 XBlog Frontend Deployment Guide

## 📋 Table of Contents
- [Hostinger Shared Hosting Deployment](#hostinger-shared-hosting)
- [VPS Deployment](#vps-deployment)
- [Troubleshooting](#troubleshooting)
- [React Router Fix](#react-router-fix)

---

## 🌐 Hostinger Shared Hosting Deployment

### **Step 1: Build the Project**
```bash
# In your local project directory
npm run build
```
This creates a `dist/` folder with production files.

### **Step 2: Upload Files**
1. **Access File Manager** in Hostinger control panel
2. **Navigate** to your subdomain folder: `domains/beta.xblog.ai/public_html/`
3. **Upload** all contents from `dist/` folder (not the folder itself)
4. **Extract** if uploaded as ZIP

### **Step 3: Fix React Router (CRITICAL)**
Create `.htaccess` file in `public_html/` with this content:

```apache
# React Router Fix
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Handle Angular and React Router
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>

# Gzip Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache Control
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

### **Step 4: Verify Deployment**
- ✅ Visit `https://beta.xblog.ai`
- ✅ Navigate to different routes (e.g., `/blog`, `/generate`)
- ✅ Refresh pages to test routing
- ✅ Check browser console for errors

---

## 🖥️ VPS Deployment

### **Prerequisites**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt install nginx -y

# Install PM2 (optional)
sudo npm install -g pm2
```

### **Step 1: Build and Upload**
```bash
# Local: Build project
npm run build

# Upload to VPS
rsync -avz --delete ./dist/ username@your-vps-ip:/var/www/beta.xblog.ai/
```

### **Step 2: Configure Nginx**
```bash
# Create site configuration
sudo nano /etc/nginx/sites-available/beta.xblog.ai
```

Add configuration:
```nginx
server {
    listen 80;
    server_name beta.xblog.ai;
    root /var/www/beta.xblog.ai;
    index index.html;

    # React Router Support
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy (if needed)
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### **Step 3: Enable Site**
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/beta.xblog.ai /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### **Step 4: SSL Certificate**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d beta.xblog.ai

# Auto-renewal
sudo systemctl enable certbot.timer
```

---

## 🔧 Troubleshooting

### **React Router 404 Issues**
**Problem:** Direct URL access shows "Not Found"
**Solution:** Ensure `.htaccess` (shared hosting) or Nginx `try_files` directive is configured

### **Build Issues**
```bash
# Clear cache and rebuild
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Environment Variables**
Create `.env.production`:
```env
VITE_API_BASE_URL=https://api.xblog.ai
VITE_APP_ENV=production
```

### **Common Commands**
```bash
# Check build size
npm run build && du -sh dist/

# Preview build locally
npm run preview

# Analyze bundle
npm run build -- --analyze
```

---

## 📝 Quick Deployment Checklist

### **Before Deployment:**
- ✅ Test locally with `npm run preview`
- ✅ Check all routes work
- ✅ Verify API endpoints
- ✅ Update environment variables

### **During Deployment:**
- ✅ Build with `npm run build`
- ✅ Upload `dist/` contents (not folder)
- ✅ Create/update `.htaccess`
- ✅ Clear browser cache

### **After Deployment:**
- ✅ Test all routes
- ✅ Check browser console
- ✅ Verify API calls work
- ✅ Test on mobile

---

## 🚨 Emergency Rollback

### **Hostinger:**
1. Keep backup of previous `dist/` folder
2. Replace files via File Manager
3. Clear browser cache

### **VPS:**
```bash
# Backup before deployment
sudo cp -r /var/www/beta.xblog.ai /var/www/beta.xblog.ai.backup.$(date +%Y%m%d_%H%M%S)

# Rollback if needed
sudo rm -rf /var/www/beta.xblog.ai
sudo mv /var/www/beta.xblog.ai.backup.YYYYMMDD_HHMMSS /var/www/beta.xblog.ai
sudo systemctl reload nginx
```

---

## 📞 Support

- **Hostinger Support:** Check control panel for live chat
- **DNS Issues:** Use `nslookup beta.xblog.ai` to verify
- **SSL Issues:** Check certificate with `openssl s_client -connect beta.xblog.ai:443`

---

*Last updated: $(date)*
