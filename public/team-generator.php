<?php
require_once __DIR__ . '/../config/config.php';

$page_title = '팀 편성 - ' . PROJECT_NAME;

// 전체 멤버 가져오기
$members = getMembers(true);

include __DIR__ . '/../includes/header.php';
?>

<div class="page-title">
    <h2>⚽ 자동 팀 편성</h2>
    <p>참가 멤버를 선택하고 공정한 팀을 자동으로 생성하세요</p>
</div>

<div style="display: grid; grid-template-columns: 1fr 2fr; gap: 30px;">
    <!-- 멤버 선택 -->
    <div class="card">
        <h3 class="card-title">참가 멤버 선택</h3>

        <div style="margin-bottom: 15px;">
            <button onclick="selectAll()" class="btn btn-secondary" style="margin-right: 10px;">전체 선택</button>
            <button onclick="deselectAll()" class="btn btn-secondary">선택 해제</button>
        </div>

        <div id="member-list" style="max-height: 500px; overflow-y: auto;">
            <?php foreach ($members as $member): ?>
                <label style="display: block; padding: 10px; margin-bottom: 5px; background: #f8f9fa; border-radius: 5px; cursor: pointer;">
                    <input type="checkbox" name="members[]" value="<?= $member['id'] ?>" class="member-checkbox">
                    <strong><?= escape($member['name']) ?></strong>
                    <span class="badge badge-info"><?= get_position_name($member['position']) ?></span>
                    <span class="badge badge-warning">Lv.<?= $member['level'] ?></span>
                </label>
            <?php endforeach; ?>
        </div>

        <div style="margin-top: 20px;">
            <button onclick="generateTeams()" class="btn btn-primary btn-block">팀 생성</button>
        </div>

        <div id="selected-count" style="margin-top: 15px; text-align: center; color: #666;">
            선택된 멤버: <strong>0명</strong>
        </div>
    </div>

    <!-- 팀 편성 결과 -->
    <div class="card">
        <h3 class="card-title">팀 편성 결과</h3>

        <div id="team-result" style="text-align: center; padding: 40px; color: #999;">
            왼쪽에서 참가 멤버를 선택하고 "팀 생성" 버튼을 클릭하세요
        </div>

        <div id="team-display" style="display: none;">
            <div class="team-container">
                <!-- Team A -->
                <div class="team-card team-a">
                    <div class="team-header">
                        <h3 style="color: #007bff;">Team A</h3>
                        <div class="team-level">
                            총 레벨: <strong id="team-a-level">0</strong>
                        </div>
                        <div style="margin-top: 10px; font-size: 0.9rem; color: #666;">
                            <span id="team-a-att">공격:0</span> |
                            <span id="team-a-def">수비:0</span> |
                            <span id="team-a-all">올:0</span>
                        </div>
                    </div>
                    <ul class="team-members" id="team-a-members">
                    </ul>
                </div>

                <!-- Team B -->
                <div class="team-card team-b">
                    <div class="team-header">
                        <h3 style="color: #dc3545;">Team B</h3>
                        <div class="team-level">
                            총 레벨: <strong id="team-b-level">0</strong>
                        </div>
                        <div style="margin-top: 10px; font-size: 0.9rem; color: #666;">
                            <span id="team-b-att">공격:0</span> |
                            <span id="team-b-def">수비:0</span> |
                            <span id="team-b-all">올:0</span>
                        </div>
                    </div>
                    <ul class="team-members" id="team-b-members">
                    </ul>
                </div>
            </div>

            <div style="text-align: center; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
                <strong>레벨 차이:</strong> <span id="level-diff">0</span>
                <span id="balance-status" style="margin-left: 15px;"></span>
            </div>
        </div>
    </div>
</div>

<script>
// 멤버 선택 카운트 업데이트
function updateSelectedCount() {
    const checkboxes = document.querySelectorAll('.member-checkbox:checked');
    document.getElementById('selected-count').innerHTML =
        `선택된 멤버: <strong>${checkboxes.length}명</strong>`;
}

// 전체 선택
function selectAll() {
    document.querySelectorAll('.member-checkbox').forEach(cb => cb.checked = true);
    updateSelectedCount();
}

// 선택 해제
function deselectAll() {
    document.querySelectorAll('.member-checkbox').forEach(cb => cb.checked = false);
    updateSelectedCount();
}

// 체크박스 변경 이벤트
document.querySelectorAll('.member-checkbox').forEach(cb => {
    cb.addEventListener('change', updateSelectedCount);
});

// 팀 생성
async function generateTeams() {
    const checkboxes = document.querySelectorAll('.member-checkbox:checked');
    const memberIds = Array.from(checkboxes).map(cb => parseInt(cb.value));

    if (memberIds.length < 4) {
        alert('최소 4명 이상의 멤버를 선택해주세요.');
        return;
    }

    try {
        const response = await fetchAPI('<?= BASE_URL ?>/api/teams.php?action=generate', {
            method: 'POST',
            body: JSON.stringify({
                member_ids: memberIds,
                save_history: true
            })
        });

        if (response.success) {
            displayTeams(response.data);
        } else {
            alert(response.message || '팀 생성에 실패했습니다.');
        }
    } catch (error) {
        alert('팀 생성 중 오류가 발생했습니다.');
        console.error(error);
    }
}

// 팀 표시
function displayTeams(data) {
    // 결과 영역 표시
    document.getElementById('team-result').style.display = 'none';
    document.getElementById('team-display').style.display = 'block';

    // Team A
    displayTeamMembers('team-a', data.team_a, data.team_a_positions);
    document.getElementById('team-a-level').textContent = data.team_a_level;

    // Team B
    displayTeamMembers('team-b', data.team_b, data.team_b_positions);
    document.getElementById('team-b-level').textContent = data.team_b_level;

    // 레벨 차이
    document.getElementById('level-diff').textContent = data.level_diff;

    // 밸런스 상태
    const balanceStatus = document.getElementById('balance-status');
    if (data.level_diff <= 2) {
        balanceStatus.innerHTML = '<span class="badge badge-success">완벽한 밸런스</span>';
    } else if (data.level_diff <= 5) {
        balanceStatus.innerHTML = '<span class="badge badge-warning">양호한 밸런스</span>';
    } else {
        balanceStatus.innerHTML = '<span class="badge badge-danger">불균형</span>';
    }
}

// 팀 멤버 표시
function displayTeamMembers(teamId, members, positions) {
    const membersList = document.getElementById(teamId + '-members');
    membersList.innerHTML = '';

    members.forEach(member => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${member.name}</strong>
                <span class="badge badge-info">${getPositionName(member.position)}</span>
            </div>
            <span class="badge badge-warning">Lv.${member.level}</span>
        `;
        membersList.appendChild(li);
    });

    // 포지션 통계
    document.getElementById(teamId + '-att').textContent = '공격:' + positions.ATT;
    document.getElementById(teamId + '-def').textContent = '수비:' + positions.DEF;
    document.getElementById(teamId + '-all').textContent = '올:' + positions.ALL;
}

// 포지션 이름
function getPositionName(position) {
    const names = { 'ATT': '공격', 'DEF': '수비', 'ALL': '올라운더' };
    return names[position] || position;
}
</script>

<?php include __DIR__ . '/../includes/footer.php'; ?>
