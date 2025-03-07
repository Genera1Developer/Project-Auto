function Footer() {
    return (
        <footer className="bg-light py-3 mt-auto">
            <div className="container">
                <p className="text-center">
                    &copy; {new Date().getFullYear()} MyProxy - All rights reserved.
                    <span className="mx-2">&#124;</span>
                    <a href="/privacy" className="text-decoration-none">Privacy Policy</a>
                    <span className="mx-2">&#124;</span>
                    <a href="/terms" className="text-decoration-none">Terms of Service</a>
                    <span className="mx-2">&#124;</span>
                    <a href="/contact" className="text-decoration-none">Contact Us</a>
                </p>
            </div>
        </footer>
    );
}

export default Footer;