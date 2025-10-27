<?php
/**
 * 전역 설정 파일
 * PHP 7.4.33
 */

// 에러 리포팅 설정 (개발 환경)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// 타임존 설정
date_default_timezone_set('Asia/Seoul');

// 프로젝트 루트 경로
define('ROOT_PATH', dirname(__DIR__));

// 데이터 디렉토리 경로
define('DATA_PATH', ROOT_PATH . '/data');

// BASE URL 설정 (VirtualHost 사용 시 자동 감지)
define('BASE_URL', '');

// 세션 설정
if (session_status() === PHP_SESSION_NONE) {
    session_start();

    // 세션 보안 설정
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    ini_set('session.cookie_secure', 0); // HTTPS 사용 시 1로 변경
}

// JSON 파일 경로 상수
define('MEMBERS_FILE', DATA_PATH . '/members.json');
define('PAYMENTS_FILE', DATA_PATH . '/payments.json');
define('ATTENDANCES_FILE', DATA_PATH . '/attendances.json');
define('TEAMS_FILE', DATA_PATH . '/teams.json');

// 응답 헤더 설정 (API용)
if (strpos($_SERVER['REQUEST_URI'], '/api/') !== false) {
    header('Content-Type: application/json; charset=utf-8');
}

// 관리자 계정 정보 불러오기
require_once __DIR__ . '/admin.php';

// 공통 함수 불러오기
require_once ROOT_PATH . '/includes/functions.php';
require_once ROOT_PATH . '/includes/data_handler.php';

// 프로젝트 정보
define('PROJECT_NAME', '풋살 팀 자동 매칭 시스템');
define('PROJECT_VERSION', '1.0.0');

// 회비 설정
define('DEFAULT_PAYMENT_AMOUNT', 10000); // 기본 회비 금액 (원)

// 팀 편성 알고리즘 설정
define('TEAM_LEVEL_TOLERANCE', 2); // 팀 레벨 차이 허용 범위
define('MIN_TEAM_SIZE', 2); // 최소 팀 인원

/**
 * 디버그 로그 함수
 */
function debug_log($message, $data = null) {
    if (defined('DEBUG_MODE') && DEBUG_MODE) {
        error_log("[DEBUG] $message" . ($data ? ": " . print_r($data, true) : ""));
    }
}
