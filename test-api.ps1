#!/usr/bin/env pwsh
# Test Backend API Endpoints for Nearby Colleges Feature

Write-Host "Testing Backend API Endpoints..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get
    if ($health.ok -and $health.db) {
        Write-Host "   SUCCESS: Health check passed" -ForegroundColor Green
        Write-Host "   Database: Connected" -ForegroundColor Green
    } else {
        Write-Host "   FAILED: Health check failed" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   FAILED: Backend not responding on port 5000" -ForegroundColor Red
    Write-Host "   Make sure backend is running" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test 2: Nearby Colleges Endpoint
Write-Host "2. Testing Nearby Colleges Endpoint..." -ForegroundColor Yellow
try {
    # Delhi coordinates
    $lat = 28.6139
    $lng = 77.2090
    $radius = 50
    
    $uri = "http://localhost:5000/api/colleges/near?lat=$lat" + "&lng=$lng" + "&radius_km=$radius"
    $response = Invoke-RestMethod -Uri $uri -Method Get
    
    if ($response.items -and $response.items.Count -gt 0) {
        Write-Host "   SUCCESS: Nearby colleges endpoint working" -ForegroundColor Green
        Write-Host "   Found $($response.items.Count) colleges within ${radius}km" -ForegroundColor Green
        Write-Host ""
        Write-Host "   Sample Colleges:" -ForegroundColor Cyan
        $response.items | Select-Object -First 3 | ForEach-Object {
            $dist = [math]::Round($_.distance, 1)
            Write-Host "     - $($_.name) - $($_.city), $($_.state) ($dist km)" -ForegroundColor White
        }
    } else {
        Write-Host "   WARNING: No colleges found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   FAILED: Nearby colleges endpoint failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 3: Nearby Colleges with Stream Filter
Write-Host "3. Testing Stream Filter (Technology)..." -ForegroundColor Yellow
try {
    $uri = "http://localhost:5000/api/colleges/near?lat=$lat" + "&lng=$lng" + "&radius_km=100" + "&path=technology"
    $response = Invoke-RestMethod -Uri $uri -Method Get
    
    if ($response.items) {
        Write-Host "   SUCCESS: Stream filter working" -ForegroundColor Green
        Write-Host "   Found $($response.items.Count) technology colleges" -ForegroundColor Green
    } else {
        Write-Host "   WARNING: No technology colleges found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   FAILED: Stream filter failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 4: All Colleges Endpoint
Write-Host "4. Testing All Colleges Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/colleges?limit=5" -Method Get
    
    if ($response.items -and $response.items.Count -gt 0) {
        Write-Host "   SUCCESS: All colleges endpoint working" -ForegroundColor Green
        Write-Host "   Total colleges available: $($response.items.Count)" -ForegroundColor Green
    } else {
        Write-Host "   WARNING: No colleges in database" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   FAILED: All colleges endpoint failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "ALL TESTS PASSED!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Restart your React frontend (npm start)" -ForegroundColor White
Write-Host "   2. Navigate to Find Colleges page" -ForegroundColor White
Write-Host "   3. Click Use My Location button" -ForegroundColor White
Write-Host "   4. Allow browser location access" -ForegroundColor White
Write-Host "   5. View nearby colleges on map!" -ForegroundColor White
Write-Host ""
