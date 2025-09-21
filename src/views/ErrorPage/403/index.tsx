import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"


export default function Error403() {
    const navigate = useNavigate()
    return (
        <div className="flex flex-col items-center justify-center w-[100vw] min-h-screen bg-gray-100 dark:bg-gray-800">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">403</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">{"哎呀！您沒有訪問此頁面的權限。"}</p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">{"請檢查您的權限，或者聯繫網站管理員。"}</p>
                <Button
                    className="inline-flex items-center justify-center mt-8 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => navigate(-1)}
                >
                    {"返回上一頁"}
                </Button>
            </div>
        </div>
    )
}
