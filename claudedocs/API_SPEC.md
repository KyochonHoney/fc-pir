# API 명세서

## 개요
풋살 팀 자동 매칭 시스템의 RESTful API 명세서입니다.

## 기본 정보
- **Base URL**: `http://localhost/football/api/`
- **Content-Type**: `application/json`
- **인증 방식**: Session-based Authentication

---

## 1. 인증 API

### 1.1 로그인
관리자 계정으로 로그인합니다.

**Endpoint**: `POST /api/auth.php?action=login`

**Request Body**:
```json
{
    "username": "admin",
    "password": "admin1234"
}
```

**Response (Success - 200)**:
```json
{
    "success": true,
    "message": "로그인 성공",
    "data": {
        "username": "admin",
        "login_time": "2025-10-27 15:30:00"
    }
}
```

**Response (Error - 401)**:
```json
{
    "success": false,
    "message": "아이디 또는 비밀번호가 올바르지 않습니다."
}
```

---

### 1.2 로그아웃
현재 세션을 종료합니다.

**Endpoint**: `POST /api/auth.php?action=logout`

**Response (Success - 200)**:
```json
{
    "success": true,
    "message": "로그아웃 성공"
}
```

---

### 1.3 세션 확인
현재 로그인 상태를 확인합니다.

**Endpoint**: `GET /api/auth.php?action=check`

**Response (Success - 200)**:
```json
{
    "success": true,
    "logged_in": true,
    "username": "admin"
}
```

**Response (Not Logged In - 200)**:
```json
{
    "success": true,
    "logged_in": false
}
```

---

## 2. 멤버 API

### 2.1 멤버 목록 조회
전체 멤버 목록을 조회합니다.

**Endpoint**: `GET /api/members.php?action=list`

**Query Parameters**:
- `active_only` (optional): `true` - 활성 멤버만 조회

**Response (Success - 200)**:
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "김철수",
            "position": "ATT",
            "level": 8,
            "is_active": true,
            "created_at": "2025-10-27 14:00:00"
        },
        {
            "id": 2,
            "name": "이영희",
            "position": "DEF",
            "level": 7,
            "is_active": true,
            "created_at": "2025-10-27 14:05:00"
        }
    ],
    "count": 2
}
```

---

### 2.2 멤버 상세 조회
특정 멤버의 정보를 조회합니다.

**Endpoint**: `GET /api/members.php?action=get&id={member_id}`

**Response (Success - 200)**:
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "김철수",
        "position": "ATT",
        "level": 8,
        "is_active": true,
        "created_at": "2025-10-27 14:00:00"
    }
}
```

**Response (Not Found - 404)**:
```json
{
    "success": false,
    "message": "멤버를 찾을 수 없습니다."
}
```

---

### 2.3 멤버 추가 (관리자 전용)
새로운 멤버를 추가합니다.

**Endpoint**: `POST /api/members.php?action=create`

**권한**: 관리자 로그인 필요

**Request Body**:
```json
{
    "name": "최민수",
    "position": "ALL",
    "level": 7
}
```

**Validation Rules**:
- `name`: 필수, 1-100자
- `position`: 필수, "ATT" | "DEF" | "ALL"
- `level`: 필수, 1-10 정수

**Response (Success - 201)**:
```json
{
    "success": true,
    "message": "멤버가 추가되었습니다.",
    "data": {
        "id": 6,
        "name": "최민수",
        "position": "ALL",
        "level": 7,
        "is_active": true,
        "created_at": "2025-10-27 16:00:00"
    }
}
```

**Response (Validation Error - 400)**:
```json
{
    "success": false,
    "message": "유효성 검사 실패",
    "errors": {
        "name": "이름은 필수입니다.",
        "level": "레벨은 1-10 사이여야 합니다."
    }
}
```

**Response (Unauthorized - 401)**:
```json
{
    "success": false,
    "message": "관리자 권한이 필요합니다."
}
```

---

### 2.4 멤버 수정 (관리자 전용)
기존 멤버 정보를 수정합니다.

**Endpoint**: `PUT /api/members.php?action=update`

**권한**: 관리자 로그인 필요

**Request Body**:
```json
{
    "id": 1,
    "name": "김철수",
    "position": "DEF",
    "level": 9
}
```

**Response (Success - 200)**:
```json
{
    "success": true,
    "message": "멤버 정보가 수정되었습니다.",
    "data": {
        "id": 1,
        "name": "김철수",
        "position": "DEF",
        "level": 9,
        "is_active": true
    }
}
```

---

### 2.5 멤버 삭제 (관리자 전용)
멤버를 비활성화합니다 (소프트 삭제).

**Endpoint**: `DELETE /api/members.php?action=delete&id={member_id}`

**권한**: 관리자 로그인 필요

**Response (Success - 200)**:
```json
{
    "success": true,
    "message": "멤버가 삭제되었습니다."
}
```

---

## 3. 회비 API

### 3.1 회비 목록 조회
전체 회비 기록을 조회합니다.

**Endpoint**: `GET /api/payments.php?action=list`

**Query Parameters**:
- `member_id` (optional): 특정 멤버의 회비만 조회
- `paid` (optional): `true` | `false` - 납부 상태 필터링

**Response (Success - 200)**:
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "member_id": 1,
            "member_name": "김철수",
            "amount": 10000,
            "paid": true,
            "payment_date": "2025-10-27",
            "note": "10월 회비",
            "created_at": "2025-10-27 14:30:00"
        }
    ],
    "count": 1,
    "statistics": {
        "total_members": 10,
        "paid_count": 7,
        "unpaid_count": 3,
        "payment_rate": 70
    }
}
```

---

### 3.2 회비 추가 (관리자 전용)
새로운 회비 기록을 추가합니다.

**Endpoint**: `POST /api/payments.php?action=create`

**권한**: 관리자 로그인 필요

**Request Body**:
```json
{
    "member_id": 1,
    "amount": 10000,
    "paid": false,
    "note": "11월 회비"
}
```

**Response (Success - 201)**:
```json
{
    "success": true,
    "message": "회비 기록이 추가되었습니다.",
    "data": {
        "id": 3,
        "member_id": 1,
        "amount": 10000,
        "paid": false,
        "payment_date": null,
        "note": "11월 회비",
        "created_at": "2025-10-27 16:30:00"
    }
}
```

---

### 3.3 회비 납부 처리 (관리자 전용)
회비를 납부 완료로 처리합니다.

**Endpoint**: `PUT /api/payments.php?action=update`

**권한**: 관리자 로그인 필요

**Request Body**:
```json
{
    "id": 3,
    "paid": true,
    "payment_date": "2025-10-27"
}
```

**Response (Success - 200)**:
```json
{
    "success": true,
    "message": "회비 납부 처리되었습니다.",
    "data": {
        "id": 3,
        "paid": true,
        "payment_date": "2025-10-27"
    }
}
```

---

### 3.4 미납자 목록 조회
회비 미납자 목록을 조회합니다.

**Endpoint**: `GET /api/payments.php?action=unpaid`

**Response (Success - 200)**:
```json
{
    "success": true,
    "data": [
        {
            "member_id": 2,
            "member_name": "이영희",
            "amount": 10000,
            "note": "10월 회비"
        }
    ],
    "count": 1
}
```

---

## 4. 팀 편성 API

### 4.1 팀 자동 생성
참가 멤버를 기반으로 팀을 자동 생성합니다.

**Endpoint**: `POST /api/teams.php?action=generate`

**Request Body**:
```json
{
    "member_ids": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "save_history": true
}
```

**Parameters**:
- `member_ids`: 참가 멤버 ID 배열
- `save_history` (optional): 팀 편성 기록 저장 여부 (기본: false)

**Response (Success - 200)**:
```json
{
    "success": true,
    "message": "팀 편성이 완료되었습니다.",
    "data": {
        "team_a": [
            {
                "id": 3,
                "name": "박민수",
                "position": "ALL",
                "level": 9
            },
            {
                "id": 2,
                "name": "이영희",
                "position": "DEF",
                "level": 7
            },
            {
                "id": 4,
                "name": "정수진",
                "position": "ATT",
                "level": 6
            },
            {
                "id": 5,
                "name": "최준호",
                "position": "DEF",
                "level": 8
            },
            {
                "id": 8,
                "name": "한지은",
                "position": "DEF",
                "level": 6
            }
        ],
        "team_b": [
            {
                "id": 1,
                "name": "김철수",
                "position": "ATT",
                "level": 8
            },
            {
                "id": 6,
                "name": "강미영",
                "position": "ALL",
                "level": 7
            },
            {
                "id": 7,
                "name": "임동혁",
                "position": "ATT",
                "level": 5
            },
            {
                "id": 9,
                "name": "오세훈",
                "position": "ALL",
                "level": 8
            },
            {
                "id": 10,
                "name": "윤하늘",
                "position": "ATT",
                "level": 7
            }
        ],
        "team_a_level": 36,
        "team_b_level": 35,
        "level_diff": 1,
        "team_a_positions": {
            "ATT": 1,
            "DEF": 3,
            "ALL": 1
        },
        "team_b_positions": {
            "ATT": 3,
            "DEF": 0,
            "ALL": 2
        }
    }
}
```

**Response (Insufficient Players - 400)**:
```json
{
    "success": false,
    "message": "최소 4명 이상의 멤버가 필요합니다."
}
```

---

### 4.2 팀 편성 기록 조회
과거 팀 편성 기록을 조회합니다.

**Endpoint**: `GET /api/teams.php?action=history`

**Query Parameters**:
- `limit` (optional): 조회할 기록 개수 (기본: 10)
- `date` (optional): 특정 날짜 필터링 (YYYY-MM-DD)

**Response (Success - 200)**:
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "match_date": "2025-10-27",
            "team_a": [1, 3, 5, 7, 9],
            "team_b": [2, 4, 6, 8, 10],
            "team_a_level": 36,
            "team_b_level": 35,
            "created_at": "2025-10-27 15:00:00"
        }
    ],
    "count": 1
}
```

---

## 5. 출석 API (선택 기능)

### 5.1 출석 체크
특정 날짜의 멤버 출석을 체크합니다.

**Endpoint**: `POST /api/attendances.php?action=check`

**Request Body**:
```json
{
    "member_id": 1,
    "attendance_date": "2025-10-27",
    "is_attending": true
}
```

**Response (Success - 200)**:
```json
{
    "success": true,
    "message": "출석이 체크되었습니다."
}
```

---

### 5.2 출석 목록 조회
특정 날짜의 출석 현황을 조회합니다.

**Endpoint**: `GET /api/attendances.php?action=list&date={YYYY-MM-DD}`

**Response (Success - 200)**:
```json
{
    "success": true,
    "data": [
        {
            "member_id": 1,
            "member_name": "김철수",
            "is_attending": true
        },
        {
            "member_id": 2,
            "member_name": "이영희",
            "is_attending": false
        }
    ],
    "attending_count": 1,
    "total_count": 2
}
```

---

## 에러 응답 형식

모든 에러는 다음 형식을 따릅니다:

```json
{
    "success": false,
    "message": "에러 메시지",
    "error_code": "ERROR_CODE",
    "errors": {
        "field_name": "상세 에러 메시지"
    }
}
```

### HTTP 상태 코드

- `200 OK`: 성공
- `201 Created`: 생성 성공
- `400 Bad Request`: 잘못된 요청
- `401 Unauthorized`: 인증 필요
- `403 Forbidden`: 권한 없음
- `404 Not Found`: 리소스 없음
- `500 Internal Server Error`: 서버 에러

---

## 공통 에러 코드

| 코드 | 설명 |
|------|------|
| `INVALID_REQUEST` | 잘못된 요청 형식 |
| `UNAUTHORIZED` | 인증 필요 |
| `FORBIDDEN` | 권한 없음 |
| `NOT_FOUND` | 리소스 없음 |
| `VALIDATION_ERROR` | 유효성 검사 실패 |
| `INTERNAL_ERROR` | 서버 내부 오류 |

---

## 예제 요청 (cURL)

### 로그인
```bash
curl -X POST http://localhost/football/api/auth.php?action=login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin1234"}' \
  -c cookies.txt
```

### 멤버 추가
```bash
curl -X POST http://localhost/football/api/members.php?action=create \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"최민수","position":"ALL","level":7}'
```

### 팀 생성
```bash
curl -X POST http://localhost/football/api/teams.php?action=generate \
  -H "Content-Type: application/json" \
  -d '{"member_ids":[1,2,3,4,5,6,7,8,9,10],"save_history":true}'
```

---

**문서 버전**: 1.0.0
**최종 수정일**: 2025-10-27
