import App from "./app";
import env from "./env"
const PORT = env.PORT;

new App().server.listen(PORT);
