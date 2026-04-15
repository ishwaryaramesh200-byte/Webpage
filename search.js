function toggleSidebar() {
    const sidebar = document.querySelector('.left');
    const content = document.querySelector('.right');
    sidebar.classList.toggle('collapsed');
    content.classList.toggle('expanded');
}

const debounceNameFinder = debounce(nameFinder, 1000);

function debounce(func, delay) {
    console.log("Debounce function created with delay:", delay);
    let timer;

    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    }
}

fetch("table.json")
    .then(response => response.json())
    .then(data => {
        console.log("Data fetched successfully:", data);
        let table = document.querySelector(".table table");
        let headerRow = document.createElement("tr");
        data.headers.forEach(headerText => {
            let header = document.createElement("th");
            if (headerText == "Status") {
                header.textContent = headerText;
                headerRow.appendChild(header);
                return;
            }
            let wrapper = document.createElement("div");
            wrapper.classList.add("th-wrapper");
            let span = document.createElement("span");
            span.textContent = headerText;
            wrapper.appendChild(span);
            wrapper.innerHTML += '<div class="sort-icons" onclick="sortTable(this, \'' + headerText + '\')"><i class="fa-solid fa-sort-down"></i></div>';
            header.appendChild(wrapper);
            headerRow.appendChild(header);
        });
        table.appendChild(headerRow);

        data.rows.forEach(rowData => {
            let row = document.createElement("tr");
            let cells = [rowData.Client[0], rowData.Product[0], rowData.Date[0], rowData.Amount[0], rowData.Commission[0], rowData.Status[0]];
            cells.forEach(cellData => {
                let cell = document.createElement("td");
                if (cellData === rowData.Client[0]) {
                    cell.classList.add("client");
                }
                if (cellData === rowData.Product[0]) {
                    cell.classList.add("product");
                }
                if (cellData === rowData.Date[0]) {
                    cell.classList.add("date");
                }
                if (cellData === rowData.Amount[0]) {
                    cell.classList.add("amount");
                }
                if (cellData === rowData.Commission[0]) {
                    cell.classList.add("commission");
                }
                if (cellData === rowData.Status[0]) {
                    let div = document.createElement("div");
                    div.classList.add("status");
                    div.textContent = cellData.value;
                    cell.appendChild(div);
                    cellData.style.forEach(style => {
                        for (let property in style) {
                            div.style[property] = style[property];
                        }
                    });
                    row.appendChild(cell);
                    return;
                }
                cell.textContent = cellData.value;
                row.appendChild(cell);
                cellData.style.forEach(style => {
                    for (let property in style) {
                        cell.style[property] = style[property];
                    }
                });
            });
            table.appendChild(row);
        });

        // Default sort by Client ascending
        let clientHeader = document.querySelector(".sort-icons");
        if (clientHeader) {
            let icon = clientHeader.querySelector("i");
            icon.classList.remove("fa-sort-down");
            icon.classList.add("fa-sort-up");
            let rows = Array.from(table.querySelectorAll("tr")).slice(1);
            rows.sort((a, b) => {
                let cellA = a.children[0].textContent.trim().toLowerCase();
                let cellB = b.children[0].textContent.trim().toLowerCase();
                return cellA.localeCompare(cellB);
            });
            rows.forEach(row => table.appendChild(row));
        }

    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });

function nameFinder() {
    const values = document.getElementById("search").value.toLowerCase();
    const results = document.querySelectorAll(".client");
    const names = Array.from(results).map(result => result.textContent.toLowerCase());

    let matchCount = 0;
    let noResultsRow = document.getElementById("no-results");

    if (values === "") {
        results.forEach(r => r.parentElement.style.display = "table-row");
        if (noResultsRow) {
            noResultsRow.style.display = "none";
        }
        return;
    }

    if (values.startsWith("client:") || values.startsWith("product:") || values.startsWith("date:") || values.startsWith("amount:") || values.startsWith("commission:") || values.startsWith("status:")) {
        console.log("Empty search");
        if (values.includes("client:") || values.includes("product:") || values.includes("date:") || values.includes("amount:") || values.includes("commission:") || values.includes("status:")) {
            console.log("Empty search with field");
            let clientSearch = null;
            let productSearch = null;
            let dateSearch = null;
            let amountSearch = null;
            let commissionSearch = null;
            let statusSearch = null;

            let parts = values.split(",");
            parts.forEach(part => {
                console.log("Part:", part);
                part = part.trim();
                if (part.startsWith("client:")) {
                    clientSearch = part.split("client:")[1].trim();
                    console.log("Client search:", clientSearch);
                } else if (part.startsWith("product:")) {
                    productSearch = part.split("product:")[1].trim();
                } else if (part.startsWith("date:")) {
                    dateSearch = part.split("date:")[1].trim();
                } else if (part.startsWith("amount:")) {
                    amountSearch = part.split("amount:")[1].trim();
                } else if (part.startsWith("commission:")) {
                    commissionSearch = part.split("commission:")[1].trim();
                } else if (part.startsWith("status:")) {
                    statusSearch = part.split("status:")[1].trim();
                }
            });

            let clients = document.querySelectorAll(".client");
            let products = document.querySelectorAll(".product");
            let dates = document.querySelectorAll(".date");
            let amounts = document.querySelectorAll(".amount");
            let commissions = document.querySelectorAll(".commission");
            let statuses = document.querySelectorAll(".status");


            for (let i = 0; i < clients.length; i++) {
                let clientName = clients[i].textContent.toLowerCase();
                let productName = products[i].textContent.toLowerCase();
                let dateValue = dates[i].textContent.toLowerCase();
                let amountValue = amounts[i].textContent.toLowerCase();
                let commissionValue = commissions[i].textContent.toLowerCase();
                let statusValue = statuses[i].textContent.toLowerCase();

                let clientMatch = clientSearch === null || clientSearch === "" || clientName.includes(clientSearch);
                let productMatch = productSearch === null || productSearch === "" || productName.includes(productSearch);
                let dateMatch = dateSearch === null || dateSearch === "" || dateValue.includes(dateSearch);
                let amountMatch = amountSearch === null || amountSearch === "" || amountValue.includes(amountSearch);
                let commissionMatch = commissionSearch === null || commissionSearch === "" || commissionValue.includes(commissionSearch);
                let statusMatch = statusSearch === null || statusSearch === "" || statusValue.includes(statusSearch);

                if (clientMatch && productMatch && dateMatch && amountMatch && commissionMatch && statusMatch) {
                    clients[i].parentElement.style.display = "table-row";
                    matchCount++;
                } else {
                    clients[i].parentElement.style.display = "none";
                }
            }
        }


        if (matchCount === 0) {
            if (!noResultsRow) {
                const table = document.querySelector(".table table");
                noResultsRow = document.createElement("tr");
                noResultsRow.id = "no-results";
                noResultsRow.innerHTML = '<td colspan="6" style="text-align:center; padding:20px; color:#888;">No results found</td>';
                table.appendChild(noResultsRow);
            }
            noResultsRow.style.display = "table-row";
        } else if (noResultsRow) {
            noResultsRow.style.display = "none";
        }
    } else {
        results.forEach(r => r.parentElement.style.display = "table-row");
        if (noResultsRow) {
            noResultsRow.style.display = "none";
        }
    }
}

function sortTable(iconDiv, value) {
    console.log("sorting the table of ", value);
    let table = document.querySelector(".table table");
    let rows = Array.from(table.querySelectorAll("tr")).slice(1);
    let headerIndex = Array.from(table.querySelectorAll("th")).findIndex(th => th.textContent == value);
    if (headerIndex == -1) {
        return;
    }

    let icon = iconDiv.querySelector("i");
    let isCurrentlyUp = icon.classList.contains("fa-sort-up");

    document.querySelectorAll(".sort-icons i").forEach(i => {
        i.classList.remove("fa-sort-up");
        i.classList.add("fa-sort-down");
    });

    let descending;
    if (isCurrentlyUp) {
        icon.classList.remove("fa-sort-up");
        icon.classList.add("fa-sort-down");
        descending = true;
    } else {
        icon.classList.remove("fa-sort-down");
        icon.classList.add("fa-sort-up");
        descending = false;
    }

    rows.sort((a, b) => {
        let cellA = a.children[headerIndex].textContent.trim();
        let cellB = b.children[headerIndex].textContent.trim();

        let moneyA = parseFloat(cellA.replace(/[^0-9.\-]/g, ''));
        let moneyB = parseFloat(cellB.replace(/[^0-9.\-]/g, ''));

        if (!isNaN(moneyA) && !isNaN(moneyB) && /[\$]/.test(cellA)) {
            return descending ? moneyB - moneyA : moneyA - moneyB;
        }

        let dateA = new Date(cellA);
        let dateB = new Date(cellB);
        if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
            return descending ? dateB - dateA : dateA - dateB;
        }

        let numA = parseFloat(cellA);
        let numB = parseFloat(cellB);
        if (!isNaN(numA) && !isNaN(numB)) {
            return descending ? numB - numA : numA - numB;
        }

        return descending
            ? cellB.toLowerCase().localeCompare(cellA.toLowerCase())
            : cellA.toLowerCase().localeCompare(cellB.toLowerCase());
    });

    rows.forEach(row => table.appendChild(row));
}

