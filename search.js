function toggleSidebar() {
    const sidebar = document.querySelector('.left');
    const content = document.querySelector('.right');
    sidebar.classList.toggle('collapsed');
    content.classList.toggle('expanded');
}

function checkClick(event) {
    console.log("checked");
    if (event.key === ":") {
        console.log(": clicked");
        nameFinder();
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
            header.textContent = headerText;
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
