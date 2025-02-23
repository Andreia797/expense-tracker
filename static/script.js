document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("transaction-form");
    const transactionList = document.getElementById("transaction-list");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const type = document.getElementById("type").value;
        const category = document.getElementById("category").value;
        const amount = document.getElementById("amount").value;
        const date = document.getElementById("date").value;

        fetch("/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, category, amount, date })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadTransactions();
        });
    });

    function loadTransactions() {
        fetch("/transactions")
        .then(response => response.json())
        .then(transactions => {
            transactionList.innerHTML = "";
            transactions.forEach(transaction => {
                const item = document.createElement("li");
                item.textContent = `${transaction[1]} - ${transaction[2]}: $${transaction[3]} on ${transaction[4]}`;
                transactionList.appendChild(item);
            });
        });
    }

    loadTransactions();
});