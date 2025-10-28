/**
 * LocalStorage 기반 데이터 관리 모듈
 * Netlify 정적 호스팅용
 */

class Storage {
    constructor() {
        this.STORAGE_KEYS = {
            members: 'football_members',
            payments: 'football_payments',
            teams: 'football_teams',
            attendances: 'football_attendances',
            admin: 'football_admin',
            gallery: 'football_gallery'
        };

        // 초기 데이터가 없으면 샘플 데이터 로드
        this.initializeData();
    }

    /**
     * 데이터 초기화 (샘플 데이터 제거)
     */
    initializeData() {
        // 빈 상태로 시작 (샘플 데이터 자동 로드 안 함)
    }

    /**
     * 데이터 가져오기
     */
    getData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('데이터 로드 오류:', error);
            return [];
        }
    }

    /**
     * 데이터 저장하기
     */
    setData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('데이터 저장 오류:', error);
            return false;
        }
    }

    // ==================== 멤버 관련 ====================

    /**
     * 모든 멤버 가져오기
     */
    getMembers(activeOnly = false) {
        const members = this.getData(this.STORAGE_KEYS.members);
        if (activeOnly) {
            return members.filter(m => m.is_active);
        }
        return members;
    }

    /**
     * 멤버 추가
     */
    addMember(name, position, level) {
        const members = this.getMembers();
        const newId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;

        const newMember = {
            id: newId,
            name: name,
            position: position,
            level: parseInt(level),
            is_active: true,
            created_at: new Date().toISOString()
        };

        members.push(newMember);
        this.setData(this.STORAGE_KEYS.members, members);
        return newMember;
    }

    /**
     * 멤버 수정
     */
    updateMember(id, name, position, level) {
        const members = this.getMembers();
        const index = members.findIndex(m => m.id === parseInt(id));

        if (index !== -1) {
            members[index] = {
                ...members[index],
                name: name,
                position: position,
                level: parseInt(level)
            };
            this.setData(this.STORAGE_KEYS.members, members);
            return members[index];
        }
        return null;
    }

    /**
     * 멤버 삭제
     */
    deleteMember(id) {
        const members = this.getMembers();
        const filtered = members.filter(m => m.id !== parseInt(id));
        this.setData(this.STORAGE_KEYS.members, filtered);
        return true;
    }

    /**
     * 멤버 조회 (ID로)
     */
    getMember(id) {
        const members = this.getMembers();
        return members.find(m => m.id === parseInt(id)) || null;
    }

    // ==================== 회비 관련 ====================

    /**
     * 모든 회비 가져오기
     */
    getPayments(memberId = null, paidStatus = null, year = null, month = null) {
        let payments = this.getData(this.STORAGE_KEYS.payments);

        if (memberId !== null) {
            payments = payments.filter(p => p.member_id === parseInt(memberId));
        }

        if (paidStatus !== null) {
            payments = payments.filter(p => p.paid === paidStatus);
        }

        if (year !== null) {
            payments = payments.filter(p => p.year === parseInt(year));
        }

        if (month !== null) {
            payments = payments.filter(p => p.month === parseInt(month));
        }

        // 멤버 이름 추가
        const members = this.getMembers();
        return payments.map(payment => {
            const member = members.find(m => m.id === payment.member_id);
            return {
                ...payment,
                member_name: member ? member.name : '알 수 없음'
            };
        });
    }

    /**
     * 회비 추가
     */
    addPayment(memberId, year, month, amount, paid = false, note = '') {
        const payments = this.getData(this.STORAGE_KEYS.payments);

        // 중복 체크 (같은 회원, 같은 년월의 회비가 이미 있는지)
        const existing = payments.find(p =>
            p.member_id === parseInt(memberId) &&
            p.year === parseInt(year) &&
            p.month === parseInt(month)
        );

        if (existing) {
            return { error: '해당 회원의 해당 월 회비가 이미 존재합니다.' };
        }

        const newId = payments.length > 0 ? Math.max(...payments.map(p => p.id)) + 1 : 1;

        const newPayment = {
            id: newId,
            member_id: parseInt(memberId),
            year: parseInt(year),
            month: parseInt(month),
            amount: parseInt(amount),
            paid: paid,
            payment_date: paid ? new Date().toISOString().split('T')[0] : null,
            note: note,
            created_at: new Date().toISOString()
        };

        payments.push(newPayment);
        this.setData(this.STORAGE_KEYS.payments, payments);
        return newPayment;
    }

    /**
     * 회비 상태 업데이트
     */
    updatePayment(id, paid, paymentDate = null, amount = null) {
        const payments = this.getData(this.STORAGE_KEYS.payments);
        const index = payments.findIndex(p => p.id === parseInt(id));

        if (index !== -1) {
            payments[index].paid = paid;
            payments[index].payment_date = paid ? (paymentDate || new Date().toISOString().split('T')[0]) : null;
            if (amount !== null) {
                payments[index].amount = parseInt(amount);
            }
            this.setData(this.STORAGE_KEYS.payments, payments);
            return payments[index];
        }
        return null;
    }

    /**
     * 회비 삭제
     */
    deletePayment(id) {
        const payments = this.getData(this.STORAGE_KEYS.payments);
        const index = payments.findIndex(p => p.id === parseInt(id));

        if (index !== -1) {
            const deleted = payments.splice(index, 1)[0];
            this.setData(this.STORAGE_KEYS.payments, payments);
            return deleted;
        }
        return null;
    }

    /**
     * 회비 찾기 (회원ID, 년도, 월로)
     */
    getPaymentByMemberYearMonth(memberId, year, month) {
        const payments = this.getData(this.STORAGE_KEYS.payments);
        return payments.find(p =>
            p.member_id === parseInt(memberId) &&
            p.year === parseInt(year) &&
            p.month === parseInt(month)
        ) || null;
    }

    /**
     * 엑셀 스타일 회비 데이터 가져오기
     */
    getPaymentMatrix(year = null) {
        const currentYear = year || new Date().getFullYear();
        const members = this.getMembers(true);
        const payments = this.getPayments(null, null, currentYear);

        const matrix = members.map(member => {
            const row = {
                member_id: member.id,
                member_name: member.name,
                months: {}
            };

            for (let month = 1; month <= 12; month++) {
                const payment = payments.find(p =>
                    p.member_id === member.id && p.month === month
                );
                row.months[month] = payment || null;
            }

            return row;
        });

        return matrix;
    }

    /**
     * 회비 통계
     */
    getPaymentStatistics() {
        const members = this.getMembers(true);
        const payments = this.getPayments();

        const paidCount = payments.filter(p => p.paid).length;
        const unpaidCount = payments.filter(p => !p.paid).length;
        const totalMembers = members.length;
        const paymentRate = totalMembers > 0 ? Math.round((paidCount / totalMembers) * 100) : 0;

        return {
            total_members: totalMembers,
            paid_count: paidCount,
            unpaid_count: unpaidCount,
            payment_rate: paymentRate
        };
    }

    // ==================== 팀 편성 관련 ====================

    /**
     * 팀 편성 기록 저장
     */
    saveTeam(teamData) {
        const teams = this.getData(this.STORAGE_KEYS.teams);
        const newId = teams.length > 0 ? Math.max(...teams.map(t => t.id)) + 1 : 1;

        const newTeam = {
            id: newId,
            ...teamData,
            created_at: new Date().toISOString()
        };

        teams.push(newTeam);
        this.setData(this.STORAGE_KEYS.teams, teams);
        return newTeam;
    }

    /**
     * 팀 편성 기록 가져오기
     */
    getTeamHistory(limit = null) {
        const teams = this.getData(this.STORAGE_KEYS.teams);
        const sorted = teams.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return limit ? sorted.slice(0, limit) : sorted;
    }

    // ==================== 관리자 인증 ====================

    /**
     * 관리자 로그인
     */
    adminLogin(username, password) {
        // 하드코딩된 관리자 계정
        if (username === 'admin' && password === 'admin1234') {
            const session = {
                username: username,
                name: '관리자',
                login_time: new Date().toISOString(),
                expires: new Date(Date.now() + 3600000).toISOString() // 1시간
            };
            this.setData(this.STORAGE_KEYS.admin, session);
            return { success: true, session: session };
        }
        return { success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' };
    }

    /**
     * 관리자 로그아웃
     */
    adminLogout() {
        localStorage.removeItem(this.STORAGE_KEYS.admin);
        return true;
    }

    /**
     * 관리자 세션 확인
     */
    isAdminLoggedIn() {
        const session = this.getData(this.STORAGE_KEYS.admin);
        if (!session || !session.expires) {
            return false;
        }

        // 세션 만료 확인
        if (new Date(session.expires) < new Date()) {
            this.adminLogout();
            return false;
        }

        return true;
    }

    /**
     * 관리자 세션 가져오기
     */
    getAdminSession() {
        if (this.isAdminLoggedIn()) {
            return this.getData(this.STORAGE_KEYS.admin);
        }
        return null;
    }

    /**
     * 전체 데이터 초기화
     */
    resetAllData() {
        if (confirm('정말 모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            Object.values(this.STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            this.loadSampleData();
            return true;
        }
        return false;
    }

    // ==================== 갤러리 관련 ====================

    /**
     * 모든 갤러리 이미지 가져오기
     */
    getGalleryImages() {
        const images = this.getData(this.STORAGE_KEYS.gallery);
        return images.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    /**
     * 갤러리 이미지 추가
     */
    addGalleryImage(title, description, imageData) {
        const images = this.getData(this.STORAGE_KEYS.gallery);
        const newId = images.length > 0 ? Math.max(...images.map(i => i.id)) + 1 : 1;

        const newImage = {
            id: newId,
            title: title,
            description: description,
            image_data: imageData, // Base64 인코딩된 이미지
            created_at: new Date().toISOString()
        };

        images.push(newImage);
        this.setData(this.STORAGE_KEYS.gallery, images);
        return newImage;
    }

    /**
     * 갤러리 이미지 삭제
     */
    deleteGalleryImage(id) {
        const images = this.getData(this.STORAGE_KEYS.gallery);
        const filtered = images.filter(i => i.id !== parseInt(id));
        this.setData(this.STORAGE_KEYS.gallery, filtered);
        return true;
    }

    /**
     * 갤러리 이미지 조회 (ID로)
     */
    getGalleryImage(id) {
        const images = this.getData(this.STORAGE_KEYS.gallery);
        return images.find(i => i.id === parseInt(id)) || null;
    }
}

// 전역 Storage 인스턴스 생성
window.storage = new Storage();
