<?php
/**
 * 공통 함수 모음
 * PHP 7.4.33
 */

/**
 * JSON 응답 반환 (API용)
 */
function json_response($success, $data = null, $message = '', $http_code = 200) {
    http_response_code($http_code);

    $response = [
        'success' => $success,
        'message' => $message
    ];

    if ($data !== null) {
        $response['data'] = $data;
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

/**
 * XSS 방지 - HTML 특수문자 변환
 */
function escape($value) {
    if (is_array($value)) {
        return array_map('escape', $value);
    }
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * POST 데이터 가져오기 (JSON 지원)
 */
function get_post_data() {
    $content_type = $_SERVER['CONTENT_TYPE'] ?? '';

    if (strpos($content_type, 'application/json') !== false) {
        $json = file_get_contents('php://input');
        return json_decode($json, true) ?? [];
    }

    return $_POST;
}

/**
 * 입력 값 검증
 */
function validate_required($data, $fields) {
    $errors = [];

    foreach ($fields as $field) {
        if (!isset($data[$field]) || trim($data[$field]) === '') {
            $errors[$field] = "{$field}은(는) 필수입니다.";
        }
    }

    return $errors;
}

/**
 * 포지션 유효성 검증
 */
function validate_position($position) {
    $valid_positions = ['ATT', 'DEF', 'ALL'];
    return in_array($position, $valid_positions);
}

/**
 * 레벨 유효성 검증
 */
function validate_level($level) {
    return is_numeric($level) && $level >= 1 && $level <= 10;
}

/**
 * 날짜 포맷 변환
 */
function format_date($date, $format = 'Y-m-d') {
    if (empty($date)) {
        return null;
    }

    $timestamp = is_numeric($date) ? $date : strtotime($date);
    return date($format, $timestamp);
}

/**
 * 금액 포맷 (원화)
 */
function format_currency($amount) {
    return number_format($amount) . '원';
}

/**
 * 포지션 한글 변환
 */
function get_position_name($position) {
    $positions = [
        'ATT' => '공격',
        'DEF' => '수비',
        'ALL' => '올라운더'
    ];

    return $positions[$position] ?? $position;
}

/**
 * 배열에서 특정 키의 값 합계
 */
function array_sum_by_key($array, $key) {
    return array_reduce($array, function($carry, $item) use ($key) {
        return $carry + ($item[$key] ?? 0);
    }, 0);
}

/**
 * 배열에서 특정 키로 그룹화
 */
function array_group_by($array, $key) {
    $result = [];

    foreach ($array as $item) {
        $group_key = $item[$key] ?? 'unknown';

        if (!isset($result[$group_key])) {
            $result[$group_key] = [];
        }

        $result[$group_key][] = $item;
    }

    return $result;
}

/**
 * 포지션별 카운트
 */
function count_positions($members) {
    $counts = [
        'ATT' => 0,
        'DEF' => 0,
        'ALL' => 0
    ];

    foreach ($members as $member) {
        $position = $member['position'] ?? 'ALL';
        if (isset($counts[$position])) {
            $counts[$position]++;
        }
    }

    return $counts;
}

/**
 * 현재 URL 가져오기
 */
function current_url() {
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    return $protocol . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
}

/**
 * 리다이렉트
 */
function redirect($url) {
    header("Location: $url");
    exit;
}

/**
 * 세션 플래시 메시지 설정
 */
function set_flash($key, $message) {
    $_SESSION['flash'][$key] = $message;
}

/**
 * 세션 플래시 메시지 가져오기
 */
function get_flash($key) {
    $message = $_SESSION['flash'][$key] ?? null;

    if ($message) {
        unset($_SESSION['flash'][$key]);
    }

    return $message;
}

/**
 * 알림 메시지 HTML 생성
 */
function flash_alert() {
    $success = get_flash('success');
    $error = get_flash('error');

    $html = '';

    if ($success) {
        $html .= '<div class="alert alert-success alert-dismissible fade show" role="alert">';
        $html .= escape($success);
        $html .= '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
        $html .= '</div>';
    }

    if ($error) {
        $html .= '<div class="alert alert-danger alert-dismissible fade show" role="alert">';
        $html .= escape($error);
        $html .= '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
        $html .= '</div>';
    }

    return $html;
}
