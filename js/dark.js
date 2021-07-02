const checkbox = document.querySelector('input[name=mode]')

checkbox.addEventListener('change', () => {
    const sun = document.querySelector('.icon-sun').classList.toggle('show')
    const moon = document.querySelector('.icon-moon').classList.toggle('show')    
    
    function darkMode() {
        var element = document.body
        element.classList.toggle("dark-mode")
    }

    darkMode()
})