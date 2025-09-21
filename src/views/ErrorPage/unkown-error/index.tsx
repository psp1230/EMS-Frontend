import { Button } from "@/components/ui/button"

export default function UnkownError() {

  return (
    <div className="flex flex-col items-center justify-center w-[100vw] min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">發生錯誤</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">哎呀！發生了錯誤。</p>
        <Button
          className="inline-flex items-center justify-center mt-8 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          onClick={() => window.location.href = '/'}
        >
          返回首頁
        </Button>
      </div>
    </div>
  )
}