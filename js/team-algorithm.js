/**
 * 팀 편성 알고리즘 (완전 랜덤 + 자동 밸런스)
 * 2팀 또는 3팀 자동 분배
 */

class TeamBalancer {
    /**
     * 팀 편성 (랜덤 + 밸런스)
     * @param {Array} members - 멤버 배열
     * @param {Number} teamCount - 팀 수 (2 또는 3, 기본값 2)
     * @returns {Object} - 팀 편성 결과
     */
    static generateBalancedTeams(members, teamCount = 2) {
        if (!members || members.length < 2) {
            return {
                success: false,
                message: '최소 2명 이상의 멤버가 필요합니다.'
            };
        }

        // 팀 수 검증
        if (![2, 3].includes(teamCount)) {
            teamCount = 2; // 기본값
        }

        // 멤버 완전 랜덤 셔플
        const shuffled = this.shuffleArray([...members]);

        // 최적 밸런스 찾기 (여러 번 시도)
        let bestResult = null;
        let bestBalance = Infinity;
        const attempts = 50; // 50번 시도

        for (let attempt = 0; attempt < attempts; attempt++) {
            // 매번 새로 랜덤 셔플
            const randomMembers = this.shuffleArray([...members]);

            // 팀 분배
            const teams = this.distributeTeams(randomMembers, teamCount);

            // 밸런스 계산
            const balance = this.calculateBalance(teams);

            // 더 좋은 밸런스를 찾으면 업데이트
            if (balance < bestBalance) {
                bestBalance = balance;
                bestResult = teams;
            }
        }

        // 결과 포맷팅
        return this.formatResult(bestResult, teamCount);
    }

    /**
     * 배열 랜덤 셔플 (Fisher-Yates)
     */
    static shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * 팀 분배 (라운드 로빈 방식)
     */
    static distributeTeams(members, teamCount) {
        const teams = Array.from({ length: teamCount }, () => []);

        members.forEach((member, index) => {
            teams[index % teamCount].push(member);
        });

        return teams;
    }

    /**
     * 팀 간 밸런스 계산 (레벨 차이의 합)
     */
    static calculateBalance(teams) {
        const levels = teams.map(team => this.calculateTeamLevel(team));
        const avgLevel = levels.reduce((a, b) => a + b, 0) / levels.length;

        // 각 팀의 평균과의 차이 합계
        return levels.reduce((sum, level) => sum + Math.abs(level - avgLevel), 0);
    }

    /**
     * 팀 레벨 합계 계산
     */
    static calculateTeamLevel(team) {
        return team.reduce((sum, member) => sum + member.level, 0);
    }

    /**
     * 팀 통계 계산
     */
    static calculateTeamStats(team) {
        const positions = {
            ATT: 0,
            DEF: 0,
            ALL: 0
        };

        team.forEach(member => {
            if (positions.hasOwnProperty(member.position)) {
                positions[member.position]++;
            }
        });

        return {
            position_att: positions.ATT,
            position_def: positions.DEF,
            position_all: positions.ALL
        };
    }

    /**
     * 결과 포맷팅
     */
    static formatResult(teams, teamCount) {
        const result = {
            success: true,
            team_count: teamCount,
            teams: []
        };

        const teamNames = ['A팀', 'B팀', 'C팀'];
        const teamColors = ['#28a745', '#17a2b8', '#e83e8c'];

        teams.forEach((team, index) => {
            const teamLevel = this.calculateTeamLevel(team);
            const teamStats = this.calculateTeamStats(team);

            result.teams.push({
                name: teamNames[index],
                color: teamColors[index],
                members: team,
                total_level: teamLevel,
                avg_level: (teamLevel / team.length).toFixed(1),
                member_count: team.length,
                ...teamStats
            });
        });

        // 레벨 차이 계산
        const levels = result.teams.map(t => t.total_level);
        const maxLevel = Math.max(...levels);
        const minLevel = Math.min(...levels);
        result.level_diff = (maxLevel - minLevel).toFixed(1);
        result.balance_quality = this.getBalanceQuality(maxLevel - minLevel);

        return result;
    }

    /**
     * 밸런스 품질 평가
     */
    static getBalanceQuality(levelDiff) {
        if (levelDiff <= 3) return 'excellent';
        if (levelDiff <= 6) return 'good';
        if (levelDiff <= 10) return 'fair';
        return 'poor';
    }

    /**
     * 밸런스 품질 텍스트
     */
    static getBalanceQualityText(quality) {
        const texts = {
            excellent: '매우 좋음',
            good: '좋음',
            fair: '보통',
            poor: '나쁨'
        };
        return texts[quality] || '알 수 없음';
    }

    /**
     * 밸런스 품질 색상
     */
    static getBalanceQualityColor(quality) {
        const colors = {
            excellent: '#28a745',
            good: '#17a2b8',
            fair: '#ffc107',
            poor: '#dc3545'
        };
        return colors[quality] || '#6c757d';
    }
}

// 전역으로 사용 가능하도록
window.TeamBalancer = TeamBalancer;
