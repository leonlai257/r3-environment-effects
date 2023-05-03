export type AnimationType = 'fadeIn' | 'fadeOut' | ''

export type HtmlAnimationProps = {
    animation?: AnimationType
}

export const HtmlAnimation = ({ animation = 'fadeOut' }: HtmlAnimationProps) => {
    switch (animation) {
        case 'fadeIn':
            return <div className="absolute  bg-black z-[9999] opacity-0 pointer-events-none w-full h-full animate-FadeIn"></div>
        case 'fadeOut':
        default:
            return <div className="absolute  bg-black z-[9999] opacity-100 pointer-events-none w-full h-full animate-FadeOut"></div>
    }
}
