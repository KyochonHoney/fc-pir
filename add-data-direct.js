// Firebase REST API로 직접 데이터 추가
const DATABASE_URL = "https://fc-pir-default-rtdb.asia-southeast1.firebasedatabase.app";

// 멤버 데이터
const members = {
  1: { id: 1, name: '최인호', position: 'ATT', level: 2, is_active: true, created_at: new Date().toISOString() },
  2: { id: 2, name: '박필하', position: 'ATT', level: 2, is_active: true, created_at: new Date().toISOString() },
  3: { id: 3, name: '노주호', position: 'ALL', level: 3, is_active: true, created_at: new Date().toISOString() },
  4: { id: 4, name: '황성영', position: 'ALL', level: 3, is_active: true, created_at: new Date().toISOString() },
  5: { id: 5, name: '조현기', position: 'ALL', level: 4, is_active: true, created_at: new Date().toISOString() },
  6: { id: 6, name: '홍세희', position: 'ATT', level: 4, is_active: true, created_at: new Date().toISOString() },
  7: { id: 7, name: '이종민', position: 'DEF', level: 4, is_active: true, created_at: new Date().toISOString() },
  8: { id: 8, name: '신상호', position: 'ATT', level: 4, is_active: true, created_at: new Date().toISOString() },
  9: { id: 9, name: '김주일', position: 'ALL', level: 5, is_active: true, created_at: new Date().toISOString() },
  10: { id: 10, name: '이신재', position: 'ALL', level: 6, is_active: true, created_at: new Date().toISOString() },
  11: { id: 11, name: '신은서', position: 'DEF', level: 6, is_active: true, created_at: new Date().toISOString() },
  12: { id: 12, name: '송민재', position: 'DEF', level: 7, is_active: true, created_at: new Date().toISOString() },
  13: { id: 13, name: '이재민', position: 'DEF', level: 7, is_active: true, created_at: new Date().toISOString() },
  14: { id: 14, name: '최기상', position: 'ATT', level: 7, is_active: true, created_at: new Date().toISOString() }
};

// 회비 데이터 (11월, 5만원, 미납)
const payments = {
  1: { id: 1, member_id: 1, year: 2025, month: 11, amount: 50000, paid: false, payment_date: null, note: '', created_at: new Date().toISOString() },
  2: { id: 2, member_id: 2, year: 2025, month: 11, amount: 50000, paid: false, payment_date: null, note: '', created_at: new Date().toISOString() },
  3: { id: 3, member_id: 3, year: 2025, month: 11, amount: 50000, paid: false, payment_date: null, note: '', created_at: new Date().toISOString() },
  4: { id: 4, member_id: 4, year: 2025, month: 11, amount: 50000, paid: false, payment_date: null, note: '', created_at: new Date().toISOString() },
  5: { id: 5, member_id: 5, year: 2025, month: 11, amount: 50000, paid: false, payment_date: null, note: '', created_at: new Date().toISOString() },
  6: { id: 6, member_id: 6, year: 2025, month: 11, amount: 50000, paid: false, payment_date: null, note: '', created_at: new Date().toISOString() },
  7: { id: 7, member_id: 7, year: 2025, month: 11, amount: 50000, paid: false, payment_date: null, note: '', created_at: new Date().toISOString() },
  8: { id: 8, member_id: 8, year: 2025, month: 11, amount: 50000, paid: false, payment_date: null, note: '', created_at: new Date().toISOString() },
  9: { id: 9, member_id: 9, year: 2025, month: 11, amount: 50000, paid: false, payment_date: null, note: '', created_at: new Date().toISOString() },
  10: { id: 10, member_id: 10, year: 2025, month: 11, amount: 50000, paid: false, payment_date: null, note: '', created_at: new Date().toISOString() },
  11: { id: 11, member_id: 11, year: 2025, month: 11, amount: 50000, paid: false, payment_date: null, note: '', created_at: new Date().toISOString() },
  12: { id: 12, member_id: 12, year: 2025, month: 11, amount: 50000, paid: false, payment_date: null, note: '', created_at: new Date().toISOString() },
  13: { id: 13, member_id: 13, year: 2025, month: 11, amount: 50000, paid: false, payment_date: null, note: '', created_at: new Date().toISOString() },
  14: { id: 14, member_id: 14, year: 2025, month: 11, amount: 50000, paid: false, payment_date: null, note: '', created_at: new Date().toISOString() }
};

async function uploadData() {
  try {
    console.log('멤버 데이터 업로드 중...');
    const membersResponse = await fetch(`${DATABASE_URL}/members.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(members)
    });
    console.log('✅ 멤버 업로드 완료:', await membersResponse.json());

    console.log('회비 데이터 업로드 중...');
    const paymentsResponse = await fetch(`${DATABASE_URL}/payments.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payments)
    });
    console.log('✅ 회비 업로드 완료:', await paymentsResponse.json());

    console.log('🎉 모든 데이터 업로드 완료!');
  } catch (error) {
    console.error('❌ 오류:', error);
  }
}

uploadData();
