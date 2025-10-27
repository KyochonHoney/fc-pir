<?php
/**
 * 팀 편성 API
 */

require_once __DIR__ . '/../config/config.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'generate':
        handleGenerate();
        break;

    case 'history':
        handleHistory();
        break;

    default:
        json_response(false, null, '잘못된 요청입니다.', 400);
}

/**
 * 팀 자동 생성
 */
function handleGenerate() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_response(false, null, 'POST 요청만 가능합니다.', 405);
    }

    $data = get_post_data();
    $memberIds = $data['member_ids'] ?? [];
    $saveHistory = $data['save_history'] ?? false;

    // 유효성 검사
    if (empty($memberIds) || !is_array($memberIds)) {
        json_response(false, null, '참가 멤버를 선택해주세요.', 400);
    }

    if (count($memberIds) < 4) {
        json_response(false, null, '최소 4명 이상의 멤버가 필요합니다.', 400);
    }

    // 멤버 정보 가져오기
    $allMembers = getMembers(true);
    $selectedMembers = [];

    foreach ($allMembers as $member) {
        if (in_array($member['id'], $memberIds)) {
            $selectedMembers[] = $member;
        }
    }

    if (count($selectedMembers) !== count($memberIds)) {
        json_response(false, null, '유효하지 않은 멤버가 포함되어 있습니다.', 400);
    }

    // 팀 편성 알고리즘 실행
    $result = generateBalancedTeams($selectedMembers);

    // 기록 저장
    if ($saveHistory) {
        saveTeamHistory($result['team_a'], $result['team_b']);
    }

    json_response(true, $result, '팀 편성이 완료되었습니다.', 200);
}

/**
 * 팀 편성 기록 조회
 */
function handleHistory() {
    $limit = $_GET['limit'] ?? 10;
    $date = $_GET['date'] ?? null;

    $history = getTeamHistory($limit, $date);

    json_response(true, $history, '', 200);
}

/**
 * 균형잡힌 팀 생성 알고리즘
 */
function generateBalancedTeams($members) {
    $memberCount = count($members);

    // 레벨 기준 내림차순 정렬
    usort($members, function($a, $b) {
        return $b['level'] - $a['level'];
    });

    // 초기 배치 (지그재그 방식)
    $teamA = [];
    $teamB = [];

    foreach ($members as $index => $member) {
        if ($index % 2 === 0) {
            $teamA[] = $member;
        } else {
            $teamB[] = $member;
        }
    }

    // 레벨 밸런스 조정
    $maxIterations = 100;
    $tolerance = TEAM_LEVEL_TOLERANCE;

    for ($i = 0; $i < $maxIterations; $i++) {
        $teamALevel = array_sum_by_key($teamA, 'level');
        $teamBLevel = array_sum_by_key($teamB, 'level');
        $diff = abs($teamALevel - $teamBLevel);

        if ($diff <= $tolerance) {
            break;
        }

        // 레벨 차이를 줄일 수 있는 교환 찾기
        $swapped = false;

        foreach ($teamA as $aIndex => $aMember) {
            foreach ($teamB as $bIndex => $bMember) {
                // 교환 후 차이 계산
                $newTeamALevel = $teamALevel - $aMember['level'] + $bMember['level'];
                $newTeamBLevel = $teamBLevel - $bMember['level'] + $aMember['level'];
                $newDiff = abs($newTeamALevel - $newTeamBLevel);

                // 더 나은 경우 교환
                if ($newDiff < $diff) {
                    $temp = $teamA[$aIndex];
                    $teamA[$aIndex] = $teamB[$bIndex];
                    $teamB[$bIndex] = $temp;
                    $swapped = true;
                    break 2;
                }
            }
        }

        if (!$swapped) {
            break;
        }
    }

    // 포지션 밸런스 확인
    $teamAPositions = count_positions($teamA);
    $teamBPositions = count_positions($teamB);

    // 최종 결과
    $teamALevel = array_sum_by_key($teamA, 'level');
    $teamBLevel = array_sum_by_key($teamB, 'level');

    return [
        'team_a' => $teamA,
        'team_b' => $teamB,
        'team_a_level' => $teamALevel,
        'team_b_level' => $teamBLevel,
        'level_diff' => abs($teamALevel - $teamBLevel),
        'team_a_positions' => $teamAPositions,
        'team_b_positions' => $teamBPositions
    ];
}
