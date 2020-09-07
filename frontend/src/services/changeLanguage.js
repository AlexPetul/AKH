export default function changeLanguage(event) {
    let selectedLang = event.target.options[event.target.selectedIndex].value;
    fetch("/change-language/", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            languageId: Number(selectedLang)
        })
    })
        .then(response => response.json())
        .then(responseJson => {
            localStorage.setItem('lang_id', selectedLang);
            window.location = window.location;
        })
};