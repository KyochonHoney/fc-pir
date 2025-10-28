const fs = require('fs');

const files = [
    'admin/payments.html',
    'admin/gallery.html',
    'index.html',
    'team-generator.html',
    'gallery.html',
    'payment-status.html'
];

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');

        // storage.js를 Firebase 모듈로 교체
        content = content.replace(
            /<script src="\/js\/storage\.js"><\/script>\s*<script>/,
            `<script type="module">
        import storage from '/js/storage-firebase.js';
        window.storage = storage;
`
        );

        // 모든 storage 메서드 호출에 await 추가
        content = content.replace(/storage\.(getMembers|getPayments|getPaymentMatrix|addMember|addPayment|updatePayment|deletePayment|isAdminLoggedIn|adminLogout|getGalleryImages|addGalleryImage|deleteGalleryImage|saveTeam|getTeamHistory)\(/g, 'await storage.$1(');

        // 모든 function을 async function으로 변경 (주요 함수만)
        content = content.replace(/function (load\w+|add\w+|update\w+|delete\w+|save\w+)\(/g, 'async function $1(');

        // 이벤트 리스너에 async 추가
        content = content.replace(/addEventListener\('submit', function\(/g, "addEventListener('submit', async function(");
        content = content.replace(/addEventListener\('click', function\(/g, "addEventListener('click', async function(");

        fs.writeFileSync(file, content);
        console.log(`✅ ${file} 변환 완료`);
    } catch (error) {
        console.error(`❌ ${file} 오류:`, error.message);
    }
});

console.log('\n🎉 모든 파일 변환 완료!');
