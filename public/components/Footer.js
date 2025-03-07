function Footer() {
    return (
        <footer className="bg-light py-3 mt-auto">
            <div className="container">
                <p className="text-center">
                    &copy; {new Date().getFullYear()} MyProxy - All rights reserved.
                    <span className="mx-2">&middot;</span>
                    <a href="/privacy" className="text-decoration-none text-muted">Privacy Policy</a>
                    <span className="mx-2">&middot;</span>
                    <a href="/terms" className="text-decoration-none text-muted">Terms of Service</a>
                    <span className="mx-2">&middot;</span>
                    <a href="/contact" className="text-decoration-none text-muted">Contact Us</a>
                </p>
            </div>
        </footer>
    );
}

export default Footer;