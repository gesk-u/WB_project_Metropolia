
import UserDetails from "./UserDetails"
import { useState } from "react";

function Login() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {
    if (!username || !password) {
      setMessage("Please fill in both fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Login failed");
        return;
      }

      setMessage(`Logged in as ${data.user.name}!`);
    } catch (error) {
      console.error(error);
      setMessage("Could not reach the server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

return (
    <div>
        <UserDetails username={username} onUsernameChange={setUsername} password={password} onPasswordChange={setPassword}/>
        <div className="flex justify-center">
            <button onClick={handleLogin} className="font-['JetBrains_Mono'] font-normal not-italic text-[17px] leading-4 text-center tracking-[0.88px] text-[#5A5550] flex-none order-0 grow-0 border border-transparent hover:border-[#DDD8D0] hover:text-[#2E2B27] transition-colors rounded-sm px-1 py-1">
                {loading ? "Logging in..." : "Login"}
            </button>
        </div>

{message && <p className="text-center">{message}</p>}

    </div>
)
}

export default Login;