# MITM Setup for Amul App

## Quick Setup

### 1. Start mitmproxy
```bash
# Option A: Terminal UI
mitmproxy --listen-port 8080

# Option B: Web UI (recommended for easier viewing)
mitmweb --listen-port 8080

# Option C: Dump to file for later analysis
mitmdump --listen-port 8080 -w amul_traffic.flow
```

### 2. Get Your Mac's IP
```bash
ipconfig getifaddr en0
```

### 3. Configure Android Device

On your Android phone:
1. Go to **Settings > Wi-Fi**
2. Long-press your connected network > **Modify network**
3. Show advanced options
4. Set **Proxy** to **Manual**
5. Enter:
   - Proxy hostname: `<your-mac-ip>` (from step 2)
   - Proxy port: `8080`
6. Save

### 4. Install mitmproxy CA (Optional but recommended)

On your Android phone:
1. Open browser and go to `http://mitm.it`
2. Download the Android certificate
3. Go to **Settings > Security > Install from storage**
4. Select the downloaded certificate

**Note:** For this app, you may NOT need to install the CA certificate since it uses `TrustEverythingTrustManager` which accepts all certificates!

### 5. Open the Amul App

Now open the Amul app and perform actions. All traffic will be captured in mitmproxy.

## Capturing Specific Endpoints

To filter for Amul API traffic only:
```bash
mitmproxy --listen-port 8080 --set flow_detail=3 \
  --set console_eventlog_verbosity=info \
  -s "~d amulamcs.com | ~d amulpashudhan.com"
```

## Saving Traffic for Analysis
```bash
# Save to file
mitmdump --listen-port 8080 -w amul_capture.flow

# Later, replay and analyze
mitmproxy -r amul_capture.flow
```

## Key Endpoints to Capture

| Action in App | Expected Endpoint |
|---------------|-------------------|
| Login/OTP | `ValidateMobileNo`, `RegisterMobileNo` |
| Dashboard | `GetDashboardData`, `GetFarmerDetail` |
| Milk Slips | `GetMilkSlips` |
| Passbook | `GetPassbookDetail` |
| Animal Trading | `pashudhanapi.amulamcs.com/*` |

## Security Notes

This app has **NO certificate pinning** and uses `TrustEverythingTrustManager` which:
- Accepts ANY SSL certificate
- Makes MITM trivial without any bypass needed
- Is a security vulnerability in the app

## Troubleshooting

### App not connecting?
1. Ensure phone and Mac are on same WiFi
2. Check firewall allows port 8080
3. Try: `sudo pfctl -d` to disable macOS firewall temporarily

### mitmproxy not showing traffic?
1. Verify proxy settings on phone
2. Test with browser first (visit any HTTPS site)
3. Check mitmproxy is running: `lsof -i :8080`
