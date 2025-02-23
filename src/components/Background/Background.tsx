import { useEffect, useState } from "react"

interface BingWallpaper {
  url: string
  copyright: string
  start_date: string
  end_date: string
  copyright_link: string
}

function Background({ children }: { children: React.ReactNode }) {
  const [backgroundUrl, setBackgroundUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWallpaper = async () => {
      try {
        const response = await fetch("https://bing.biturl.top/")
        const data: BingWallpaper = await response.json()
        setBackgroundUrl(data.url)
      } catch (error) {
        console.error("Failed to fetch wallpaper:", error)
        setBackgroundUrl("")
      } finally {
        setIsLoading(false)
      }
    }

    fetchWallpaper()
  }, [])

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black bg-opacity-90 m-0 p-0">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div
      className="w-screen h-screen m-0 p-0 overflow-hidden relative"
      style={{
        ...(backgroundUrl
          ? {
              backgroundImage: `url(${backgroundUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
              backgroundSize: "cover",
              backgroundAttachment: "fixed",
            }
          : {
              backgroundColor: "rgba(0, 0, 0, 0.9)",
            }),
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 w-full h-full m-0 p-0">{children}</div>
    </div>
  )
}

export default Background
