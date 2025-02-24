document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("transaction-form");
    const transactionList = document.getElementById("transaction-list");
    const categoryFilter = document.getElementById("filter-category");
    const dateFilter = document.getElementById("filter-date");
    const toggleMode = document.getElementById("toggle-mode");
    const ctx = document.getElementById("expenseChart").getContext("2d");
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
            loadChartData();
        });
    });

    function loadTransactions() {
        let url = "/transactions";
        const params = new URLSearchParams();
        if (categoryFilter.value) params.append("category", categoryFilter.value);
        if (dateFilter.value) params.append("date", dateFilter.value);
        if (params.toString()) url += "?" + params.toString();

        fetch(url)
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

    function loadChartData() {
        fetch("/chart-data")
        .then(response => response.json())
        .then(data => {
            new Chart(ctx, {
                type: "pie",
                data: {
                    labels: data.labels,
                    datasets: [{
                        data: data.values,
                        backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0", "#9966ff"]
                    }]
                }
            });
        });
    }

    categoryFilter.addEventListener("change", loadTransactions);
    dateFilter.addEventListener("change", loadTransactions);
    loadTransactions();
    loadChartData();

    toggleMode.addEventListener("click", function() {
        document.body.classList.toggle("light-mode");
    });
});
