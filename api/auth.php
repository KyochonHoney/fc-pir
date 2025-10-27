<?php
/**
 * 인증 API
 * 로그인, 로그아웃, 세션 확인
 */

require_once __DIR__ . '/../config/config.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        handleLogin();
        break;

    case 'logout':
        handleLogout();
        break;

    case 'check':
        handleCheck();
        break;

    default:
        json_response(false, null, '잘못된 요청입니다.', 400);
}

/**
 * 로그인 처리
 */
function handleLogin() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_response(false, null, 'POST 요청만 가능합니다.', 405);
    }

    $data = get_post_data();
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    // 유효성 검사
    if (empty($username) || empty($password)) {
        json_response(false, null, '아이디와 비밀번호를 입력해주세요.', 400);
    }

    // 관리자 인증
    if (check_admin_auth($username, $password)) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $username;
        $_SESSION['login_time'] = date('Y-m-d H:i:s');

        json_response(true, [
            'username' => $username,
            'login_time' => $_SESSION['login_time']
        ], '로그인 성공', 200);
    } else {
        json_response(false, null, '아이디 또는 비밀번호가 올바르지 않습니다.', 401);
    }
}

/**
 * 로그아웃 처리
 */
function handleLogout() {
    // 세션 변수 모두 제거
    $_SESSION = [];

    // 세션 쿠키 삭제
    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time() - 42000, '/');
    }

    // 세션 파기
    session_destroy();

    // 폼 요청인 경우
    if (!isset($_SERVER['HTTP_ACCEPT']) || strpos($_SERVER['HTTP_ACCEPT'], 'application/json') === false) {
        redirect(BASE_URL . '/public/index.php');
    }

    json_response(true, null, '로그아웃 성공', 200);
}

/**
 * 세션 확인
 */
function handleCheck() {
    $logged_in = is_admin_logged_in();

    json_response(true, [
        'logged_in' => $logged_in,
        'username' => $_SESSION['admin_username'] ?? null
    ], '', 200);
}
