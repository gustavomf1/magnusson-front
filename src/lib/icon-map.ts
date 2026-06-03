import {
  Feather,
  Infinity,
  MapPin,
  Sparkles,
  Square,
  type LucideIcon
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  Feather,
  Square,
  MapPin,
  Infinity
}

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Sparkles
}
