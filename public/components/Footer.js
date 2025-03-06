function Footer() {
    return (
        <footer className="bg-light py-3 mt-auto">
            <div className="container">
                <p className="text-center">
                    &copy; {new Date().getFullYear()} MyProxy. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;