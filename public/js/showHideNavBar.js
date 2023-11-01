function showHideNavBar() {
    const navBar = document.getElementsByTagName('nav')[0];
    if (navBar.style.display == 'block') {
        navBar.style.display = 'none'
    } else {
        navBar.style.display = 'block'
    }
}