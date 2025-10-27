<?php
/**
 * JSON 파일 데이터 핸들러
 * PHP 7.4.33
 */

/**
 * JSON 파일 읽기
 */
function readJSON($filename) {
    $filepath = DATA_PATH . '/' . $filename;

    if (!file_exists($filepath)) {
        return null;
    }

    $content = file_get_contents($filepath);
    return json_decode($content, true);
}

/**
 * JSON 파일 쓰기 (파일 잠금 적용)
 */
function writeJSON($filename, $data) {
    $filepath = DATA_PATH . '/' . $filename;

    // 파일 잠금으로 동시 쓰기 방지
    $fp = fopen($filepath, 'w');

    if (!$fp) {
        return false;
    }

    if (flock($fp, LOCK_EX)) {
        fwrite($fp, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        flock($fp, LOCK_UN);
    }

    fclose($fp);
    return true;
}

// ============================================
// 멤버 관련 함수
// ============================================

/**
 * 전체 멤버 목록 가져오기
 */
function getMembers($activeOnly = false) {
    $data = readJSON('members.json');
    $members = $data['members'] ?? [];

    if ($activeOnly) {
        return array_filter($members, function($m) {
            return $m['is_active'] === true;
        });
    }

    return $members;
}

/**
 * 특정 멤버 가져오기
 */
function getMember($id) {
    $members = getMembers();

    foreach ($members as $member) {
        if ($member['id'] == $id) {
            return $member;
        }
    }

    return null;
}

/**
 * 멤버 추가
 */
function addMember($name, $position, $level) {
    $data = readJSON('members.json');

    $new_member = [
        'id' => $data['next_id'],
        'name' => $name,
        'position' => $position,
        'level' => (int)$level,
        'is_active' => true,
        'created_at' => date('Y-m-d H:i:s')
    ];

    $data['members'][] = $new_member;
    $data['next_id']++;

    writeJSON('members.json', $data);

    return $new_member;
}

/**
 * 멤버 수정
 */
function updateMember($id, $name, $position, $level) {
    $data = readJSON('members.json');
    $found = false;

    foreach ($data['members'] as &$member) {
        if ($member['id'] == $id) {
            $member['name'] = $name;
            $member['position'] = $position;
            $member['level'] = (int)$level;
            $found = true;
            break;
        }
    }

    if ($found) {
        writeJSON('members.json', $data);
    }

    return $found;
}

/**
 * 멤버 삭제 (비활성화)
 */
function deleteMember($id) {
    $data = readJSON('members.json');
    $found = false;

    foreach ($data['members'] as &$member) {
        if ($member['id'] == $id) {
            $member['is_active'] = false;
            $found = true;
            break;
        }
    }

    if ($found) {
        writeJSON('members.json', $data);
    }

    return $found;
}

// ============================================
// 회비 관련 함수
// ============================================

/**
 * 전체 회비 목록 가져오기
 */
function getPayments($memberId = null, $paidStatus = null) {
    $data = readJSON('payments.json');
    $payments = $data['payments'] ?? [];

    // 멤버 정보와 조인
    $members = getMembers();
    $memberMap = [];

    foreach ($members as $member) {
        $memberMap[$member['id']] = $member;
    }

    foreach ($payments as &$payment) {
        $payment['member_name'] = $memberMap[$payment['member_id']]['name'] ?? '알 수 없음';
    }

    // 필터링
    if ($memberId !== null) {
        $payments = array_filter($payments, function($p) use ($memberId) {
            return $p['member_id'] == $memberId;
        });
    }

    if ($paidStatus !== null) {
        $payments = array_filter($payments, function($p) use ($paidStatus) {
            return $p['paid'] === $paidStatus;
        });
    }

    return array_values($payments);
}

/**
 * 회비 추가
 */
function addPayment($memberId, $amount, $paid = false, $note = '') {
    $data = readJSON('payments.json');

    $new_payment = [
        'id' => $data['next_id'],
        'member_id' => (int)$memberId,
        'amount' => (int)$amount,
        'paid' => $paid,
        'payment_date' => $paid ? date('Y-m-d') : null,
        'note' => $note,
        'created_at' => date('Y-m-d H:i:s')
    ];

    $data['payments'][] = $new_payment;
    $data['next_id']++;

    writeJSON('payments.json', $data);

    return $new_payment;
}

/**
 * 회비 납부 처리
 */
function updatePayment($id, $paid, $paymentDate = null) {
    $data = readJSON('payments.json');
    $found = false;

    foreach ($data['payments'] as &$payment) {
        if ($payment['id'] == $id) {
            $payment['paid'] = $paid;
            $payment['payment_date'] = $paymentDate ?? ($paid ? date('Y-m-d') : null);
            $found = true;
            break;
        }
    }

    if ($found) {
        writeJSON('payments.json', $data);
    }

    return $found;
}

/**
 * 회비 통계
 */
function getPaymentStatistics() {
    $payments = getPayments();
    $totalMembers = count(getMembers(true));

    $paidCount = count(array_filter($payments, function($p) {
        return $p['paid'] === true;
    }));

    $unpaidCount = $totalMembers - $paidCount;
    $paymentRate = $totalMembers > 0 ? round(($paidCount / $totalMembers) * 100) : 0;

    return [
        'total_members' => $totalMembers,
        'paid_count' => $paidCount,
        'unpaid_count' => $unpaidCount,
        'payment_rate' => $paymentRate
    ];
}

// ============================================
// 출석 관련 함수
// ============================================

/**
 * 출석 체크
 */
function checkAttendance($memberId, $attendanceDate, $isAttending) {
    $data = readJSON('attendances.json');
    $found = false;

    // 기존 출석 정보가 있는지 확인
    foreach ($data['attendances'] as &$attendance) {
        if ($attendance['member_id'] == $memberId && $attendance['attendance_date'] === $attendanceDate) {
            $attendance['is_attending'] = $isAttending;
            $found = true;
            break;
        }
    }

    // 없으면 새로 추가
    if (!$found) {
        $data['attendances'][] = [
            'member_id' => (int)$memberId,
            'attendance_date' => $attendanceDate,
            'is_attending' => $isAttending
        ];
    }

    writeJSON('attendances.json', $data);
    return true;
}

/**
 * 특정 날짜 출석 목록
 */
function getAttendances($date) {
    $data = readJSON('attendances.json');
    $attendances = $data['attendances'] ?? [];

    $members = getMembers(true);
    $result = [];

    foreach ($members as $member) {
        $isAttending = false;

        foreach ($attendances as $attendance) {
            if ($attendance['member_id'] == $member['id'] && $attendance['attendance_date'] === $date) {
                $isAttending = $attendance['is_attending'];
                break;
            }
        }

        $result[] = [
            'member_id' => $member['id'],
            'member_name' => $member['name'],
            'is_attending' => $isAttending
        ];
    }

    return $result;
}

// ============================================
// 팀 편성 관련 함수
// ============================================

/**
 * 팀 편성 기록 저장
 */
function saveTeamHistory($teamA, $teamB, $matchDate = null) {
    $data = readJSON('teams.json');

    $teamALevel = array_sum_by_key($teamA, 'level');
    $teamBLevel = array_sum_by_key($teamB, 'level');

    $teamAIds = array_column($teamA, 'id');
    $teamBIds = array_column($teamB, 'id');

    $new_team = [
        'id' => $data['next_id'],
        'match_date' => $matchDate ?? date('Y-m-d'),
        'team_a' => $teamAIds,
        'team_b' => $teamBIds,
        'team_a_level' => $teamALevel,
        'team_b_level' => $teamBLevel,
        'created_at' => date('Y-m-d H:i:s')
    ];

    $data['teams'][] = $new_team;
    $data['next_id']++;

    writeJSON('teams.json', $data);

    return $new_team;
}

/**
 * 팀 편성 기록 조회
 */
function getTeamHistory($limit = 10, $date = null) {
    $data = readJSON('teams.json');
    $teams = $data['teams'] ?? [];

    // 날짜 필터링
    if ($date !== null) {
        $teams = array_filter($teams, function($t) use ($date) {
            return $t['match_date'] === $date;
        });
    }

    // 최신순 정렬
    usort($teams, function($a, $b) {
        return strtotime($b['created_at']) - strtotime($a['created_at']);
    });

    // 제한
    return array_slice($teams, 0, $limit);
}
