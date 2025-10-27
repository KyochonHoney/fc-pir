<?php
if (!defined('ROOT_PATH')) {
    require_once __DIR__ . '/../config/config.php';
}
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $page_title ?? PROJECT_NAME ?></title>
    <link rel="stylesheet" href="<?= BASE_URL ?>/assets/css/style.css">
</head>
<body>
    <header>
        <div class="container">
            <h1>⚽ 풋살 팀 매칭</h1>
            <nav>
                <ul>
                    <li><a href="<?= BASE_URL ?>/public/index.php">홈</a></li>
                    <li><a href="<?= BASE_URL ?>/public/team-generator.php">팀 편성</a></li>
                    <li><a href="<?= BASE_URL ?>/public/payment-status.php">회비 현황</a></li>
                    <?php if (is_admin_logged_in()): ?>
                        <li><a href="<?= BASE_URL ?>/admin/index.php">관리자</a></li>
                        <li><a href="<?= BASE_URL ?>/api/auth.php?action=logout">로그아웃</a></li>
                    <?php else: ?>
                        <li><a href="<?= BASE_URL ?>/admin/login.php">로그인</a></li>
                    <?php endif; ?>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <div class="container">
            <?= flash_alert() ?>
