// 풋살 팀 자동 매칭 시스템 - 메인 JavaScript

console.log('⚽ 풋살 팀 자동 매칭 시스템 로드 완료');

// 알림 자동 닫기
document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert');

    alerts.forEach(function(alert) {
        setTimeout(function() {
            alert.style.transition = 'opacity 0.5s';
            alert.style.opacity = '0';

            setTimeout(function() {
                alert.remove();
            }, 500);
        }, 5000);
    });
});

// 폼 제출 확인
function confirmAction(message) {
    return confirm(message);
}

// AJAX 요청 헬퍼
async function fetchAPI(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        return await response.json();
    } catch (error) {
        console.error('API 요청 오류:', error);
        return { success: false, message: '서버 요청 중 오류가 발생했습니다.' };
    }
}
