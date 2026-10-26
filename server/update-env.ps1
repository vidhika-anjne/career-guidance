# Script to update .env file with correct MySQL configuration
$envPath = "c:\Users\HP\OneDrive\Desktop\4c_G8_Project_implementation_uploaded_on_github_ CS508_Minor Project I_July-Dec 2024\new\server\.env"

$envContent = @"
# ====================
# DATABASE (MySQL)
# ====================
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=ansh
MYSQL_DATABASE=ansh

# ====================
# AUTHENTICATION
# ====================
JWT_SECRET=your_jwt_secret_key_change_this_in_production
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=781880501299-j7opim8a8fcf3ilhvrcontent.com.googleusercontent.com

# ====================
# GOOGLE MAPS (Optional)
# ====================
GOOGLE_MAPS_API_KEY=

# ====================
# EMAIL/SMTP (Optional - will use Ethereal for testing if not configured)
# ====================
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=CareerVerse <no-reply@careerverse.local>

# ====================
# SERVER
# ====================
PORT=5000
NODE_ENV=development
"@

Set-Content -Path $envPath -Value $envContent -NoNewline
Write-Host "✅ .env file updated successfully!"
Write-Host "📝  MYSQL_PASSWORD set to: ansh"
Write-Host "🔄  Please restart the server with: npm run dev"
