const Modal = {
    open(){
        let modal = document.querySelector('.modal-overlay')
        modal.classList.add('active')
    },

    close(){
        let modal = document.querySelector('.modal-overlay')
        modal.classList.remove('active')
    }
}

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem('anchor.finance:transactions')) || []
    },

    set(transactions){
        localStorage.setItem('anchor.finance:transactions', JSON.stringify(transactions))
    }
}

const Transactions = {
    all: Storage.get(),

    add(transaction){
        this.all.push(transaction)

        App.reload()
    },

    remove(index){
        this.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        let income = 0
        this.all.forEach(transaction => {
            if(transaction.amount > 0){
                income += transaction.amount
            }
        })

        return income
    },

    expenses() {
        let expense = 0
        this.all.forEach(transaction => {
            if(transaction.amount < 0){
                expense += transaction.amount
            }
        })

        return expense
    },

    total() {
        return this.incomes() + this.expenses()
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    
    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index){
        const CSSclass = transaction.amount > 0 ? 'income' : 'expense'

        const amount = Useful.formatCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td class="remove"><div class="icon-minus-circle" onclick="Transactions.remove(${index})"></div></td>
        `

        return html
    },

    updateBalance(){
        document.getElementById('incomeDisplay').innerHTML = Useful.formatCurrency(Transactions.incomes())
        document.getElementById('expenseDisplay').innerHTML = Useful.formatCurrency(Transactions.expenses())
        document.getElementById('totalDisplay').innerHTML = Useful.formatCurrency(Transactions.total())
    },

    clearTransactions(){
        this.transactionsContainer.innerHTML = '' 
    }
}

const Useful = {
    formatAmount(value){
        value = Number(value) * 100
        
        return Math.round(value)
    },

    formatDate(date){
        const splittedDate = date.split("-")

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? '-' : ''

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100 

        value = value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })


        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return {
            description: this.description.value,
            amount: this.amount.value,
            date: this.date.value
        }
    },

    validateFields(){
        const { description, amount, date } = this.getValues()

        if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues(){
        let { description, amount, date } = this.getValues()

        amount = Useful.formatAmount(amount)

        date = Useful.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields(){
        this.description.value = ""
        this.amount.value = ""
        this.date.value = ""
    },

    submit(event){
        event.preventDefault()

        try {        
            this.validateFields()
            const transaction = this.formatValues()
            Transactions.add(transaction)
            this.clearFields()
            Modal.close()

        } catch(Error){
            alert(Error.message)
        }
    }
}

const App = {
    init(){ 
        Transactions.all.forEach(DOM.addTransaction)

        DOM.updateBalance()

        Storage.set(Transactions.all)
    },

    reload(){
        DOM.clearTransactions()
        App.init()
    },
}

App.init()