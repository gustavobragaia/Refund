// select form items
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")


// select ul elements
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")


// capture input event to format value
amount.oninput = () => {
    // get actual value and remove non numeric character
    let value = amount.value.replace(/\D/g, "")

    // transform the value in cents
    value = Number(value) / 100
    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value){
    // format to BRL format
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })
    return value
}

// capturing submit event to get the values
form.onsubmit = (e) => {
    // unable reload event onsubmit
    e.preventDefault()

    // creating a object 
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }

    // call func to add a item on list
    expenseAdd(newExpense)
}

// add a new item  to a list
function expenseAdd(newExpense){
    try{
        // create an element to add on list (ul)
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        // create an category icon
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        // create info of expense DIV
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        // create expense name STRONG
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        // create expense category SPAN
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        // add name and category on information of expense
        expenseInfo.append(expenseName, expenseCategory)

        // create value of expense
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`
            
        // create remove icon
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "remove")

        // add info on a item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        // add item of a list
        expenseList.append(expenseItem)

        // update totals
        updateTotals()

        // clear form
        formClear()

    } catch(error){
        alert("Não foi possível atualizar a lista de despeza")
    }
}

// update the total of expense
function updateTotals(){
    try{
        // get quantity of items
        const items = expenseList.children

        expensesQuantity.textContent = `${items.length} ${
            items.length > 1 ? "despesas" : "despesa"}`

        
        let total = 0
        // go to each item (li) of list (ul)
        for(let item = 0; item < items.length; item++){
            const itemAmount = items[item].querySelector(".expense-amount")

            // remove non numeric chacacters and replace , to .
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

            // transform to float
            value = parseFloat(value)

            // verify if is a value number
            if(isNaN(value)){
                return alert("Não foi possível calcular o valor total. O valor não parece um número")
            }

            // convert to number
            total += Number(value)
        }

        // create span to add R$ with correct format
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        // format the value removing R$ (without correct format)
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        // add symbol of currency and formated value
        expensesTotal.innerHTML = ""
        expensesTotal.append(symbolBRL, total)

    } catch(error){
        alert("Não foi possível atualizar os totais")

    }
}

// capture click on item list
expenseList.addEventListener("click", (event) =>{
    if(event.target.classList.contains("remove-icon")){
        // obtain parent li of clicked element
        const item = event.target.closest(".expense")
        // remove item of list
        item.remove()
    }

    // update total (quantity and totals)
    updateTotals()
})

function formClear(){
    // clear inputs
    expense.value = ""
    category.value = ""
    amount.value = ""

    // focus on amount input
    expense.focus()
}