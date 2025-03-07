function Footer() {
    return (
        <footer className="bg-light py-3 mt-auto">
            <div className="container">
                <div className="text-center">
                    &copy; {new Date().getFullYear()} MyProxy - All rights reserved.
                    <div className="mt-2">
                        <a href="/privacy" className="text-decoration-none text-muted mx-2">Privacy Policy</a> |
                        <a href="/terms" className="text-decoration-none text-muted mx-2">Terms of Service</a> |
                        <a href="/contact" className="text-decoration-none text-muted mx-2">Contact Us</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;