<?php
require_once __DIR__ . '/../config/config.php';

// 이미 로그인된 경우 대시보드로 리다이렉트
if (is_admin_logged_in()) {
    redirect(BASE_URL . '/admin/index.php');
}

$page_title = '관리자 로그인';
$error = '';

// POST 요청 처리
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        $error = '아이디와 비밀번호를 입력해주세요.';
    } else if (check_admin_auth($username, $password)) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $username;
        $_SESSION['login_time'] = date('Y-m-d H:i:s');

        set_flash('success', '로그인 성공! 환영합니다.');
        redirect(BASE_URL . '/admin/index.php');
    } else {
        $error = '아이디 또는 비밀번호가 올바르지 않습니다.';
    }
}

include __DIR__ . '/../includes/header.php';
?>

<div class="page-title">
    <h2>🔐 관리자 로그인</h2>
    <p>멤버 관리 및 회비 관리를 위해 로그인하세요</p>
</div>

<div class="card" style="max-width: 500px; margin: 0 auto;">
    <h3 class="card-title">로그인</h3>

    <?php if ($error): ?>
        <div class="alert alert-danger"><?= escape($error) ?></div>
    <?php endif; ?>

    <form method="POST" action="">
        <div class="form-group">
            <label for="username">아이디</label>
            <input type="text" id="username" name="username" class="form-control" required autofocus>
        </div>

        <div class="form-group">
            <label for="password">비밀번호</label>
            <input type="password" id="password" name="password" class="form-control" required>
        </div>

        <button type="submit" class="btn btn-primary btn-block">로그인</button>
    </form>

    <div class="mt-20 text-center">
        <p style="color: #666; font-size: 0.9rem;">기본 계정: admin / admin1234</p>
    </div>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>
