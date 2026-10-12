const state = { employees: [] };
const $ = (selector) => document.querySelector(selector);
const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

$('#today').textContent = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

function initials(name = '') { return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || '?'; }
function escapeHtml(value = '') { const node = document.createElement('span'); node.textContent = value; return node.innerHTML; }

function render() {
  const query = $('#searchInput').value.trim().toLowerCase();
  const employees = state.employees.filter((employee) => [employee.name, employee.email, employee.department].some((value) => (value || '').toLowerCase().includes(query)));
  const departments = state.employees.reduce((all, employee) => { const name = employee.department || 'Unassigned'; all[name] = (all[name] || 0) + 1; return all; }, {});
  const departmentEntries = Object.entries(departments).sort((a, b) => b[1] - a[1]);
  const salaryTotal = state.employees.reduce((total, employee) => total + Number(employee.salary || 0), 0);

  $('#totalCount').textContent = state.employees.length;
  $('#totalDelta').textContent = state.employees.length ? 'Live team count' : 'Start building your team';
  $('#departmentCount').textContent = departmentEntries.length;
  $('#averageSalary').textContent = currency.format(state.employees.length ? salaryTotal / state.employees.length : 0);
  $('#employeeSummary').textContent = state.employees.length ? `${state.employees.length} team member${state.employees.length === 1 ? '' : 's'} in your directory` : 'Your team directory is empty';
  $('#departmentBars').innerHTML = departmentEntries.length ? departmentEntries.map(([name, count]) => `<div class="department-row"><span class="department-label">${escapeHtml(name)}</span><div class="bar-track"><div class="bar-fill" style="width:${(count / state.employees.length) * 100}%"></div></div><span class="department-value">${count}</span></div>`).join('') : '<p class="empty-inline">No employee data yet.</p>';
  $('#employeeRows').innerHTML = employees.map((employee) => `<tr><td><div class="employee-name"><span class="avatar">${initials(employee.name)}</span><span>${escapeHtml(employee.name)}<small class="employee-email">${escapeHtml(employee.email)}</small></span></div></td><td><span class="department-badge">${escapeHtml(employee.department)}</span></td><td>${currency.format(employee.salary || 0)}</td><td class="actions"><button class="action-link" data-edit="${employee.id}">Edit</button><button class="action-link delete-link" data-delete="${employee.id}">Delete</button></td></tr>`).join('');
  $('#emptyState').hidden = employees.length !== 0;
  $('.table-wrap').hidden = employees.length === 0;
}

async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error('Request failed');
  const contentType = response.headers.get('content-type') || '';
  return contentType.includes('application/json') ? response.json() : null;
}
async function loadEmployees() {
  try { state.employees = await request('/employees'); render(); }
  catch { $('#employeeSummary').textContent = 'Unable to connect to the employee API'; showToast('Could not load employees. Is the server running?'); render(); }
}
function openForm(employee) {
  $('#employeeForm').reset(); $('#formError').textContent = '';
  $('#employeeId').value = employee?.id || '';
  $('#formKicker').textContent = employee ? 'UPDATE EMPLOYEE' : 'NEW EMPLOYEE';
  $('#formTitle').textContent = employee ? 'Edit employee' : 'Add employee';
  $('#saveButton').textContent = employee ? 'Save changes' : 'Save employee';
  if (employee) ['name', 'email', 'department', 'salary'].forEach((field) => { $(`#${field}`).value = employee[field] ?? ''; });
  $('#employeeDialog').showModal(); $('#name').focus();
}
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => toast.classList.remove('show'), 3500); }

['#openAdd', '#welcomeAdd', '#emptyAdd'].forEach((id) => $(id).addEventListener('click', () => openForm()));
$('#closeDialog').addEventListener('click', () => $('#employeeDialog').close());
$('#cancelDialog').addEventListener('click', () => $('#employeeDialog').close());
$('#searchInput').addEventListener('input', render);
$('#employeeRows').addEventListener('click', async (event) => {
  const id = event.target.dataset.edit || event.target.dataset.delete; if (!id) return;
  const employee = state.employees.find((item) => String(item.id) === id);
  if (event.target.dataset.edit) openForm(employee);
  if (event.target.dataset.delete && confirm(`Delete ${employee.name}? This cannot be undone.`)) { try { await request(`/employees/${id}`, { method: 'DELETE' }); await loadEmployees(); showToast('Employee deleted.'); } catch { showToast('Could not delete employee.'); } }
});
$('#employeeForm').addEventListener('submit', async (event) => {
  event.preventDefault(); const id = $('#employeeId').value;
  const payload = Object.fromEntries(new FormData(event.currentTarget)); payload.salary = Number(payload.salary);
  try { await request(id ? `/employees/${id}` : '/employees', { method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); $('#employeeDialog').close(); await loadEmployees(); showToast(id ? 'Employee updated.' : 'Employee added.'); }
  catch { $('#formError').textContent = 'We could not save this employee. Please try again.'; }
});
loadEmployees();
