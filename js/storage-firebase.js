/**
 * Firebase Realtime Database 기반 데이터 관리 모듈 (v12)
 * ES6 Module 방식
 */

import { db } from './firebase-config.js';
import { ref, get, set, remove, child, query, orderByChild } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

class Storage {
    constructor() {
        this.DB_PATHS = {
            members: 'members',
            payments: 'payments',
            teams: 'teams',
            attendances: 'attendances',
            admin: 'admin_sessions',
            gallery: 'gallery'
        };

        this.db = db;
        console.log('🔥 Firebase Storage v12 초기화 완료');
    }

    // ==================== 헬퍼 함수 ====================

    /**
     * Firebase에서 데이터 가져오기 (비동기)
     */
    async getData(path) {
        try {
            const dbRef = ref(this.db, path);
            const snapshot = await get(dbRef);
            const data = snapshot.val();
            return data ? Object.values(data) : [];
        } catch (error) {
            console.error('데이터 로드 오류:', error);
            return [];
        }
    }

    /**
     * Firebase에 데이터 저장하기 (비동기)
     */
    async setData(path, id, data) {
        try {
            const dbRef = ref(this.db, `${path}/${id}`);
            await set(dbRef, data);
            return true;
        } catch (error) {
            console.error('데이터 저장 오류:', error);
            return false;
        }
    }

    /**
     * Firebase에서 데이터 삭제하기
     */
    async deleteData(path, id) {
        try {
            const dbRef = ref(this.db, `${path}/${id}`);
            await remove(dbRef);
            return true;
        } catch (error) {
            console.error('데이터 삭제 오류:', error);
            return false;
        }
    }

    /**
     * 새 ID 생성
     */
    async getNewId(path) {
        const items = await this.getData(path);
        if (items.length === 0) return 1;
        return Math.max(...items.map(item => item.id)) + 1;
    }

    // ==================== 멤버 관련 ====================

    /**
     * 모든 멤버 가져오기
     */
    async getMembers(activeOnly = false) {
        const members = await this.getData(this.DB_PATHS.members);
        if (activeOnly) {
            return members.filter(m => m.is_active);
        }
        return members;
    }

    /**
     * 멤버 추가
     */
    async addMember(name, position, level) {
        const newId = await this.getNewId(this.DB_PATHS.members);

        const newMember = {
            id: newId,
            name: name,
            position: position,
            level: parseInt(level),
            is_active: true,
            created_at: new Date().toISOString()
        };

        await this.setData(this.DB_PATHS.members, newId, newMember);
        return newMember;
    }

    /**
     * 멤버 수정
     */
    async updateMember(id, name, position, level) {
        const members = await this.getMembers();
        const member = members.find(m => m.id === parseInt(id));

        if (member) {
            const updatedMember = {
                ...member,
                name: name,
                position: position,
                level: parseInt(level)
            };
            await this.setData(this.DB_PATHS.members, id, updatedMember);
            return updatedMember;
        }
        return null;
    }

    /**
     * 멤버 삭제
     */
    async deleteMember(id) {
        return await this.deleteData(this.DB_PATHS.members, id);
    }

    /**
     * 멤버 조회 (ID로)
     */
    async getMember(id) {
        const members = await this.getMembers();
        return members.find(m => m.id === parseInt(id)) || null;
    }

    // ==================== 회비 관련 ====================

    /**
     * 모든 회비 가져오기
     */
    async getPayments(memberId = null, paidStatus = null, year = null, month = null) {
        let payments = await this.getData(this.DB_PATHS.payments);

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
        const members = await this.getMembers();
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
    async addPayment(memberId, year, month, amount, paid = false, note = '') {
        const payments = await this.getData(this.DB_PATHS.payments);

        // 중복 체크
        const existing = payments.find(p =>
            p.member_id === parseInt(memberId) &&
            p.year === parseInt(year) &&
            p.month === parseInt(month)
        );

        if (existing) {
            return { error: '해당 회원의 해당 월 회비가 이미 존재합니다.' };
        }

        const newId = await this.getNewId(this.DB_PATHS.payments);

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

        await this.setData(this.DB_PATHS.payments, newId, newPayment);
        return newPayment;
    }

    /**
     * 회비 상태 업데이트
     */
    async updatePayment(id, paid, paymentDate = null, amount = null) {
        const payments = await this.getData(this.DB_PATHS.payments);
        const payment = payments.find(p => p.id === parseInt(id));

        if (payment) {
            payment.paid = paid;
            payment.payment_date = paid ? (paymentDate || new Date().toISOString().split('T')[0]) : null;
            if (amount !== null) {
                payment.amount = parseInt(amount);
            }
            await this.setData(this.DB_PATHS.payments, id, payment);
            return payment;
        }
        return null;
    }

    /**
     * 회비 삭제
     */
    async deletePayment(id) {
        return await this.deleteData(this.DB_PATHS.payments, id);
    }

    /**
     * 회비 찾기 (회원ID, 년도, 월로)
     */
    async getPaymentByMemberYearMonth(memberId, year, month) {
        const payments = await this.getData(this.DB_PATHS.payments);
        return payments.find(p =>
            p.member_id === parseInt(memberId) &&
            p.year === parseInt(year) &&
            p.month === parseInt(month)
        ) || null;
    }

    /**
     * 엑셀 스타일 회비 데이터 가져오기
     */
    async getPaymentMatrix(year = null) {
        const currentYear = year || new Date().getFullYear();
        const members = await this.getMembers(true);
        const payments = await this.getPayments(null, null, currentYear);

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
    async getPaymentStatistics() {
        const members = await this.getMembers(true);
        const payments = await this.getPayments();

        const paidCount = payments.filter(p => p.paid).length;
        const unpaidCount = payments.filter(p => !p.paid).length;
        const totalPayments = payments.length;
        const paymentRate = totalPayments > 0 ? Math.round((paidCount / totalPayments) * 100) : 0;

        return {
            total_members: members.length,
            paid_count: paidCount,
            unpaid_count: unpaidCount,
            payment_rate: paymentRate
        };
    }

    // ==================== 팀 편성 관련 ====================

    /**
     * 팀 편성 기록 저장
     */
    async saveTeam(teamData) {
        const newId = await this.getNewId(this.DB_PATHS.teams);

        const newTeam = {
            id: newId,
            ...teamData,
            created_at: new Date().toISOString()
        };

        await this.setData(this.DB_PATHS.teams, newId, newTeam);
        return newTeam;
    }

    /**
     * 팀 편성 기록 가져오기
     */
    async getTeamHistory(limit = null) {
        const teams = await this.getData(this.DB_PATHS.teams);
        const sorted = teams.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return limit ? sorted.slice(0, limit) : sorted;
    }

    // ==================== 관리자 인증 ====================

    /**
     * 관리자 로그인
     */
    async adminLogin(username, password) {
        // 하드코딩된 관리자 계정
        if (username === 'admin' && password === 'admin1234') {
            const sessionId = 'session_' + Date.now();
            const session = {
                id: sessionId,
                username: username,
                name: '관리자',
                login_time: new Date().toISOString(),
                expires: new Date(Date.now() + 3600000).toISOString() // 1시간
            };

            // Firebase에 세션 저장
            await this.setData(this.DB_PATHS.admin, sessionId, session);

            // localStorage에도 세션 ID 저장 (브라우저별 로그인 상태)
            localStorage.setItem('admin_session_id', sessionId);

            return { success: true, session: session };
        }
        return { success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' };
    }

    /**
     * 관리자 로그아웃
     */
    async adminLogout() {
        const sessionId = localStorage.getItem('admin_session_id');
        if (sessionId) {
            await this.deleteData(this.DB_PATHS.admin, sessionId);
            localStorage.removeItem('admin_session_id');
        }
        return true;
    }

    /**
     * 관리자 세션 확인
     */
    async isAdminLoggedIn() {
        const sessionId = localStorage.getItem('admin_session_id');
        if (!sessionId) return false;

        try {
            const dbRef = ref(this.db, `${this.DB_PATHS.admin}/${sessionId}`);
            const snapshot = await get(dbRef);
            const session = snapshot.val();

            if (!session || !session.expires) {
                await this.adminLogout();
                return false;
            }

            // 세션 만료 확인
            if (new Date(session.expires) < new Date()) {
                await this.adminLogout();
                return false;
            }

            return true;
        } catch (error) {
            console.error('세션 확인 오류:', error);
            return false;
        }
    }

    /**
     * 관리자 세션 가져오기
     */
    async getAdminSession() {
        const sessionId = localStorage.getItem('admin_session_id');
        if (!sessionId) return null;

        try {
            const dbRef = ref(this.db, `${this.DB_PATHS.admin}/${sessionId}`);
            const snapshot = await get(dbRef);
            return snapshot.val();
        } catch (error) {
            console.error('세션 가져오기 오류:', error);
            return null;
        }
    }

    // ==================== 갤러리 관련 ====================

    /**
     * 모든 갤러리 이미지 가져오기
     */
    async getGalleryImages() {
        const images = await this.getData(this.DB_PATHS.gallery);
        return images.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    /**
     * 갤러리 이미지 추가
     */
    async addGalleryImage(title, description, imageData) {
        const newId = await this.getNewId(this.DB_PATHS.gallery);

        const newImage = {
            id: newId,
            title: title,
            description: description,
            image_data: imageData, // Base64 인코딩된 이미지
            created_at: new Date().toISOString()
        };

        await this.setData(this.DB_PATHS.gallery, newId, newImage);
        return newImage;
    }

    /**
     * 갤러리 이미지 삭제
     */
    async deleteGalleryImage(id) {
        return await this.deleteData(this.DB_PATHS.gallery, id);
    }

    /**
     * 갤러리 이미지 조회 (ID로)
     */
    async getGalleryImage(id) {
        const images = await this.getGalleryImages();
        return images.find(i => i.id === parseInt(id)) || null;
    }

    // ==================== 데이터 마이그레이션 ====================

    /**
     * localStorage에서 Firebase로 데이터 마이그레이션
     */
    async migrateFromLocalStorage() {
        console.log('📦 LocalStorage → Firebase 마이그레이션 시작...');

        const oldKeys = {
            members: 'football_members',
            payments: 'football_payments',
            teams: 'football_teams',
            gallery: 'football_gallery'
        };

        try {
            // Members 마이그레이션
            const localMembers = JSON.parse(localStorage.getItem(oldKeys.members) || '[]');
            if (localMembers.length > 0) {
                for (const member of localMembers) {
                    await this.setData(this.DB_PATHS.members, member.id, member);
                }
                console.log(`✅ Members 마이그레이션: ${localMembers.length}개`);
            }

            // Payments 마이그레이션
            const localPayments = JSON.parse(localStorage.getItem(oldKeys.payments) || '[]');
            if (localPayments.length > 0) {
                for (const payment of localPayments) {
                    await this.setData(this.DB_PATHS.payments, payment.id, payment);
                }
                console.log(`✅ Payments 마이그레이션: ${localPayments.length}개`);
            }

            // Teams 마이그레이션
            const localTeams = JSON.parse(localStorage.getItem(oldKeys.teams) || '[]');
            if (localTeams.length > 0) {
                for (const team of localTeams) {
                    await this.setData(this.DB_PATHS.teams, team.id, team);
                }
                console.log(`✅ Teams 마이그레이션: ${localTeams.length}개`);
            }

            // Gallery 마이그레이션
            const localGallery = JSON.parse(localStorage.getItem(oldKeys.gallery) || '[]');
            if (localGallery.length > 0) {
                for (const image of localGallery) {
                    await this.setData(this.DB_PATHS.gallery, image.id, image);
                }
                console.log(`✅ Gallery 마이그레이션: ${localGallery.length}개`);
            }

            console.log('🎉 마이그레이션 완료!');
            return true;
        } catch (error) {
            console.error('❌ 마이그레이션 오류:', error);
            return false;
        }
    }
}

// 전역 Storage 인스턴스 생성
const storage = new Storage();
export default storage;

// 전역 변수로도 노출 (기존 코드 호환성)
window.storage = storage;
