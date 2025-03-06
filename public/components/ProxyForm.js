function ProxyForm() {
  return (
    React.createElement("form", { id: "proxy-form" },
      React.createElement("input", {
        type: "text",
        id: "url",
        placeholder: "Enter URL",
        required: true
      }),
      React.createElement("button", { type: "submit" }, "Go")
    )
  );
}