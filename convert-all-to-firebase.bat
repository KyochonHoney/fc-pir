@echo off
echo ========================================
echo Firebase 일괄 변환 스크립트
echo ========================================
echo.

echo [1/7] admin/members.html 변환 중...
powershell -Command "(Get-Content 'admin/members.html' -Raw) -replace '<script src=\"/js/storage.js\"></script>\r?\n    <script>', '<script type=\"module\">\r\n        import storage from ''/js/storage-firebase.js'';\r\n        window.storage = storage;\r\n' | Set-Content 'admin/members.html'"

echo [2/7] admin/payments.html 변환 중...
powershell -Command "(Get-Content 'admin/payments.html' -Raw) -replace '<script src=\"/js/storage.js\"></script>\r?\n    <script>', '<script type=\"module\">\r\n        import storage from ''/js/storage-firebase.js'';\r\n        window.storage = storage;\r\n' | Set-Content 'admin/payments.html'"

echo [3/7] admin/gallery.html 변환 중...
powershell -Command "(Get-Content 'admin/gallery.html' -Raw) -replace '<script src=\"/js/storage.js\"></script>\r?\n    <script>', '<script type=\"module\">\r\n        import storage from ''/js/storage-firebase.js'';\r\n        window.storage = storage;\r\n' | Set-Content 'admin/gallery.html'"

echo [4/7] index.html 변환 중...
powershell -Command "(Get-Content 'index.html' -Raw) -replace '<script src=\"/js/storage.js\"></script>\r?\n    <script>', '<script type=\"module\">\r\n        import storage from ''/js/storage-firebase.js'';\r\n        window.storage = storage;\r\n' | Set-Content 'index.html'"

echo [5/7] team-generator.html 변환 중...
powershell -Command "(Get-Content 'team-generator.html' -Raw) -replace '<script src=\"/js/storage.js\"></script>\r?\n    <script>', '<script type=\"module\">\r\n        import storage from ''/js/storage-firebase.js'';\r\n        window.storage = storage;\r\n ' | Set-Content 'team-generator.html'"

echo [6/7] gallery.html 변환 중...
powershell -Command "(Get-Content 'gallery.html' -Raw) -replace '<script src=\"/js/storage.js\"></script>\r?\n    <script>', '<script type=\"module\">\r\n        import storage from ''/js/storage-firebase.js'';\r\n        window.storage = storage;\r\n' | Set-Content 'gallery.html'"

echo [7/7] payment-status.html 변환 중...
powershell -Command "(Get-Content 'payment-status.html' -Raw) -replace '<script src=\"/js/storage.js\"></script>\r?\n    <script>', '<script type=\"module\">\r\n        import storage from ''/js/storage-firebase.js'';\r\n        window.storage = storage;\r\n' | Set-Content 'payment-status.html'"

echo.
echo ========================================
echo 변환 완료!
echo ========================================
echo.
echo 다음 단계:
echo 1. Firebase Realtime Database 활성화
echo 2. js/firebase-config.js 에서 databaseURL 수정
echo 3. 테스트: http://localhost/football/admin/members.html
echo.
pause
