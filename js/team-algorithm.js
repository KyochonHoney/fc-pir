/**
 * 팀 편성 알고리즘
 * JavaScript 버전
 */

class TeamBalancer {
    /**
     * 팀 편성
     * @param {Array} members - 멤버 배열
     * @returns {Object} - 팀 편성 결과
     */
    static generateBalancedTeams(members) {
        if (!members || members.length < 2) {
            return {
                success: false,
                message: '최소 2명 이상의 멤버가 필요합니다.'
            };
        }

        // 레벨 기준 내림차순 정렬
        const sortedMembers = [...members].sort((a, b) => b.level - a.level);

        // Zigzag 방식으로 초기 분배
        const teamA = [];
        const teamB = [];

        sortedMembers.forEach((member, index) => {
            if (index % 2 === 0) {
                teamA.push(member);
            } else {
                teamB.push(member);
            }
        });

        // Iterative balancing
        let improved = true;
        let iterations = 0;
        const maxIterations = 100;

        while (improved && iterations < maxIterations) {
            improved = false;
            iterations++;

            const levelDiffBefore = Math.abs(
                this.calculateTeamLevel(teamA) - this.calculateTeamLevel(teamB)
            );

            // 모든 가능한 스왑 시도
            for (let i = 0; i < teamA.length; i++) {
                for (let j = 0; j < teamB.length; j++) {
                    // 스왑 시뮬레이션
                    const newTeamA = [...teamA];
                    const newTeamB = [...teamB];

                    [newTeamA[i], newTeamB[j]] = [newTeamB[j], newTeamA[i]];

                    const levelDiffAfter = Math.abs(
                        this.calculateTeamLevel(newTeamA) - this.calculateTeamLevel(newTeamB)
                    );

                    // 개선되었으면 스왑 적용
                    if (levelDiffAfter < levelDiffBefore) {
                        [teamA[i], teamB[j]] = [teamB[j], teamA[i]];
                        improved = true;
                        break;
                    }
                }
                if (improved) break;
            }
        }

        // 최종 통계 계산
        const teamALevel = this.calculateTeamLevel(teamA);
        const teamBLevel = this.calculateTeamLevel(teamB);
        const levelDiff = Math.abs(teamALevel - teamBLevel);

        const teamAStats = this.calculateTeamStats(teamA);
        const teamBStats = this.calculateTeamStats(teamB);

        return {
            success: true,
            team_a: {
                members: teamA,
                total_level: teamALevel,
                avg_level: (teamALevel / teamA.length).toFixed(1),
                ...teamAStats
            },
            team_b: {
                members: teamB,
                total_level: teamBLevel,
                avg_level: (teamBLevel / teamB.length).toFixed(1),
                ...teamBStats
            },
            level_diff: levelDiff.toFixed(1),
            balance_quality: this.getBalanceQuality(levelDiff),
            iterations: iterations
        };
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
     * 밸런스 품질 평가
     */
    static getBalanceQuality(levelDiff) {
        if (levelDiff <= 2) return 'excellent';
        if (levelDiff <= 5) return 'good';
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
