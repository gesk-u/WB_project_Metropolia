import { useState } from "react";

function UserDetails({ username, onUsernameChange, password, onPasswordChange }) {

    const [showPassword, setShowPassword] = useState(false);

return(
    <div>

    <h4 className="h-[17px] font-['JetBrains_Mono'] font-normal not-italic text-[20px] leading-[16.5px] text-center tracking-[0.66px] text-[#C4BFB8] w-full py-6">
        Username
    </h4>
    <input className="h-[17px] font-['JetBrains_Mono'] font-normal not-italic text-[20px] leading-[16.5px] text-center tracking-[0.66px] text-[#C4BFB8] w-full py-6" type="string" placeholder="johndoe123" value={username} onChange={(e) => onUsernameChange(e.target.value)}></input>

    <h4 className="h-[17px] font-['JetBrains_Mono'] font-normal not-italic text-[20px] leading-[16.5px] text-center tracking-[0.66px] text-[#C4BFB8] w-full py-6">
        Passphrase
    </h4>
    
      {password && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="font-['JetBrains_Mono'] font-normal not-italic text-[17px] leading-4 text-center tracking-[0.88px] text-[#5A5550] flex-none order-0 grow-0 border border-transparent hover:border-[#DDD8D0] hover:text-[#2E2B27] transition-colors rounded-sm px-1 py-1"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      )}

      <input
        type={showPassword ? "text" : "password"}
        className="h-[17px] font-['JetBrains_Mono'] font-normal not-italic text-[20px] leading-[16.5px] text-center tracking-[0.66px] text-[#C4BFB8] w-full py-6"
        placeholder="************"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
      />
    </div>
)

}

export default UserDetails