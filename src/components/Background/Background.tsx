import { useEffect, useState } from "react"

interface BingWallpaper {
  url: string
  copyright: string
  start_date: string
  end_date: string
  copyright_link: string
}

function Background({ children }: { children: React.ReactNode }) {
  const [backgroundUrl, setBackgroundUrl] = useState("/img/default_bg.png")  // Set default image as initial state
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWallpaper = async () => {
      try {
        // Check localStorage first
        const today = new Date().toISOString().split('T')[0].replace(/-/g, '')
        const storedWallpaper = localStorage.getItem('bingWallpaper')
        const storedData = storedWallpaper ? JSON.parse(storedWallpaper) : null

        // If we have a stored image that hasn't expired, use it
        if (storedData && storedData.end_date >= today) {
          setBackgroundUrl(storedData.url)
          setIsLoading(false)
          return
        }

        // Otherwise fetch a new one
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch("https://bing.biturl.top/", {
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data: BingWallpaper = await response.json()

        // Store the new wallpaper in localStorage
        localStorage.setItem('bingWallpaper', JSON.stringify(data))

        setBackgroundUrl(data.url)
      } catch (error) {
        console.error("Failed to fetch wallpaper:", error)
        setBackgroundUrl("/img/default_bg.jpg") // Use default image on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchWallpaper()
  }, [])

  // Rest of component remains the same
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black bg-opacity-90 m-0 p-0">
        <span className="loading loading-infinity loading-lg text-primary"></span>
      </div>
    )
  }

  return (
    <div
      className="w-screen h-screen m-0 p-0 overflow-auto relative"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 w-full h-full m-0 p-0 overflow-auto">{children}</div>
    </div>
  )
}

export default Background