<?php
/**
 * 관리자 계정 설정 (하드코딩)
 * PHP 7.4.33
 */

// 관리자 계정 정보
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'admin1234'); // 실제 운영 시 더 강력한 비밀번호로 변경

// 또는 배열 방식 (여러 관리자 계정 필요 시)
$admin_accounts = [
    [
        'username' => 'admin',
        'password' => 'admin1234',
        'name' => '관리자'
    ]
    // 추가 관리자 계정이 필요한 경우 여기에 추가
];

/**
 * 관리자 인증 확인
 */
function check_admin_auth($username, $password) {
    global $admin_accounts;

    foreach ($admin_accounts as $account) {
        if ($account['username'] === $username && $account['password'] === $password) {
            return true;
        }
    }

    return false;
}

/**
 * 관리자 로그인 여부 확인
 */
function is_admin_logged_in() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

/**
 * 관리자 권한 필요 페이지 접근 제어
 */
function require_admin() {
    if (!is_admin_logged_in()) {
        // API 요청인 경우
        if (strpos($_SERVER['REQUEST_URI'], '/api/') !== false) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => '관리자 권한이 필요합니다.'
            ]);
            exit;
        }

        // 일반 페이지 요청인 경우
        header('Location: ' . BASE_URL . '/admin/login.php');
        exit;
    }
}
