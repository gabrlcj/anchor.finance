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