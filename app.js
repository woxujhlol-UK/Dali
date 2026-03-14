// 10 支品牌战队配置（品牌名、主题色、当前人数上限）
const TEAMS = [
  { id: 'lehu', name: '乐虎组', color: '#E85D04', max: 26 },
  { id: 'kebike', name: '可比克组', color: '#F59E0B', max: 26 },
  { id: 'haochidian', name: '好吃点组', color: '#B45309', max: 26 },
  { id: 'heqizheng', name: '和其正组', color: '#059669', max: 26 },
  { id: 'doubendou', name: '豆本豆组', color: '#10B981', max: 26 },
  { id: 'daliyuan', name: '达利园组', color: '#DC2626', max: 26 },
  { id: 'qingmeilvcha', name: '青梅绿茶组', color: '#34D399', max: 26 },
  { id: 'faxixiaomianbao', name: '法式小面包组', color: '#FBBF24', max: 26 },
  { id: 'ruishijuan', name: '瑞士卷组', color: '#92400E', max: 26 },
  { id: 'huashengniunai', name: '花生牛奶组', color: '#D97706', max: 26 },
];

// 模拟积分数据（实际项目中应从后端获取）
const SCORES = TEAMS.map((t, i) => ({
  teamId: t.id,
  teamName: t.name,
  level1: 80 + Math.floor(Math.random() * 20),
  level2: 75 + Math.floor(Math.random() * 25),
  level3: 70 + Math.floor(Math.random() * 30),
}));

// 本地存储的组队数据
let teamMembers = JSON.parse(localStorage.getItem('teamMembers') || '{}');
TEAMS.forEach(t => {
  if (!teamMembers[t.id]) teamMembers[t.id] = [];
});

// 当前用户加入的战队
let myTeamId = localStorage.getItem('myTeamId') || null;

function init() {
  renderTeams();
  renderLeaderboard();
  initParticles();
  bindEvents();
}

// 渲染战队选择卡片
function renderTeams() {
  const grid = document.getElementById('teamsGrid');
  if (!grid) return;

  grid.innerHTML = TEAMS.map(team => {
    const count = teamMembers[team.id]?.length || 0;
    const full = count >= team.max;
    const joined = myTeamId === team.id;

    return `
      <div class="team-card ${full ? 'full' : ''} ${joined ? 'joined' : ''}"
           data-id="${team.id}"
           data-name="${team.name}">
        <div class="team-name" style="color: ${team.color}">${team.name}</div>
        <div class="team-count">
          <span>${count}</span> / ${team.max} 人
        </div>
      </div>
    `;
  }).join('');
}

// 渲染积分榜
function renderLeaderboard() {
  const tbody = document.getElementById('leaderboardBody');
  if (!tbody) return;

  const sorted = [...SCORES]
    .map(s => ({
      ...s,
      total: s.level1 + s.level2 + s.level3,
    }))
    .sort((a, b) => b.total - a.total);

  tbody.innerHTML = sorted.map((row, i) => {
    const rankClass = i < 3 ? `rank-${i + 1}` : '';
    return `
      <tr>
        <td class="${rankClass}">${i + 1}</td>
        <td>${row.teamName}</td>
        <td>${row.level1}</td>
        <td>${row.level2}</td>
        <td>${row.level3}</td>
        <td><strong>${row.total}</strong></td>
      </tr>
    `;
  });
}

// 粒子背景
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 5 + 's';
    container.appendChild(p);
  }
}

function bindEvents() {
  // 战队点击
  document.getElementById('teamsGrid')?.addEventListener('click', e => {
    const card = e.target.closest('.team-card');
    if (!card || card.classList.contains('full')) return;
    if (myTeamId) {
      alert('您已加入 ' + TEAMS.find(t => t.id === myTeamId).name + '，不可重复加入。');
      return;
    }
    openModal(card.dataset.id, card.dataset.name);
  });

  // 关闭弹窗
  document.getElementById('modalClose')?.addEventListener('click', () => closeModal());
  document.getElementById('teamModal')?.addEventListener('click', e => {
    if (e.target.id === 'teamModal') closeModal();
  });

  // 提交加入
  document.getElementById('joinForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('userName').value.trim();
    const teamId = document.getElementById('teamModal').dataset.teamId;
    if (!name || !teamId) return;

    teamMembers[teamId] = teamMembers[teamId] || [];
    teamMembers[teamId].push({ name, id: document.getElementById('userId').value });
    myTeamId = teamId;

    localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
    localStorage.setItem('myTeamId', myTeamId);

    closeModal();
    renderTeams();
    alert('加入成功！请与小组内成员协调分配七星岩(10人)与鼎湖山(16人)任务区。');
  });
}

function openModal(teamId, teamName) {
  const modal = document.getElementById('teamModal');
  const nameEl = document.getElementById('modalTeamName');
  if (!modal || !nameEl) return;

  modal.dataset.teamId = teamId;
  nameEl.textContent = `加入 ${teamName}`;
  document.getElementById('userName').value = '';
  document.getElementById('userId').value = '';
  modal.classList.add('active');
}

function closeModal() {
  document.getElementById('teamModal')?.classList.remove('active');
}

// 启动
document.addEventListener('DOMContentLoaded', init);
