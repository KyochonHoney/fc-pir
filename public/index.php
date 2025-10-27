<?php
require_once __DIR__ . '/../config/config.php';

$page_title = '홈 - ' . PROJECT_NAME;

// 통계 데이터
$total_members = count(getMembers(true));
$payment_stats = getPaymentStatistics();

include __DIR__ . '/../includes/header.php';
?>

<div class="page-title">
    <h2>⚽ 풋살 팀 자동 매칭 시스템</h2>
    <p>공정하고 균형잡힌 팀 편성을 위한 스마트 솔루션</p>
</div>

<!-- 통계 카드 -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
    <div class="card text-center">
        <h3 style="color: #28a745; font-size: 3rem; margin-bottom: 10px;"><?= $total_members ?></h3>
        <p style="color: #666; font-size: 1.1rem;">전체 멤버</p>
    </div>

    <div class="card text-center">
        <h3 style="color: #17a2b8; font-size: 3rem; margin-bottom: 10px;"><?= $payment_stats['payment_rate'] ?>%</h3>
        <p style="color: #666; font-size: 1.1rem;">회비 납부율</p>
    </div>

    <div class="card text-center">
        <h3 style="color: #28a745; font-size: 3rem; margin-bottom: 10px;"><?= $payment_stats['paid_count'] ?></h3>
        <p style="color: #666; font-size: 1.1rem;">납부 완료</p>
    </div>

    <div class="card text-center">
        <h3 style="color: #dc3545; font-size: 3rem; margin-bottom: 10px;"><?= $payment_stats['unpaid_count'] ?></h3>
        <p style="color: #666; font-size: 1.1rem;">미납</p>
    </div>
</div>

<!-- 주요 기능 -->
<div class="card">
    <h3 class="card-title">🎯 주요 기능</h3>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin-top: 20px;">
        <!-- 팀 편성 -->
        <div style="border: 2px solid #28a745; border-radius: 10px; padding: 20px; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 15px;">⚽</div>
            <h4 style="margin-bottom: 10px; color: #28a745;">자동 팀 편성</h4>
            <p style="color: #666; margin-bottom: 20px;">공격/수비 밸런스와 레벨을 고려한 공정한 팀 구성</p>
            <a href="<?= BASE_URL ?>/public/team-generator.php" class="btn btn-primary">팀 짜기</a>
        </div>

        <!-- 회비 현황 -->
        <div style="border: 2px solid #17a2b8; border-radius: 10px; padding: 20px; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 15px;">💰</div>
            <h4 style="margin-bottom: 10px; color: #17a2b8;">회비 현황</h4>
            <p style="color: #666; margin-bottom: 20px;">전체 멤버의 회비 납부 상태 확인</p>
            <a href="<?= BASE_URL ?>/public/payment-status.php" class="btn btn-secondary">현황 보기</a>
        </div>

        <!-- 관리자 -->
        <div style="border: 2px solid #ffc107; border-radius: 10px; padding: 20px; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 15px;">⚙️</div>
            <h4 style="margin-bottom: 10px; color: #e0a800;">멤버 관리</h4>
            <p style="color: #666; margin-bottom: 20px;">멤버 추가, 수정, 회비 관리 (관리자 전용)</p>
            <?php if (is_admin_logged_in()): ?>
                <a href="<?= BASE_URL ?>/admin/index.php" class="btn" style="background: #ffc107; color: #333;">관리자 페이지</a>
            <?php else: ?>
                <a href="<?= BASE_URL ?>/admin/login.php" class="btn" style="background: #ffc107; color: #333;">로그인</a>
            <?php endif; ?>
        </div>
    </div>
</div>

<!-- 시스템 특징 -->
<div class="card">
    <h3 class="card-title">✨ 시스템 특징</h3>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 20px;">
        <div>
            <h4 style="color: #28a745; margin-bottom: 10px;">⚖️ 공정한 팀 편성</h4>
            <p style="color: #666;">각 팀의 레벨 합계를 최대한 비슷하게 조정하여 공정한 경기 진행</p>
        </div>

        <div>
            <h4 style="color: #28a745; margin-bottom: 10px;">🎯 포지션 밸런스</h4>
            <p style="color: #666;">공격수와 수비수를 균등하게 배치하여 팀 밸런스 유지</p>
        </div>

        <div>
            <h4 style="color: #28a745; margin-bottom: 10px;">⚡ 빠른 처리</h4>
            <p style="color: #666;">몇 초 만에 최적의 팀 구성 완료</p>
        </div>

        <div>
            <h4 style="color: #28a745; margin-bottom: 10px;">💰 회비 추적</h4>
            <p style="color: #666;">멤버별 회비 납부 여부를 한눈에 확인</p>
        </div>
    </div>
</div>

<!-- 사용 방법 -->
<div class="card">
    <h3 class="card-title">📖 사용 방법</h3>

    <ol style="line-height: 2; color: #666; font-size: 1.05rem;">
        <li><strong>팀 편성</strong>: "팀 짜기" 메뉴에서 참가 멤버를 선택하고 자동으로 팀을 생성합니다</li>
        <li><strong>회비 확인</strong>: "회비 현황" 메뉴에서 전체 멤버의 납부 상태를 확인합니다</li>
        <li><strong>멤버 관리</strong>: 관리자는 로그인 후 멤버 추가/수정/삭제 및 회비 관리가 가능합니다</li>
    </ol>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>
