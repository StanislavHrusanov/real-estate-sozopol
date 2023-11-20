function showHideDropdown() {
    const dropdown = document.getElementsByClassName('dropdown-content')[0];
    if (dropdown.style.display == 'block') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
    }
}