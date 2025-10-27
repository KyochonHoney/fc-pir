<?php
require_once __DIR__ . '/../config/config.php';

$page_title = '회비 현황 - ' . PROJECT_NAME;

// 회비 목록 가져오기
$payments = getPayments();
$stats = getPaymentStatistics();

// 납부/미납 필터링
$filter = $_GET['filter'] ?? 'all';

if ($filter === 'paid') {
    $payments = array_filter($payments, function($p) {
        return $p['paid'] === true;
    });
} elseif ($filter === 'unpaid') {
    $payments = array_filter($payments, function($p) {
        return $p['paid'] === false;
    });
}

include __DIR__ . '/../includes/header.php';
?>

<div class="page-title">
    <h2>💰 회비 현황</h2>
    <p>전체 멤버의 회비 납부 상태를 확인하세요</p>
</div>

<!-- 통계 카드 -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
    <div class="card text-center">
        <h3 style="color: #17a2b8; font-size: 2.5rem;"><?= $stats['payment_rate'] ?>%</h3>
        <p style="color: #666;">납부율</p>
    </div>

    <div class="card text-center">
        <h3 style="color: #28a745; font-size: 2.5rem;"><?= $stats['paid_count'] ?>명</h3>
        <p style="color: #666;">납부 완료</p>
    </div>

    <div class="card text-center">
        <h3 style="color: #dc3545; font-size: 2.5rem;"><?= $stats['unpaid_count'] ?>명</h3>
        <p style="color: #666;">미납</p>
    </div>

    <div class="card text-center">
        <h3 style="color: #6c757d; font-size: 2.5rem;"><?= $stats['total_members'] ?>명</h3>
        <p style="color: #666;">전체 멤버</p>
    </div>
</div>

<!-- 필터 -->
<div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 class="card-title" style="margin: 0;">회비 목록</h3>

        <div>
            <a href="?filter=all" class="btn <?= $filter === 'all' ? 'btn-primary' : 'btn-secondary' ?>" style="margin-right: 5px;">전체</a>
            <a href="?filter=paid" class="btn <?= $filter === 'paid' ? 'btn-primary' : 'btn-secondary' ?>" style="margin-right: 5px;">납부</a>
            <a href="?filter=unpaid" class="btn <?= $filter === 'unpaid' ? 'btn-primary' : 'btn-secondary' ?>">미납</a>
        </div>
    </div>

    <?php if (empty($payments)): ?>
        <div style="text-align: center; padding: 40px; color: #999;">
            회비 기록이 없습니다.
        </div>
    <?php else: ?>
        <table class="table">
            <thead>
                <tr>
                    <th>멤버명</th>
                    <th>회비 금액</th>
                    <th>납부 상태</th>
                    <th>납부일</th>
                    <th>비고</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($payments as $payment): ?>
                    <tr>
                        <td><strong><?= escape($payment['member_name']) ?></strong></td>
                        <td><?= format_currency($payment['amount']) ?></td>
                        <td>
                            <?php if ($payment['paid']): ?>
                                <span class="badge badge-success">납부 완료</span>
                            <?php else: ?>
                                <span class="badge badge-danger">미납</span>
                            <?php endif; ?>
                        </td>
                        <td><?= $payment['payment_date'] ? escape($payment['payment_date']) : '-' ?></td>
                        <td><?= escape($payment['note']) ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>
</div>

<div class="card">
    <h3 class="card-title">📌 안내사항</h3>
    <ul style="line-height: 2; color: #666;">
        <li>회비 금액: <strong><?= format_currency(DEFAULT_PAYMENT_AMOUNT) ?></strong></li>
        <li>회비 납부 현황은 관리자가 직접 업데이트합니다</li>
        <li>회비 납부는 관리자에게 문의해주세요</li>
        <?php if (is_admin_logged_in()): ?>
            <li><a href="<?= BASE_URL ?>/admin/payments.php">관리자 페이지에서 회비 관리 →</a></li>
        <?php endif; ?>
    </ul>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>
