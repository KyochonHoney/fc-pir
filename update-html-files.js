/**
 * 모든 HTML 파일에 Firebase SDK 추가
 * Node.js로 실행: node update-html-files.js
 */

const fs = require('fs');
const path = require('path');

const htmlFiles = [
    'admin/index.html',
    'admin/members.html',
    'admin/payments.html',
    'admin/gallery.html',
    'index.html',
    'team-generator.html',
    'gallery.html',
    'payment-status.html'
];

const oldPattern = '<script src="/js/storage.js"></script>';

const newPattern = `<!-- Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>

    <!-- Firebase 설정 -->
    <script src="/js/firebase-config.js"></script>

    <!-- Firebase Storage -->
    <script src="/js/storage-firebase.js"></script>`;

htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);

    try {
        let content = fs.readFileSync(filePath, 'utf8');

        if (content.includes(oldPattern)) {
            content = content.replace(oldPattern, newPattern);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Updated: ${file}`);
        } else {
            console.log(`⏭️  Skipped: ${file} (pattern not found)`);
        }
    } catch (error) {
        console.error(`❌ Error updating ${file}:`, error.message);
    }
});

console.log('\n🎉 Update complete!');
