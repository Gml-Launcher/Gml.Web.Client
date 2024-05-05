import { useTheme } from "next-themes"
import { Label } from "@/shared/ui/label"
import { Switch } from "@/shared/ui/switch"
import { MoonIcon, SunIcon } from "lucide-react"

export const ChangeTheme = () => {
    const { setTheme, theme } = useTheme()
    const isDarkTheme = theme === 'dark'
    console.log(theme)
    const onChangeTheme = () => {
        if (theme === 'light')
            return setTheme('dark')

        return setTheme('light')
    }

    return (
        <button className="flex justify-between items-center space-x-2 gap-x-3 text-base p-2.5 rounded-lg transition-colors hover:bg-muted cursor-pointer" onClick={onChangeTheme}>
            <div className="flex items-center gap-x-2 cursor-pointer">
                {isDarkTheme ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
                <Label className="cursor-pointer">Темная тема</Label>
            </div>
            <Switch checked={isDarkTheme} />
        </button>
    )
}