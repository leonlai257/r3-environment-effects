export const HtmlTransition = (transition: 'transition-in' | 'transition-out') => {
    return <div className="absolute top-0 left-0 bg-black z-[9999] opacity-0 pointer-events-none w-full h-full"></div>
}
