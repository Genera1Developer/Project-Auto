function createFooter() {
    const footer = document.createElement('footer');
    footer.style.textAlign = 'center';
    footer.style.padding = '20px';
    footer.style.backgroundColor = '#f0f0f0';
    footer.style.marginTop = '20px';
    footer.innerHTML = `
        <p>&copy; ${new Date().getFullYear()} Web Proxy. All rights reserved.</p>
    `;
    return footer;
}

export default createFooter;