export type AnimationType = 'enterScene' | 'fadeIn' | 'fadeOut' | 'fadeInAndOut' | ''

export type HtmlAnimationProps = {
    animation?: AnimationType
}

export const HtmlAnimation = ({ animation = 'fadeOut' }: HtmlAnimationProps) => {
    switch (animation) {
        case 'enterScene':
            return <div className="absolute bg-white z-[9999] opacity-0 pointer-events-none w-full h-full animate-EnterScene"></div>
        case 'fadeInAndOut':
            return <div className="absolute bg-white z-[9999] opacity-0 pointer-events-none w-full h-full animate-FadeInAndOut"></div>
        case 'fadeIn':
            return <div className="absolute bg-white z-[9999] opacity-0 pointer-events-none w-full h-full animate-FadeIn"></div>
        case 'fadeOut':
        default:
            return <div className="absolute bg-white z-[9999] opacity-100 pointer-events-none w-full h-full animate-FadeOut"></div>
    }
}
