export const Loading=()=>{
    return(
        <div className="min-h-screen flex justify-center items-center bg-[#191919]">
            <div className="flex flex-row gap-2 justify-center items-center ">
                <div className="w-4 h-4 rounded-full bg-[#814bff] animate-bounce"></div>
                <div
                    className="w-4 h-4 rounded-full bg-[#814bff] animate-bounce [animation-delay:-.3s]"
                ></div>
                <div
                    className="w-4 h-4 rounded-full bg-[#814bff] animate-bounce [animation-delay:-.5s]"
                ></div>
            </div>
        </div>
    )
}