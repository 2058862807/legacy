'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
const links = [
{ href: '/dashboard', label: 'Dashboard' },
{ href: '/companion', label: 'Companion' },
{ href: '/heirs', label: 'Heirs' },
{ href: '/blockchain', label: 'Blockchain' },
{ href: '/safes', label: 'Safes' },
{ href: '/vault', label: 'Vault' },
{ href: '/compliance', label: 'Compliance' },
{ href: '/will-builder', label: 'Will Builder' }
]
export default function TopNav() {
const pathname = usePathname()
return (
<nav className="border-b">
<ul className="container mx-auto flex gap-4 p-4">
{links.map(l => (
<li key={l.href}>
<Link
href={l.href}
className={hover:underline ${pathname.startsWith(l.href) ? 'font-semibold' : ''}}
>
{l.label}
</Link>
</li>
))}
</ul>
</nav>
)
}
