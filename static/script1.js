async function addTransaction() {
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    
    if (!category || !amount || !date) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    const response = await fetch('/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, category, amount, date })
    });
    
    const result = await response.json();
    alert(result.message);
    fetchTransactions();
}

async function fetchTransactions() {
    const response = await fetch('/transactions');
    const transactions = await response.json();
    const list = document.getElementById('transaction-list');
    list.innerHTML = '';
    transactions.forEach(tr => {
        const li = document.createElement('li');
        li.textContent = `${tr[1]} - ${tr[2]}: $${tr[3]} em ${tr[4]}`;
        list.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const toggleModeBtn = document.getElementById('toggle-mode');
    toggleModeBtn.innerHTML = '🌙 Mudar Modo';
    toggleModeBtn.addEventListener('click', function () {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            toggleModeBtn.innerHTML = '☀️ Mudar Modo';
        } else {
            toggleModeBtn.innerHTML = '🌙 Mudar Modo';
        }
    });
});

document.addEventListener('DOMContentLoaded', fetchTransactions);

