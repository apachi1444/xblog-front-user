# 📊 Google Analytics Implementation Guide

## ✅ What We've Implemented

### 1. **Analytics Utilities** (`lib/utils/analytics.ts`)
- ✅ Centralized analytics functions for Google Analytics
- ✅ Predefined event categories and actions
- ✅ Type-safe event tracking
- ✅ Error handling and browser environment checks
- ✅ Convenience functions for common events

### 2. **Analytics Context Provider** (`contexts/analytics-context.tsx`)
- ✅ React context for analytics state management
- ✅ Application initialization tracking
- ✅ Enhanced tracking functions with error handling
- ✅ Clean provider pattern for easy integration

### 3. **Enhanced useAnalytics Hook** (`hooks/useAnalytics.ts`)
- ✅ Comprehensive tracking methods for all app events
- ✅ Authentication flow tracking
- ✅ CRUD operations tracking
- ✅ Navigation and UI interaction tracking
- ✅ PDF generation and file operation tracking

### 4. **Google Analytics Integration** (`app/layout.tsx`)
- ✅ Next.js Google Analytics component
- ✅ Clean integration with app providers
- ✅ Production-ready configuration

## 🧪 How to Test Analytics

### Step 1: Verify Google Analytics Integration
1. **Check GA ID**: Ensure `G-9GYWTG1CV4` is properly configured
2. **Browser Console**: Look for Google Analytics initialization logs
3. **Network Tab**: Verify analytics requests are being sent to Google

### Step 2: Test Events in Application
1. **Navigate through the app** and perform various actions:
   - Sign in/out
   - Click on table cards
   - Create/edit/delete records
   - Download PDFs
   - Search for records
   - Change language settings

### Step 3: Verify in Google Analytics
1. **Go to Google Analytics**: https://analytics.google.com
2. **Select your property**: GA4 property with ID `G-9GYWTG1CV4`
3. **Navigate to Reports > Real-time**
4. **Check Events**: Events should appear within seconds
5. **Use DebugView**: For detailed event inspection

### Step 4: Manual Event Testing
```javascript
// Open browser console and run:
gtag('event', 'test_event', {
  'custom_parameter': 'test_value',
  'event_category': 'manual_test'
});
```

## 🔍 Debugging Common Issues

### Issue 1: "Analytics not initialized"
**Symptoms**: Console warnings, no events tracked
**Solutions**:
- Check Google Analytics ID in your app configuration
- Verify the `GoogleAnalytics` component is properly imported
- Ensure you're testing in a browser (not SSR)
- Check network tab for analytics requests

### Issue 2: Events not appearing in Google Analytics
**Symptoms**: Events are triggered but don't appear in GA
**Solutions**:
- Wait a few minutes for real-time reports
- Use Google Analytics Real-time view for immediate verification
- Check GA4 property permissions
- Verify measurement ID matches your Google Analytics property

### Issue 3: TypeScript errors
**Symptoms**: Type errors when using analytics functions
**Solutions**:
- Ensure all analytics types are properly imported
- Check that the analytics context is properly wrapped around your app
- Verify the useAnalytics hook is used within the provider

## 📊 Event Types We're Tracking

### Authentication Events
- `sign_in_attempt` - When users attempt to sign in
- `sign_in_success` - Successful sign in
- `sign_in_failure` - Failed sign in attempts
- `sign_out` - When users sign out
- `session_timeout` - When sessions expire due to inactivity

### Navigation Events
- `specify_the_name_of_screen` - When users navigate to different pages
- `navigate_to_details` - When users click on table cards
- `back_navigation` - When users navigate back

### CRUD Operations
- `create_record` - When users create new records
- `update_record` - When users edit existing records
- `delete_record` - When users delete records
- `search_records` - When users search for records

### UI Interactions
- `button_click` - When users click buttons
- `menu_open` - When dropdown menus are opened
- `dialog_open/close` - When dialogs are opened/closed
- `toggle_visibility` - When content visibility is toggled
- `language_change` - When users change language

### File Operations
- `pdf_download_attempt` - When PDF download is initiated
- `pdf_download_success` - Successful PDF generation
- `pdf_download_failure` - Failed PDF generation

### Error Tracking
- `api_error` - API-related errors
- `validation_error` - Form validation errors
- `generic_error` - General application errors

### Enhanced Data
- User agent information
- Screen resolution
- Language preferences
- Page URLs and titles
- Timestamps
- Error context and details

## 🚀 Production Deployment

### Before Going Live:
1. **Verify Google Analytics Configuration**: Ensure GA ID is correct
2. **Test on Different Devices**: Mobile, tablet, desktop
3. **Check HTTPS**: Analytics requires secure connections
4. **Verify Domain**: Ensure your domain is authorized in Google Analytics

### Production Monitoring:
1. **Google Analytics Dashboard**: Monitor user behavior
2. **Real-time Reports**: Check active users
3. **Conversion Tracking**: Set up goals and funnels
4. **Custom Reports**: Create reports for your specific needs

## 🔧 Advanced Configuration

### Custom Dimensions (Ready for Implementation):
- `custom_dimension_1`: User type
- `custom_dimension_2`: App version
- `custom_dimension_3`: Device type

### Enhanced E-commerce (Ready for Implementation):
```javascript
// Track financial transactions
trackEvent('purchase', {
  transaction_id: 'T12345',
  value: 25.25,
  currency: 'MAD',
  items: [{
    item_id: 'item_001',
    item_name: 'Financial Record',
    category: 'Financial',
    quantity: 1,
    price: 25.25
  }]
});
```

## 📱 Mobile App Analytics (PWA)

### PWA-Specific Events:
- App installation prompts
- Offline usage
- Push notification interactions
- Home screen additions

### Testing on Mobile:
1. **Use Chrome DevTools**: Mobile device simulation
2. **Test on Real Devices**: iOS Safari, Android Chrome
3. **Check PWA Features**: Install prompt, offline mode

## 🆘 Troubleshooting Commands

```bash
# Check if analytics is working in browser console:
console.log('Analytics initialized:', !!window.gtag);

# Test manual event:
gtag('event', 'test', { test_parameter: 'working' });

# Check dataLayer:
console.log('DataLayer:', window.dataLayer);
```

---

# 🔄 Implementation Guide for Regular React Apps

## 📋 Prerequisites for React Apps

### 1. Install Required Dependencies
```bash
npm install react-hot-toast
# or
yarn add react-hot-toast
```

### 2. Add Google Analytics Script
Add this to your `public/index.html`:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_GA_ID');
</script>
```

## 🔧 Implementation Steps

### Step 1: Create Analytics Utilities
Copy the `lib/utils/analytics.ts` file to your React project. Update the `sendGAEvent` function:

```typescript
// Replace the Next.js import with direct gtag usage
export function trackEvent(event: AnalyticsEvent): void {
  try {
    if (typeof window === 'undefined' || !window.gtag) {
      return
    }

    // Use gtag directly instead of sendGAEvent
    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.custom_parameters
    })
  } catch (error) {
    console.warn('Analytics tracking failed:', error)
  }
}
```

### Step 2: Add TypeScript Declarations
Create a `types/gtag.d.ts` file:
```typescript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: any
    ) => void;
    dataLayer: any[];
  }
}

export {};
```

### Step 3: Create Analytics Context
Copy the `contexts/analytics-context.tsx` file to your React project (no changes needed).

### Step 4: Create Enhanced Analytics Hook
Copy the `hooks/useAnalytics.ts` file to your React project (no changes needed).

### Step 5: Wrap Your App
In your main `App.tsx` or `index.tsx`:
```tsx
import { AnalyticsProvider } from './contexts/analytics-context';

function App() {
  return (
    <AnalyticsProvider>
      {/* Your app components */}
    </AnalyticsProvider>
  );
}
```

### Step 6: Use Analytics in Components
```tsx
import { useEnhancedAnalytics } from './hooks/useAnalytics';

function MyComponent() {
  const analytics = useEnhancedAnalytics();

  const handleClick = () => {
    analytics.trackButtonClick('my_button', 'my_page');
  };

  return <button onClick={handleClick}>Track Me</button>;
}
```

## 🎯 Key Differences from Next.js

1. **No `sendGAEvent`**: Use `window.gtag` directly
2. **Manual Script Loading**: Add GA script to `index.html`
3. **TypeScript Declarations**: Add gtag types manually
4. **No SSR Considerations**: Standard React doesn't have SSR by default

## ✅ Verification

1. Check browser console for gtag initialization
2. Use Google Analytics Real-time reports
3. Test events using the browser console commands above

---

**🎉 Your React app now has the same powerful analytics system!**
